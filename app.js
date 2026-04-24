import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { appSettings, supabaseConfig } from "./supabase-config.js";

const MOCK_STORAGE_KEY = "nilaa-os-preview-store-v2";

const state = {
  route: "orders",
  authUser: null,
  profile: null,
  shop: null,
  products: [],
  expenses: [],
  orders: [],
  users: [],
  cart: [],
  currentBuyer: "",
  latestReceipt: null,
  backendMode: "setup"
};

const elements = {
  authShell: document.getElementById("authShell"),
  appShell: document.getElementById("appShell"),
  setupBanner: document.getElementById("setupBanner"),
  telegramLink: document.getElementById("telegramLink"),
  showLoginTab: document.getElementById("showLoginTab"),
  showRequestTab: document.getElementById("showRequestTab"),
  loginPanel: document.getElementById("loginPanel"),
  requestPanel: document.getElementById("requestPanel"),
  loginForm: document.getElementById("loginForm"),
  loginUsername: document.getElementById("loginUsername"),
  loginPassword: document.getElementById("loginPassword"),
  welcomeLabel: document.getElementById("welcomeLabel"),
  shopName: document.getElementById("shopName"),
  openDashboardButton: document.getElementById("openDashboardButton"),
  closeDashboardButton: document.getElementById("closeDashboardButton"),
  logoutButton: document.getElementById("logoutButton"),
  dashboardDrawer: document.getElementById("dashboardDrawer"),
  adminNavButton: document.getElementById("adminNavButton"),
  navButtons: [...document.querySelectorAll(".nav-button")],
  orderForm: document.getElementById("orderForm"),
  buyerName: document.getElementById("buyerName"),
  productSearch: document.getElementById("productSearch"),
  productSuggestions: document.getElementById("productSuggestions"),
  productQty: document.getElementById("productQty"),
  productPrice: document.getElementById("productPrice"),
  clearCartButton: document.getElementById("clearCartButton"),
  cartList: document.getElementById("cartList"),
  cartCount: document.getElementById("cartCount"),
  orderFee: document.getElementById("orderFee"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  cartTotal: document.getElementById("cartTotal"),
  checkoutButton: document.getElementById("checkoutButton"),
  expenseForm: document.getElementById("expenseForm"),
  expenseNote: document.getElementById("expenseNote"),
  expenseAmount: document.getElementById("expenseAmount"),
  expenseList: document.getElementById("expenseList"),
  expenseCount: document.getElementById("expenseCount"),
  todaySalesValue: document.getElementById("todaySalesValue"),
  todayExpenseValue: document.getElementById("todayExpenseValue"),
  todayNetValue: document.getElementById("todayNetValue"),
  productForm: document.getElementById("productForm"),
  productNameInput: document.getElementById("productNameInput"),
  productPriceInput: document.getElementById("productPriceInput"),
  productStockInput: document.getElementById("productStockInput"),
  productLowStockInput: document.getElementById("productLowStockInput"),
  productList: document.getElementById("productList"),
  productCount: document.getElementById("productCount"),
  reportOrderCount: document.getElementById("reportOrderCount"),
  reportItemCount: document.getElementById("reportItemCount"),
  reportLowStockCount: document.getElementById("reportLowStockCount"),
  lowStockLabel: document.getElementById("lowStockLabel"),
  orderList: document.getElementById("orderList"),
  orderCount: document.getElementById("orderCount"),
  lowStockList: document.getElementById("lowStockList"),
  adminCreateUserForm: document.getElementById("adminCreateUserForm"),
  newUsername: document.getElementById("newUsername"),
  newPassword: document.getElementById("newPassword"),
  newShopName: document.getElementById("newShopName"),
  newUserRole: document.getElementById("newUserRole"),
  userList: document.getElementById("userList"),
  userCount: document.getElementById("userCount"),
  screens: {
    orders: document.getElementById("ordersScreen"),
    money: document.getElementById("moneyScreen"),
    stock: document.getElementById("stockScreen"),
    reports: document.getElementById("reportsScreen"),
    admin: document.getElementById("adminScreen")
  },
  receiptModal: document.getElementById("receiptModal"),
  closeReceiptButton: document.getElementById("closeReceiptButton"),
  receiptBuyer: document.getElementById("receiptBuyer"),
  receiptDate: document.getElementById("receiptDate"),
  receiptInvoice: document.getElementById("receiptInvoice"),
  receiptItems: document.getElementById("receiptItems"),
  receiptSubtotal: document.getElementById("receiptSubtotal"),
  receiptFee: document.getElementById("receiptFee"),
  receiptTotal: document.getElementById("receiptTotal"),
  downloadReceiptButton: document.getElementById("downloadReceiptButton"),
  printReceiptButton: document.getElementById("printReceiptButton")
};

elements.telegramLink.href = appSettings.telegramRequestUrl;

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function safeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function usernameToEmail(username) {
  return `${String(username).trim().toLowerCase()}@nilaa-os.local`;
}

function normalizeLoginIdentifier(value) {
  const input = String(value || "").trim();
  return input.includes("@") ? input : usernameToEmail(input);
}

function loginErrorMessage(error, attemptedIdentifier) {
  const fallback = "មិនអាចចូលប្រើបានទេ។ សូមពិនិត្យអ៊ីមែល និងពាក្យសម្ងាត់ម្តងទៀត។";
  const message = String(error?.message || "").trim();
  if (!message) return fallback;
  if (message.toLowerCase().includes("invalid login credentials")) {
    if (!String(attemptedIdentifier || "").includes("@")) {
      return "សូមប្រើអ៊ីមែលដែលបានបង្កើតក្នុងគណនីរបស់អ្នក មិនមែនឈ្មោះខ្លីទេ។";
    }
    return fallback;
  }
  return message;
}

function currentReservedQty(productId) {
  return state.cart
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.qty, 0);
}

