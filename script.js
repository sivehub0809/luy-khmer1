const STORAGE_KEY = "luy-khmer-pos-v2";
const LOGIN_PIN = "1234";

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultState = {
  session: {
    isLoggedIn: false,
    username: ""
  },
  products: [
    { id: crypto.randomUUID(), name: "កាហ្វេទឹកកក", price: 1.5, stock: 30, lowStockAt: 8 },
    { id: crypto.randomUUID(), name: "តែទឹកដោះគោ", price: 2, stock: 18, lowStockAt: 6 },
    { id: crypto.randomUUID(), name: "មីខ្ចប់", price: 0.75, stock: 42, lowStockAt: 10 }
  ],
  orders: [],
  expenses: [],
  cart: []
};

const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
const normalizeProducts = (products) =>
  products.map((product) => ({
    id: product.id || crypto.randomUUID(),
    name: product.name || "ទំនិញថ្មី",
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    lowStockAt: Number(product.lowStockAt) || 5
  }));

const state = savedState
  ? {
      session: savedState.session || defaultState.session,
      products: Array.isArray(savedState.products)
        ? normalizeProducts(savedState.products)
        : normalizeProducts(defaultState.products),
      orders: Array.isArray(savedState.orders) ? savedState.orders : defaultState.orders,
      expenses: Array.isArray(savedState.expenses) ? savedState.expenses : defaultState.expenses,
      cart: Array.isArray(savedState.cart) ? savedState.cart : defaultState.cart
    }
  : {
      ...structuredClone(defaultState),
      products: normalizeProducts(defaultState.products)
    };

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value);
}

function safeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function todayOrders() {
  return state.orders.filter((order) => order.date === todayKey());
}

function todayExpenses() {
  return state.expenses.filter((expense) => expense.date === todayKey());
}

function findProductByName(name) {
  return state.products.find((product) => product.name.toLowerCase() === name.trim().toLowerCase());
}

function fillProductSuggestions() {
  const datalist = document.getElementById("productSuggestions");
  datalist.innerHTML = state.products
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "km"))
    .map((product) => `<option value="${safeText(product.name)}"></option>`)
    .join("");
}

function renderAuth() {
  const loginScreen = document.getElementById("loginScreen");
  const appShell = document.getElementById("appShell");
  loginScreen.classList.toggle("hidden", state.session.isLoggedIn);
  appShell.classList.toggle("hidden", !state.session.isLoggedIn);
  document.getElementById("welcomeUser").textContent = state.session.username
    ? `សួស្តី ${state.session.username}`
    : "សួស្តី";
}

function renderSummary() {
  const orders = todayOrders();
  const expenses = todayExpenses();
  const salesTotal = orders.reduce((sum, order) => sum + order.total, 0);
  const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netTotal = salesTotal - expenseTotal;
  const lowStock = state.products.filter((product) => product.stock <= product.lowStockAt).length;

  document.getElementById("salesToday").textContent = money(salesTotal);
  document.getElementById("ordersToday").textContent = `${orders.length} វិក្កយបត្រ`;
  document.getElementById("expenseToday").textContent = money(expenseTotal);
  document.getElementById("expenseCount").textContent = `${expenses.length} កំណត់ត្រា`;
  document.getElementById("netToday").textContent = money(netTotal);
  document.getElementById("stockAlertCount").textContent = `${lowStock} មុខទំនិញជិតអស់`;
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const total = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (!state.cart.length) {
    cartList.innerHTML = '<p class="empty-state">មិនទាន់មានមុខទំនិញក្នុងកន្ត្រកទេ</p>';
  } else {
    cartList.innerHTML = state.cart
      .map(
        (item) => `
          <article class="cart-row">
            <div>
              <div class="cart-title">${safeText(item.name)}</div>
              <div class="cart-meta">${item.qty} x ${money(item.price)}</div>
            </div>
            <div class="chip-row">
              <strong>${money(item.qty * item.price)}</strong>
              <button class="delete-button" type="button" onclick="removeCartItem('${item.id}')">លុប</button>
            </div>
          </article>
        `
      )
      .join("");
  }

  document.getElementById("cartCount").textContent = `${state.cart.length} មុខ`;
  document.getElementById("cartTotal").textContent = money(total);
}

