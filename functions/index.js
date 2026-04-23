import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import admin from "firebase-admin";
import puppeteer from "puppeteer";

admin.initializeApp();

const db = admin.firestore();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_USERNAME = defineSecret("ADMIN_USERNAME");
const ADMIN_PASSWORD = defineSecret("ADMIN_PASSWORD");

function usernameToEmail(username) {
  return `${String(username).trim().toLowerCase()}@nilaa-os.local`;
}

function requireAuth(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }
}

async function requireAdmin(request) {
  requireAuth(request);
  const userSnapshot = await db.collection("users").doc(request.auth.uid).get();
  if (!userSnapshot.exists || userSnapshot.data()?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin only.");
  }
  return userSnapshot.data();
}

function loadKhmerFontDataUri() {
  const fontPath = path.join(__dirname, "assets", "Battambang-Regular.ttf");
  if (!fs.existsSync(fontPath)) {
    return "";
  }
  const base64 = fs.readFileSync(fontPath).toString("base64");
  return `data:font/ttf;base64,${base64}`;
}

function renderReceiptHtml(receipt) {
  const fontDataUri = loadKhmerFontDataUri();
  const fontFace = fontDataUri
    ? `
      @font-face {
        font-family: "BattambangEmbed";
        src: url("${fontDataUri}") format("truetype");
      }
    `
    : "";
  const fontFamily = fontDataUri ? `"BattambangEmbed", Arial, sans-serif` : `Arial, sans-serif`;

  const rows = (receipt.items || [])
    .map(
      (item) => `
        <div class="row">
          <span>${item.qty}</span>
          <span>${item.name}</span>
          <span>${Number(item.qty * item.price).toFixed(2)}</span>
        </div>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="km">
    <head>
      <meta charset="UTF-8">
      <style>
        ${fontFace}
        body {
          font-family: ${fontFamily};
          width: 300px;
          margin: 0 auto;
          padding: 20px;
          color: #222;
        }
        h1 {
          margin: 0;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 28px;
        }
        p {
          margin: 4px 0;
          text-align: center;
        }
        .divider {
          margin: 12px 0;
          border-top: 2px dashed #888;
        }
        .row, .meta, .total {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 12px;
          margin: 4px 0;
        }
        .head {
          font-weight: 700;
        }
        .grand {
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <h1>nilaa-os</h1>
      <p>វិក្កយបត្រលក់</p>
      <p>អ្នកទិញ: ${receipt.buyerName || "ភ្ញៀវ"}</p>
      <div class="divider"></div>
      <div class="meta"><span>${receipt.createdAtText || ""}</span><span>${receipt.invoiceNo || ""}</span></div>
      <div class="divider"></div>
      <div class="row head"><span>ចំនួន</span><span>មុខទំនិញ</span><span>តម្លៃ</span></div>
      ${rows}
      <div class="divider"></div>
      <div class="total"><span>សរុបមុខទំនិញ</span><span>${Number(receipt.subtotal || 0).toFixed(2)}</span></div>
      <div class="total"><span>ថ្លៃបន្ថែម</span><span>${Number(receipt.fee || 0).toFixed(2)}</span></div>
      <div class="total grand"><span>សរុបចុងក្រោយ</span><span>${Number(receipt.total || 0).toFixed(2)}</span></div>
      <div class="divider"></div>
      <p>Thanks you bong! please come again.</p>
    </body>
    </html>
  `;
}

export const seedAdminAccount = onCall(
  {
    region: "asia-southeast1",
    secrets: [ADMIN_USERNAME, ADMIN_PASSWORD]
  },
  async (request) => {
    const requestUsername = request.data?.username || ADMIN_USERNAME.value() || "nilaa-os0809$";
    const requestPassword = request.data?.password || ADMIN_PASSWORD.value() || "08090809";
    const shopName = request.data?.shopName || "Nilaa Main Shop";
    const email = usernameToEmail(requestUsername);

    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      userRecord = await admin.auth().createUser({
        email,
        password: requestPassword,
        displayName: requestUsername
      });
    }

    const shopRef = db.collection("shops").doc("main-shop");
    await shopRef.set(
      {
        name: shopName,
        status: "active",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    await db.collection("users").doc(userRecord.uid).set(
      {
        username: requestUsername,
        role: "admin",
        shopId: shopRef.id,
        status: "active",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: "admin",
      shopId: shopRef.id
    });

    return { ok: true, uid: userRecord.uid, username: requestUsername };
  }
);

export const adminCreateUser = onCall({ region: "asia-southeast1" }, async (request) => {
  const adminUser = await requireAdmin(request);
  const { username, password, shopName, role } = request.data || {};

  if (!username || !password || !shopName || !role) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  const email = usernameToEmail(username);
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: username
  });

  const shopRef = db.collection("shops").doc();
  await shopRef.set({
    name: shopName,
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await db.collection("users").doc(userRecord.uid).set({
    username,
    role,
    shopId: shopRef.id,
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: adminUser.username
  });

  await admin.auth().setCustomUserClaims(userRecord.uid, {
    role,
    shopId: shopRef.id
  });

  return { ok: true, uid: userRecord.uid, shopId: shopRef.id };
});

export const generateReceiptPdf = onCall({ region: "asia-southeast1" }, async (request) => {
  requireAuth(request);
  const receipt = request.data?.receipt;
  if (!receipt) {
    throw new HttpsError("invalid-argument", "Receipt payload is required.");
  }

  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(renderReceiptHtml(receipt), { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      width: "80mm",
      printBackground: true,
      margin: {
        top: "8mm",
        right: "6mm",
        bottom: "8mm",
        left: "6mm"
      }
    });

    return {
      base64: Buffer.from(pdf).toString("base64"),
      fileName: `${receipt.invoiceNo || "receipt"}.pdf`,
      mimeType: "application/pdf"
    };
  } finally {
    await browser.close();
  }
});