function effectiveStock(product) {
  return Number(product.stock_qty || product.stockQty || 0) - currentReservedQty(product.id);
}

function orderSummary(order) {
  return (order.items || []).map((item) => `${item.name} x${item.qty}`).join(", ");
}

function blankState(message) {
  return `<p class="meta-line">${safeText(message)}</p>`;
}

function showSetupBanner(message) {
  elements.setupBanner.textContent = message;
  elements.setupBanner.classList.remove("hidden");
}

function hideSetupBanner() {
  elements.setupBanner.classList.add("hidden");
}

function switchAuthTab(mode) {
  const showLogin = mode === "login";
  elements.loginPanel.classList.toggle("hidden", !showLogin);
  elements.requestPanel.classList.toggle("hidden", showLogin);
  elements.showLoginTab.classList.toggle("tab-button--active", showLogin);
  elements.showRequestTab.classList.toggle("tab-button--active", !showLogin);
}

function buttonLabel(route) {
  return {
    orders: "ការបញ្ជាទិញ",
    money: "លុយ",
    stock: "ស្តុក",
    reports: "របាយការណ៍",
    admin: "Admin"
  }[route] || "nilaa-os";
}

function setRoute(route) {
  state.route = route;
  Object.entries(elements.screens).forEach(([key, screen]) => {
    screen.classList.toggle("hidden", key !== route);
  });
  elements.navButtons.forEach((button) => {
    button.classList.toggle("nav-button--active", button.dataset.route === route);
  });
  elements.shopName.textContent = route === "orders" ? "ការបញ្ជាទិញ" : buttonLabel(route);
}

function openDrawer(open) {
  elements.dashboardDrawer.classList.toggle("hidden", !open);
}

function renderAuth() {
  const loggedIn = Boolean(state.authUser && state.profile);
  elements.authShell.classList.toggle("hidden", loggedIn);
  elements.appShell.classList.toggle("hidden", !loggedIn);
  if (!loggedIn) return;
  elements.welcomeLabel.textContent = `សួស្តី ${state.profile.username}`;
  elements.adminNavButton.classList.toggle("hidden", state.profile.role !== "admin");
  if (state.profile.role !== "admin" && state.route === "admin") {
    setRoute("orders");
  }
}

function renderCart() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const fee = Number(elements.orderFee.value || 0);
  elements.cartCount.textContent = `${state.cart.length} មុខ`;
  elements.cartSubtotal.textContent = money(subtotal);
  elements.cartTotal.textContent = money(subtotal + fee);

  elements.cartList.innerHTML = state.cart.length
    ? state.cart.map((item) => `
        <article class="cart-row">
          <div>
            <strong>${safeText(item.name)}</strong>
            <div class="meta-line">${item.qty} x ${money(item.price)}</div>
          </div>
          <div>
            <strong>${money(item.qty * item.price)}</strong>
            <button class="delete-button" type="button" data-cart-id="${item.id}">លុប</button>
          </div>
        </article>
      `).join("")
    : blankState("មិនទាន់មានទំនិញក្នុងកន្ត្រកទេ");
}

