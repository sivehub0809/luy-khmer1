import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { appSettings, supabaseConfig } from "./supabase-config.js";

const MOCK_STORAGE_KEY = "nilaa-os-preview-store-v2";
const LANGUAGE_STORAGE_KEY = "nilaa-os-language";

const state = {
  route: "pos",
  language: localStorage.getItem(LANGUAGE_STORAGE_KEY) || "km",
  productFilter: "all",
  authUser: null,
  profile: null,
  shop: null,
  settings: null,
  capabilities: {
    settings: true,
    payments: true,
    customers: true
  },
  products: [],
  expenses: [],
  orders: [],
  users: [],
  cart: [],
  currentBuyer: "",
  currentPhone: "",
  pendingPaymentOrder: null,
  latestReceipt: null,
  backendMode: "setup",
  splashDone: false,
  customerExpanded: false
};

const elements = {
  startupSplash: document.getElementById("startupSplash"),
  startupOrbit: document.getElementById("startupOrbit"),
  authShell: document.getElementById("authShell"),
  appShell: document.getElementById("appShell"),
  asyncOverlay: document.getElementById("asyncOverlay"),
  asyncSpinner: document.getElementById("asyncSpinner"),
  asyncSuccess: document.getElementById("asyncSuccess"),
  asyncTitle: document.getElementById("asyncTitle"),
  asyncMessage: document.getElementById("asyncMessage"),
  setupBanner: document.getElementById("setupBanner"),
  telegramLink: document.getElementById("telegramLink"),
  helpTelegramLink: document.getElementById("helpTelegramLink"),
  langKmButton: document.getElementById("langKmButton"),
  langEnButton: document.getElementById("langEnButton"),
  appLangKmButton: document.getElementById("appLangKmButton"),
  appLangEnButton: document.getElementById("appLangEnButton"),
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
  sidebarLogoutButton: document.getElementById("sidebarLogoutButton"),
  bottomMoreButton: document.getElementById("bottomMoreButton"),
  dashboardDrawer: document.getElementById("dashboardDrawer"),
  adminNavButton: document.getElementById("adminNavButton"),
  navButtons: [...document.querySelectorAll(".nav-button")],
  customerToggleButton: document.getElementById("customerToggleButton"),
  customerFields: document.getElementById("customerFields"),
  orderForm: document.getElementById("orderForm"),
  buyerName: document.getElementById("buyerName"),
  buyerPhone: document.getElementById("buyerPhone"),
  productSearch: document.getElementById("productSearch"),
  productSuggestions: document.getElementById("productSuggestions"),
  quickProductList: document.getElementById("quickProductList"),
  categoryChips: [...document.querySelectorAll("[data-product-filter]")],
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
  ordersHistoryList: document.getElementById("ordersHistoryList"),
  ordersPageCount: document.getElementById("ordersPageCount"),
  customerList: document.getElementById("customerList"),
  customerCount: document.getElementById("customerCount"),
  productForm: document.getElementById("productForm"),
  productNameInput: document.getElementById("productNameInput"),
  productImageInput: document.getElementById("productImageInput"),
  productImagePreview: document.getElementById("productImagePreview"),
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
  newPhone: document.getElementById("newPhone"),
  newPassword: document.getElementById("newPassword"),
  newShopName: document.getElementById("newShopName"),
  newUserRole: document.getElementById("newUserRole"),
  userList: document.getElementById("userList"),
  userCount: document.getElementById("userCount"),
  settingsForm: document.getElementById("settingsForm"),
  settingsProfileImage: document.getElementById("settingsProfileImage"),
  settingsProfilePreview: document.getElementById("settingsProfilePreview"),
  settingsBusinessName: document.getElementById("settingsBusinessName"),
  settingsBusinessDescription: document.getElementById("settingsBusinessDescription"),
  settingsPaymentMethod: document.getElementById("settingsPaymentMethod"),
  settingsQrUpload: document.getElementById("settingsQrUpload"),
  settingsQrPreview: document.getElementById("settingsQrPreview"),
  settingsReceiptTitle: document.getElementById("settingsReceiptTitle"),
  settingsReceiptFooter: document.getElementById("settingsReceiptFooter"),
  nonStaffFields: [...document.querySelectorAll("[data-non-staff='true']")],
  paymentQrImage: document.getElementById("paymentQrImage"),
  receiptHeaderTitle: document.getElementById("receiptHeaderTitle"),
  receiptBrandLogo: document.getElementById("receiptBrandLogo"),
  receiptBrandName: document.getElementById("receiptBrandName"),
  receiptBusinessDescription: document.getElementById("receiptBusinessDescription"),
  receiptFooterText: document.getElementById("receiptFooterText"),
  screens: {
    pos: document.getElementById("posScreen"),
    orders: document.getElementById("ordersScreen"),
    money: document.getElementById("moneyScreen"),
    expenses: document.getElementById("expensesScreen"),
    stock: document.getElementById("stockScreen"),
    customers: document.getElementById("customersScreen"),
    reports: document.getElementById("reportsScreen"),
    settings: document.getElementById("settingsScreen"),
    users: document.getElementById("usersScreen"),
    help: document.getElementById("helpScreen")
  },
  receiptModal: document.getElementById("receiptModal"),
  paymentModal: document.getElementById("paymentModal"),
  closePaymentButton: document.getElementById("closePaymentButton"),
  cancelPaymentButton: document.getElementById("cancelPaymentButton"),
  markPaidButton: document.getElementById("markPaidButton"),
  paymentTotal: document.getElementById("paymentTotal"),
  paymentInvoice: document.getElementById("paymentInvoice"),
  paymentMethod: document.getElementById("paymentMethod"),
  qrBox: document.getElementById("qrBox"),
  payQrButton: document.getElementById("payQrButton"),
  payManualButton: document.getElementById("payManualButton"),
  paymentBackButton: document.getElementById("paymentBackButton"),
  betaQrGrid: document.getElementById("betaQrGrid"),
  closeReceiptButton: document.getElementById("closeReceiptButton"),
  receiptBackButton: document.getElementById("receiptBackButton"),
  receiptBuyer: document.getElementById("receiptBuyer"),
  receiptPhone: document.getElementById("receiptPhone"),
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
if (elements.helpTelegramLink) elements.helpTelegramLink.href = appSettings.telegramRequestUrl;

const translations = {
  km: {
    authTitle: "ប្រព័ន្ធ POS សម្រាប់ហាង និងភោជនីយដ្ឋាន",
    authCopy: "ស្នើសុំគណនីតាម Telegram មុនសិន។ បន្ទាប់ពី admin អនុម័ត អ្នកអាចចូលប្រើបាន ហើយប្រព័ន្ធនឹងរក្សា session លើឧបករណ៍នេះ។",
    requestTelegram: "ស្នើសុំគណនីតាម Telegram",
    loginTab: "ចូលប្រើ",
    requestTab: "របៀបស្នើសុំគណនី",
    loginHeading: "ចូលប្រើគណនី",
    emailLabel: "អ៊ីមែល ឬ លេខទូរស័ព្ទ",
    loginEmailPlaceholder: "ឧទាហរណ៍: nilaademo@gmail.com ឬ 012345678",
    passwordLabel: "ពាក្យសម្ងាត់",
    loginButton: "ចូលប្រើ",
    requestHeading: "ស្នើសុំគណនី",
    requestStep1: "ផ្ញើសារ Telegram ទៅ admin",
    requestStep2: "ប្រាប់ឈ្មោះហាង និងលេខទូរស័ព្ទ",
    requestStep3: "រង់ចាំ admin បង្កើតគណនីអោយ",
    requestStep4: "ចូលប្រើម្តងហើយ app នឹងរក្សា session លើឧបករណ៍នេះ",
    dashboardButton: "Dashboard",
    sidebarCaption: "ប្រព័ន្ធគ្រប់គ្រងហាង",
    logoutButton: "ចាកចេញ",
    navPOS: "POS",
    navDashboard: "Dashboard",
    navOrdersShort: "Orders",
    navMore: "More",
    navOrders: "ការបញ្ជាទិញ",
    navMoney: "លុយ",
    navStock: "ស្តុក",
    navSettings: "ការកំណត់",
    navSettingsShort: "កំណត់",
    navReports: "របាយការណ៍",
    clearCart: "សម្អាតកន្ត្រក",
    buyerNameLabel: "ឈ្មោះអ្នកទិញ",
    buyerNamePlaceholder: "ឧទាហរណ៍: បងវិសាល",
    buyerPhoneLabel: "លេខទូរស័ព្ទអ្នកទិញ",
    buyerPhonePlaceholder: "ឧទាហរណ៍: 012 345 678",
    productLabel: "មុខទំនិញ",
    productSearchPlaceholder: "ស្វែងរកឈ្មោះទំនិញ",
    qtyLabel: "ចំនួន",
    priceLabel: "តម្លៃ",
    addButton: "បន្ថែម",
    quickProductsHeading: "ចុចជ្រើសទំនិញ",
    quickProductsHint: "POS quick menu",
    filterAll: "ទាំងអស់",
    filterPopular: "ពេញនិយម",
    filterLowStock: "ជិតអស់",
    cartHeading: "កន្ត្រកលក់",
    feeLabel: "ថ្លៃបន្ថែម",
    subtotalLabel: "សរុបមុខទំនិញ",
    totalLabel: "សរុបត្រូវបង់",
    checkoutButton: "បិទការលក់",
    moneyHeading: "គ្រប់គ្រងលុយ",
    todaySales: "លក់ថ្ងៃនេះ",
    todayExpenses: "ចំណាយថ្ងៃនេះ",
    todayNet: "សាច់ប្រាក់សុទ្ធ",
    expenseNoteLabel: "កំណត់សម្គាល់ចំណាយ",
    expenseNotePlaceholder: "ឧទាហរណ៍: បង់ភ្លើង ឬ ទិញកញ្ចប់",
    expenseAmountLabel: "ចំនួនទឹកប្រាក់",
    addExpenseButton: "បន្ថែមចំណាយ",
    expenseListHeading: "បញ្ជីចំណាយថ្ងៃនេះ",
    stockHeading: "គ្រប់គ្រងស្តុក",
    productNameLabel: "ឈ្មោះទំនិញ",
    productNamePlaceholder: "ឧទាហរណ៍: កាហ្វេទឹកកក",
    productImageLabel: "រូបភាពទំនិញ",
    stockLeftLabel: "ស្តុកនៅសល់",
    lowStockLabelText: "ព្រមាននៅចំនួន",
    saveProductButton: "រក្សាទុកទំនិញ",
    productListHeading: "បញ្ជីទំនិញ",
    reportsHeading: "របាយការណ៍ប្រចាំថ្ងៃ",
    orderCountLabel: "ចំនួនវិក្កយបត្រ",
    itemsSoldLabel: "ទំនិញលក់បាន",
    lowStockSummaryLabel: "ជិតអស់ស្តុក",
    salesListHeading: "បញ្ជីការលក់",
    lowStockHeading: "ស្ថានភាពស្តុក",
    adminHeading: "បង្កើតអ្នកប្រើថ្មី",
    newUsernameLabel: "អ៊ីមែលអ្នកប្រើ",
    newPhoneLabel: "លេខទូរស័ព្ទអ្នកប្រើ",
    shopNameLabel: "ឈ្មោះហាង",
    roleLabel: "តួនាទី",
    createAccountButton: "បង្កើតគណនី",
    userListHeading: "អ្នកប្រើក្នុងហាងនេះ",
    settingsHeading: "ការកំណត់ហាង",
    profileSettingsHeading: "រូបភាព និងព័ត៌មានអាជីវកម្ម",
    profileImageLabel: "រូបភាពប្រូហ្វាល់ហាង",
    businessNameLabel: "ឈ្មោះហាង",
    businessDescriptionLabel: "ពិពណ៌នាអាជីវកម្ម",
    businessDescriptionPlaceholder: "ណែនាំខ្លីៗអំពីហាង និងអ្វីដែលអ្នកលក់",
    paymentSettingsHeading: "ការទូទាត់ និង QR",
    paymentMethodSettingLabel: "វិធីទូទាត់ដើម",
    paymentOptionBoth: "QR និង បង់ផ្ទាល់",
    bankQrLabel: "រូប QR ធនាគារ",
    receiptSettingsHeading: "ការកំណត់វិក្កយបត្រ",
    receiptNameLabel: "ចំណងជើងវិក្កយបត្រ",
    receiptFooterLabel: "សារខាងក្រោមវិក្កយបត្រ",
    receiptFooterPlaceholder: "Thanks you bong! please come again.",
    saveSettingsButton: "រក្សាទុកការកំណត់",
    receiptTitle: "វិក្កយបត្រលក់",
    receiptThanks: "Thanks you bong! please come again.",
    downloadPdfButton: "Download PDF",
    printButton: "Print",
    itemUnit: "មុខ",
    deleteButton: "លុប",
    emptyCart: "មិនទាន់មានទំនិញក្នុងកន្ត្រកទេ",
    noExpenses: "មិនទាន់មានចំណាយថ្ងៃនេះទេ",
    noProducts: "មិនទាន់មានទំនិញទេ",
    productMeta: "តម្លៃ {price} • ស្តុកនៅសល់ {left}",
    lowStock: "ជិតអស់",
    normalStock: "ធម្មតា",
    orderMeta: "{buyer} • {summary}",
    guestBuyer: "ភ្ញៀវ",
    noSales: "មិនទាន់មានការលក់ថ្ងៃនេះទេ",
    stockStatusMeta: "នៅសល់ {left} • ព្រមាននៅ {lowAt}",
    stockStable: "ស្តុកមិនទាបទេ",
    adminOnlyUsers: "Admin ប៉ុណ្ណោះដែលអាចមើលបាន",
    noUsers: "មិនទាន់មានអ្នកប្រើទេ",
    buyerLine: "អ្នកទិញ: {buyer}",
    phoneLine: "ទូរស័ព្ទ: {phone}",
    paymentHeading: "ការទូទាត់",
    paymentSubheading: "ស្កេន QR ដើម្បីបង់ប្រាក់",
    paymentMethodLabel: "វិធីបង់ប្រាក់",
    paymentBank: "ផ្ទេរទៅធនាគារ",
    paymentCash: "ទទួលលុយផ្ទាល់",
    payQrButton: "បង់តាម QR",
    payManualButton: "បង់ផ្ទាល់",
    backButton: "ត្រឡប់ក្រោយ",
    markPaidButton: "បានទូទាត់រួច",
    cancelButton: "បោះបង់",
    previewBanner: "Preview mode is active. Add Supabase URL and anon key, then run the SQL in supabase/schema.sql to move to real production.",
    schemaBanner: "ការកំណត់ database មិនទាន់ពេញលេញទេ។ សូម run SQL ចុងក្រោយនៅ supabase/schema.sql ដើម្បីអោយ Settings, Payments និង Customers ដំណើរការ។",
    popupAlert: "សូមអនុញ្ញាត popup ដើម្បី print receipt",
    loginFailed: "មិនអាចចូលប្រើបានទេ។ សូមពិនិត្យអ៊ីមែល/លេខទូរស័ព្ទ និងពាក្យសម្ងាត់ម្តងទៀត។",
    loginEmailOnly: "សូមប្រើអ៊ីមែល ឬលេខទូរស័ព្ទដែល admin បានបង្កើតអោយ។",
    invalidProduct: "សូមជ្រើសរើសទំនិញ និងបញ្ចូលតម្លៃអោយត្រឹមត្រូវ",
    insufficientStock: "ស្តុកមិនគ្រប់",
    checkoutFailed: "បិទការលក់មិនបាន",
    expenseInvalid: "សូមបញ្ចូលចំណាយអោយត្រឹមត្រូវ",
    productInvalid: "សូមបំពេញព័ត៌មានទំនិញអោយត្រឹមត្រូវ",
    createUserFailed: "បង្កើតអ្នកប្រើមិនបាន",
    createPdfFailed: "មិនអាចបង្កើត PDF បាន",
    saveExpenseFailed: "រក្សាទុកចំណាយមិនបាន",
    saveProductFailed: "រក្សាទុកទំនិញមិនបាន",
    saveSettingsFailed: "រក្សាទុកការកំណត់មិនបាន"
  },
  en: {
    authTitle: "POS system for shops and restaurants",
    authCopy: "Request your account on Telegram first. After the admin approves it, you can sign in and stay signed in on this device.",
    requestTelegram: "Request Account on Telegram",
    loginTab: "Login",
    requestTab: "How to request an account",
    loginHeading: "Sign in",
    emailLabel: "Email or phone",
    loginEmailPlaceholder: "Example: nilaademo@gmail.com or 012345678",
    passwordLabel: "Password",
    loginButton: "Login",
    requestHeading: "Request account",
    requestStep1: "Send a Telegram message to the admin",
    requestStep2: "Share your shop name and phone number",
    requestStep3: "Wait for the admin to create your account",
    requestStep4: "After you sign in once, the app keeps your session on this device",
    dashboardButton: "Dashboard",
    sidebarCaption: "Shop operating system",
    logoutButton: "Logout",
    navPOS: "POS",
    navDashboard: "Dashboard",
    navOrdersShort: "Orders",
    navMore: "More",
    navOrders: "Orders",
    navMoney: "Money",
    navStock: "Stock",
    navSettings: "Settings",
    navSettingsShort: "Settings",
    navReports: "Reports",
    clearCart: "Clear cart",
    buyerNameLabel: "Buyer name",
    buyerNamePlaceholder: "Example: Vichea",
    buyerPhoneLabel: "Buyer phone",
    buyerPhonePlaceholder: "Example: 012 345 678",
    productLabel: "Product",
    productSearchPlaceholder: "Search saved product",
    qtyLabel: "Qty",
    priceLabel: "Price",
    addButton: "Add",
    quickProductsHeading: "Tap product",
    quickProductsHint: "POS quick menu",
    filterAll: "All",
    filterPopular: "Popular",
    filterLowStock: "Low Stock",
    cartHeading: "Sale cart",
    feeLabel: "Extra fee",
    subtotalLabel: "Subtotal",
    totalLabel: "Total due",
    checkoutButton: "Close sale",
    moneyHeading: "Money management",
    todaySales: "Today sales",
    todayExpenses: "Today expenses",
    todayNet: "Net cash",
    expenseNoteLabel: "Expense note",
    expenseNotePlaceholder: "Example: electricity or package",
    expenseAmountLabel: "Amount",
    addExpenseButton: "Add expense",
    expenseListHeading: "Today's expenses",
    stockHeading: "Stock management",
    productNameLabel: "Product name",
    productNamePlaceholder: "Example: Iced coffee",
    productImageLabel: "Product image",
    stockLeftLabel: "Stock left",
    lowStockLabelText: "Low stock alert at",
    saveProductButton: "Save product",
    productListHeading: "Product list",
    reportsHeading: "Daily reports",
    orderCountLabel: "Invoices",
    itemsSoldLabel: "Items sold",
    lowStockSummaryLabel: "Low stock",
    salesListHeading: "Sales list",
    lowStockHeading: "Stock status",
    adminHeading: "Create new user",
    newUsernameLabel: "User email",
    newPhoneLabel: "User phone",
    shopNameLabel: "Shop name",
    roleLabel: "Role",
    createAccountButton: "Create account",
    userListHeading: "Users in this shop",
    settingsHeading: "Shop settings",
    profileSettingsHeading: "Profile and business details",
    profileImageLabel: "Shop profile image",
    businessNameLabel: "Business name",
    businessDescriptionLabel: "Business description",
    businessDescriptionPlaceholder: "Add a short description about the shop and what you sell",
    paymentSettingsHeading: "Payment and QR",
    paymentMethodSettingLabel: "Default payment option",
    paymentOptionBoth: "QR and manual",
    bankQrLabel: "Bank account QR image",
    receiptSettingsHeading: "Receipt settings",
    receiptNameLabel: "Receipt title",
    receiptFooterLabel: "Receipt footer",
    receiptFooterPlaceholder: "Thanks you bong! please come again.",
    saveSettingsButton: "Save settings",
    receiptTitle: "Sales receipt",
    receiptThanks: "Thanks you bong! please come again.",
    downloadPdfButton: "Download PDF",
    printButton: "Print",
    itemUnit: "items",
    deleteButton: "Delete",
    emptyCart: "No items in the cart yet.",
    noExpenses: "No expenses recorded today.",
    noProducts: "No products saved yet.",
    productMeta: "Price {price} • Left {left}",
    lowStock: "Low",
    normalStock: "Normal",
    orderMeta: "{buyer} • {summary}",
    guestBuyer: "Guest",
    noSales: "No sales recorded today.",
    stockStatusMeta: "Left {left} • Alert at {lowAt}",
    stockStable: "Stock looks fine.",
    adminOnlyUsers: "Only admin can see this section.",
    noUsers: "No users yet.",
    buyerLine: "Buyer: {buyer}",
    phoneLine: "Phone: {phone}",
    paymentHeading: "Payment",
    paymentSubheading: "Scan QR to pay",
    paymentMethodLabel: "Payment method",
    paymentBank: "Bank transfer",
    paymentCash: "Cash received",
    payQrButton: "Pay with QR",
    payManualButton: "Pay manual",
    backButton: "Back",
    markPaidButton: "Payment received",
    cancelButton: "Cancel",
    previewBanner: "Preview mode is active. Add Supabase URL and anon key, then run the SQL in supabase/schema.sql to move to real production.",
    schemaBanner: "Database setup is incomplete. Please run the latest SQL in supabase/schema.sql so Settings, Payments, and Customers work correctly.",
    popupAlert: "Please allow popups to print the receipt.",
    loginFailed: "Could not sign in. Please check your email/phone and password.",
    loginEmailOnly: "Please use the email or phone number created by the admin.",
    invalidProduct: "Please choose a product and enter a valid price.",
    insufficientStock: "Not enough stock.",
    checkoutFailed: "Could not close the sale.",
    expenseInvalid: "Please enter a valid expense.",
    productInvalid: "Please enter valid product details.",
    createUserFailed: "Could not create the user.",
    createPdfFailed: "Could not generate the PDF.",
    saveExpenseFailed: "Could not save the expense.",
    saveProductFailed: "Could not save the product.",
    saveSettingsFailed: "Could not save the settings."
  }
};

Object.assign(translations.km, {
  navExpenses: "Expenses",
  navCustomers: "Customers",
  navUsers: "Users & Staff",
  navHelp: "Help & Support",
  fixedPriceTag: "Fixed prices",
  customerToggle: "Add customer info",
  discountPlaceholder: "Discount",
  taxPlaceholder: "Tax",
  customerHistoryHeading: "Recent buyers",
  helpHeading: "Need support?",
  helpCopy: "Use Telegram support for account approval, shop setup, and login help."
});

Object.assign(translations.en, {
  navExpenses: "Expenses",
  navCustomers: "Customers",
  navUsers: "Users & Staff",
  navHelp: "Help & Support",
  fixedPriceTag: "Fixed prices",
  customerToggle: "Add customer info",
  discountPlaceholder: "Discount",
  taxPlaceholder: "Tax",
  customerHistoryHeading: "Recent buyers",
  helpHeading: "Need support?",
  helpCopy: "Use Telegram support for account approval, shop setup, and login help."
});

function t(key, vars = {}) {
  const pack = translations[state.language] || translations.km;
  let text = pack[key] || translations.km[key] || key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  [elements.langKmButton, elements.appLangKmButton].forEach((button) => {
    button?.classList.toggle("tab-button--active", state.language === "km");
  });
  [elements.langEnButton, elements.appLangEnButton].forEach((button) => {
    button?.classList.toggle("tab-button--active", state.language === "en");
  });
}

function setLanguage(language) {
  state.language = language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyLanguage();
  renderAll();
}

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

function normalizePhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function isPhoneLogin(value) {
  const input = String(value || "").trim();
  return !input.includes("@") && normalizePhone(input).replace(/^\+/, "").length >= 6;
}

function phoneAliasToEmail(value) {
  const digits = normalizePhone(value).replace(/^\+/, "");
  return `${digits}@phone.nilaa-os.local`;
}

function normalizeLoginIdentifier(value) {
  const input = String(value || "").trim();
  if (isPhoneLogin(input)) return phoneAliasToEmail(input);
  return input.includes("@") ? input : usernameToEmail(input);
}

function loginErrorMessage(error, attemptedIdentifier) {
  const fallback = t("loginFailed");
  const message = String(error?.message || "").trim();
  if (!message) return fallback;
  if (message.toLowerCase().includes("invalid login credentials")) {
    if (!String(attemptedIdentifier || "").includes("@")) {
      return t("loginEmailOnly");
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

function qrSeed(value) {
  return String(value || "nilaa-os")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function renderBetaQr(value) {
  if (!elements.betaQrGrid) return;
  const seed = qrSeed(value);
  elements.betaQrGrid.innerHTML = Array.from({ length: 81 }, (_, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const finder =
      (row < 3 && col < 3) ||
      (row < 3 && col > 5) ||
      (row > 5 && col < 3);
    const active = finder || ((index * 7 + seed + row * col) % 5 < 2);
    return `<span class="${active ? "qr-dot qr-dot--active" : "qr-dot"}"></span>`;
  }).join("");
}

function blankState(message) {
  return `<p class="meta-line">${safeText(message)}</p>`;
}

function productImageMarkup(product, variant = "large") {
  const imageUrl = product?.image_url || product?.imageUrl;
  if (!imageUrl) return "";
  const thumbClass = variant === "small" ? "product-thumb product-thumb--small" : "product-thumb";
  return `<img class="${thumbClass}" src="${safeText(imageUrl)}" alt="${safeText(product.name || "product")}">`;
}

function showSetupBanner(message) {
  elements.setupBanner.textContent = message;
  elements.setupBanner.classList.remove("hidden");
}

function hideSetupBanner() {
  elements.setupBanner.classList.add("hidden");
}

function refreshSetupBanner() {
  if (state.backendMode === "preview") {
    showSetupBanner(t("previewBanner"));
    return;
  }
  const missing = Object.entries(state.capabilities || {})
    .filter(([, enabled]) => !enabled)
    .map(([name]) => name);
  if (missing.length) {
    showSetupBanner(`${t("schemaBanner")} Missing: ${missing.join(", ")}`);
    return;
  }
  hideSetupBanner();
}

function showAsyncStatus({ title, message, success = false } = {}) {
  if (!elements.asyncOverlay) return;
  elements.asyncTitle.textContent = title || (success ? "Success" : "Loading");
  elements.asyncMessage.textContent = message || "";
  elements.asyncSpinner.classList.toggle("hidden", success);
  elements.asyncSuccess.classList.toggle("hidden", !success);
  elements.asyncOverlay.classList.remove("hidden");
}

function hideAsyncStatus() {
  elements.asyncOverlay?.classList.add("hidden");
}

async function runWithStatus(config, task) {
  showAsyncStatus(config);
  try {
    const result = await task();
    showAsyncStatus({
      title: config.successTitle || "Done",
      message: config.successMessage || "",
      success: true
    });
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    hideAsyncStatus();
    return result;
  } catch (error) {
    hideAsyncStatus();
    throw error;
  }
}

function initializeSplash() {
  if (sessionStorage.getItem("nilaa-os-splash-done")) {
    state.splashDone = true;
    elements.startupSplash?.classList.add("hidden");
    return;
  }
  window.setTimeout(() => {
    state.splashDone = true;
    sessionStorage.setItem("nilaa-os-splash-done", "1");
    elements.startupSplash?.classList.add("hidden");
    renderAuth();
  }, 4300);
}

function defaultSettings() {
  return {
    business_name: state.shop?.name || "nilaa-os",
    business_description: "",
    payment_method: "both",
    qr_image_url: "",
    receipt_name: "nilaa-os",
    receipt_footer: t("receiptThanks"),
    shop_logo_url: ""
  };
}

function currentSettings() {
  return { ...defaultSettings(), ...(state.settings || {}) };
}

function syncBrandVisuals() {
  const settings = currentSettings();
  const logoUrl = settings.shop_logo_url || "assets/nilaa-logo.png";
  document.querySelectorAll(".brand-logo").forEach((node) => {
    node.src = logoUrl;
  });
  if (elements.settingsProfilePreview) elements.settingsProfilePreview.src = logoUrl;
  if (elements.receiptBrandLogo) {
    elements.receiptBrandLogo.src = logoUrl;
    elements.receiptBrandLogo.classList.toggle("hidden", !settings.shop_logo_url);
  }
  if (elements.receiptBrandName) elements.receiptBrandName.textContent = settings.receipt_name || settings.business_name || "nilaa-os";
  if (elements.receiptHeaderTitle) elements.receiptHeaderTitle.textContent = settings.receipt_name || settings.business_name || "nilaa-os";
  if (elements.receiptBusinessDescription) {
    elements.receiptBusinessDescription.textContent = settings.business_description || "";
    elements.receiptBusinessDescription.classList.toggle("hidden", !settings.business_description);
  }
  if (elements.receiptFooterText) elements.receiptFooterText.textContent = settings.receipt_footer || t("receiptThanks");
  if (elements.shopName && state.route === "pos") {
    elements.shopName.textContent = t("navPOS");
  }
}

function renderSettings() {
  const settings = currentSettings();
  if (elements.settingsBusinessName) elements.settingsBusinessName.value = settings.business_name || state.shop?.name || "";
  if (elements.settingsBusinessDescription) elements.settingsBusinessDescription.value = settings.business_description || "";
  if (elements.settingsPaymentMethod) elements.settingsPaymentMethod.value = settings.payment_method || "both";
  if (elements.settingsReceiptTitle) elements.settingsReceiptTitle.value = settings.receipt_name || "";
  if (elements.settingsReceiptFooter) elements.settingsReceiptFooter.value = settings.receipt_footer || t("receiptThanks");
  if (elements.settingsQrPreview) {
    const qrUrl = settings.qr_image_url || "";
    elements.settingsQrPreview.src = qrUrl || "assets/nilaa-logo.png";
    elements.settingsQrPreview.classList.toggle("hidden", !qrUrl);
  }
  syncBrandVisuals();
}

async function readFileAsDataUrl(file) {
  if (!file) return "";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

function switchAuthTab(mode) {
  const showLogin = mode === "login";
  elements.loginPanel.classList.toggle("hidden", !showLogin);
  elements.requestPanel.classList.toggle("hidden", showLogin);
  elements.showLoginTab.classList.toggle("tab-button--active", showLogin);
  elements.showRequestTab.classList.toggle("tab-button--active", !showLogin);
}

function currentRole() {
  const role = state.profile?.role || "";
  return role === "business_owner" ? "owner" : role;
}

function canManageSettings() {
  return ["admin", "owner"].includes(currentRole());
}

function canManageUsers() {
  return ["admin", "owner"].includes(currentRole());
}

function canEditProductMeta() {
  return ["admin", "owner"].includes(currentRole());
}

function buttonLabel(route) {
  return {
    pos: t("navPOS"),
    orders: t("navOrdersShort"),
    money: t("navMoney"),
    expenses: t("navExpenses"),
    stock: t("navStock"),
    customers: t("navCustomers"),
    settings: t("navSettings"),
    reports: t("navReports"),
    users: t("navUsers"),
    help: t("navHelp")
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
  elements.shopName.textContent = buttonLabel(route);
}

function openDrawer(open) {
  elements.dashboardDrawer.classList.toggle("hidden", !open);
}

function renderAuth() {
  const loggedIn = Boolean(state.authUser && state.profile);
  elements.authShell.classList.toggle("hidden", loggedIn || !state.splashDone);
  elements.appShell.classList.toggle("hidden", !loggedIn);
  if (!loggedIn) return;
  elements.welcomeLabel.textContent = `${state.language === "en" ? "Hello" : "សួស្តី"} ${state.profile.username}`;
  document.querySelectorAll("[data-admin-only]").forEach((node) => {
    node.classList.toggle("hidden", !canManageUsers());
  });
  elements.nonStaffFields.forEach((node) => {
    node.classList.toggle("hidden", !canEditProductMeta());
  });
  document.querySelectorAll("[data-route='settings']").forEach((node) => {
    node.classList.toggle("hidden", !canManageSettings());
  });
  if (!canManageUsers() && state.route === "users") {
    setRoute("pos");
  }
}

function renderCart() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const fee = Number(elements.orderFee.value || 0);
  elements.cartCount.textContent = `${state.cart.reduce((sum, item) => sum + item.qty, 0)} ${t("itemUnit")}`;
  elements.cartSubtotal.textContent = money(subtotal);
  elements.cartTotal.textContent = money(subtotal + fee);

  elements.cartList.innerHTML = state.cart.length
    ? state.cart.map((item) => `
        <article class="cart-row">
          <div class="cart-row__media">
            ${productImageMarkup(item, "small")}
            <div>
              <strong>${safeText(item.name)}</strong>
              <div class="meta-line">${money(item.price)}</div>
            </div>
          </div>
          <div class="cart-row__side">
            <div class="qty-stepper">
              <button class="icon-button qty-stepper__button" type="button" data-cart-action="decrease" data-cart-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="icon-button qty-stepper__button" type="button" data-cart-action="increase" data-cart-id="${item.id}">+</button>
            </div>
            <strong>${money(item.qty * item.price)}</strong>
            <button class="delete-button" type="button" data-cart-action="remove" data-cart-id="${item.id}">${t("deleteButton")}</button>
          </div>
        </article>
      `).join("")
    : blankState(t("emptyCart"));
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
            <button class="delete-button" type="button" data-expense-id="${expense.id}">${t("deleteButton")}</button>
          </div>
        </article>
      `).join("")
    : blankState(t("noExpenses"));
}

function renderProducts() {
  elements.productCount.textContent = state.products.length;
  elements.productSuggestions.innerHTML = state.products
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "km"))
    .map((product) => `<option value="${safeText(product.name)}"></option>`)
    .join("");
  elements.categoryChips.forEach((button) => {
    button.classList.toggle("category-chip--active", button.dataset.productFilter === state.productFilter);
  });
  const filteredProducts = state.products.filter((product, index) => {
    const left = effectiveStock(product);
    const lowAt = Number(product.low_stock_at ?? product.lowStockAt ?? 0);
    if (state.productFilter === "popular") return Boolean(product.is_popular) || index < 8;
    if (state.productFilter === "low") return left <= lowAt;
    return true;
  });
  elements.quickProductList.innerHTML = filteredProducts.length
    ? filteredProducts.map((product) => {
        const left = effectiveStock(product);
        return `
          <button class="quick-product" type="button" data-quick-product-id="${product.id}" ${left <= 0 ? "disabled" : ""}>
              ${productImageMarkup(product)}
              <strong>${safeText(product.name)}</strong>
            <span>${money(product.price)} • ${left}</span>
          </button>
        `;
      }).join("")
    : blankState(t("noProducts"));

  elements.productList.innerHTML = state.products.length
    ? state.products.map((product) => {
        const left = effectiveStock(product);
        const lowAt = Number(product.low_stock_at ?? product.lowStockAt ?? 0);
        const isLow = left <= lowAt;
        return `
          <article class="product-row">
            <div class="product-row__media">
              ${productImageMarkup(product)}
              <div>
                <strong>${safeText(product.name)}</strong>
                <div class="meta-line">${t("productMeta", { price: money(product.price), left })}</div>
              </div>
            </div>
            <div>
              <span class="tag ${isLow ? "tag--low" : ""}">${isLow ? t("lowStock") : t("normalStock")}</span>
              ${canEditProductMeta() ? `<button class="delete-button" type="button" data-product-id="${product.id}">${t("deleteButton")}</button>` : ""}
            </div>
          </article>
        `;
      }).join("")
    : blankState(t("noProducts"));
}

function renderOrdersHistory() {
  if (!elements.ordersHistoryList) return;
  elements.ordersPageCount.textContent = state.orders.length;
  elements.ordersHistoryList.innerHTML = state.orders.length
    ? state.orders.map((order) => `
        <article class="record-row">
          <div>
            <strong>${safeText(order.invoice_no || order.invoiceNo)}</strong>
            <div class="meta-line">${safeText(order.buyer_name || order.buyerName || t("guestBuyer"))}</div>
            <div class="meta-line">${safeText(order.payment_method || "cash")} • ${safeText(formatDateTime(order.created_at || order.createdAt))}</div>
          </div>
          <div class="record-actions">
            <strong>${money(order.total)}</strong>
            <div class="record-actions__buttons">
              <button class="secondary-button" type="button" data-open-receipt-id="${order.id}">${t("receiptTitle")}</button>
              <button class="delete-button" type="button" data-order-id="${order.id}">${t("deleteButton")}</button>
            </div>
          </div>
        </article>
      `).join("")
    : blankState(t("noSales"));
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
    ? state.orders.map((order) => {
        const firstItem = order.items?.[0];
        const previewProduct = firstItem ? state.products.find((item) => item.id === firstItem.productId) : null;
        return `
        <article class="record-row">
          <div class="product-row__media">
            ${productImageMarkup(previewProduct, "small")}
            <div>
              <strong>${safeText(order.invoice_no || order.invoiceNo)}</strong>
              <div class="meta-line">${safeText(t("orderMeta", { buyer: order.buyer_name || order.buyerName || t("guestBuyer"), summary: orderSummary(order) }))}</div>
            </div>
          </div>
          <div class="record-actions">
            <strong>${money(order.total)}</strong>
            <div class="record-actions__buttons">
              <button class="secondary-button" type="button" data-open-receipt-id="${order.id}">${t("receiptTitle")}</button>
              <button class="delete-button" type="button" data-order-id="${order.id}">${t("deleteButton")}</button>
            </div>
          </div>
        </article>
      `;
      }).join("")
    : blankState(t("noSales"));
  elements.lowStockList.innerHTML = lowStock.length
    ? lowStock.map((product) => `
        <article class="record-row">
          <div class="product-row__media">
            ${productImageMarkup(product, "small")}
            <div>
              <strong>${safeText(product.name)}</strong>
              <div class="meta-line">${t("stockStatusMeta", { left: effectiveStock(product), lowAt: product.low_stock_at ?? product.lowStockAt })}</div>
            </div>
          </div>
          <span class="tag tag--low">${t("lowStock")}</span>
        </article>
      `).join("")
    : blankState(t("stockStable"));
}

function renderCustomers() {
  if (!elements.customerList) return;
  const buyers = state.orders.filter((order) => order.buyer_name || order.buyerName || order.buyer_phone || order.buyerPhone);
  elements.customerCount.textContent = buyers.length;
  elements.customerList.innerHTML = buyers.length
    ? buyers.map((order) => `
        <article class="record-row">
          <div>
            <strong>${safeText(order.buyer_name || order.buyerName || t("guestBuyer"))}</strong>
            <div class="meta-line">${safeText(order.buyer_phone || order.buyerPhone || "-")}</div>
          </div>
          <div>
            <strong>${money(order.total)}</strong>
            <div class="meta-line">${safeText(formatDateTime(order.created_at || order.createdAt))}</div>
          </div>
        </article>
      `).join("")
    : blankState(t("noSales"));
}

function renderUsers() {
  if (!state.profile || !canManageUsers()) {
    elements.userCount.textContent = 0;
    elements.userList.innerHTML = blankState(t("adminOnlyUsers"));
    return;
  }
  elements.userCount.textContent = state.users.length;
  elements.userList.innerHTML = state.users.length
    ? state.users.map((user) => `
        <article class="record-row">
          <div>
            <strong>${safeText(user.username)}</strong>
            <div class="meta-line">${safeText([user.role, user.phone, user.status || "active"].filter(Boolean).join(" • "))}</div>
          </div>
        </article>
      `).join("")
    : blankState(t("noUsers"));
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
  const settings = currentSettings();
  return {
    invoiceNo: order.invoice_no || order.invoiceNo,
    buyerName: order.buyer_name || order.buyerName,
    buyerPhone: order.buyer_phone || order.buyerPhone,
    paymentMethod: order.payment_method || order.paymentMethod,
    items: order.items || [],
    subtotal: Number(order.subtotal || 0),
    fee: Number(order.fee || 0),
    total: Number(order.total || 0),
    createdAtText: formatDateTime(order.created_at || order.createdAt),
    receiptName: settings.receipt_name || settings.business_name || "nilaa-os",
    receiptFooter: settings.receipt_footer || t("receiptThanks"),
    businessDescription: settings.business_description || "",
    logoUrl: settings.shop_logo_url || ""
  };
}

function renderReceipt() {
  if (!state.latestReceipt) {
    elements.receiptModal.classList.add("hidden");
    return;
  }
  elements.receiptModal.classList.remove("hidden");
  elements.receiptHeaderTitle.textContent = state.latestReceipt.receiptName || "nilaa-os";
  elements.receiptBrandName.textContent = state.latestReceipt.receiptName || "nilaa-os";
  elements.receiptBrandLogo.src = state.latestReceipt.logoUrl || "assets/nilaa-logo.png";
  elements.receiptBrandLogo.classList.toggle("hidden", !state.latestReceipt.logoUrl);
  elements.receiptBuyer.textContent = t("buyerLine", { buyer: state.latestReceipt.buyerName || t("guestBuyer") });
  elements.receiptPhone.textContent = state.latestReceipt.buyerPhone ? t("phoneLine", { phone: state.latestReceipt.buyerPhone }) : "";
  elements.receiptBusinessDescription.textContent = state.latestReceipt.businessDescription || "";
  elements.receiptBusinessDescription.classList.toggle("hidden", !state.latestReceipt.businessDescription);
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
  elements.receiptFooterText.textContent = state.latestReceipt.receiptFooter || t("receiptThanks");
}

function renderAll() {
  applyLanguage();
  renderAuth();
  if (!state.authUser || !state.profile) return;
  elements.buyerName.value = state.currentBuyer;
  elements.buyerPhone.value = state.currentPhone;
  elements.customerFields?.classList.toggle("hidden", !state.customerExpanded);
  renderCart();
  renderMoney();
  renderProducts();
  renderOrdersHistory();
  renderReports();
  renderCustomers();
  renderUsers();
  renderSettings();
  renderReceipt();
  setRoute(state.route);
}

function closeReceipt() {
  state.latestReceipt = null;
  renderReceipt();
}

function openPayment(order) {
  const settings = currentSettings();
  state.pendingPaymentOrder = order;
  elements.paymentTotal.textContent = money(order.total);
  elements.paymentInvoice.textContent = order.invoice_no || order.invoiceNo;
  renderBetaQr(`${order.invoice_no || order.invoiceNo}-${order.total}`);
  elements.paymentMethod.value = "";
  elements.qrBox.classList.add("hidden");
  elements.markPaidButton.classList.add("hidden");
  if (elements.paymentQrImage) {
    elements.paymentQrImage.src = settings.qr_image_url || "";
    elements.paymentQrImage.classList.toggle("hidden", !settings.qr_image_url);
  }
  elements.qrBox.querySelector("strong").textContent = settings.qr_image_url ? "Bank QR" : "Beta QR";
  elements.betaQrGrid.classList.toggle("hidden", Boolean(settings.qr_image_url));
  if (settings.payment_method === "bank") {
    elements.payManualButton.classList.add("hidden");
  } else {
    elements.payManualButton.classList.remove("hidden");
  }
  if (settings.payment_method === "cash") {
    elements.payQrButton.classList.add("hidden");
  } else {
    elements.payQrButton.classList.remove("hidden");
  }
  elements.paymentModal.classList.remove("hidden");
}

function closePayment() {
  state.pendingPaymentOrder = null;
  elements.paymentModal.classList.add("hidden");
}

async function completePayment() {
  if (!state.pendingPaymentOrder) return;
  const method = elements.paymentMethod.value;
  try {
    const savedOrder = await runWithStatus({
      title: state.language === "en" ? "Saving sale" : "កំពុងរក្សាទុកការលក់",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Payment confirmed" : "ទូទាត់បានជោគជ័យ"
    }, () => backend.checkout(
      state.pendingPaymentOrder.shopId,
      { ...state.pendingPaymentOrder, paymentMethod: method },
      state.profile
    ));
    const receiptOrder = {
      ...savedOrder,
      buyer_phone: state.pendingPaymentOrder.buyerPhone,
      payment_method: method,
      paymentMethod: method
    };
    state.cart = [];
    state.currentBuyer = "";
    state.currentPhone = "";
    elements.buyerName.value = "";
    elements.buyerPhone.value = "";
    elements.orderFee.value = "0";
    state.latestReceipt = buildReceipt(receiptOrder);
    await afterMutation();
  } catch (error) {
    window.alert(error.message || t("checkoutFailed"));
    return;
  }
  state.pendingPaymentOrder = null;
  elements.paymentModal.classList.add("hidden");
  renderAll();
}

function choosePaymentMethod(method) {
  elements.paymentMethod.value = method;
  elements.qrBox.classList.toggle("hidden", method !== "bank");
  elements.markPaidButton.classList.remove("hidden");
}

function backToPaymentChoice() {
  elements.paymentMethod.value = "";
  elements.qrBox.classList.add("hidden");
  elements.markPaidButton.classList.add("hidden");
}

function previewImage(input, target) {
  const [file] = input.files || [];
  if (!file || !target) return;
  const reader = new FileReader();
  reader.onload = () => {
    target.src = String(reader.result || "");
    target.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

function makeDownload(data) {
  if (data.html) {
    const preview = window.open("", "_blank", "width=420,height=720");
    if (!preview) {
      window.alert(t("popupAlert"));
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

async function downloadReceiptAsPdf() {
  const receiptNode = document.getElementById("receiptPaper");
  const jsPdfCtor = window.jspdf?.jsPDF;
  const html2canvasLib = window.html2canvas;
  if (!receiptNode || !jsPdfCtor || !html2canvasLib) {
    throw new Error(t("createPdfFailed"));
  }
  const canvas = await html2canvasLib(receiptNode, {
    scale: Math.min(window.devicePixelRatio || 2, 3),
    backgroundColor: "#ffffff",
    useCORS: true
  });
  const imageData = canvas.toDataURL("image/png");
  const pdfWidth = 80;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  const pdf = new jsPdfCtor({
    orientation: "portrait",
    unit: "mm",
    format: [pdfWidth, pdfHeight]
  });
  pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
  const blob = pdf.output("blob");
  const fileName = `receipt-${state.latestReceipt?.invoiceNo || Date.now()}.pdf`;
  const file = new File([blob], fileName, { type: "application/pdf" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: fileName });
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function nextInvoiceNumber() {
  return `#${Date.now().toString().slice(-8)}`;
}

function createMockBackend() {
  const listeners = new Set();
  const seed = () => ({
    sessionUserId: null,
    shops: [{ id: "shop-admin", name: "Nilaa Main Shop", status: "active", created_at: new Date().toISOString() }],
    settings: [{
      id: crypto.randomUUID(),
      shop_id: "shop-admin",
      business_name: "Nilaa Main Shop",
      business_description: "",
      payment_method: "both",
      qr_image_url: "",
      receipt_name: "nilaa-os",
      receipt_footer: "Thanks you bong! please come again.",
      shop_logo_url: ""
    }],
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
      showSetupBanner(t("previewBanner"));
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
      const phone = normalizePhone(username);
      const user = store.users.find(
        (item) =>
          (item.username === username ||
            normalizeLoginIdentifier(item.username) === normalized ||
            item.email === normalized ||
            normalizePhone(item.phone) === phone) &&
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
        users: role === "admin" ? store.users : store.users.filter((item) => item.shop_id === shopId),
        settings: store.settings.find((item) => item.shop_id === shopId) || null,
        capabilities: { settings: true, payments: true, customers: true }
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
        invoice_no: payload.invoiceNo || `#${String(store.orders.length + 1).padStart(4, "0")}`,
        buyer_name: payload.buyerName,
        buyer_phone: payload.buyerPhone,
        payment_method: payload.paymentMethod,
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
      if (!["admin", "owner", "business_owner"].includes(profile.role)) throw new Error("Only admin or owner can create users.");
      const store = load();
      const shopId = crypto.randomUUID();
      store.shops.push({ id: shopId, name: payload.shopName, status: "active", created_at: new Date().toISOString() });
      store.settings.push({
        id: crypto.randomUUID(),
        shop_id: shopId,
        business_name: payload.shopName,
        business_description: "",
        payment_method: "both",
        qr_image_url: "",
        receipt_name: payload.shopName || "nilaa-os",
        receipt_footer: "Thanks you bong! please come again.",
        shop_logo_url: ""
      });
      store.users.push({ id: crypto.randomUUID(), username: payload.username, email: payload.username, phone: payload.phone, password: payload.password, role: payload.role, shop_id: shopId, status: "active", created_at: new Date().toISOString() });
      save(store);
    },
    async saveSettings(shopId, payload) {
      const store = load();
      const existing = store.settings.find((item) => item.shop_id === shopId);
      if (existing) Object.assign(existing, payload);
      else store.settings.push({ id: crypto.randomUUID(), shop_id: shopId, ...defaultSettings(), ...payload });
      const shop = store.shops.find((item) => item.id === shopId);
      if (shop && payload.business_name) shop.name = payload.business_name;
      save(store);
    },
    async markPaid(orderId, paymentMethod) {
      const store = load();
      const order = store.orders.find((item) => item.id === orderId);
      if (order) order.payment_method = paymentMethod;
      save(store);
    },
    async generateReceiptPdf(receipt) {
      const html = `
      <!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><style>
      body{font-family:Arial,sans-serif;padding:20px;width:300px}h1{text-align:center;text-transform:uppercase;margin:0}
      p{margin:4px 0;text-align:center}.divider{border-top:1px dashed #666;margin:12px 0}.row,.total{display:flex;justify-content:space-between;gap:8px;font-size:12px}.total{font-weight:700}
      </style></head><body>
      <h1>nilaa-os</h1><p>វិក្កយបត្រលក់</p><p>អ្នកទិញ: ${safeText(receipt.buyerName || "ភ្ញៀវ")}</p>${receipt.buyerPhone ? `<p>ទូរស័ព្ទ: ${safeText(receipt.buyerPhone)}</p>` : ""}
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

  const columnMissing = (error) => String(error?.message || "").toLowerCase().includes("column");
  const relationMissing = (error) => {
    const message = String(error?.message || "").toLowerCase();
    return message.includes("schema cache") || message.includes("could not find the table") || message.includes("relation");
  };
  const detectTable = async (name) => {
    const { error } = await supabase.from(name).select("id").limit(1);
    return !error;
  };
  const resolveLoginEmail = async (identifier) => {
    const input = String(identifier || "").trim();
    if (!isPhoneLogin(input)) return normalizeLoginIdentifier(input);
    const alias = normalizePhone(input);
    const { data, error } = await supabase
      .from("login_aliases")
      .select("login_email")
      .eq("alias", alias)
      .maybeSingle();
    if (!error && data?.login_email) return data.login_email;
    return phoneAliasToEmail(input);
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
      const email = await resolveLoginEmail(username);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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
      const capabilities = {
        settings: await detectTable("settings"),
        payments: await detectTable("payments"),
        customers: await detectTable("customers")
      };
      const [productsRes, expensesRes, ordersRes, usersRes, settingsRes] = await Promise.all([
        supabase.from("products").select("*").eq("shop_id", shopId).order("name"),
        supabase.from("expenses").select("*").eq("shop_id", shopId).eq("date", todayKey()).order("created_at", { ascending: false }),
        supabase.from("orders").select("*").eq("shop_id", shopId).eq("date", todayKey()).order("created_at", { ascending: false }),
        role === "admin"
          ? supabase.from("users").select("*").order("created_at", { ascending: false })
          : supabase.from("users").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }),
        capabilities.settings
          ? supabase.from("settings").select("*").eq("shop_id", shopId).maybeSingle()
          : Promise.resolve({ data: null, error: null })
      ]);

      for (const result of [productsRes, expensesRes, ordersRes, usersRes]) {
        if (result.error) throw result.error;
      }

      return {
        products: productsRes.data || [],
        expenses: expensesRes.data || [],
        orders: (ordersRes.data || []).map((row) => ({ ...row, items: row.items || [] })),
        users: usersRes.data || [],
        settings: settingsRes.error ? null : settingsRes.data || null,
        capabilities
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
        let { error } = await supabase.from("products").update(payload).eq("id", existing.id);
        if (error && columnMissing(error)) {
          const { image_url: _imageUrl, category_id: _categoryId, sort_order: _sortOrder, is_popular: _isPopular, ...legacyPayload } = payload;
          const fallback = await supabase.from("products").update(legacyPayload).eq("id", existing.id);
          error = fallback.error;
        }
        if (error) throw error;
      } else {
        let { error } = await supabase.from("products").insert({ shop_id: shopId, ...payload });
        if (error && columnMissing(error)) {
          const { image_url: _imageUrl, category_id: _categoryId, sort_order: _sortOrder, is_popular: _isPopular, ...legacyPayload } = payload;
          const fallback = await supabase.from("products").insert({ shop_id: shopId, ...legacyPayload });
          error = fallback.error;
        }
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
      const productIds = payload.items.map((item) => item.productId);
      const { data: productRows, error: productError } = await supabase
        .from("products")
        .select("id, name, stock_qty")
        .eq("shop_id", shopId)
        .in("id", productIds);
      if (productError) throw productError;

      const productsById = new Map((productRows || []).map((row) => [row.id, row]));
      for (const item of payload.items) {
        const product = productsById.get(item.productId);
        if (!product || Number(product.stock_qty || 0) < item.qty) {
          throw new Error(`${t("insufficientStock")} ${item.name}`);
        }
      }

      for (const item of payload.items) {
        const product = productsById.get(item.productId);
        const { error } = await supabase
          .from("products")
          .update({ stock_qty: Number(product.stock_qty || 0) - item.qty })
          .eq("id", item.productId)
          .eq("shop_id", shopId);
        if (error) throw error;
      }

      const orderRecord = {
        shop_id: shopId,
        invoice_no: payload.invoiceNo || payload.invoice_no || nextInvoiceNumber(),
        buyer_name: payload.buyerName,
        buyer_phone: payload.buyerPhone,
        payment_method: payload.paymentMethod,
        items: payload.items,
        subtotal: payload.subtotal,
        fee: payload.fee,
        total: payload.total,
        status: "completed",
        created_by: profile.username,
        created_at: new Date().toISOString(),
        date: todayKey()
      };

      let { data, error } = await supabase.from("orders").insert(orderRecord).select("*").single();
      if (error && columnMissing(error)) {
        const { buyer_phone: _buyerPhone, payment_method: _paymentMethod, ...legacyOrderRecord } = orderRecord;
        const legacyResult = await supabase.from("orders").insert(legacyOrderRecord).select("*").single();
        data = legacyResult.data;
        error = legacyResult.error;
      }
      if (error) throw error;
      if (payload.buyerName || payload.buyerPhone) {
        const customerInsert = await supabase.from("customers").insert({
          shop_id: shopId,
          name: payload.buyerName,
          phone: payload.buyerPhone,
          last_order_at: new Date().toISOString()
        });
        if (customerInsert.error && !relationMissing(customerInsert.error)) {
          console.warn(customerInsert.error);
        }
      }
      const paymentInsert = await supabase.from("payments").insert({
        order_id: data.id,
        shop_id: shopId,
        method: payload.paymentMethod || "cash",
        amount: payload.total,
        status: "paid",
        paid_at: new Date().toISOString()
      });
      if (paymentInsert.error && !relationMissing(paymentInsert.error)) {
        console.warn(paymentInsert.error);
      }
      return { ...data, buyer_phone: payload.buyerPhone };
    },
    async deleteOrder(shopId, orderId) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("shop_id", shopId)
        .single();
      if (orderError) throw orderError;

      for (const item of order.items || []) {
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("id, stock_qty")
          .eq("id", item.productId)
          .eq("shop_id", shopId)
          .single();
        if (productError) throw productError;
        const { error: restoreError } = await supabase
          .from("products")
          .update({ stock_qty: Number(product.stock_qty || 0) + Number(item.qty || 0) })
          .eq("id", item.productId)
          .eq("shop_id", shopId);
        if (restoreError) throw restoreError;
      }

      const { error } = await supabase.from("orders").delete().eq("id", orderId).eq("shop_id", shopId);
      if (error) throw error;
    },
    async createUser(payload, profile) {
      if (!["admin", "owner", "business_owner"].includes(profile.role)) throw new Error("Only admin or owner can create users.");
      const email = normalizeLoginIdentifier(payload.username);
      const phone = normalizePhone(payload.phone);
      const authClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          storageKey: `nilaa-create-user-${crypto.randomUUID()}`
        }
      });
      const { data: authData, error: authError } = await authClient.auth.signUp({
        email,
        password: payload.password
      });
      if (authError) throw authError;
      if (!authData.user?.id) {
        throw new Error("Account created needs email confirmation before profile can be saved.");
      }

      let shopId = profile.shop_id || profile.shopId;
      if (payload.shopName) {
        const { data: shop, error: shopError } = await supabase
          .from("shops")
          .insert({ name: payload.shopName, status: "active" })
          .select("*")
          .single();
        if (shopError) throw shopError;
        shopId = shop.id;
      }

      const profileRecord = {
        id: authData.user.id,
        username: payload.username,
        email,
        phone,
        role: payload.role,
        shop_id: shopId,
        status: "active",
        created_at: new Date().toISOString()
      };
      let { error: profileError } = await supabase.from("users").insert(profileRecord);
      if (profileError && columnMissing(profileError)) {
        const { email: _email, phone: _phone, ...legacyProfileRecord } = profileRecord;
        const legacyResult = await supabase.from("users").insert(legacyProfileRecord);
        profileError = legacyResult.error;
      }
      if (profileError) throw profileError;
      if (phone) {
        await supabase.from("login_aliases").upsert({
          alias: phone,
          login_email: email,
          user_id: authData.user.id,
          shop_id: shopId,
          updated_at: new Date().toISOString()
        });
      }
    },
    async saveSettings(shopId, payload) {
      const settingsRecord = {
        shop_id: shopId,
        business_name: payload.business_name,
        business_description: payload.business_description,
        payment_method: payload.payment_method,
        qr_image_url: payload.qr_image_url,
        receipt_name: payload.receipt_name,
        receipt_footer: payload.receipt_footer,
        shop_logo_url: payload.shop_logo_url,
        updated_at: new Date().toISOString()
      };
      let { error } = await supabase.from("settings").upsert(settingsRecord, { onConflict: "shop_id" });
      if (error && columnMissing(error)) {
        const legacySettings = {
          shop_id: shopId,
          receipt_name: payload.receipt_name,
          receipt_footer: payload.receipt_footer,
          qr_image_url: payload.qr_image_url,
          shop_logo_url: payload.shop_logo_url,
          updated_at: new Date().toISOString()
        };
        const fallback = await supabase.from("settings").upsert(legacySettings, { onConflict: "shop_id" });
        error = fallback.error;
      }
      if (error && relationMissing(error)) {
        throw new Error(t("schemaBanner"));
      }
      if (error) throw error;
      if (payload.business_name) {
        const shopUpdate = await supabase.from("shops").update({ name: payload.business_name }).eq("id", shopId);
        if (shopUpdate.error) throw shopUpdate.error;
      }
    },
    async markPaid(orderId, paymentMethod) {
      let { error } = await supabase
        .from("orders")
        .update({ status: "completed", payment_method: paymentMethod })
        .eq("id", orderId);
      if (error && columnMissing(error)) {
        const fallback = await supabase.from("orders").update({ status: "completed" }).eq("id", orderId);
        error = fallback.error;
      }
      if (error) throw error;
    },
    async generateReceiptPdf(receipt) {
      try {
        return await callFunction("generate-receipt-pdf", { receipt });
      } catch (_error) {
        const html = `
        <!DOCTYPE html><html lang="${state.language}"><head><meta charset="UTF-8"><style>
        body{font-family:Arial,sans-serif;padding:20px;width:300px}h1{text-align:center;text-transform:uppercase;margin:0}
        p{margin:4px 0;text-align:center}.divider{border-top:1px dashed #666;margin:12px 0}.row,.total{display:flex;justify-content:space-between;gap:8px;font-size:12px}.total{font-weight:700}
        </style></head><body>
        <h1>nilaa-os</h1><p>${safeText(t("receiptTitle"))}</p><p>${safeText(t("buyerLine", { buyer: receipt.buyerName || t("guestBuyer") }))}</p>${receipt.buyerPhone ? `<p>${safeText(t("phoneLine", { phone: receipt.buyerPhone }))}</p>` : ""}
        <div class="divider"></div><div class="row"><span>${safeText(receipt.createdAtText)}</span><span>${safeText(receipt.invoiceNo)}</span></div>
        <div class="divider"></div>${receipt.items.map((item) => `<div class="row"><span>${item.qty}</span><span>${safeText(item.name)}</span><span>${money(item.qty * item.price)}</span></div>`).join("")}
        <div class="divider"></div><div class="row"><span>${safeText(t("subtotalLabel"))}</span><span>${money(receipt.subtotal)}</span></div>
        <div class="row"><span>${safeText(t("feeLabel"))}</span><span>${money(receipt.fee)}</span></div><div class="row total"><span>${safeText(t("totalLabel"))}</span><span>${money(receipt.total)}</span></div>
        <div class="divider"></div><p>${safeText(t("receiptThanks"))}</p></body></html>`;
        return { html };
      }
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
  state.settings = data.settings ? { ...defaultSettings(), ...data.settings } : defaultSettings();
  state.capabilities = { settings: true, payments: true, customers: true, ...(data.capabilities || {}) };
  refreshSetupBanner();
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
    state.settings = null;
    state.products = [];
    state.expenses = [];
    state.orders = [];
    state.users = [];
    state.cart = [];
    state.pendingPaymentOrder = null;
    state.latestReceipt = null;
    state.customerExpanded = false;
    elements.paymentModal.classList.add("hidden");
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

function syncProductFormPreview(product = null) {
  const imageUrl = product?.image_url || "";
  elements.productImagePreview.src = imageUrl || "";
  elements.productImagePreview.classList.toggle("hidden", !imageUrl);
}

elements.langKmButton?.addEventListener("click", () => setLanguage("km"));
elements.langEnButton?.addEventListener("click", () => setLanguage("en"));
elements.appLangKmButton?.addEventListener("click", () => setLanguage("km"));
elements.appLangEnButton?.addEventListener("click", () => setLanguage("en"));
elements.showLoginTab.addEventListener("click", () => switchAuthTab("login"));
elements.showRequestTab.addEventListener("click", () => switchAuthTab("request"));
elements.openDashboardButton.addEventListener("click", () => openDrawer(true));
elements.closeDashboardButton.addEventListener("click", () => openDrawer(false));
elements.dashboardDrawer.addEventListener("click", (event) => {
  if (event.target.id === "dashboardDrawer") openDrawer(false);
});
elements.navButtons.forEach((button) => {
  if (!button.dataset.route) return;
  button.addEventListener("click", () => {
    setRoute(button.dataset.route);
    openDrawer(false);
  });
});

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const identifier = elements.loginUsername.value.trim();
  try {
    await runWithStatus({
      title: state.language === "en" ? "Signing in" : "កំពុងចូល",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Signed in" : "ចូលបានហើយ"
    }, () => backend.signIn(identifier, elements.loginPassword.value.trim()));
  } catch (error) {
    window.alert(loginErrorMessage(error, identifier));
  }
});

elements.logoutButton.addEventListener("click", async () => {
  await backend.signOut();
});
elements.sidebarLogoutButton?.addEventListener("click", async () => {
  await backend.signOut();
});
elements.customerToggleButton?.addEventListener("click", () => {
  state.customerExpanded = !state.customerExpanded;
  renderAll();
});
elements.buyerName.addEventListener("input", (event) => {
  state.currentBuyer = event.target.value.trim();
});

elements.buyerPhone.addEventListener("input", (event) => {
  state.currentPhone = event.target.value.trim();
});

elements.productSearch.addEventListener("input", () => {
  const product = currentProductByName(elements.productSearch.value);
  if (!product) return;
  elements.productPrice.value = product.price;
  elements.productQty.value = 1;
});

elements.productNameInput?.addEventListener("input", () => {
  const existing = currentProductByName(elements.productNameInput.value);
  if (!existing) return;
  elements.productPriceInput.value = existing.price ?? "";
  elements.productStockInput.value = existing.stock_qty ?? 0;
  elements.productLowStockInput.value = existing.low_stock_at ?? 5;
  syncProductFormPreview(existing);
});

elements.productImageInput?.addEventListener("change", () => {
  previewImage(elements.productImageInput, elements.productImagePreview);
});

elements.categoryChips.forEach((button) => {
  button.addEventListener("click", () => {
    state.productFilter = button.dataset.productFilter;
    renderProducts();
  });
});

elements.quickProductList.addEventListener("click", (event) => {
  const target = event.target.closest("[data-quick-product-id]");
  if (!target) return;
  const product = state.products.find((item) => item.id === target.dataset.quickProductId);
  if (!product || effectiveStock(product) <= 0) return;
  const existing = state.cart.find((item) => item.productId === product.id);
  if (existing) existing.qty += 1;
  else state.cart.push({
    id: crypto.randomUUID(),
    productId: product.id,
    name: product.name,
    image_url: product.image_url || "",
    qty: 1,
    price: Number(product.price || 0)
  });
  renderAll();
});

elements.orderFee.addEventListener("input", renderCart);

elements.orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = currentProductByName(elements.productSearch.value);
  const qty = Number(elements.productQty.value);
  const enteredPrice = Number(product?.price || 0);
  if (!product || !qty || qty <= 0 || enteredPrice < 0) {
    window.alert(t("invalidProduct"));
    return;
  }
  if (effectiveStock(product) < qty) {
    window.alert(t("insufficientStock"));
    return;
  }
  const existing = state.cart.find((item) => item.productId === product.id && item.price === enteredPrice);
  if (existing) existing.qty += qty;
  else state.cart.push({ id: crypto.randomUUID(), productId: product.id, name: product.name, image_url: product.image_url || "", qty, price: enteredPrice });
  state.currentBuyer = elements.buyerName.value.trim();
  renderAll();
  resetOrderInputs();
});

elements.cartList.addEventListener("click", (event) => {
  const target = event.target.closest("[data-cart-id]");
  if (!target) return;
  const item = state.cart.find((entry) => entry.id === target.dataset.cartId);
  if (!item) return;
  const action = target.dataset.cartAction || "remove";
  if (action === "increase") {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (product && effectiveStock(product) > 0) item.qty += 1;
  } else if (action === "decrease") {
    item.qty -= 1;
    if (item.qty <= 0) {
      state.cart = state.cart.filter((entry) => entry.id !== item.id);
    }
  } else {
    state.cart = state.cart.filter((entry) => entry.id !== item.id);
  }
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
    shopId: state.profile.shop_id || state.profile.shopId,
    invoiceNo: nextInvoiceNumber(),
    buyerName: elements.buyerName.value.trim() || t("guestBuyer"),
    buyerPhone: elements.buyerPhone.value.trim(),
    items: state.cart.map((item) => ({ productId: item.productId, name: item.name, qty: item.qty, price: item.price })),
    subtotal,
    fee,
    total: subtotal + fee
  };
  openPayment(payload);
});

elements.expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  const note = elements.expenseNote.value.trim();
  const amount = Number(elements.expenseAmount.value);
  if (!note || amount < 0) {
    window.alert(t("expenseInvalid"));
    return;
  }
  try {
    await runWithStatus({
      title: state.language === "en" ? "Saving expense" : "កំពុងរក្សាទុកចំណាយ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Expense saved" : "រក្សាទុកបាន"
    }, () => backend.createExpense(state.profile.shop_id || state.profile.shopId, { note, amount }, state.profile));
  } catch (error) {
    window.alert(error.message || t("saveExpenseFailed"));
    return;
  }
  elements.expenseForm.reset();
  await afterMutation();
});

elements.expenseList.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-expense-id]");
  if (!target || !state.profile) return;
  await runWithStatus({
    title: state.language === "en" ? "Removing expense" : "កំពុងលុបចំណាយ",
    message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
    successTitle: state.language === "en" ? "Expense removed" : "លុបបាន"
  }, () => backend.deleteExpense(state.profile.shop_id || state.profile.shopId, target.dataset.expenseId));
  await afterMutation();
});

elements.productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  const name = elements.productNameInput.value.trim();
  const price = Number(elements.productPriceInput.value);
  const stock_qty = Number(elements.productStockInput.value);
  const low_stock_at = Number(elements.productLowStockInput.value);
  const existing = currentProductByName(name);
  if (!name || price < 0 || stock_qty < 0 || low_stock_at < 0) {
    window.alert(t("productInvalid"));
    return;
  }
  if (!canEditProductMeta() && !existing) {
    window.alert("Staff can update stock only for existing products.");
    return;
  }
  try {
    const image_url = elements.productImageInput.files?.[0]
      ? await readFileAsDataUrl(elements.productImageInput.files[0])
      : existing?.image_url || "";
    await runWithStatus({
      title: state.language === "en" ? "Saving product" : "កំពុងរក្សាទុកទំនិញ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Product saved" : "រក្សាទុកបាន"
    }, () => backend.saveProduct(state.profile.shop_id || state.profile.shopId, { name, image_url, price, stock_qty, low_stock_at, active: true }));
  } catch (error) {
    window.alert(error.message || t("saveProductFailed"));
    return;
  }
  elements.productForm.reset();
  elements.productStockInput.value = "0";
  elements.productLowStockInput.value = "5";
  syncProductFormPreview();
  await afterMutation();
});

elements.productList.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-product-id]");
  if (!target || !state.profile) return;
  await runWithStatus({
    title: state.language === "en" ? "Removing product" : "កំពុងលុបទំនិញ",
    message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
    successTitle: state.language === "en" ? "Product removed" : "លុបបាន"
  }, () => backend.deleteProduct(state.profile.shop_id || state.profile.shopId, target.dataset.productId));
  await afterMutation();
});

const handleOrderAction = async (event) => {
  const receiptTarget = event.target.closest("[data-open-receipt-id]");
  if (receiptTarget) {
    const order = state.orders.find((item) => item.id === receiptTarget.dataset.openReceiptId);
    if (order) {
      state.latestReceipt = buildReceipt(order);
      renderReceipt();
    }
    return;
  }
  const deleteTarget = event.target.closest("[data-order-id]");
  if (!deleteTarget || !state.profile) return;
  await runWithStatus({
    title: state.language === "en" ? "Removing order" : "កំពុងលុបការបញ្ជាទិញ",
    message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
    successTitle: state.language === "en" ? "Order removed" : "លុបបាន"
  }, () => backend.deleteOrder(state.profile.shop_id || state.profile.shopId, deleteTarget.dataset.orderId));
  await afterMutation();
};

elements.orderList.addEventListener("click", handleOrderAction);
elements.ordersHistoryList?.addEventListener("click", handleOrderAction);

elements.adminCreateUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  try {
    await runWithStatus({
      title: state.language === "en" ? "Creating user" : "កំពុងបង្កើតអ្នកប្រើ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "User created" : "បង្កើតបាន"
    }, () => backend.createUser({
      username: elements.newUsername.value.trim(),
      phone: elements.newPhone.value.trim(),
      password: elements.newPassword.value.trim(),
      shopName: elements.newShopName.value.trim(),
      role: elements.newUserRole.value
    }, state.profile));
    elements.adminCreateUserForm.reset();
    await afterMutation();
  } catch (error) {
    window.alert(error.message || t("createUserFailed"));
  }
});

elements.settingsProfileImage?.addEventListener("change", () => {
  previewImage(elements.settingsProfileImage, elements.settingsProfilePreview);
});

elements.settingsQrUpload?.addEventListener("change", () => {
  previewImage(elements.settingsQrUpload, elements.settingsQrPreview);
});

elements.settingsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  try {
    const current = currentSettings();
    const profileImage = elements.settingsProfileImage.files?.[0]
      ? await readFileAsDataUrl(elements.settingsProfileImage.files[0])
      : current.shop_logo_url || "";
    const qrImage = elements.settingsQrUpload.files?.[0]
      ? await readFileAsDataUrl(elements.settingsQrUpload.files[0])
      : current.qr_image_url || "";
    const payload = {
      business_name: elements.settingsBusinessName.value.trim() || state.shop?.name || "nilaa-os",
      business_description: elements.settingsBusinessDescription.value.trim(),
      payment_method: elements.settingsPaymentMethod.value,
      qr_image_url: qrImage,
      receipt_name: elements.settingsReceiptTitle.value.trim() || "nilaa-os",
      receipt_footer: elements.settingsReceiptFooter.value.trim() || t("receiptThanks"),
      shop_logo_url: profileImage
    };
    await runWithStatus({
      title: state.language === "en" ? "Saving settings" : "កំពុងរក្សាទុកការកំណត់",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Settings saved" : "រក្សាទុកបាន"
    }, () => backend.saveSettings(state.profile.shop_id || state.profile.shopId, payload, state.profile));
    state.shop = { ...(state.shop || {}), name: payload.business_name };
    state.settings = { ...current, ...payload };
    elements.settingsProfileImage.value = "";
    elements.settingsQrUpload.value = "";
    await afterMutation();
  } catch (error) {
    window.alert(error.message || t("saveSettingsFailed"));
  }
});

elements.closeReceiptButton.addEventListener("click", closeReceipt);
elements.receiptModal.addEventListener("click", (event) => {
  if (event.target.id === "receiptModal") closeReceipt();
});
elements.closePaymentButton.addEventListener("click", closePayment);
elements.cancelPaymentButton.addEventListener("click", closePayment);
elements.paymentModal.addEventListener("click", (event) => {
  if (event.target.id === "paymentModal") closePayment();
});
elements.payQrButton.addEventListener("click", () => choosePaymentMethod("bank"));
elements.payManualButton.addEventListener("click", () => choosePaymentMethod("cash"));
elements.paymentBackButton.addEventListener("click", backToPaymentChoice);
elements.markPaidButton.addEventListener("click", completePayment);
elements.receiptBackButton.addEventListener("click", closeReceipt);
elements.printReceiptButton.addEventListener("click", () => window.print());
elements.downloadReceiptButton.addEventListener("click", async () => {
  if (!state.latestReceipt) return;
  try {
    await downloadReceiptAsPdf();
  } catch (error) {
    try {
      const file = await backend.generateReceiptPdf(state.latestReceipt);
      makeDownload(file);
    } catch (fallbackError) {
      window.alert(fallbackError.message || error.message || t("createPdfFailed"));
    }
  }
});

initializeSplash();
applyLanguage();
await backend.init();
backend.onAuthChange(async (user) => {
  await loadSignedInUser(user);
});
