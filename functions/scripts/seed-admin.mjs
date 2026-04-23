import admin from "firebase-admin";

admin.initializeApp();

const username = process.env.ADMIN_USERNAME || "nilaa-os0809$";
const password = process.env.ADMIN_PASSWORD || "08090809";
const shopName = process.env.ADMIN_SHOP_NAME || "Nilaa Main Shop";
const email = `${username.toLowerCase()}@nilaa-os.local`;

let userRecord;
try {
  userRecord = await admin.auth().getUserByEmail(email);
} catch {
  userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: username
  });
}

await admin.firestore().collection("shops").doc("main-shop").set(
  {
    name: shopName,
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  { merge: true }
);

await admin.firestore().collection("users").doc(userRecord.uid).set(
  {
    username,
    role: "admin",
    shopId: "main-shop",
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  { merge: true }
);

await admin.auth().setCustomUserClaims(userRecord.uid, {
  role: "admin",
  shopId: "main-shop"
});

console.log(`Seeded admin account: ${username}`);