function renderMoney() {
  const todaySales = state.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const todayExpenses = state.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  elements.todaySalesValue.textContent = money(todaySales);
  elements.todayExpenseValue.textContent = money(todayExpenses);
  elements.todayNetValue.textContent = money(todaySales - todayExpenses);
  elements.expenseCount.textContent = state.expenses.length;
  elements.expenseList.innerHTML = state.expenses.length
    ? state.expenses.map((expense) => `
        <article class="record-row">
          <div>
            <strong>${safeText(expense.note)}</strong>
            <div class="meta-line">${safeText(formatDateTime(expense.created_at || expense.createdAt))}</div>
          </div>
          <div>
            <strong>${money(expense.amount)}</strong>
            <button class="delete-button" type="button" data-expense-id="${expense.id}">លុប</button>
          </div>
        </article>
      `).join("")
    : blankState("មិនទាន់មានចំណាយថ្ងៃនេះទេ");
}

function renderProducts() {
  elements.productCount.textContent = state.products.length;
  elements.productSuggestions.innerHTML = state.products
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "km"))
    .map((product) => `<option value="${safeText(product.name)}"></option>`)
    .join("");

  elements.productList.innerHTML = state.products.length
    ? state.products.map((product) => {
        const left = effectiveStock(product);
        const lowAt = Number(product.low_stock_at ?? product.lowStockAt ?? 0);
        const isLow = left <= lowAt;
        return `
          <article class="product-row">
            <div>
              <strong>${safeText(product.name)}</strong>
              <div class="meta-line">តម្លៃ ${money(product.price)} • ស្តុកនៅសល់ ${left}</div>
            </div>
            <div>
              <span class="tag ${isLow ? "tag--low" : ""}">${isLow ? "ជិតអស់" : "ធម្មតា"}</span>
              <button class="delete-button" type="button" data-product-id="${product.id}">លុប</button>
            </div>
          </article>
        `;
      }).join("")
    : blankState("មិនទាន់មានទំនិញទេ");
}

function renderReports() {
  const itemCount = state.orders.reduce((sum, order) => sum + (order.items || []).reduce((s, item) => s + item.qty, 0), 0);
  const lowStock = state.products.filter((product) => effectiveStock(product) <= Number(product.low_stock_at ?? product.lowStockAt ?? 0));
  elements.reportOrderCount.textContent = state.orders.length;
  elements.reportItemCount.textContent = itemCount;
  elements.reportLowStockCount.textContent = lowStock.length;
  elements.orderCount.textContent = state.orders.length;
  elements.lowStockLabel.textContent = lowStock.length;
  elements.orderList.innerHTML = state.orders.length
    ? state.orders.map((order) => `
        <article class="record-row">
          <div>
            <strong>${safeText(order.invoice_no || order.invoiceNo)}</strong>
            <div class="meta-line">${safeText(order.buyer_name || order.buyerName || "ភ្ញៀវ")} • ${safeText(orderSummary(order))}</div>
          </div>
          <div>
            <strong>${money(order.total)}</strong>
            <button class="delete-button" type="button" data-order-id="${order.id}">លុប</button>
          </div>
        </article>
      `).join("")
    : blankState("មិនទាន់មានការលក់ថ្ងៃនេះទេ");
  elements.lowStockList.innerHTML = lowStock.length
    ? lowStock.map((product) => `
        <article class="record-row">
          <div>
            <strong>${safeText(product.name)}</strong>
            <div class="meta-line">នៅសល់ ${effectiveStock(product)} • ព្រមាននៅ ${product.low_stock_at ?? product.lowStockAt}</div>
          </div>
          <span class="tag tag--low">ជិតអស់</span>
        </article>
      `).join("")
    : blankState("ស្តុកមិនទាបទេ");
}