function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  if (!state.products.length) {
    productGrid.innerHTML = '<p class="empty-state">មិនទាន់មានទំនិញដែលបានរក្សាទុកទេ</p>';
  } else {
    productGrid.innerHTML = state.products
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "km"))
      .map((product) => {
        const isLow = product.stock <= product.lowStockAt;
        return `
          <article class="product-card">
            <div class="product-row">
              <div>
                <div class="product-title">${safeText(product.name)}</div>
                <div class="product-note">តម្លៃ ${money(product.price)} • ស្តុក ${product.stock}</div>
              </div>
              <button class="delete-button" type="button" onclick="deleteProduct('${product.id}')">លុប</button>
            </div>
            <div class="chip-row">
              <button class="chip-button" type="button" onclick="quickPickProduct('${product.id}')">ជ្រើសលក់</button>
              <span class="product-note">${isLow ? "ជិតអស់ស្តុក" : "ស្តុកធម្មតា"}</span>
            </div>
          </article>
        `;
      })
      .join("");
  }
  document.getElementById("productCount").textContent = `${state.products.length} មុខ`;
  fillProductSuggestions();
}

function renderReports() {
  const orders = todayOrders();
  const expenses = todayExpenses();
  const soldItems = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0),
    0
  );
  const average = orders.length
    ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
    : 0;

  document.getElementById("reportOrders").textContent = orders.length;
  document.getElementById("reportItems").textContent = soldItems;
  document.getElementById("reportAverage").textContent = money(average);
  document.getElementById("saleHistoryCount").textContent = orders.length;
  document.getElementById("expenseHistoryCount").textContent = expenses.length;

  const salesHistory = document.getElementById("salesHistory");
  if (!orders.length) {
    salesHistory.innerHTML = '<p class="empty-state">ថ្ងៃនេះមិនទាន់មានការលក់ទេ</p>';
  } else {
    salesHistory.innerHTML = orders
      .slice()
      .reverse()
      .map((order) => {
        const names = order.items.map((item) => `${safeText(item.name)} x${item.qty}`).join(", ");
        return `
          <article class="record-row">
            <div>
              <div class="record-title">វិក្កយបត្រ ${safeText(order.invoice)}</div>
              <div class="record-meta">${names}</div>
            </div>
            <div class="chip-row">
              <strong>${money(order.total)}</strong>
              <button class="delete-button" type="button" onclick="deleteOrder('${order.id}')">លុប</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const expenseHistory = document.getElementById("expenseHistory");
  if (!expenses.length) {
    expenseHistory.innerHTML = '<p class="empty-state">ថ្ងៃនេះមិនទាន់មានចំណាយទេ</p>';
  } else {
    expenseHistory.innerHTML = expenses
      .slice()
      .reverse()
      .map(
        (expense) => `
          <article class="record-row">
            <div>
              <div class="record-title">${safeText(expense.note)}</div>
              <div class="record-meta">${safeText(expense.createdAt)}</div>
            </div>
            <div class="chip-row">
              <strong>${money(expense.amount)}</strong>
              <button class="delete-button" type="button" onclick="deleteExpense('${expense.id}')">លុប</button>
            </div>
          </article>
        `
      )
      .join("");
  }
}

function renderApp() {
  renderAuth();
  if (!state.session.isLoggedIn) {
    return;
  }
  renderSummary();
  renderCart();
  renderProducts();
  renderReports();
}

function saveOrUpdateProduct({ name, price, stock }) {
  const existing = findProductByName(name);
  if (existing) {
    existing.price = price;
    existing.stock = stock;
    return existing;
  }
  const product = {
    id: crypto.randomUUID(),
    name,
    price,
    stock,
    lowStockAt: Math.max(3, Math.min(10, Math.ceil(stock * 0.25) || 5))
  };
  state.products.push(product);
  return product;
}

function addToCart(name, qty, price) {
  const existing = state.cart.find((item) => item.name.toLowerCase() === name.toLowerCase() && item.price === price);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({
      id: crypto.randomUUID(),
      name,
      qty,
      price
    });
  }
}

function resetQuickForm() {
  document.getElementById("productSearch").value = "";
  document.getElementById("productQty").value = 1;
  document.getElementById("productPrice").value = "";
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("loginName").value.trim() || "ម្ចាស់ហាង";
  const pin = document.getElementById("loginPin").value.trim();

  if (pin !== LOGIN_PIN) {
    window.alert("លេខសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមប្រើ 1234");
    return;
  }

  state.session.isLoggedIn = true;
  state.session.username = username;
  persistState();
  renderApp();
});

document.getElementById("logoutButton").addEventListener("click", () => {
  state.session.isLoggedIn = false;
  persistState();
  renderApp();
});

document.getElementById("productSearch").addEventListener("input", (event) => {
  const product = findProductByName(event.target.value);
  if (!product) {
    return;
  }
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productQty").value = 1;
});

document.getElementById("itemForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("productSearch").value.trim();
  const qty = Number(document.getElementById("productQty").value);
  const enteredPrice = Number(document.getElementById("productPrice").value);

  if (!name || qty <= 0 || enteredPrice < 0) {
    return;
  }

  const matched = findProductByName(name);
  const product = matched || saveOrUpdateProduct({ name, price: enteredPrice, stock: 0 });
  product.price = enteredPrice;
  addToCart(product.name, qty, enteredPrice);
  persistState();
  renderApp();
  resetQuickForm();
});

document.getElementById("catalogForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("catalogName").value.trim();
  const price = Number(document.getElementById("catalogPrice").value);
  const stock = Number(document.getElementById("catalogStock").value);

  if (!name || price < 0 || stock < 0) {
    return;
  }

  saveOrUpdateProduct({ name, price, stock });
  persistState();
  renderApp();
  event.target.reset();
});

document.getElementById("expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.getElementById("expenseNote").value.trim();
  const amount = Number(document.getElementById("expenseAmount").value);

  if (!note || amount < 0) {
    return;
  }

  state.expenses.push({
    id: crypto.randomUUID(),
    note,
    amount,
    date: todayKey(),
    createdAt: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    })
  });
  persistState();
  renderApp();
  event.target.reset();
});

document.getElementById("clearCartButton").addEventListener("click", () => {
  state.cart = [];
  persistState();
  renderApp();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!state.cart.length) {
    return;
  }

  const orderItems = state.cart.map((item) => ({ ...item }));
  const total = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  orderItems.forEach((item) => {
    const product = findProductByName(item.name);
    if (product) {
      product.stock = Math.max(0, product.stock - item.qty);
    }
  });

  state.orders.push({
    id: crypto.randomUUID(),
    invoice: `#${String(state.orders.length + 1).padStart(3, "0")}`,
    items: orderItems,
    total,
    date: todayKey()
  });

  state.cart = [];
  persistState();
  renderApp();
});

window.removeCartItem = (id) => {
  state.cart = state.cart.filter((item) => item.id !== id);
  persistState();
  renderApp();
};

window.deleteExpense = (id) => {
  state.expenses = state.expenses.filter((item) => item.id !== id);
  persistState();
  renderApp();
};

window.deleteOrder = (id) => {
  const order = state.orders.find((item) => item.id === id);
  if (order) {
    order.items.forEach((item) => {
      const product = findProductByName(item.name);
      if (product) {
        product.stock += item.qty;
      }
    });
  }
  state.orders = state.orders.filter((item) => item.id !== id);
  persistState();
  renderApp();
};

window.deleteProduct = (id) => {
  state.products = state.products.filter((item) => item.id !== id);
  persistState();
  renderApp();
};

window.quickPickProduct = (id) => {
  const product = state.products.find((item) => item.id === id);
  if (!product) {
    return;
  }
  document.getElementById("productSearch").value = product.name;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productQty").value = 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

renderApp();