function renderUsers() {
  if (!state.profile || state.profile.role !== "admin") {
    elements.userCount.textContent = 0;
    elements.userList.innerHTML = blankState("Admin ប៉ុណ្ណោះដែលអាចមើលបាន");
    return;
  }
  elements.userCount.textContent = state.users.length;
  elements.userList.innerHTML = state.users.length
    ? state.users.map((user) => `
        <article class="record-row">
          <div>
            <strong>${safeText(user.username)}</strong>
            <div class="meta-line">${safeText(user.role)} • ${safeText(user.status || "active")}</div>
          </div>
        </article>
      `).join("")
    : blankState("មិនទាន់មានអ្នកប្រើទេ");
}

function formatDateTime(value) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
}

function buildReceipt(order) {
  return {
    invoiceNo: order.invoice_no || order.invoiceNo,
    buyerName: order.buyer_name || order.buyerName,
    items: order.items || [],
    subtotal: Number(order.subtotal || 0),
    fee: Number(order.fee || 0),
    total: Number(order.total || 0),
    createdAtText: formatDateTime(order.created_at || order.createdAt)
  };
}

function renderReceipt() {
  if (!state.latestReceipt) {
    elements.receiptModal.classList.add("hidden");
    return;
  }
  elements.receiptModal.classList.remove("hidden");
  elements.receiptBuyer.textContent = `អ្នកទិញ: ${state.latestReceipt.buyerName || "ភ្ញៀវ"}`;
  elements.receiptDate.textContent = state.latestReceipt.createdAtText;
  elements.receiptInvoice.textContent = state.latestReceipt.invoiceNo;
  elements.receiptItems.innerHTML = state.latestReceipt.items.map((item) => `
      <div class="receipt-row">
        <span>${item.qty}</span>
        <span>${safeText(item.name)}</span>
        <span>${money(item.qty * item.price)}</span>
      </div>
    `).join("");
  elements.receiptSubtotal.textContent = money(state.latestReceipt.subtotal);
  elements.receiptFee.textContent = money(state.latestReceipt.fee);
  elements.receiptTotal.textContent = money(state.latestReceipt.total);
}

function renderAll() {
  renderAuth();
  if (!state.authUser || !state.profile) return;
  elements.buyerName.value = state.currentBuyer;
  renderCart();
  renderMoney();
  renderProducts();
  renderReports();
  renderUsers();
  renderReceipt();
  setRoute(state.route);
}

function closeReceipt() {
  state.latestReceipt = null;
  renderReceipt();
}

function makeDownload(data) {
  if (data.html) {
    const preview = window.open("", "_blank", "width=420,height=720");
    if (!preview) {
      window.alert("សូមអនុញ្ញាត popup ដើម្បី print receipt");
      return;
    }
    preview.document.open();
    preview.document.write(data.html);
    preview.document.close();
    preview.focus();
    setTimeout(() => preview.print(), 400);
    return;
  }
  if (data.url) {
    window.open(data.url, "_blank", "noreferrer");
  }
}

function createMockBackend() {
  const listeners = new Set();
  const seed = () => ({
    sessionUserId: null,
    shops: [{ id: "shop-admin", name: "Nilaa Main Shop", status: "active", created_at: new Date().toISOString() }],
    users: [],
    products: [
      { id: crypto.randomUUID(), shop_id: "shop-admin", name: "កាហ្វេទឹកកក", price: 1.5, stock_qty: 20, low_stock_at: 5 },
      { id: crypto.randomUUID(), shop_id: "shop-admin", name: "តែទឹកដោះគោ", price: 2, stock_qty: 15, low_stock_at: 5 }
    ],
    expenses: [],
    orders: []
  });
  const load = () => JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || "null") || seed();
  const save = (store) => localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
  const notify = async () => {
    const store = load();
    const user = store.users.find((item) => item.id === store.sessionUserId) || null;
    for (const callback of listeners) {
      await callback(user ? { id: user.id, email: usernameToEmail(user.username) } : null);
    }
  };
  return {
    mode: "preview",
    async init() {
      if (!localStorage.getItem(MOCK_STORAGE_KEY)) save(seed());
      showSetupBanner("Preview mode is active. Add Supabase URL and anon key, then run the SQL in supabase/schema.sql to move to real production.");
    },
    onAuthChange(callback) {
      listeners.add(callback);
      const store = load();
      const user = store.users.find((item) => item.id === store.sessionUserId) || null;
      callback(user ? { id: user.id, email: usernameToEmail(user.username) } : null);
      return { unsubscribe: () => listeners.delete(callback) };
    },
    async signIn(username, password) {
      const store = load();
      const normalized = normalizeLoginIdentifier(username);
      const user = store.users.find(
        (item) =>
          (item.username === username || normalizeLoginIdentifier(item.username) === normalized || item.email === normalized) &&
          item.password === password &&
          item.status !== "disabled"
      );
      if (!user) throw new Error("ឈ្មោះអ្នកប្រើ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
      store.sessionUserId = user.id;
      save(store);
      await notify();
    },
    async signOut() {
      const store = load();
      store.sessionUserId = null;
      save(store);
      await notify();
    },
    async getProfile(uid) {
      const store = load();
      const user = store.users.find((item) => item.id === uid);
      return user ? { id: user.id, username: user.username, role: user.role, shop_id: user.shop_id, status: user.status } : null;
    },
    async getShop(shopId) {
      const store = load();
      return store.shops.find((item) => item.id === shopId) || null;
    },
    async fetchDashboard(shopId, role) {
      const store = load();
      return {
        products: store.products.filter((item) => item.shop_id === shopId),
        expenses: store.expenses.filter((item) => item.shop_id === shopId && item.date === todayKey()).reverse(),
        orders: store.orders.filter((item) => item.shop_id === shopId && item.date === todayKey()).reverse(),
        users: role === "admin" ? store.users : store.users.filter((item) => item.shop_id === shopId)
      };
    },
    async saveProduct(shopId, payload) {
      const store = load();
      const existing = store.products.find((item) => item.shop_id === shopId && item.name.toLowerCase() === payload.name.toLowerCase());
      if (existing) Object.assign(existing, payload);
      else store.products.push({ id: crypto.randomUUID(), shop_id: shopId, ...payload });
      save(store);
    },
    async deleteProduct(shopId, productId) {
      const store = load();
      store.products = store.products.filter((item) => !(item.shop_id === shopId && item.id === productId));
      save(store);
    },
    async createExpense(shopId, payload, profile) {
      const store = load();
      store.expenses.push({ id: crypto.randomUUID(), shop_id: shopId, note: payload.note, amount: payload.amount, created_by: profile.username, created_at: new Date().toISOString(), date: todayKey() });
      save(store);
    },
    async deleteExpense(shopId, expenseId) {
      const store = load();
      store.expenses = store.expenses.filter((item) => !(item.shop_id === shopId && item.id === expenseId));
      save(store);
    },
    async checkout(shopId, payload, profile) {
      const store = load();
      for (const item of payload.items) {
        const product = store.products.find((row) => row.id === item.productId && row.shop_id === shopId);
        if (!product || product.stock_qty < item.qty) throw new Error(`ស្តុកមិនគ្រប់សម្រាប់ ${item.name}`);
      }
      payload.items.forEach((item) => {
        const product = store.products.find((row) => row.id === item.productId && row.shop_id === shopId);
        product.stock_qty -= item.qty;
      });
      const order = {
        id: crypto.randomUUID(),
        shop_id: shopId,
        invoice_no: `#${String(store.orders.length + 1).padStart(4, "0")}`,
        buyer_name: payload.buyerName,
        items: payload.items,
        subtotal: payload.subtotal,
        fee: payload.fee,
        total: payload.total,
        status: "completed",
        created_by: profile.username,
        created_at: new Date().toISOString(),
        date: todayKey()
      };
      store.orders.push(order);
      save(store);
      return order;
    },
    async deleteOrder(shopId, orderId) {
      const store = load();
      const order = store.orders.find((item) => item.shop_id === shopId && item.id === orderId);
      if (order) {
        order.items.forEach((item) => {
          const product = store.products.find((row) => row.id === item.productId);
          if (product) product.stock_qty += item.qty;
        });
      }
      store.orders = store.orders.filter((item) => !(item.shop_id === shopId && item.id === orderId));
      save(store);
    },
    async createUser(payload, profile) {
      if (profile.role !== "admin") throw new Error("មានតែ admin ប៉ុណ្ណោះ");
      const store = load();
      const shopId = crypto.randomUUID();
      store.shops.push({ id: shopId, name: payload.shopName, status: "active", created_at: new Date().toISOString() });
      store.users.push({ id: crypto.randomUUID(), username: payload.username, password: payload.password, role: payload.role, shop_id: shopId, status: "active", created_at: new Date().toISOString() });
      save(store);
    },
    async generateReceiptPdf(receipt) {
      const html = `
      <!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><style>
      body{font-family:Arial,sans-serif;padding:20px;width:300px}h1{text-align:center;text-transform:uppercase;margin:0}
      p{margin:4px 0;text-align:center}.divider{border-top:1px dashed #666;margin:12px 0}.row,.total{display:flex;justify-content:space-between;gap:8px;font-size:12px}.total{font-weight:700}
      </style></head><body>
      <h1>nilaa-os</h1><p>វិក្កយបត្រលក់</p><p>អ្នកទិញ: ${safeText(receipt.buyerName || "ភ្ញៀវ")}</p>
      <div class="divider"></div><div class="row"><span>${safeText(receipt.createdAtText)}</span><span>${safeText(receipt.invoiceNo)}</span></div>
      <div class="divider"></div>${receipt.items.map((item) => `<div class="row"><span>${item.qty}</span><span>${safeText(item.name)}</span><span>${money(item.qty * item.price)}</span></div>`).join("")}
      <div class="divider"></div><div class="row"><span>សរុបមុខទំនិញ</span><span>${money(receipt.subtotal)}</span></div>
      <div class="row"><span>ថ្លៃបន្ថែម</span><span>${money(receipt.fee)}</span></div><div class="row total"><span>សរុបចុងក្រោយ</span><span>${money(receipt.total)}</span></div>
      <div class="divider"></div><p>Thanks you bong! please come again.</p></body></html>`;
      return { html };
    }
  };
}

function createSupabaseBackend() {
  const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

  const callFunction = async (name, body) => {
    const { data, error } = await supabase.functions.invoke(name, { body });
    if (error) throw error;
    return data;
  };

  return {
    mode: "supabase",
    async init() {
      hideSetupBanner();
    },
    onAuthChange(callback) {
      const subscription = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
      });
      supabase.auth.getSession().then(({ data }) => callback(data.session?.user || null));
      return subscription.data.subscription;
    },
    async signIn(username, password) {
      const { error } = await supabase.auth.signInWithPassword({ email: normalizeLoginIdentifier(username), password });
      if (error) throw error;
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    async getProfile(uid) {
      const { data, error } = await supabase.from("users").select("*").eq("id", uid).single();
      if (error) throw error;
      return data;
    },
    async getShop(shopId) {
      const { data, error } = await supabase.from("shops").select("*").eq("id", shopId).single();
      if (error) throw error;
      return data;
    },
    async fetchDashboard(shopId, role) {
      const [productsRes, expensesRes, ordersRes, usersRes] = await Promise.all([
        supabase.from("products").select("*").eq("shop_id", shopId).order("name"),
        supabase.from("expenses").select("*").eq("shop_id", shopId).eq("date", todayKey()).order("created_at", { ascending: false }),
        supabase.from("orders").select("*").eq("shop_id", shopId).eq("date", todayKey()).order("created_at", { ascending: false }),
        role === "admin"
          ? supabase.from("users").select("*").order("created_at", { ascending: false })
          : supabase.from("users").select("*").eq("shop_id", shopId).order("created_at", { ascending: false })
      ]);

      for (const result of [productsRes, expensesRes, ordersRes, usersRes]) {
        if (result.error) throw result.error;
      }

      return {
        products: productsRes.data || [],
        expenses: expensesRes.data || [],
        orders: (ordersRes.data || []).map((row) => ({ ...row, items: row.items || [] })),
        users: usersRes.data || []
      };
    },
    async saveProduct(shopId, payload) {
      const { data: existing, error: checkError } = await supabase
        .from("products")
        .select("id")
        .eq("shop_id", shopId)
        .eq("name", payload.name)
        .maybeSingle();
      if (checkError) throw checkError;
      if (existing) {
        const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({ shop_id: shopId, ...payload });
        if (error) throw error;
      }
    },
    async deleteProduct(_shopId, productId) {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    },
    async createExpense(shopId, payload, profile) {
      const { error } = await supabase.from("expenses").insert({
        shop_id: shopId,
        note: payload.note,
        amount: payload.amount,
        created_by: profile.username,
        created_at: new Date().toISOString(),
        date: todayKey()
      });
      if (error) throw error;
    },
    async deleteExpense(_shopId, expenseId) {
      const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
      if (error) throw error;
    },
    async checkout(shopId, payload, profile) {
      const result = await callFunction("checkout-order", {
        shopId,
        buyerName: payload.buyerName,
        items: payload.items,
        subtotal: payload.subtotal,
        fee: payload.fee,
        total: payload.total,
        createdBy: profile.username,
        date: todayKey()
      });
      return result.order;
    },
    async deleteOrder(shopId, orderId) {
      await callFunction("delete-order", { shopId, orderId });
    },
    async createUser(payload) {
      await callFunction("admin-create-user", payload);
    },
    async generateReceiptPdf(receipt) {
      return await callFunction("generate-receipt-pdf", { receipt });
    }
  };
}

const isSupabaseConfigured = Boolean(supabaseConfig.url) && Boolean(supabaseConfig.anonKey);
const backend = isSupabaseConfigured ? createSupabaseBackend() : createMockBackend();
state.backendMode = backend.mode;

async function loadDashboardData() {
  if (!state.profile) return;
  const data = await backend.fetchDashboard(state.profile.shop_id || state.profile.shopId, state.profile.role);
  state.products = data.products.map((row) => ({
    ...row,
    stock_qty: Number(row.stock_qty ?? row.stockQty ?? 0),
    price: Number(row.price || 0),
    low_stock_at: Number(row.low_stock_at ?? row.lowStockAt ?? 0)
  }));
  state.expenses = data.expenses.map((row) => ({ ...row, amount: Number(row.amount || 0) }));
  state.orders = data.orders.map((row) => ({
    ...row,
    subtotal: Number(row.subtotal || 0),
    fee: Number(row.fee || 0),
    total: Number(row.total || 0)
  }));
  state.users = data.users;
}

async function afterMutation() {
  if (state.profile) await loadDashboardData();
  renderAll();
}

async function loadSignedInUser(user) {
  state.authUser = user;
  if (!user) {
    state.profile = null;
    state.shop = null;
    state.products = [];
    state.expenses = [];
    state.orders = [];
    state.users = [];
    state.cart = [];
    state.latestReceipt = null;
    renderAll();
    return;
  }
  state.profile = await backend.getProfile(user.id || user.uid);
  state.shop = state.profile ? await backend.getShop(state.profile.shop_id || state.profile.shopId) : null;
  await loadDashboardData();
  renderAll();
}

function currentProductByName(name) {
  return state.products.find((item) => item.name.toLowerCase() === name.trim().toLowerCase());
}

function resetOrderInputs() {
  elements.productSearch.value = "";
  elements.productQty.value = 1;
  elements.productPrice.value = "";
}

elements.showLoginTab.addEventListener("click", () => switchAuthTab("login"));
elements.showRequestTab.addEventListener("click", () => switchAuthTab("request"));
elements.openDashboardButton.addEventListener("click", () => openDrawer(true));
elements.closeDashboardButton.addEventListener("click", () => openDrawer(false));
elements.dashboardDrawer.addEventListener("click", (event) => {
  if (event.target.id === "dashboardDrawer") openDrawer(false);
});
elements.navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setRoute(button.dataset.route);
    openDrawer(false);
  });
});

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const identifier = elements.loginUsername.value.trim();
  try {
    await backend.signIn(identifier, elements.loginPassword.value.trim());
  } catch (error) {
    window.alert(loginErrorMessage(error, identifier));
  }
});

elements.logoutButton.addEventListener("click", async () => {
  await backend.signOut();
});

elements.buyerName.addEventListener("input", (event) => {
  state.currentBuyer = event.target.value.trim();
});

elements.productSearch.addEventListener("input", () => {
  const product = currentProductByName(elements.productSearch.value);
  if (!product) return;
  elements.productPrice.value = product.price;
  elements.productQty.value = 1;
});

elements.orderFee.addEventListener("input", renderCart);

elements.orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = currentProductByName(elements.productSearch.value);
  const qty = Number(elements.productQty.value);
  const enteredPrice = Number(elements.productPrice.value);
  if (!product || !qty || qty <= 0 || enteredPrice < 0) {
    window.alert("សូមជ្រើសរើសទំនិញ និងបញ្ចូលតម្លៃអោយត្រឹមត្រូវ");
    return;
  }
  if (effectiveStock(product) < qty) {
    window.alert("ស្តុកមិនគ្រប់");
    return;
  }
  const existing = state.cart.find((item) => item.productId === product.id && item.price === enteredPrice);
  if (existing) existing.qty += qty;
  else state.cart.push({ id: crypto.randomUUID(), productId: product.id, name: product.name, qty, price: enteredPrice });
  state.currentBuyer = elements.buyerName.value.trim();
  renderAll();
  resetOrderInputs();
});

elements.cartList.addEventListener("click", (event) => {
  const target = event.target.closest("[data-cart-id]");
  if (!target) return;
  state.cart = state.cart.filter((item) => item.id !== target.dataset.cartId);
  renderAll();
});

elements.clearCartButton.addEventListener("click", () => {
  state.cart = [];
  renderAll();
});

elements.checkoutButton.addEventListener("click", async () => {
  if (!state.cart.length || !state.profile) return;
  const subtotal = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const fee = Number(elements.orderFee.value || 0);
  const payload = {
    buyerName: elements.buyerName.value.trim() || "ភ្ញៀវ",
    items: state.cart.map((item) => ({ productId: item.productId, name: item.name, qty: item.qty, price: item.price })),
    subtotal,
    fee,
    total: subtotal + fee
  };
  try {
    const order = await backend.checkout(state.profile.shop_id || state.profile.shopId, payload, state.profile);
    state.latestReceipt = buildReceipt(order);
    state.cart = [];
    state.currentBuyer = "";
    elements.buyerName.value = "";
    elements.orderFee.value = "0";
    await afterMutation();
  } catch (error) {
    window.alert(error.message || "បិទការលក់មិនបាន");
  }
});

elements.expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  const note = elements.expenseNote.value.trim();
  const amount = Number(elements.expenseAmount.value);
  if (!note || amount < 0) {
    window.alert("សូមបញ្ចូលចំណាយអោយត្រឹមត្រូវ");
    return;
  }
  await backend.createExpense(state.profile.shop_id || state.profile.shopId, { note, amount }, state.profile);
  elements.expenseForm.reset();
  await afterMutation();
});

elements.expenseList.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-expense-id]");
  if (!target || !state.profile) return;
  await backend.deleteExpense(state.profile.shop_id || state.profile.shopId, target.dataset.expenseId);
  await afterMutation();
});

elements.productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  const name = elements.productNameInput.value.trim();
  const price = Number(elements.productPriceInput.value);
  const stock_qty = Number(elements.productStockInput.value);
  const low_stock_at = Number(elements.productLowStockInput.value);
  if (!name || price < 0 || stock_qty < 0 || low_stock_at < 0) {
    window.alert("សូមបំពេញព័ត៌មានទំនិញអោយត្រឹមត្រូវ");
    return;
  }
  await backend.saveProduct(state.profile.shop_id || state.profile.shopId, { name, price, stock_qty, low_stock_at, active: true });
  elements.productForm.reset();
  elements.productStockInput.value = "0";
  elements.productLowStockInput.value = "5";
  await afterMutation();
});

elements.productList.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-product-id]");
  if (!target || !state.profile) return;
  await backend.deleteProduct(state.profile.shop_id || state.profile.shopId, target.dataset.productId);
  await afterMutation();
});

elements.orderList.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-order-id]");
  if (!target || !state.profile) return;
  await backend.deleteOrder(state.profile.shop_id || state.profile.shopId, target.dataset.orderId);
  await afterMutation();
});

elements.adminCreateUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  try {
    await backend.createUser({
      username: elements.newUsername.value.trim(),
      password: elements.newPassword.value.trim(),
      shopName: elements.newShopName.value.trim(),
      role: elements.newUserRole.value
    }, state.profile);
    elements.adminCreateUserForm.reset();
    await afterMutation();
  } catch (error) {
    window.alert(error.message || "បង្កើតអ្នកប្រើមិនបាន");
  }
});

elements.closeReceiptButton.addEventListener("click", closeReceipt);
elements.receiptModal.addEventListener("click", (event) => {
  if (event.target.id === "receiptModal") closeReceipt();
});
elements.printReceiptButton.addEventListener("click", () => window.print());
elements.downloadReceiptButton.addEventListener("click", async () => {
  if (!state.latestReceipt) return;
  try {
    const file = await backend.generateReceiptPdf(state.latestReceipt);
    makeDownload(file);
  } catch (error) {
    window.alert(error.message || "មិនអាចបង្កើត PDF បាន");
  }
});

await backend.init();
backend.onAuthChange(async (user) => {
  await loadSignedInUser(user);
});
