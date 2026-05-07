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
  categories: [],
  products: [],
  expenses: [],
  orders: [],
  customers: [],
  users: [],
  cart: [],
  currentBuyer: "",
  currentPhone: "",
  pendingPaymentOrder: null,
  latestReceipt: null,
  backendMode: "setup",
  splashDone: false,
  customerExpanded: false,
  productSearchQuery: "",
  ordersSearchQuery: "",
  customerSearchQuery: "",
  pendingCustomizerProduct: null,
  platformData: { shops: [], users: [] },
  platformAdminView: "adminChooser",
  posMarkupType: ""
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
  bottomMoreButton: document.getElementById("bottomNavButton5"),
  dashboardDrawer: document.getElementById("dashboardDrawer"),
  adminNavButton: document.getElementById("adminNavButton"),
  platformAdminSwitcher: document.getElementById("platformAdminSwitcher"),
  adminSystemButtons: [...document.querySelectorAll("[data-admin-system]")],
  navButtons: [...document.querySelectorAll(".nav-button")],
  customerToggleButton: document.getElementById("customerToggleButton"),
  customerFields: document.getElementById("customerFields"),
  orderForm: document.getElementById("orderForm"),
  buyerName: document.getElementById("buyerName"),
  buyerPhone: document.getElementById("buyerPhone"),
  retailMemberCard: document.getElementById("retailMemberCard"),
  retailMemberName: document.getElementById("retailMemberName"),
  retailMemberPhone: document.getElementById("retailMemberPhone"),
  retailMemberPoints: document.getElementById("retailMemberPoints"),
  retailMemberCredit: document.getElementById("retailMemberCredit"),
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
  retailSubtotalDiscountInput: document.getElementById("retailSubtotalDiscountInput"),
  retailTaxRateInput: document.getElementById("retailTaxRateInput"),
  retailStoreCreditInput: document.getElementById("retailStoreCreditInput"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  cartItemDiscount: document.getElementById("cartItemDiscount"),
  cartSubtotalDiscount: document.getElementById("cartSubtotalDiscount"),
  cartTax: document.getElementById("cartTax"),
  cartStoreCredit: document.getElementById("cartStoreCredit"),
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
  customerMemberCount: document.getElementById("customerMemberCount"),
  customerSpendSummary: document.getElementById("customerSpendSummary"),
  customerSearchInput: document.getElementById("customerSearchInput"),
  customerForm: document.getElementById("customerForm"),
  customerNameInput: document.getElementById("customerNameInput"),
  customerPhoneInput: document.getElementById("customerPhoneInput"),
  customerMemberCodeInput: document.getElementById("customerMemberCodeInput"),
  customerStoreCreditInput: document.getElementById("customerStoreCreditInput"),
  customerLoyaltyPointsInput: document.getElementById("customerLoyaltyPointsInput"),
  productForm: document.getElementById("productForm"),
  productNameInput: document.getElementById("productNameInput"),
  productImageInput: document.getElementById("productImageInput"),
  productImagePreview: document.getElementById("productImagePreview"),
  productCategorySelect: document.getElementById("productCategorySelect"),
  productPriceInput: document.getElementById("productPriceInput"),
  productBarcodeInput: document.getElementById("productBarcodeInput"),
  productSkuInput: document.getElementById("productSkuInput"),
  productCostPriceInput: document.getElementById("productCostPriceInput"),
  productBrandInput: document.getElementById("productBrandInput"),
  productSupplierInput: document.getElementById("productSupplierInput"),
  productColorInput: document.getElementById("productColorInput"),
  productSizeLabelInput: document.getElementById("productSizeLabelInput"),
  productDiscountInput: document.getElementById("productDiscountInput"),
  productVariantsInput: document.getElementById("productVariantsInput"),
  productStockInput: document.getElementById("productStockInput"),
  productLowStockInput: document.getElementById("productLowStockInput"),
  productEnableSize: document.getElementById("productEnableSize"),
  productEnableSugar: document.getElementById("productEnableSugar"),
  productEnableIce: document.getElementById("productEnableIce"),
  productEnableCoffee: document.getElementById("productEnableCoffee"),
  productEnableToppings: document.getElementById("productEnableToppings"),
  productList: document.getElementById("productList"),
  productCount: document.getElementById("productCount"),
  mobileCheckoutButton: document.getElementById("mobileCheckoutButton"),
  ordersSearchInput: document.getElementById("ordersSearchInput"),
  ordersPageCountSummary: document.getElementById("ordersPageCountSummary"),
  ordersSalesTotal: document.getElementById("ordersSalesTotal"),
  ordersCustomerCount: document.getElementById("ordersCustomerCount"),
  reportOrderCount: document.getElementById("reportOrderCount"),
  reportItemCount: document.getElementById("reportItemCount"),
  reportLowStockCount: document.getElementById("reportLowStockCount"),
  reportSalesTotal: document.getElementById("reportSalesTotal"),
  lowStockLabel: document.getElementById("lowStockLabel"),
  orderList: document.getElementById("orderList"),
  orderCount: document.getElementById("orderCount"),
  lowStockList: document.getElementById("lowStockList"),
  adminCreateUserForm: document.getElementById("adminCreateUserForm"),
  newUsername: document.getElementById("newUsername"),
  newPhone: document.getElementById("newPhone"),
  newPassword: document.getElementById("newPassword"),
  newUserRole: document.getElementById("newUserRole"),
  userList: document.getElementById("userList"),
  userCount: document.getElementById("userCount"),
  adminPlatformForm: document.getElementById("adminPlatformForm"),
  adminShopName: document.getElementById("adminShopName"),
  adminShopType: document.getElementById("adminShopType"),
  adminShopTypeFnb: document.getElementById("adminShopTypeFnb"),
  adminShopTypeRetail: document.getElementById("adminShopTypeRetail"),
  adminUsername: document.getElementById("adminUsername"),
  adminPhone: document.getElementById("adminPhone"),
  adminPassword: document.getElementById("adminPassword"),
  adminShopCount: document.getElementById("adminShopCount"),
  adminUserCount: document.getElementById("adminUserCount"),
  adminSchemaStatus: document.getElementById("adminSchemaStatus"),
  adminShopList: document.getElementById("adminShopList"),
  adminUserList: document.getElementById("adminUserList"),
  adminShopListCount: document.getElementById("adminShopListCount"),
  adminUserListCount: document.getElementById("adminUserListCount"),
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
  settingsReceiptAddress: document.getElementById("settingsReceiptAddress"),
  settingsReceiptContact: document.getElementById("settingsReceiptContact"),
  settingsReceiptManager: document.getElementById("settingsReceiptManager"),
  settingsReceiptNote: document.getElementById("settingsReceiptNote"),
  settingsRetailTaxRate: document.getElementById("settingsRetailTaxRate"),
  settingsRetailBarcodeMode: document.getElementById("settingsRetailBarcodeMode"),
  settingsRetailStoreCreditLabel: document.getElementById("settingsRetailStoreCreditLabel"),
  settingsRetailLoyaltyLabel: document.getElementById("settingsRetailLoyaltyLabel"),
  settingsOptionSizes: document.getElementById("settingsOptionSizes"),
  settingsOptionSugar: document.getElementById("settingsOptionSugar"),
  settingsOptionIce: document.getElementById("settingsOptionIce"),
  settingsOptionCoffee: document.getElementById("settingsOptionCoffee"),
  settingsOptionToppings: document.getElementById("settingsOptionToppings"),
  settingsOrderCounter: document.getElementById("settingsOrderCounter"),
  resetOrderCounterButton: document.getElementById("resetOrderCounterButton"),
  categoryForm: document.getElementById("categoryForm"),
  categoryNameInput: document.getElementById("categoryNameInput"),
  categoryEnableSize: document.getElementById("categoryEnableSize"),
  categoryEnableSugar: document.getElementById("categoryEnableSugar"),
  categoryEnableIce: document.getElementById("categoryEnableIce"),
  categoryEnableCoffee: document.getElementById("categoryEnableCoffee"),
  categoryEnableToppings: document.getElementById("categoryEnableToppings"),
  categoryCount: document.getElementById("categoryCount"),
  categoryList: document.getElementById("categoryList"),
  posShopProfileImage: document.getElementById("posShopProfileImage"),
  posShopBusinessName: document.getElementById("posShopBusinessName"),
  posShopBusinessDescription: document.getElementById("posShopBusinessDescription"),
  currentSystemBadge: document.getElementById("currentSystemBadge"),
  nonStaffFields: [...document.querySelectorAll("[data-non-staff='true']")],
  paymentQrImage: document.getElementById("paymentQrImage"),
  receiptHeaderTitle: document.getElementById("receiptHeaderTitle"),
  receiptBrandLogo: document.getElementById("receiptBrandLogo"),
  receiptBrandName: document.getElementById("receiptBrandName"),
  receiptBusinessDescription: document.getElementById("receiptBusinessDescription"),
  receiptAddress: document.getElementById("receiptAddress"),
  receiptContact: document.getElementById("receiptContact"),
  receiptManager: document.getElementById("receiptManager"),
  receiptNote: document.getElementById("receiptNote"),
  receiptBarcodeValue: document.getElementById("receiptBarcodeValue"),
  receiptFooterText: document.getElementById("receiptFooterText"),
  screens: {
    adminChooser: document.getElementById("adminChooserScreen"),
    pos: document.getElementById("posScreen"),
    orders: document.getElementById("ordersScreen"),
    money: document.getElementById("moneyScreen"),
    expenses: document.getElementById("expensesScreen"),
    stock: document.getElementById("stockScreen"),
    customers: document.getElementById("customersScreen"),
    reports: document.getElementById("reportsScreen"),
    settings: document.getElementById("settingsScreen"),
    users: document.getElementById("usersScreen"),
    admin: document.getElementById("adminScreen"),
    help: document.getElementById("helpScreen")
  },
  itemModal: document.getElementById("itemModal"),
  closeItemButton: document.getElementById("closeItemButton"),
  cancelItemButton: document.getElementById("cancelItemButton"),
  addItemToCartButton: document.getElementById("addItemToCartButton"),
  itemModalTitle: document.getElementById("itemModalTitle"),
  itemModalPrice: document.getElementById("itemModalPrice"),
  itemSize: document.getElementById("itemSize"),
  itemSugar: document.getElementById("itemSugar"),
  itemIce: document.getElementById("itemIce"),
  itemCoffee: document.getElementById("itemCoffee"),
  itemToppings: document.getElementById("itemToppings"),
  itemNote: document.getElementById("itemNote"),
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
  payCardButton: document.getElementById("payCardButton"),
  payBankButton: document.getElementById("payBankButton"),
  paySplitButton: document.getElementById("paySplitButton"),
  payStoreCreditButton: document.getElementById("payStoreCreditButton"),
  paymentBackButton: document.getElementById("paymentBackButton"),
  betaQrGrid: document.getElementById("betaQrGrid"),
  closeReceiptButton: document.getElementById("closeReceiptButton"),
  receiptBackButton: document.getElementById("receiptBackButton"),
  receiptCashier: document.getElementById("receiptCashier"),
  receiptPaymentMethod: document.getElementById("receiptPaymentMethod"),
  receiptBuyer: document.getElementById("receiptBuyer"),
  receiptPhone: document.getElementById("receiptPhone"),
  receiptDate: document.getElementById("receiptDate"),
  receiptInvoice: document.getElementById("receiptInvoice"),
  receiptItems: document.getElementById("receiptItems"),
  receiptRetailSummary: document.getElementById("receiptRetailSummary"),
  receiptItemDiscount: document.getElementById("receiptItemDiscount"),
  receiptSubtotalDiscount: document.getElementById("receiptSubtotalDiscount"),
  receiptTax: document.getElementById("receiptTax"),
  receiptStoreCredit: document.getElementById("receiptStoreCredit"),
  receiptSubtotal: document.getElementById("receiptSubtotal"),
  receiptFee: document.getElementById("receiptFee"),
  receiptTotal: document.getElementById("receiptTotal"),
  shareReceiptButton: document.getElementById("shareReceiptButton"),
  downloadReceiptButton: document.getElementById("downloadReceiptButton"),
  printReceiptButton: document.getElementById("printReceiptButton"),
  itemModalMeta: document.getElementById("itemModalMeta"),
  itemVariantLabel: document.getElementById("itemVariantLabel"),
  itemVariant: document.getElementById("itemVariant"),
  bottomNavButtons: [
    document.getElementById("bottomNavButton1"),
    document.getElementById("bottomNavButton2"),
    document.getElementById("bottomNavButton3"),
    document.getElementById("bottomNavButton4"),
    document.getElementById("bottomNavButton5")
  ]
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
    loginEmailOnly: "សូមប្រើអ៊ីមែល ឬលេខទូរស័ព្ទដែលក្រុមគាំទ្រ ឬម្ចាស់ហាងបានបង្កើតអោយ។",
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
    loginEmailOnly: "Please use the email or phone number created by support or your shop owner.",
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
  navAdmin: "Admin index",
  navHelp: "Help & Support",
  fixedPriceTag: "Fixed prices",
  customerToggle: "Add customer info",
  discountPlaceholder: "Discount",
  taxPlaceholder: "Tax",
  customerHistoryHeading: "Recent buyers",
  helpHeading: "Need support?",
  helpCopy: "Use Telegram support for account approval, shop setup, and login help.",
  authCopy: "Request your account on Telegram first. After the owner approves it, you can sign in and stay signed in on this device.",
  requestStep1: "Send a Telegram message to the owner",
  requestStep3: "Wait for the owner to create your account",
  adminHeading: "Create shop members",
  receiptDesignHeading: "រចនាវិក្កយបត្រ",
  receiptAddressLabel: "អាសយដ្ឋានអាជីវកម្ម",
  receiptAddressPlaceholder: "ផ្លូវ ទីក្រុង ឬទីតាំងសម្គាល់",
  receiptContactLabel: "លេខទំនាក់ទំនងលើវិក្កយបត្រ",
  receiptContactPlaceholder: "ទូរស័ព្ទ Telegram ឬ Facebook",
  receiptManagerLabel: "បន្ទាត់អ្នកគ្រប់គ្រង / អ្នកលក់",
  receiptManagerPlaceholder: "អ្នកគ្រប់គ្រង: Srey Leak",
  receiptExtraNoteLabel: "កំណត់សម្គាល់បន្ថែម",
  receiptExtraNotePlaceholder: "ច្បាប់ប្តូរ ឬសារអរគុណ",
  savePdfButton: "រក្សាទុក PDF",
  buyerLabel: "អ្នកទិញ",
  dateLabel: "កាលបរិច្ឆេទ",
  invoiceLabel: "លេខវិក្កយបត្រ",
  sizeLabel: "ទំហំ",
  sugarLabel: "កម្រិតស្ករ",
  iceLabel: "កម្រិតទឹកកក",
  coffeeLabel: "កម្រិតកាហ្វេ",
  toppingLabel: "Topping",
  noteLabel: "ចំណាំ",
  notePlaceholder: "ផ្អែមតិច ឬមិនដាក់ចំបើង",
  addToCheckoutButton: "បន្ថែមទៅកន្ត្រក",
  productOptionHeading: "រចនាជម្រើសទំនិញ",
  productOptionSizesLabel: "ទំហំ (បន្ទាត់មួយមួយ)",
  productOptionSugarLabel: "កម្រិតស្ករ",
  productOptionIceLabel: "កម្រិតទឹកកក",
  productOptionCoffeeLabel: "កម្រិតកាហ្វេ",
  productOptionToppingsLabel: "Topping",
  businessControlsHeading: "ការគ្រប់គ្រងអាជីវកម្ម",
  orderCounterLabel: "លេខកូដវិក្កយបត្របន្ទាប់",
  resetOrderCounterButton: "កំណត់ទៅ 1",
  orderHistoryHeading: "ប្រវត្តិវិក្កយបត្រ",
  orderLookupHeading: "ស្វែងរកវិក្កយបត្រ",
  ordersSearchPlaceholder: "ស្វែងរកតាមលេខកូដ អ្នកទិញ លេខទូរស័ព្ទ ឬទំនិញ",
  reportRecentHeading: "វិក្កយបត្រថ្មីៗ",
  todaySalesShort: "ទឹកប្រាក់លក់",
  customerCountLabel: "ចំនួនអតិថិជន",
  scrollToCheckoutButton: "ទៅកាន់កន្ត្រក",
  tapToAdd: "ចុចដើម្បីបន្ថែម",
  optionsCountLabel: "{count} ជម្រើស",
  productOptionEnableHeading: "បើកជម្រើសសម្រាប់ទំនិញនេះ",
  productEnableSize: "ទំហំ",
  productEnableSugar: "ស្ករ",
  productEnableIce: "ទឹកកក",
  productEnableCoffee: "កាហ្វេ",
  productEnableToppings: "Topping",
  createOwnerButton: "បង្កើតហាងម្ចាស់",
  shopTypeLabel: "ប្រភេទហាង",
  shopTypeFnb: "ហាង F&B",
  shopTypeRetail: "ហាង Retail",
  retailPosHint: "ស្វែងរកតាមឈ្មោះ បាកូដ ឬ SKU",
  barcodeLabel: "បាកូដ",
  skuLabel: "SKU",
  costPriceLabel: "តម្លៃដើម",
  brandLabel: "ម៉ាក",
  supplierLabel: "អ្នកផ្គត់ផ្គង់",
  variantColorLabel: "ពណ៌",
  variantSizeLabel: "ស្លាកទំហំ",
  discountLabel: "បញ្ចុះតម្លៃ",
  variantsLabel: "បញ្ជីវ៉ារ្យ៉ង់",
  variantLabel: "វ៉ារ្យ៉ង់",
  cashierLabel: "អ្នកគិតលុយ",
  itemDiscountLabel: "បញ្ចុះតម្លៃតាមទំនិញ",
  subtotalDiscountLabel: "បញ្ចុះតម្លៃសរុប",
  taxLabel: "ពន្ធ",
  payCardButton: "កាត",
  payBankPlaceholder: "ធនាគារ",
  paySplitPlaceholder: "បង់ចែក",
  payStoreCreditPlaceholder: "Store credit",
  adminShopCountLabel: "ចំនួនហាង",
  adminUserCountLabel: "ចំនួនអ្នកប្រើ",
  adminSchemaLabel: "Schema",
  adminShopListHeading: "បញ្ជីហាងទាំងអស់",
  adminUserListHeading: "បញ្ជីអ្នកប្រើទាំងអស់",
  loginEmailOnly: "សូមប្រើអ៊ីមែល ឬលេខទូរស័ព្ទដែលក្រុមគាំទ្រ ឬម្ចាស់ហាងបានអនុម័ត",
  paymentBank: "បង់តាមធនាគារ",
  paymentCash: "បង់សាច់ប្រាក់",
  navExpenses: "ចំណាយ",
  navCustomers: "អតិថិជន",
  navUsers: "អ្នកប្រើ និងបុគ្គលិក",
  navHelp: "ជំនួយ",
  fixedPriceTag: "តម្លៃថេរ",
  customerToggle: "បន្ថែមព័ត៌មានអតិថិជន",
  adminOnlyUsers: "មានសិទ្ធិម្ចាស់ហាងប៉ុណ្ណោះ",
  adminHeading: "បង្កើតសមាជិកហាង",
  stockOnlyWarning: "បុគ្គលិកអាចកែបានតែចំនួនស្តុកសម្រាប់ទំនិញដែលមានរួចប៉ុណ្ណោះ។",
  noShops: "មិនទាន់មានហាងទេ",
  noPlatformUsers: "មិនទាន់មានអ្នកប្រើទេ"
});

Object.assign(translations.en, {
  navExpenses: "Expenses",
  navCustomers: "Customers",
  navUsers: "Users & Staff",
  navAdmin: "Admin index",
  navHelp: "Help & Support",
  fixedPriceTag: "Fixed prices",
  customerToggle: "Add customer info",
  discountPlaceholder: "Discount",
  taxPlaceholder: "Tax",
  customerHistoryHeading: "Recent buyers",
  helpHeading: "Need support?",
  helpCopy: "Use Telegram support for account approval, shop setup, and login help.",
  authCopy: "Request your account on Telegram first. After the owner approves it, you can sign in and stay signed in on this device.",
  requestStep1: "Send a Telegram message to the owner",
  requestStep3: "Wait for the owner to create your account",
  adminHeading: "Create shop members",
  receiptDesignHeading: "Receipt designing",
  receiptAddressLabel: "Business address",
  receiptAddressPlaceholder: "Street, city, landmark",
  receiptContactLabel: "Receipt contact",
  receiptContactPlaceholder: "Phone / Telegram / social",
  receiptManagerLabel: "Manager / cashier line",
  receiptManagerPlaceholder: "Manager: Srey Leak",
  receiptExtraNoteLabel: "Extra note",
  receiptExtraNotePlaceholder: "Return policy or thank-you note",
  savePdfButton: "Save PDF",
  buyerLabel: "Buyer",
  dateLabel: "Date",
  invoiceLabel: "Invoice",
  sizeLabel: "Size",
  sugarLabel: "Sugar level",
  iceLabel: "Ice level",
  coffeeLabel: "Coffee level",
  toppingLabel: "Toppings",
  noteLabel: "Note",
  notePlaceholder: "Less sweet, no straw",
  addToCheckoutButton: "Add to checkout",
  productOptionHeading: "Product option designing",
  productOptionSizesLabel: "Sizes (one per line)",
  productOptionSugarLabel: "Sugar levels",
  productOptionIceLabel: "Ice levels",
  productOptionCoffeeLabel: "Coffee levels",
  productOptionToppingsLabel: "Toppings",
  businessControlsHeading: "Business controls",
  orderCounterLabel: "Next invoice code",
  resetOrderCounterButton: "Reset to 1",
  orderHistoryHeading: "Order history",
  orderLookupHeading: "Order lookup",
  ordersSearchPlaceholder: "Search invoice, buyer, phone, or item",
  reportRecentHeading: "Recent receipts",
  todaySalesShort: "Sales total",
  customerCountLabel: "Customers",
  scrollToCheckoutButton: "View checkout",
  tapToAdd: "Tap to add",
  optionsCountLabel: "{count} options",
  productOptionEnableHeading: "Enable options for this product",
  productEnableSize: "Size",
  productEnableSugar: "Sugar",
  productEnableIce: "Ice",
  productEnableCoffee: "Coffee",
  productEnableToppings: "Toppings",
  createOwnerButton: "Create owner shop",
  shopTypeLabel: "Shop type",
  shopTypeFnb: "F&B shop",
  shopTypeRetail: "Retail shop",
  adminChooserHeading: "Choose a system",
  adminGoFnb: "Open F&B POS",
  adminGoRetail: "Open Retail POS",
  adminFnbHint: "Open the food and beverage POS system.",
  adminRetailHint: "Open the retail checkout and member system.",
  adminIndexHint: "Create shops, assign shop type, and manage business accounts.",
  retailPosHint: "Search by name, barcode, or SKU",
  barcodeLabel: "Barcode",
  skuLabel: "SKU",
  costPriceLabel: "Cost price",
  brandLabel: "Brand",
  supplierLabel: "Supplier",
  variantColorLabel: "Color",
  variantSizeLabel: "Size label",
  discountLabel: "Discount",
  variantsLabel: "Variants",
  variantLabel: "Variant",
  cashierLabel: "Cashier",
  itemDiscountLabel: "Item discount",
  subtotalDiscountLabel: "Subtotal discount",
  taxLabel: "Tax",
  payCardButton: "Card",
  payBankPlaceholder: "Bank",
  paySplitPlaceholder: "Split",
  payStoreCreditPlaceholder: "Store credit",
  adminShopCountLabel: "Shops",
  adminUserCountLabel: "Users",
  adminSchemaLabel: "Schema",
  adminShopListHeading: "All shops",
  adminUserListHeading: "All users"
  ,
  adminOnlyUsers: "Only owners can see this section.",
  adminHeading: "Create shop members",
  stockOnlyWarning: "Staff can update stock only for existing products.",
  noShops: "No shops",
  noPlatformUsers: "No users"
});

Object.assign(translations.km, {
  dashboardButton: "ផ្ទាំងគ្រប់គ្រង",
  navDashboard: "ផ្ទាំងគ្រប់គ្រង",
  navOrdersShort: "ការបញ្ជាទិញ",
  navAdmin: "ផ្ទាំង Admin",
  navExpenses: "ចំណាយ",
  navCustomers: "អតិថិជន",
  navUsers: "អ្នកប្រើ និងបុគ្គលិក",
  navHelp: "ជំនួយ និងគាំទ្រ",
  fixedPriceTag: "តម្លៃថេរ",
  customerToggle: "បន្ថែមព័ត៌មានអតិថិជន",
  discountPlaceholder: "បញ្ចុះតម្លៃ",
  taxPlaceholder: "ពន្ធ",
  customerHistoryHeading: "អតិថិជនថ្មីៗ",
  helpHeading: "ត្រូវការជំនួយ?",
  helpCopy: "ប្រើ Telegram សម្រាប់ស្នើគណនី កំណត់ហាង និងដោះស្រាយបញ្ហាចូលប្រើ។",
  authCopy: "ស្នើសុំគណនីតាម Telegram មុនសិន។ បន្ទាប់ពីម្ចាស់អនុម័ត អ្នកអាចចូលប្រើបាន ហើយប្រព័ន្ធនឹងរក្សា session លើឧបករណ៍នេះ។",
  requestStep1: "ផ្ញើសារ Telegram ទៅម្ចាស់ហាង",
  requestStep3: "រង់ចាំម្ចាស់បង្កើតគណនីអោយ",
  receiptExtraNoteLabel: "កំណត់ចំណាំបន្ថែម",
  productOptionToppingsLabel: "Topping",
  scrollToCheckoutButton: "មើលកន្លែងទូទាត់",
  tapToAdd: "ចុចដើម្បីបន្ថែម",
  reportRecentHeading: "វិក្កយបត្រថ្មីៗ",
  createOwnerButton: "បង្កើតហាងម្ចាស់",
  adminChooserHeading: "ជ្រើសរើសប្រព័ន្ធ",
  adminGoFnb: "ចូល F&B POS",
  adminGoRetail: "ចូល Retail POS",
  adminFnbHint: "បើកប្រព័ន្ធ POS សម្រាប់ហាងអាហារ និងភេសជ្ជៈ។",
  adminRetailHint: "បើកប្រព័ន្ធ Retail សម្រាប់លក់រាយ និងសមាជិក។",
  adminIndexHint: "បង្កើតហាង កំណត់ប្រភេទហាង និងគ្រប់គ្រងគណនីអ្នកប្រើ។",
  adminShopCountLabel: "ហាង",
  adminUserCountLabel: "អ្នកប្រើ",
  adminShopListHeading: "ហាងទាំងអស់",
  adminUserListHeading: "អ្នកប្រើទាំងអស់",
  noShops: "មិនទាន់មានហាងទេ",
  noPlatformUsers: "មិនទាន់មានអ្នកប្រើទេ",
  savePdfButton: "រក្សាទុក PDF",
  shareButton: "ចែករំលែក",
  productCategoryLabel: "ប្រភេទទំនិញ",
  productCategoryPlaceholder: "មិនបានជ្រើសប្រភេទ",
  categoryOptionHeading: "លំនាំដើមជម្រើសតាមប្រភេទ",
  categoryOptionLegend: "ជម្រើសលំនាំដើមសម្រាប់ប្រភេទនេះ",
  categoryNameLabel: "ឈ្មោះប្រភេទ",
  categoryNamePlaceholder: "ឧទាហរណ៍: កាហ្វេ",
  saveCategoryButton: "រក្សាទុកប្រភេទ",
  categoryListHeading: "ប្រភេទដែលបានរក្សាទុក",
  saveCategoryFailed: "រក្សាទុកប្រភេទមិនបាន",
  deleteCategoryFailed: "លុបប្រភេទមិនបាន",
  categoryMissing: "សូមបញ្ចូលឈ្មោះប្រភេទ",
  homepageBusinessFallback: "អាជីវកម្មរបស់អ្នក",
  startupLoading: "កំពុងរៀបចំប្រព័ន្ធ...",
  startupReady: "ប្រព័ន្ធកំពុងរួចរាល់",
  noCategories: "មិនទាន់មានប្រភេទទេ",
  categoryDefaultTag: "លំនាំដើមតាមប្រភេទ",
  receiptActionHint: "រក្សាទុក ឬចែករំលែកវិក្កយបត្រនេះ",
  paymentBankLabel: "បង់តាម QR",
  paymentCashLabel: "បង់ផ្ទាល់",
  reportPageHint: "មើលស្ថិតិ និងបើកវិក្កយបត្រវិញ",
  ordersPageHint: "ស្វែងរក និងពិនិត្យការបញ្ជាទិញ",
  settingsPageHint: "កំណត់ហាង កូដ QR និងវិក្កយបត្រ",
  businessNamePlaceholder: "ឧទាហរណ៍: Nilaa Coffee",
  receiptNamePlaceholder: "ឈ្មោះវិក្កយបត្រ",
  productOptionSizesPlaceholder: "តូច\nមធ្យម\nធំ",
  productOptionSugarPlaceholder: "0%\n50%\n100%",
  productOptionIcePlaceholder: "គ្មានទឹកកក\nទឹកកកតិច\nទឹកកកធម្មតា",
  productOptionCoffeePlaceholder: "ស្រាល\nធម្មតា\nខ្លាំង",
  productOptionToppingsPlaceholder: "ប៊ូបា\nចាហួយ\nក្រែម",
  userEmailPlaceholder: "owner@example.com",
  userPhonePlaceholder: "012 345 678",
  receiptFooterPlaceholder: "អរគុណសម្រាប់ការគាំទ្រ សូមអញ្ជើញមកម្តងទៀត។",
  receiptThanks: "អរគុណសម្រាប់ការគាំទ្រ សូមអញ្ជើញមកម្តងទៀត។",
  receiptActionHint: "រក្សាទុក ឬចែករំលែកវិក្កយបត្រនេះ"
});

Object.assign(translations.en, {
  shareButton: "Share",
  productCategoryLabel: "Product category",
  productCategoryPlaceholder: "No category",
  categoryOptionHeading: "Category option defaults",
  categoryOptionLegend: "Default options for this category",
  categoryNameLabel: "Category name",
  categoryNamePlaceholder: "Example: Coffee",
  saveCategoryButton: "Save category",
  categoryListHeading: "Saved categories",
  saveCategoryFailed: "Could not save category.",
  deleteCategoryFailed: "Could not delete category.",
  categoryMissing: "Please enter a category name.",
  homepageBusinessFallback: "Your business",
  startupLoading: "Preparing your workspace...",
  startupReady: "System ready",
  noCategories: "No categories yet.",
  categoryDefaultTag: "Category default",
  receiptActionHint: "Save or share this receipt",
  paymentBankLabel: "Pay with QR",
  paymentCashLabel: "Pay manual",
  reportPageHint: "See KPIs and reopen receipts",
  ordersPageHint: "Search and review every order",
  settingsPageHint: "Set shop profile, QR, and receipt",
  businessNamePlaceholder: "Example: Nilaa Coffee",
  receiptNamePlaceholder: "Receipt name",
  productOptionSizesPlaceholder: "Small\nMedium\nLarge",
  productOptionSugarPlaceholder: "0%\n50%\n100%",
  productOptionIcePlaceholder: "No ice\nLess ice\nNormal ice",
  productOptionCoffeePlaceholder: "Light\nNormal\nStrong",
  productOptionToppingsPlaceholder: "Pearl\nJelly\nCream",
  userEmailPlaceholder: "owner@example.com",
  userPhonePlaceholder: "012 345 678"
});

Object.assign(translations.km, {
  customerLookupHeading: "ស្វែងរកអតិថិជន",
  customerSearchPlaceholder: "ស្វែងរកឈ្មោះ ឬ លេខទូរស័ព្ទ",
  customerMemberCountLabel: "សមាជិក",
  customerSpendSummaryLabel: "ចំណាយសរុប",
  customerMemberEditorHeading: "ព័ត៌មានសមាជិក",
  memberCodeLabel: "កូដសមាជិក",
  storeCreditBalanceLabel: "សមតុល្យ Store credit",
  loyaltyPointsLabel: "ពិន្ទុ Loyalty",
  saveCustomerButton: "រក្សាទុកសមាជិក",
  customerSaved: "រក្សាទុកសមាជិកបាន",
  taxRateLabel: "អត្រាពន្ធ (%)",
  storeCreditApplyLabel: "Store credit ប្រើ",
  retailSettingsHeading: "ការកំណត់ Retail",
  barcodeModeLabel: "របៀប Barcode",
  barcodeModeCamera: "Camera និង keyboard",
  barcodeModeKeyboard: "Keyboard scanner ប៉ុណ្ណោះ",
  storeCreditLabel: "ឈ្មោះ Store credit",
  storeCreditLabelPlaceholder: "Store credit",
  loyaltyProgramLabel: "ឈ្មោះ Loyalty",
  loyaltyProgramPlaceholder: "Loyalty points",
  noCustomers: "មិនទាន់មានអតិថិជនទេ",
  retailCustomerMeta: "ចំនួនទិញ {count} ដង • ចំណាយ {amount}",
  retailStoreCreditTag: "Store credit {amount}",
  retailPointsTag: "{points} pts"
});

Object.assign(translations.en, {
  customerLookupHeading: "Customer lookup",
  customerSearchPlaceholder: "Search name or phone",
  customerMemberCountLabel: "Members",
  customerSpendSummaryLabel: "Total spend",
  customerMemberEditorHeading: "Member profile",
  memberCodeLabel: "Member code",
  storeCreditBalanceLabel: "Store credit balance",
  loyaltyPointsLabel: "Loyalty points",
  saveCustomerButton: "Save member",
  customerSaved: "Member saved",
  taxRateLabel: "Tax rate (%)",
  storeCreditApplyLabel: "Store credit",
  retailSettingsHeading: "Retail settings",
  barcodeModeLabel: "Barcode mode",
  barcodeModeCamera: "Camera and keyboard",
  barcodeModeKeyboard: "Keyboard scanner only",
  storeCreditLabel: "Store credit label",
  storeCreditLabelPlaceholder: "Store credit",
  loyaltyProgramLabel: "Loyalty label",
  loyaltyProgramPlaceholder: "Loyalty points",
  noCustomers: "No customers yet.",
  retailCustomerMeta: "{count} visits • {amount} spent",
  retailStoreCreditTag: "Store credit {amount}",
  retailPointsTag: "{points} pts"
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

function isPlatformAdminProfile(profile = state.profile) {
  const identifier = String(profile?.email || profile?.username || "").trim().toLowerCase();
  return identifier === "nilaademo@gmail.com";
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

function parseOptionList(value, fallback = []) {
  const input = Array.isArray(value) ? value.join("\n") : String(value || "");
  const items = input
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

function currentOptionConfig() {
  const settings = currentSettings();
  return {
    sizes: parseOptionList(settings.option_sizes, ["Regular"]),
    sugar: parseOptionList(settings.option_sugar_levels, ["100%"]),
    ice: parseOptionList(settings.option_ice_levels, ["Normal"]),
    coffee: parseOptionList(settings.option_coffee_levels, ["Normal"]),
    toppings: parseOptionList(settings.option_toppings, [])
  };
}

function categoryById(categoryId) {
  return state.categories.find((item) => item.id === categoryId) || null;
}

function productOptionState(product = {}) {
  const category = categoryById(product.category_id || product.categoryId);
  return {
    size: product.enable_size ?? category?.enable_size ?? true,
    sugar: product.enable_sugar ?? category?.enable_sugar ?? true,
    ice: product.enable_ice ?? category?.enable_ice ?? true,
    coffee: product.enable_coffee ?? category?.enable_coffee ?? true,
    toppings: product.enable_toppings ?? category?.enable_toppings ?? false
  };
}

function itemOptionParts(item) {
  const options = item?.options || {};
  const parts = [options.variant, options.size, options.sugar, options.ice, options.coffee].filter(Boolean);
  if (Array.isArray(options.toppings) && options.toppings.length) parts.push(options.toppings.join(", "));
  if (options.note) parts.push(options.note);
  return parts;
}

function itemOptionsMarkup(item) {
  const parts = itemOptionParts(item);
  return parts.length ? `<div class="meta-line">${safeText(parts.join(" • "))}</div>` : "";
}

function itemOptionsInlineText(item) {
  const parts = itemOptionParts(item);
  return parts.length ? ` (${parts.join(" / ")})` : "";
}

function orderSummary(order) {
  return (order.items || []).map((item) => {
    const parts = itemOptionParts(item);
    return `${item.name} x${item.qty}${parts.length ? ` (${parts.join("/")})` : ""}`;
  }).join(", ");
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
  window.setTimeout(() => {
    state.splashDone = true;
    elements.startupSplash?.classList.add("hidden");
    renderAuth();
  }, 3000);
}

function defaultSettingsForShopType(shopType = currentShopType()) {
  const retail = shopType === "retail";
  return {
    business_name: state.shop?.name || "nilaa-os",
    business_description: "",
    payment_method: "both",
    qr_image_url: "",
    receipt_name: "nilaa-os",
    receipt_footer: t("receiptThanks"),
    shop_logo_url: "",
    receipt_address: "",
    receipt_contact: "",
    receipt_manager: "",
    receipt_note: "",
    retail_tax_rate: retail ? 10 : 0,
    retail_barcode_mode: "camera",
    retail_store_credit_label: "Store credit",
    retail_loyalty_label: "Loyalty points",
    option_sizes: retail ? "XS\nS\nM\nL\nXL" : "Small\nMedium\nLarge",
    option_sugar_levels: "0%\n50%\n100%",
    option_ice_levels: "No ice\nLess ice\nNormal ice",
    option_coffee_levels: "Light\nNormal\nStrong",
    option_toppings: "",
    order_counter: 1
  };
}

function defaultSettings() {
  return defaultSettingsForShopType(currentShopType());
}

function nextInvoiceNumber() {
  return `#${Number(currentSettings().order_counter || 1)}`;
}

function currentSettings() {
  return { ...defaultSettings(), ...(state.settings || {}) };
}

function aggregatedCustomers() {
  const map = new Map();
  state.customers.forEach((customer) => {
    const key = normalizePhone(customer.phone) || String(customer.id || "").toLowerCase();
    if (!key) return;
    map.set(key, {
      id: customer.id,
      name: customer.name || "",
      phone: customer.phone || "",
      member_code: customer.member_code || "",
      store_credit_balance: Number(customer.store_credit_balance || 0),
      loyalty_points: Number(customer.loyalty_points || 0),
      visits: 0,
      totalSpent: 0,
      lastOrderAt: customer.last_order_at || customer.created_at || ""
    });
  });
  state.orders.forEach((order) => {
    const phone = order.buyer_phone || order.buyerPhone || "";
    const name = order.buyer_name || order.buyerName || "";
    const key = normalizePhone(phone) || name.trim().toLowerCase();
    if (!key) return;
    const existing = map.get(key) || {
      id: key,
      name,
      phone,
      member_code: "",
      store_credit_balance: 0,
      loyalty_points: 0,
      visits: 0,
      totalSpent: 0,
      lastOrderAt: ""
    };
    existing.name ||= name;
    existing.phone ||= phone;
    existing.visits += 1;
    existing.totalSpent += Number(order.total || 0);
    existing.lastOrderAt = order.created_at || order.createdAt || existing.lastOrderAt;
    map.set(key, existing);
  });
  return [...map.values()].sort((a, b) => new Date(b.lastOrderAt || 0) - new Date(a.lastOrderAt || 0));
}

function currentRetailCustomer() {
  const phone = normalizePhone(elements.buyerPhone?.value || state.currentPhone);
  const name = String(elements.buyerName?.value || state.currentBuyer || "").trim().toLowerCase();
  return aggregatedCustomers().find((customer) =>
    (phone && normalizePhone(customer.phone) === phone) ||
    (name && String(customer.name || "").trim().toLowerCase() === name)
  ) || null;
}

function retailPricingSummary() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const fee = Number(elements.orderFee?.value || 0);
  const itemDiscount = isRetailShop()
    ? state.cart.reduce((sum, item) => sum + Number(item.discount || 0) * Number(item.qty || 0), 0)
    : 0;
  const subtotalDiscount = isRetailShop() ? Number(elements.retailSubtotalDiscountInput?.value || 0) : 0;
  const configuredRate = Number(currentSettings().retail_tax_rate || 0);
  const taxRate = isRetailShop()
    ? Number(elements.retailTaxRateInput?.value || configuredRate || 0)
    : 0;
  const member = currentRetailCustomer();
  const availableCredit = Number(member?.store_credit_balance || 0);
  let storeCreditUsed = isRetailShop() ? Number(elements.retailStoreCreditInput?.value || 0) : 0;
  const discountedSubtotal = Math.max(0, subtotal - itemDiscount - subtotalDiscount);
  const tax = discountedSubtotal * (taxRate / 100);
  const beforeCredit = discountedSubtotal + tax + fee;
  if (storeCreditUsed > availableCredit) {
    storeCreditUsed = availableCredit;
    if (elements.retailStoreCreditInput) elements.retailStoreCreditInput.value = String(storeCreditUsed);
  }
  storeCreditUsed = Math.min(storeCreditUsed, beforeCredit);
  const total = Math.max(0, beforeCredit - storeCreditUsed);
  return { subtotal, fee, itemDiscount, subtotalDiscount, taxRate, tax, storeCreditUsed, total, member };
}

function syncBrandVisuals() {
  const settings = currentSettings();
  const logoUrl = "assets/nilaa-logo.png";
  document.querySelectorAll(".brand-logo").forEach((node) => {
    node.src = logoUrl;
  });
  if (elements.settingsProfilePreview) elements.settingsProfilePreview.src = settings.shop_logo_url || "assets/nilaa-logo.png";
  if (elements.receiptBrandLogo) {
    elements.receiptBrandLogo.src = settings.shop_logo_url || "assets/nilaa-logo.png";
    elements.receiptBrandLogo.classList.toggle("hidden", !settings.shop_logo_url);
  }
  if (elements.receiptBrandName) elements.receiptBrandName.textContent = settings.receipt_name || settings.business_name || "nilaa-os";
  if (elements.receiptHeaderTitle) elements.receiptHeaderTitle.textContent = settings.receipt_name || settings.business_name || "nilaa-os";
  if (elements.receiptBusinessDescription) {
    elements.receiptBusinessDescription.textContent = settings.business_description || "";
    elements.receiptBusinessDescription.classList.toggle("hidden", !settings.business_description);
  }
  if (elements.receiptAddress) {
    elements.receiptAddress.textContent = settings.receipt_address || "";
    elements.receiptAddress.classList.toggle("hidden", !settings.receipt_address);
  }
  if (elements.receiptContact) {
    elements.receiptContact.textContent = settings.receipt_contact || "";
    elements.receiptContact.classList.toggle("hidden", !settings.receipt_contact);
  }
  if (elements.receiptManager) {
    elements.receiptManager.textContent = settings.receipt_manager || "";
    elements.receiptManager.classList.toggle("hidden", !settings.receipt_manager);
  }
  if (elements.receiptNote) {
    elements.receiptNote.textContent = settings.receipt_note || "";
    elements.receiptNote.classList.toggle("hidden", !settings.receipt_note);
  }
  if (elements.receiptFooterText) elements.receiptFooterText.textContent = settings.receipt_footer || t("receiptThanks");
  if (elements.posShopProfileImage) {
    elements.posShopProfileImage.src = settings.shop_logo_url || "assets/nilaa-logo.png";
    elements.posShopProfileImage.classList.toggle("hidden", !settings.shop_logo_url);
  }
  if (elements.posShopBusinessName) {
    elements.posShopBusinessName.textContent = settings.business_name || state.shop?.name || t("homepageBusinessFallback");
  }
  if (elements.posShopBusinessDescription) {
    elements.posShopBusinessDescription.textContent = settings.business_description || t("settingsPageHint");
    elements.posShopBusinessDescription.classList.remove("hidden");
  }
  if (elements.currentSystemBadge) {
    elements.currentSystemBadge.textContent = currentShopType() === "retail" ? t("adminGoRetail") : t("adminGoFnb");
  }
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
  if (elements.settingsReceiptAddress) elements.settingsReceiptAddress.value = settings.receipt_address || "";
  if (elements.settingsReceiptContact) elements.settingsReceiptContact.value = settings.receipt_contact || "";
  if (elements.settingsReceiptManager) elements.settingsReceiptManager.value = settings.receipt_manager || "";
  if (elements.settingsReceiptNote) elements.settingsReceiptNote.value = settings.receipt_note || "";
  if (elements.settingsRetailTaxRate) elements.settingsRetailTaxRate.value = Number(settings.retail_tax_rate || 0);
  if (elements.settingsRetailBarcodeMode) elements.settingsRetailBarcodeMode.value = settings.retail_barcode_mode || "camera";
  if (elements.settingsRetailStoreCreditLabel) elements.settingsRetailStoreCreditLabel.value = settings.retail_store_credit_label || "Store credit";
  if (elements.settingsRetailLoyaltyLabel) elements.settingsRetailLoyaltyLabel.value = settings.retail_loyalty_label || "Loyalty points";
  if (elements.settingsOptionSizes) elements.settingsOptionSizes.value = settings.option_sizes || "Small\nMedium\nLarge";
  if (elements.settingsOptionSugar) elements.settingsOptionSugar.value = settings.option_sugar_levels || "0%\n50%\n100%";
  if (elements.settingsOptionIce) elements.settingsOptionIce.value = settings.option_ice_levels || "No ice\nLess ice\nNormal ice";
  if (elements.settingsOptionCoffee) elements.settingsOptionCoffee.value = settings.option_coffee_levels || "Light\nNormal\nStrong";
  if (elements.settingsOptionToppings) elements.settingsOptionToppings.value = settings.option_toppings || "";
  if (elements.settingsOrderCounter) elements.settingsOrderCounter.value = Number(settings.order_counter || 1);
  if (elements.settingsQrPreview) {
    const qrUrl = settings.qr_image_url || "";
    elements.settingsQrPreview.src = qrUrl || "assets/nilaa-logo.png";
    elements.settingsQrPreview.classList.toggle("hidden", !qrUrl);
  }
  syncBrandVisuals();
}

function renderCategoryOptions() {
  if (!elements.productCategorySelect) return;
  const currentValue = elements.productCategorySelect.value;
  elements.productCategorySelect.innerHTML = [
    `<option value="">${safeText(t("productCategoryPlaceholder"))}</option>`,
    ...state.categories
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "km"))
      .map((category) => `<option value="${category.id}">${safeText(category.name)}</option>`)
  ].join("");
  elements.productCategorySelect.value = currentValue && state.categories.some((item) => item.id === currentValue) ? currentValue : "";
}

function renderCategories() {
  renderCategoryOptions();
  if (!elements.categoryList || !elements.categoryCount) return;
  elements.categoryCount.textContent = state.categories.length;
  elements.categoryList.innerHTML = state.categories.length
    ? state.categories
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "km"))
        .map((category) => {
          const enabled = [
            category.enable_size ? t("productEnableSize") : "",
            category.enable_sugar ? t("productEnableSugar") : "",
            category.enable_ice ? t("productEnableIce") : "",
            category.enable_coffee ? t("productEnableCoffee") : "",
            category.enable_toppings ? t("productEnableToppings") : ""
          ].filter(Boolean);
          return `
            <article class="record-row">
              <div>
                <strong>${safeText(category.name)}</strong>
                <div class="meta-line">${safeText(enabled.join(" • ") || t("noCategories"))}</div>
              </div>
              <div class="record-actions__buttons">
                <button class="delete-button" type="button" data-category-id="${category.id}">${t("deleteButton")}</button>
              </div>
            </article>
          `;
        })
        .join("")
    : blankState(t("noCategories"));
}

function applyCategoryDefaultsToProductForm(categoryId) {
  const category = categoryById(categoryId);
  const defaults = {
    size: category?.enable_size ?? true,
    sugar: category?.enable_sugar ?? true,
    ice: category?.enable_ice ?? true,
    coffee: category?.enable_coffee ?? true,
    toppings: category?.enable_toppings ?? false
  };
  if (elements.productEnableSize) elements.productEnableSize.checked = defaults.size;
  if (elements.productEnableSugar) elements.productEnableSugar.checked = defaults.sugar;
  if (elements.productEnableIce) elements.productEnableIce.checked = defaults.ice;
  if (elements.productEnableCoffee) elements.productEnableCoffee.checked = defaults.coffee;
  if (elements.productEnableToppings) elements.productEnableToppings.checked = defaults.toppings;
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
  return role === "business_owner" || role === "admin" ? "owner" : role;
}

function currentShellType() {
  if (!isPlatformAdminProfile()) return currentShopType();
  if (state.platformAdminView === "fnb" || state.platformAdminView === "retail") return state.platformAdminView;
  return "admin";
}

function currentShopType() {
  if (isPlatformAdminProfile() && (state.platformAdminView === "fnb" || state.platformAdminView === "retail")) {
    return state.platformAdminView;
  }
  return state.shop?.shop_type || state.shop?.shopType || "fnb";
}

function isRetailShop() {
  return currentShopType() === "retail";
}

function adminRoutesForCurrentShell() {
  if (state.platformAdminView === "fnb") return ["adminChooser", "admin", ...ownerRoutesForCurrentShell()];
  if (state.platformAdminView === "retail") return ["adminChooser", "admin", ...ownerRoutesForCurrentShell()];
  return ["adminChooser", "admin", "help"];
}

function ownerRoutesForCurrentShell() {
  return isRetailShop()
    ? ["pos", "stock", "orders", "customers", "expenses", "settings", "users", "help"]
    : ["pos", "orders", "money", "expenses", "stock", "customers", "reports", "settings", "users", "help"];
}

function staffRoutesForCurrentShell() {
  return isRetailShop() ? ["pos", "stock", "help"] : ["stock", "help", "pos"];
}

function cashierRoutesForCurrentShell() {
  return isRetailShop() ? ["pos", "help"] : ["pos", "orders", "help"];
}

function retailDefaultCategories() {
  return [
    "Homeware",
    "Bedding",
    "Skincare",
    "Fashion",
    "Towels"
  ];
}

function fnbDefaultCategories() {
  return [
    "Coffee",
    "Tea",
    "Drinks",
    "Food"
  ];
}

function canManageSettings() {
  return currentRole() === "owner";
}

function canManageUsers() {
  return currentRole() === "owner";
}

function canEditProductMeta() {
  return currentRole() === "owner";
}

function defaultRouteForCurrentUser() {
  if (isPlatformAdminProfile()) return "adminChooser";
  if (currentRole() === "staff") return "stock";
  return "pos";
}

function posSearchPlaceholderKey() {
  return isRetailShop() ? "retailPosHint" : "productSearchPlaceholder";
}

function posCategoryMarkup() {
  return `
    <div class="category-chips">
      <button class="category-chip category-chip--active" type="button" data-product-filter="all" data-i18n="filterAll">All</button>
      <button class="category-chip" type="button" data-product-filter="popular" data-i18n="filterPopular">Popular</button>
      <button class="category-chip" type="button" data-product-filter="low" data-i18n="filterLowStock">Low Stock</button>
    </div>
  `;
}

function fnbPosMarkup() {
  return `
    <div class="pos-layout pos-layout--fnb">
      <article class="panel panel--pos-main">
        <div class="pos-head">
          <div>
            <p class="eyebrow">POS machine</p>
            <h3 data-i18n="navPOS">POS</h3>
          </div>
          <div class="pos-head__meta">
            <span id="currentSystemBadge" class="tag tag--system">F&amp;B POS</span>
            <span class="tag" data-i18n="fixedPriceTag">Fixed prices</span>
            <button id="clearCartButton" class="ghost-button" type="button" data-i18n="clearCart">Clear cart</button>
          </div>
        </div>

        <div class="pos-home-identity">
          <img id="posShopProfileImage" class="pos-home-identity__image hidden" src="assets/nilaa-logo.png" alt="Shop profile">
          <div class="pos-home-identity__copy">
            <strong id="posShopBusinessName">Nilaa POS</strong>
            <p id="posShopBusinessDescription" class="hidden"></p>
          </div>
        </div>

        <div class="pos-search-row">
          <label class="pos-search">
            <span class="hidden" data-i18n="productLabel">Product</span>
            <input id="productSearch" list="productSuggestions" type="text" data-i18n-placeholder="${posSearchPlaceholderKey()}" placeholder="Search products">
            <datalist id="productSuggestions"></datalist>
          </label>
        </div>

        ${posCategoryMarkup()}

        <div id="quickProductList" class="quick-product-list quick-product-list--desktop"></div>
        <button id="mobileCheckoutButton" class="primary-button mobile-checkout-button" type="button" data-i18n="scrollToCheckoutButton">View checkout</button>

        <form id="orderForm" class="hidden">
          <input id="productQty" type="number" min="1" value="1">
          <input id="productPrice" type="number" min="0" step="0.01" value="">
        </form>
      </article>

      <aside class="panel panel--checkout">
        <div class="checkout-head">
          <div>
            <p class="eyebrow">Checkout</p>
            <h3 data-i18n="cartHeading">Cart</h3>
          </div>
          <span id="cartCount">0 items</span>
        </div>

        <div class="customer-box">
          <button id="customerToggleButton" class="ghost-button customer-box__toggle" type="button" data-i18n="customerToggle">Add customer info</button>
          <div id="customerFields" class="customer-box__fields hidden">
            <label>
              <span data-i18n="buyerNameLabel">Buyer name</span>
              <input id="buyerName" type="text" data-i18n-placeholder="buyerNamePlaceholder" placeholder="Customer name">
            </label>
            <label>
              <span data-i18n="buyerPhoneLabel">Buyer phone</span>
              <input id="buyerPhone" type="tel" inputmode="tel" data-i18n-placeholder="buyerPhonePlaceholder" placeholder="012 345 678">
            </label>
          </div>
        </div>

        <div id="cartList" class="stack-list checkout-cart-list"></div>

        <div class="checkout-totals">
          <label class="cart-footer__fee">
            <span data-i18n="feeLabel">Fee</span>
            <input id="orderFee" type="number" min="0" step="0.01" value="0">
          </label>
          <div class="checkout-line">
            <span data-i18n="subtotalLabel">Subtotal</span>
            <strong id="cartSubtotal">$0.00</strong>
          </div>
          <div class="checkout-line checkout-line--grand">
            <span data-i18n="totalLabel">Total</span>
            <strong id="cartTotal">$0.00</strong>
          </div>
        </div>

        <div class="checkout-actions">
          <button id="checkoutButton" class="primary-button primary-button--full" type="button" data-i18n="checkoutButton">Close sale</button>
        </div>
      </aside>
    </div>
  `;
}

function retailPosMarkup() {
  return `
    <div class="pos-layout pos-layout--retail">
      <article class="panel panel--pos-main">
        <div class="pos-head">
          <div>
            <p class="eyebrow">Retail POS</p>
            <h3 data-i18n="navPOS">POS</h3>
          </div>
          <div class="pos-head__meta">
            <span id="currentSystemBadge" class="tag tag--system">Retail POS</span>
            <span class="tag">Barcode / SKU</span>
            <button id="clearCartButton" class="ghost-button" type="button" data-i18n="clearCart">Clear cart</button>
          </div>
        </div>

        <div class="pos-home-identity">
          <img id="posShopProfileImage" class="pos-home-identity__image hidden" src="assets/nilaa-logo.png" alt="Shop profile">
          <div class="pos-home-identity__copy">
            <strong id="posShopBusinessName">Nilaa POS</strong>
            <p id="posShopBusinessDescription" class="hidden"></p>
          </div>
        </div>

        <div class="pos-search-row">
          <label class="pos-search">
            <span class="hidden" data-i18n="productLabel">Product</span>
            <input id="productSearch" list="productSuggestions" type="text" data-i18n-placeholder="${posSearchPlaceholderKey()}" placeholder="Search products">
            <datalist id="productSuggestions"></datalist>
          </label>
        </div>

        ${posCategoryMarkup()}

        <div id="quickProductList" class="quick-product-list quick-product-list--desktop"></div>
        <button id="mobileCheckoutButton" class="primary-button mobile-checkout-button" type="button" data-i18n="scrollToCheckoutButton">View checkout</button>

        <form id="orderForm" class="hidden">
          <input id="productQty" type="number" min="1" value="1">
          <input id="productPrice" type="number" min="0" step="0.01" value="">
        </form>
      </article>

      <aside class="panel panel--checkout">
        <div class="checkout-head">
          <div>
            <p class="eyebrow">Checkout</p>
            <h3 data-i18n="cartHeading">Cart</h3>
          </div>
          <span id="cartCount">0 items</span>
        </div>

        <div class="customer-box">
          <button id="customerToggleButton" class="ghost-button customer-box__toggle" type="button" data-i18n="customerToggle">Add customer info</button>
          <div id="customerFields" class="customer-box__fields hidden">
            <label>
              <span data-i18n="buyerNameLabel">Buyer name</span>
              <input id="buyerName" type="text" data-i18n-placeholder="buyerNamePlaceholder" placeholder="Customer name">
            </label>
            <label>
              <span data-i18n="buyerPhoneLabel">Buyer phone</span>
              <input id="buyerPhone" type="tel" inputmode="tel" data-i18n-placeholder="buyerPhonePlaceholder" placeholder="012 345 678">
            </label>
          </div>
          <div id="retailMemberCard" class="member-card hidden">
            <div>
              <strong id="retailMemberName">Guest</strong>
              <div id="retailMemberPhone" class="meta-line">-</div>
            </div>
            <div class="member-card__meta">
              <span id="retailMemberPoints" class="tag">0 pts</span>
              <span id="retailMemberCredit" class="tag">$0.00</span>
            </div>
          </div>
        </div>

        <div id="cartList" class="stack-list checkout-cart-list"></div>

        <div class="checkout-totals">
          <div class="retail-checkout-fields">
            <label>
              <span data-i18n="subtotalDiscountLabel">Subtotal discount</span>
              <input id="retailSubtotalDiscountInput" type="number" min="0" step="0.01" value="0">
            </label>
            <label>
              <span data-i18n="taxRateLabel">Tax rate (%)</span>
              <input id="retailTaxRateInput" type="number" min="0" step="0.01" value="0">
            </label>
            <label>
              <span data-i18n="storeCreditApplyLabel">Store credit</span>
              <input id="retailStoreCreditInput" type="number" min="0" step="0.01" value="0">
            </label>
          </div>
          <div class="checkout-line">
            <span data-i18n="subtotalLabel">Subtotal</span>
            <strong id="cartSubtotal">$0.00</strong>
          </div>
          <div class="checkout-line checkout-line--muted">
            <span data-i18n="itemDiscountLabel">Item discount</span>
            <span id="cartItemDiscount">$0.00</span>
          </div>
          <div class="checkout-line checkout-line--muted">
            <span data-i18n="subtotalDiscountLabel">Subtotal discount</span>
            <span id="cartSubtotalDiscount">$0.00</span>
          </div>
          <div class="checkout-line checkout-line--muted">
            <span data-i18n="taxLabel">Tax</span>
            <span id="cartTax">$0.00</span>
          </div>
          <div class="checkout-line checkout-line--muted">
            <span data-i18n="storeCreditApplyLabel">Store credit</span>
            <span id="cartStoreCredit">$0.00</span>
          </div>
          <div class="checkout-line checkout-line--grand">
            <span data-i18n="totalLabel">Total</span>
            <strong id="cartTotal">$0.00</strong>
          </div>
        </div>

        <div class="checkout-actions">
          <button id="checkoutButton" class="primary-button primary-button--full" type="button" data-i18n="checkoutButton">Close sale</button>
        </div>
      </aside>
    </div>
  `;
}

function syncPosElementReferences() {
  elements.customerToggleButton = document.getElementById("customerToggleButton");
  elements.customerFields = document.getElementById("customerFields");
  elements.orderForm = document.getElementById("orderForm");
  elements.buyerName = document.getElementById("buyerName");
  elements.buyerPhone = document.getElementById("buyerPhone");
  elements.retailMemberCard = document.getElementById("retailMemberCard");
  elements.retailMemberName = document.getElementById("retailMemberName");
  elements.retailMemberPhone = document.getElementById("retailMemberPhone");
  elements.retailMemberPoints = document.getElementById("retailMemberPoints");
  elements.retailMemberCredit = document.getElementById("retailMemberCredit");
  elements.productSearch = document.getElementById("productSearch");
  elements.productSuggestions = document.getElementById("productSuggestions");
  elements.quickProductList = document.getElementById("quickProductList");
  elements.categoryChips = [...document.querySelectorAll("[data-product-filter]")];
  elements.productQty = document.getElementById("productQty");
  elements.productPrice = document.getElementById("productPrice");
  elements.clearCartButton = document.getElementById("clearCartButton");
  elements.cartList = document.getElementById("cartList");
  elements.cartCount = document.getElementById("cartCount");
  elements.orderFee = document.getElementById("orderFee");
  elements.retailSubtotalDiscountInput = document.getElementById("retailSubtotalDiscountInput");
  elements.retailTaxRateInput = document.getElementById("retailTaxRateInput");
  elements.retailStoreCreditInput = document.getElementById("retailStoreCreditInput");
  elements.cartSubtotal = document.getElementById("cartSubtotal");
  elements.cartItemDiscount = document.getElementById("cartItemDiscount");
  elements.cartSubtotalDiscount = document.getElementById("cartSubtotalDiscount");
  elements.cartTax = document.getElementById("cartTax");
  elements.cartStoreCredit = document.getElementById("cartStoreCredit");
  elements.cartTotal = document.getElementById("cartTotal");
  elements.checkoutButton = document.getElementById("checkoutButton");
  elements.mobileCheckoutButton = document.getElementById("mobileCheckoutButton");
  elements.posShopProfileImage = document.getElementById("posShopProfileImage");
  elements.posShopBusinessName = document.getElementById("posShopBusinessName");
  elements.posShopBusinessDescription = document.getElementById("posShopBusinessDescription");
  elements.currentSystemBadge = document.getElementById("currentSystemBadge");
}

function bindPosEvents() {
  elements.customerToggleButton?.addEventListener("click", () => {
    state.customerExpanded = !state.customerExpanded;
    renderAll();
  });
  elements.buyerName?.addEventListener("input", (event) => {
    state.currentBuyer = event.target.value.trim();
    renderCart();
  });
  elements.buyerPhone?.addEventListener("input", (event) => {
    state.currentPhone = event.target.value.trim();
    renderCart();
  });
  elements.productSearch?.addEventListener("input", () => {
    state.productSearchQuery = elements.productSearch.value.trim();
    const product = currentProductBySearch(elements.productSearch.value);
    if (product) {
      if (elements.productPrice) elements.productPrice.value = product.price;
      if (elements.productQty) elements.productQty.value = 1;
    }
    renderProducts();
  });
  elements.productSearch?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const product = currentProductBySearch(elements.productSearch.value);
    if (!product) return;
    event.preventDefault();
    openItemCustomizer(product);
  });
  [elements.retailSubtotalDiscountInput, elements.retailTaxRateInput, elements.retailStoreCreditInput, elements.orderFee].forEach((input) => {
    input?.addEventListener("input", () => renderCart());
  });
  elements.categoryChips.forEach((button) => {
    button.addEventListener("click", () => {
      state.productFilter = button.dataset.productFilter;
      renderProducts();
    });
  });
  elements.quickProductList?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-quick-product-id]");
    if (!target) return;
    const product = state.products.find((item) => item.id === target.dataset.quickProductId);
    if (!product) return;
    openItemCustomizer(product);
  });
  elements.mobileCheckoutButton?.addEventListener("click", () => {
    document.querySelector(".panel--checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  elements.cartList?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-cart-id]");
    if (!target) return;
    const item = state.cart.find((entry) => entry.id === target.dataset.cartId);
    if (!item) return;
    if (target.dataset.cartAction === "increase") item.qty += 1;
    if (target.dataset.cartAction === "decrease") item.qty = Math.max(1, item.qty - 1);
    if (target.dataset.cartAction === "remove") {
      state.cart = state.cart.filter((entry) => entry.id !== item.id);
    }
    renderAll();
  });
  elements.clearCartButton?.addEventListener("click", () => {
    state.cart = [];
    renderAll();
  });
  elements.checkoutButton?.addEventListener("click", async () => {
    if (!state.cart.length || !state.profile) return;
    const pricing = retailPricingSummary();
    const payload = {
      shopId: state.profile.shop_id || state.profile.shopId,
      invoiceNo: nextInvoiceNumber(),
      buyerName: state.currentBuyer,
      buyerPhone: state.currentPhone,
      items: state.cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price,
        options: item.options || {},
        discount: item.discount || 0,
        sku: item.sku || "",
        barcode: item.barcode || ""
      })),
      subtotal: pricing.subtotal,
      fee: pricing.fee,
      total: pricing.total,
      subtotalDiscount: pricing.subtotalDiscount,
      tax: pricing.tax,
      storeCreditUsed: pricing.storeCreditUsed
    };
    openPayment(payload);
  });
}

function ensurePosScreenMarkup() {
  const targetType = currentShopType();
  if (!elements.screens.pos) return;
  if (state.posMarkupType === targetType && elements.productSearch) return;
  elements.screens.pos.innerHTML = targetType === "retail" ? retailPosMarkup() : fnbPosMarkup();
  state.posMarkupType = targetType;
  syncPosElementReferences();
  bindPosEvents();
}

function canAccessRoute(route) {
  if (isPlatformAdminProfile()) return adminRoutesForCurrentShell().includes(route);
  const role = currentRole();
  if (role === "owner") return ownerRoutesForCurrentShell().includes(route);
  if (role === "staff") return staffRoutesForCurrentShell().includes(route);
  if (role === "cashier") return cashierRoutesForCurrentShell().includes(route);
  return ["pos", "help"].includes(route);
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
    admin: t("navAdmin"),
    help: t("navHelp"),
    adminChooser: t("adminChooserHeading")
  }[route] || "nilaa-os";
}

function configureBottomNav() {
  if (!elements.bottomNavButtons?.length) return;
  const items = isRetailShop()
    ? [
        { route: "pos", label: t("navPOS") },
        { route: "stock", label: t("navStock") },
        { route: "orders", label: t("navOrdersShort") },
        { route: "customers", label: t("navCustomers") },
        { route: "settings", label: t("navSettingsShort") }
      ]
    : [
        { route: "pos", label: t("navPOS") },
        { route: "orders", label: t("navOrdersShort") },
        { route: "stock", label: t("navStock") },
        { route: "money", label: t("navMoney") },
        { route: "settings", label: t("navSettingsShort") }
      ];
  elements.bottomNavButtons.forEach((button, index) => {
    const item = items[index];
    if (!button || !item) return;
    button.dataset.route = item.route;
    button.textContent = item.label;
    button.classList.toggle("hidden", !canAccessRoute(item.route));
  });
}

function updateShellVisibility() {
  const shellType = currentShellType();
  document.body.classList.toggle("shop-type-retail", shellType === "retail");
  document.body.classList.toggle("shop-type-fnb", shellType === "fnb");
  document.body.classList.toggle("platform-admin-mode", isPlatformAdminProfile());
  document.body.classList.toggle("platform-admin-chooser", isPlatformAdminProfile() && state.platformAdminView === "adminChooser");
  document.querySelectorAll("[data-platform-admin='true']").forEach((node) => {
    node.classList.toggle("hidden", !isPlatformAdminProfile());
  });
  document.querySelectorAll("[data-shell-nav]").forEach((node) => {
    node.classList.toggle("hidden", node.dataset.shellNav !== shellType);
  });
  document.querySelectorAll("[data-admin-nav]").forEach((node) => {
    node.classList.toggle("hidden", !isPlatformAdminProfile() || state.platformAdminView === "adminChooser");
  });
  document.querySelectorAll("[data-shell]").forEach((node) => {
    if (node.classList.contains("screen")) return;
    const shell = node.dataset.shell;
    const hidden = shell === "retail" ? shellType !== "retail" : shell === "fnb" ? shellType !== "fnb" : false;
    node.classList.toggle("hidden", hidden);
  });
  if (elements.platformAdminSwitcher) {
    elements.platformAdminSwitcher.classList.toggle("hidden", !isPlatformAdminProfile());
  }
  elements.adminSystemButtons?.forEach((button) => {
    button.classList.toggle("tab-button--active", button.dataset.adminSystem === state.platformAdminView);
  });
  document.querySelectorAll("[data-owner-only]").forEach((node) => {
    node.classList.toggle("hidden", !canManageUsers());
  });
  elements.nonStaffFields.forEach((node) => {
    node.classList.toggle("hidden", !canEditProductMeta());
  });
  document.querySelectorAll("[data-route='settings']").forEach((node) => {
    node.classList.toggle("hidden", !canManageSettings());
  });
  elements.navButtons.forEach((node) => {
    if (!node.dataset.route) return;
    node.classList.toggle("hidden", !canAccessRoute(node.dataset.route));
  });
  configureBottomNav();
  if (isPlatformAdminProfile()) {
    elements.bottomNavButtons?.forEach((button) => button?.classList.add("hidden"));
  }
  if (elements.openDashboardButton) {
    const targetRoute = isRetailShop() ? "stock" : "reports";
    elements.openDashboardButton.dataset.route = targetRoute;
    elements.openDashboardButton.classList.toggle("hidden", isPlatformAdminProfile() || !canAccessRoute(targetRoute));
  }
  if (elements.adminShopType) {
    const shopType = elements.adminShopType.value || "fnb";
    elements.adminShopTypeFnb?.classList.toggle("shop-type-picker__button--active", shopType === "fnb");
    elements.adminShopTypeRetail?.classList.toggle("shop-type-picker__button--active", shopType === "retail");
  }
}

function setRoute(route) {
  if (!canAccessRoute(route)) route = defaultRouteForCurrentUser();
  if (isPlatformAdminProfile()) {
    if (route === "admin") state.platformAdminView = "admin";
    if (route === "adminChooser") state.platformAdminView = "adminChooser";
  }
  state.route = route;
  document.body.classList.toggle("route-admin-chooser", route === "adminChooser");
  Object.entries(elements.screens).forEach(([key, screen]) => {
    screen.classList.toggle("hidden", key !== route);
  });
  updateShellVisibility();
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
  updateShellVisibility();
  if (!canAccessRoute(state.route)) setRoute(defaultRouteForCurrentUser());
}

function renderCart() {
  const pricing = retailPricingSummary();
  const itemCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  elements.cartCount.textContent = `${itemCount} ${t("itemUnit")}`;
  elements.cartSubtotal.textContent = money(pricing.subtotal);
  if (elements.cartItemDiscount) elements.cartItemDiscount.textContent = money(pricing.itemDiscount);
  if (elements.cartSubtotalDiscount) elements.cartSubtotalDiscount.textContent = money(pricing.subtotalDiscount);
  if (elements.cartTax) elements.cartTax.textContent = money(pricing.tax);
  if (elements.cartStoreCredit) elements.cartStoreCredit.textContent = money(pricing.storeCreditUsed);
  elements.cartTotal.textContent = money(pricing.total);
  if (elements.mobileCheckoutButton) {
    elements.mobileCheckoutButton.textContent = `${t("scrollToCheckoutButton")} • ${itemCount} • ${money(pricing.total)}`;
    elements.mobileCheckoutButton.classList.toggle("hidden", state.cart.length === 0);
  }
  if (elements.retailMemberCard) {
    const member = pricing.member;
    elements.retailMemberCard.classList.toggle("hidden", !isRetailShop() || !member);
    if (member) {
      elements.retailMemberName.textContent = member.name || t("guestBuyer");
      elements.retailMemberPhone.textContent = member.phone || "-";
      elements.retailMemberPoints.textContent = t("retailPointsTag", { points: Number(member.loyalty_points || 0) });
      elements.retailMemberCredit.textContent = t("retailStoreCreditTag", { amount: money(member.store_credit_balance || 0) });
    }
  }

  elements.cartList.innerHTML = state.cart.length
    ? state.cart.map((item) => `
        <article class="cart-row">
          <div class="cart-row__media">
            ${productImageMarkup(item, "small")}
            <div>
              <strong>${safeText(item.name)}</strong>
              ${itemOptionsMarkup(item)}
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
  if (elements.productSearch) {
    elements.productSearch.placeholder = isRetailShop() ? t("retailPosHint") : t("productSearchPlaceholder");
  }
  elements.productSuggestions.innerHTML = state.products
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "km"))
    .flatMap((product) => {
      const suggestions = [product.name];
      if (isRetailShop()) {
        if (product.sku) suggestions.push(product.sku);
        if (product.barcode) suggestions.push(product.barcode);
      }
      return suggestions.map((value) => `<option value="${safeText(value)}"></option>`);
    })
    .join("");
  elements.categoryChips.forEach((button) => {
    button.classList.toggle("category-chip--active", button.dataset.productFilter === state.productFilter);
  });
  const query = state.productSearchQuery.trim().toLowerCase();
  const filteredProducts = state.products
    .filter((product, index) => {
      const left = effectiveStock(product);
      const lowAt = Number(product.low_stock_at ?? product.lowStockAt ?? 0);
      if (state.productFilter === "popular" && !(Boolean(product.is_popular) || index < 8)) return false;
      if (state.productFilter === "low" && !(left <= lowAt)) return false;
      if (!query) return true;
      return [
        product.name,
        product.sku,
        product.barcode,
        product.brand,
        product.supplier
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (!query) return a.name.localeCompare(b.name, "km");
      const aExact = a.name.toLowerCase() === query ? 1 : 0;
      const bExact = b.name.toLowerCase() === query ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      const aStarts = a.name.toLowerCase().startsWith(query) ? 1 : 0;
      const bStarts = b.name.toLowerCase().startsWith(query) ? 1 : 0;
      if (aStarts !== bStarts) return bStarts - aStarts;
      return a.name.localeCompare(b.name, "km");
    });
  elements.quickProductList.innerHTML = filteredProducts.length
    ? filteredProducts.map((product) => {
        const left = effectiveStock(product);
        const options = productOptionState(product);
        const optionCount = Object.values(options).filter(Boolean).length;
        const category = categoryById(product.category_id || product.categoryId);
        const retailMeta = isRetailShop()
          ? [product.brand, product.sku || product.barcode].filter(Boolean).join(" • ")
          : "";
        return `
          <button class="quick-product" type="button" data-quick-product-id="${product.id}" ${left <= 0 ? "disabled" : ""}>
            ${productImageMarkup(product)}
            <strong>${safeText(product.name)}</strong>
            ${category ? `<small>${safeText(category.name)}</small>` : ""}
            ${retailMeta ? `<small>${safeText(retailMeta)}</small>` : ""}
            <span>${money(product.price)} • ${left}</span>
            <span class="quick-product__hint">${safeText(optionCount ? t("optionsCountLabel", { count: optionCount }) : t("tapToAdd"))}</span>
          </button>
        `;
      }).join("")
    : blankState(t("noProducts"));

  elements.productList.innerHTML = filteredProducts.length
    ? filteredProducts.map((product) => {
        const left = effectiveStock(product);
        const lowAt = Number(product.low_stock_at ?? product.lowStockAt ?? 0);
        const isLow = left <= lowAt;
        const options = productOptionState(product);
        const category = categoryById(product.category_id || product.categoryId);
        const enabledList = [
          category?.name ? category.name : "",
          isRetailShop() && product.brand ? product.brand : "",
          isRetailShop() && (product.sku || product.barcode) ? (product.sku || product.barcode) : "",
          options.size ? t("productEnableSize") : "",
          options.sugar ? t("productEnableSugar") : "",
          options.ice ? t("productEnableIce") : "",
          options.coffee ? t("productEnableCoffee") : "",
          options.toppings ? t("productEnableToppings") : ""
        ].filter(Boolean);
        return `
          <article class="product-row">
            <div class="product-row__media">
              ${productImageMarkup(product)}
              <div>
                <strong>${safeText(product.name)}</strong>
                <div class="meta-line">${t("productMeta", { price: money(product.price), left })}</div>
                ${enabledList.length ? `<div class="meta-line">${safeText(enabledList.join(" • "))}</div>` : ""}
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
  const query = state.ordersSearchQuery.trim().toLowerCase();
  const filteredOrders = state.orders
    .slice()
    .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
    .filter((order) => {
      if (!query) return true;
      const haystack = [
        order.invoice_no || order.invoiceNo,
        order.buyer_name || order.buyerName,
        order.buyer_phone || order.buyerPhone,
        orderSummary(order)
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  const buyerCount = new Set(filteredOrders.map((order) => (order.buyer_phone || order.buyerPhone || order.buyer_name || order.buyerName || order.id))).size;
  const salesTotal = filteredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  elements.ordersPageCount.textContent = filteredOrders.length;
  if (elements.ordersPageCountSummary) elements.ordersPageCountSummary.textContent = filteredOrders.length;
  if (elements.ordersSalesTotal) elements.ordersSalesTotal.textContent = money(salesTotal);
  if (elements.ordersCustomerCount) elements.ordersCustomerCount.textContent = buyerCount;
  elements.ordersHistoryList.innerHTML = filteredOrders.length
    ? filteredOrders.map((order) => `
        <article class="record-row">
          <div>
            <strong>${safeText(order.invoice_no || order.invoiceNo)}</strong>
            <div class="meta-line">${safeText(order.buyer_name || order.buyerName || t("guestBuyer"))}</div>
            <div class="meta-line">${safeText(order.payment_method || "cash")} • ${safeText(formatDateTime(order.created_at || order.createdAt))}</div>
            <div class="meta-line">${safeText(orderSummary(order))}</div>
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
  const recentOrders = state.orders
    .slice()
    .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
    .slice(0, 6);
  const salesTotal = state.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  elements.reportOrderCount.textContent = state.orders.length;
  elements.reportItemCount.textContent = itemCount;
  elements.reportLowStockCount.textContent = lowStock.length;
  if (elements.reportSalesTotal) elements.reportSalesTotal.textContent = money(salesTotal);
  elements.orderCount.textContent = recentOrders.length;
  elements.lowStockLabel.textContent = lowStock.length;
  elements.orderList.innerHTML = recentOrders.length
    ? recentOrders.map((order) => {
        const firstItem = order.items?.[0];
        const previewProduct = firstItem ? state.products.find((item) => item.id === firstItem.productId) : null;
        return `
        <article class="record-row">
          <div class="product-row__media">
            ${productImageMarkup(previewProduct, "small")}
            <div>
              <strong>${safeText(order.invoice_no || order.invoiceNo)}</strong>
              <div class="meta-line">${safeText(t("orderMeta", { buyer: order.buyer_name || order.buyerName || t("guestBuyer"), summary: orderSummary(order) }))}</div>
              <div class="meta-line">${safeText(order.payment_method || "cash")} • ${safeText(formatDateTime(order.created_at || order.createdAt))}</div>
            </div>
          </div>
          <div class="record-actions">
            <strong>${money(order.total)}</strong>
            <div class="record-actions__buttons">
              <button class="secondary-button" type="button" data-open-receipt-id="${order.id}">${t("receiptTitle")}</button>
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
  const query = String(state.customerSearchQuery || "").trim().toLowerCase();
  const buyers = aggregatedCustomers().filter((customer) =>
    !query || [customer.name, customer.phone, customer.member_code].filter(Boolean).some((value) => String(value).toLowerCase().includes(query))
  );
  elements.customerCount.textContent = buyers.length;
  if (elements.customerMemberCount) elements.customerMemberCount.textContent = buyers.length;
  if (elements.customerSpendSummary) {
    elements.customerSpendSummary.textContent = money(buyers.reduce((sum, customer) => sum + Number(customer.totalSpent || 0), 0));
  }
  elements.customerList.innerHTML = buyers.length
    ? buyers.map((customer) => `
        <article class="record-row">
          <div>
            <strong>${safeText(customer.name || t("guestBuyer"))}</strong>
            <div class="meta-line">${safeText(customer.phone || customer.member_code || "-")}</div>
            ${isRetailShop() ? `<div class="meta-line">${safeText(t("retailCustomerMeta", { count: customer.visits || 0, amount: money(customer.totalSpent || 0) }))}</div>` : ""}
          </div>
          <div>
            <strong>${money(customer.totalSpent || 0)}</strong>
            <div class="meta-line">${safeText(formatDateTime(customer.lastOrderAt))}</div>
          </div>
        </article>
      `).join("")
    : blankState(t("noCustomers"));
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

function renderAdminScreen() {
  if (!isPlatformAdminProfile()) return;
  elements.adminShopCount.textContent = state.platformData.shops.length;
  elements.adminUserCount.textContent = state.platformData.users.length;
  elements.adminSchemaStatus.textContent = Object.values(state.capabilities || {}).every(Boolean) ? "Ready" : "Setup";
  elements.adminShopListCount.textContent = state.platformData.shops.length;
  elements.adminUserListCount.textContent = state.platformData.users.length;
  elements.adminShopList.innerHTML = state.platformData.shops.length
    ? state.platformData.shops.map((shop) => `
        <article class="record-row">
          <div>
            <strong>${safeText(shop.name)}</strong>
            <div class="meta-line">${safeText([shop.shop_type || "fnb", shop.id].join(" • "))}</div>
          </div>
          <div><span class="tag">${safeText(shop.status || "active")}</span></div>
        </article>
      `).join("")
    : blankState(t("noShops"));
  elements.adminUserList.innerHTML = state.platformData.users.length
    ? state.platformData.users.map((user) => `
        <article class="record-row">
          <div>
            <strong>${safeText(user.username || user.email || "-")}</strong>
            <div class="meta-line">${safeText([user.role, user.shop_id || user.shopId, user.phone].filter(Boolean).join(" • "))}</div>
          </div>
        </article>
      `).join("")
    : blankState(t("noPlatformUsers"));
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
  const invoiceNo = order.invoice_no || order.invoiceNo;
  const itemDiscount = (order.items || []).reduce((sum, item) => sum + Number(item.discount || 0) * Number(item.qty || 0), 0);
  return {
    invoiceNo,
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
    logoUrl: settings.shop_logo_url || "",
    address: settings.receipt_address || "",
    contact: settings.receipt_contact || "",
    manager: settings.receipt_manager || state.profile?.username || "",
    note: settings.receipt_note || "",
    barcodeValue: `#${String(invoiceNo || "").replace(/[^0-9A-Za-z]/g, "").slice(-16) || "NILAAOS"}#`,
    cashier: state.profile?.username || "",
    itemDiscount,
    subtotalDiscount: Number(order.subtotal_discount || 0),
    tax: Number(order.tax || 0),
    storeCreditUsed: Number(order.store_credit_used || 0),
    shopType: currentShopType()
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
  if (elements.receiptCashier) elements.receiptCashier.textContent = state.latestReceipt.cashier || "-";
  if (elements.receiptPaymentMethod) elements.receiptPaymentMethod.textContent = state.latestReceipt.paymentMethod || "-";
  elements.receiptBuyer.textContent = state.latestReceipt.buyerName || t("guestBuyer");
  elements.receiptPhone.textContent = state.latestReceipt.buyerPhone || "-";
  elements.receiptBusinessDescription.textContent = state.latestReceipt.businessDescription || "";
  elements.receiptBusinessDescription.classList.toggle("hidden", !state.latestReceipt.businessDescription);
  elements.receiptAddress.textContent = state.latestReceipt.address || "";
  elements.receiptAddress.classList.toggle("hidden", !state.latestReceipt.address);
  elements.receiptContact.textContent = state.latestReceipt.contact || "";
  elements.receiptContact.classList.toggle("hidden", !state.latestReceipt.contact);
  elements.receiptManager.textContent = state.latestReceipt.manager || "";
  elements.receiptManager.classList.toggle("hidden", !state.latestReceipt.manager);
  elements.receiptDate.textContent = state.latestReceipt.createdAtText;
  elements.receiptInvoice.textContent = state.latestReceipt.invoiceNo;
  elements.receiptItems.innerHTML = state.latestReceipt.items.map((item) => `
      <div class="receipt-row">
        <span>${item.qty}</span>
        <span>${safeText(item.name)}${itemOptionsMarkup(item)}<small>${money(item.price)} x ${item.qty}${item.sku ? ` • ${safeText(item.sku)}` : ""}</small></span>
        <span>${money(item.qty * item.price)}</span>
      </div>
    `).join("");
  elements.receiptRetailSummary?.classList.toggle("hidden", !isRetailShop());
  if (elements.receiptItemDiscount) elements.receiptItemDiscount.textContent = money(state.latestReceipt.itemDiscount || 0);
  if (elements.receiptSubtotalDiscount) elements.receiptSubtotalDiscount.textContent = money(state.latestReceipt.subtotalDiscount || 0);
  if (elements.receiptTax) elements.receiptTax.textContent = money(state.latestReceipt.tax || 0);
  if (elements.receiptStoreCredit) elements.receiptStoreCredit.textContent = money(state.latestReceipt.storeCreditUsed || 0);
  elements.receiptSubtotal.textContent = money(state.latestReceipt.subtotal);
  elements.receiptFee.textContent = money(state.latestReceipt.fee);
  elements.receiptTotal.textContent = money(state.latestReceipt.total);
  elements.receiptNote.textContent = state.latestReceipt.note || "";
  elements.receiptNote.classList.toggle("hidden", !state.latestReceipt.note);
  elements.receiptBarcodeValue.textContent = state.latestReceipt.barcodeValue || "";
  elements.receiptBarcodeValue.classList.toggle("hidden", !state.latestReceipt.barcodeValue);
  elements.receiptFooterText.textContent = state.latestReceipt.receiptFooter || t("receiptThanks");
}

function renderAll() {
  ensurePosScreenMarkup();
  applyLanguage();
  renderAuth();
  if (!state.authUser || !state.profile) return;
  elements.buyerName.value = state.currentBuyer;
  elements.buyerPhone.value = state.currentPhone;
  if (elements.customerSearchInput) elements.customerSearchInput.value = state.customerSearchQuery;
  if (elements.retailTaxRateInput && document.activeElement !== elements.retailTaxRateInput) {
    elements.retailTaxRateInput.value = Number(elements.retailTaxRateInput.value || currentSettings().retail_tax_rate || 0);
  }
  elements.customerFields?.classList.toggle("hidden", !state.customerExpanded);
  renderCart();
  renderMoney();
  renderProducts();
  renderOrdersHistory();
  renderReports();
  renderCustomers();
  renderUsers();
  renderAdminScreen();
  renderSettings();
  renderCategories();
  renderReceipt();
  renderItemCustomizer();
  setRoute(state.route);
}

function closeReceipt() {
  state.latestReceipt = null;
  renderReceipt();
}

function openPayment(order) {
  const settings = currentSettings();
  const retailCustomer = currentRetailCustomer();
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
  elements.qrBox.querySelector("strong").textContent = settings.qr_image_url ? t("paymentBankLabel") : "Beta QR";
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
  [elements.payCardButton, elements.payBankButton, elements.paySplitButton].forEach((button) => {
    button?.classList.toggle("hidden", !isRetailShop());
  });
  elements.payStoreCreditButton?.classList.toggle("hidden", !isRetailShop() || Number(retailCustomer?.store_credit_balance || 0) <= 0);
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
      paymentMethod: method,
      subtotal_discount: state.pendingPaymentOrder.subtotalDiscount || 0,
      tax: state.pendingPaymentOrder.tax || 0,
      store_credit_used: state.pendingPaymentOrder.storeCreditUsed || 0
    };
    state.orders.unshift(receiptOrder);
    state.pendingPaymentOrder.items.forEach((item) => {
      const product = state.products.find((row) => row.id === item.productId);
      if (product) product.stock_qty = Math.max(0, Number(product.stock_qty || 0) - item.qty);
    });
    state.settings = { ...currentSettings(), order_counter: Number(currentSettings().order_counter || 1) + 1 };
    if (isRetailShop() && (receiptOrder.buyer_phone || receiptOrder.buyer_name)) {
      const phone = normalizePhone(receiptOrder.buyer_phone);
      const existingCustomer = state.customers.find((item) => normalizePhone(item.phone) === phone);
      if (existingCustomer) {
        existingCustomer.name = receiptOrder.buyer_name || existingCustomer.name;
        existingCustomer.last_order_at = new Date().toISOString();
        existingCustomer.loyalty_points = Number(existingCustomer.loyalty_points || 0) + Math.floor(Number(receiptOrder.total || 0));
        existingCustomer.store_credit_balance = Math.max(0, Number(existingCustomer.store_credit_balance || 0) - Number(receiptOrder.store_credit_used || 0));
      } else {
        state.customers.unshift({
          id: crypto.randomUUID(),
          shop_id: state.profile.shop_id || state.profile.shopId,
          name: receiptOrder.buyer_name || t("guestBuyer"),
          phone: receiptOrder.buyer_phone || "",
          member_code: "",
          store_credit_balance: 0,
          loyalty_points: Math.floor(Number(receiptOrder.total || 0)),
          last_order_at: new Date().toISOString()
        });
      }
    }
    state.cart = [];
    state.currentBuyer = "";
    state.currentPhone = "";
    elements.buyerName.value = "";
    elements.buyerPhone.value = "";
    elements.orderFee.value = "0";
    if (elements.retailSubtotalDiscountInput) elements.retailSubtotalDiscountInput.value = "0";
    if (elements.retailStoreCreditInput) elements.retailStoreCreditInput.value = "0";
    state.latestReceipt = buildReceipt(receiptOrder);
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

function fillSelectOptions(select, options) {
  if (!select) return;
  select.innerHTML = options.map((option) => `<option value="${safeText(option)}">${safeText(option)}</option>`).join("");
}

function renderItemCustomizer() {
  const product = state.pendingCustomizerProduct;
  if (!product) {
    elements.itemModal?.classList.add("hidden");
    return;
  }
  const config = currentOptionConfig();
  const enabled = productOptionState(product);
  elements.itemModalTitle.textContent = product.name;
  elements.itemModalPrice.textContent = money(product.price);
  const variantOptions = Array.isArray(product.variant_options)
    ? product.variant_options
    : String(product.variant_options || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const variantMeta = [
    product.brand,
    product.sku || product.barcode,
    product.color,
    product.size_label
  ].filter(Boolean).join(" • ");
  if (elements.itemModalMeta) {
    elements.itemModalMeta.textContent = variantMeta;
    elements.itemModalMeta.classList.toggle("hidden", !variantMeta);
  }
  fillSelectOptions(elements.itemVariant, variantOptions.length ? variantOptions : [product.color, product.size_label].filter(Boolean));
  elements.itemVariantLabel?.classList.toggle("hidden", !isRetailShop() || !(variantOptions.length || product.color || product.size_label));
  fillSelectOptions(elements.itemSize, config.sizes);
  fillSelectOptions(elements.itemSugar, config.sugar);
  fillSelectOptions(elements.itemIce, config.ice);
  fillSelectOptions(elements.itemCoffee, config.coffee);
  elements.itemSize.closest("label")?.classList.toggle("hidden", !enabled.size);
  elements.itemSugar.closest("label")?.classList.toggle("hidden", !enabled.sugar);
  elements.itemIce.closest("label")?.classList.toggle("hidden", !enabled.ice);
  elements.itemCoffee.closest("label")?.classList.toggle("hidden", !enabled.coffee);
  elements.itemToppings.innerHTML = config.toppings.length
    ? config.toppings.map((topping, index) => `
        <label class="option-check">
          <input type="checkbox" value="${safeText(topping)}" ${index === 0 ? "" : ""}>
          <span>${safeText(topping)}</span>
        </label>
      `).join("")
    : `<p class="meta-line">${safeText(state.language === "en" ? "No toppings configured yet." : "មិនទាន់មាន topping ទេ។")}</p>`;
  elements.itemToppings.closest("fieldset")?.classList.toggle("hidden", !enabled.toppings);
  elements.itemNote.value = "";
  elements.itemModal.classList.remove("hidden");
}

function openItemCustomizer(product) {
  state.pendingCustomizerProduct = product;
  renderItemCustomizer();
}

function closeItemCustomizer() {
  state.pendingCustomizerProduct = null;
  elements.itemModal?.classList.add("hidden");
}

function addCustomizedItemToCart() {
  const product = state.pendingCustomizerProduct;
  if (!product) return;
  const selectedToppings = [...elements.itemToppings.querySelectorAll("input:checked")].map((node) => node.value);
  const enabled = productOptionState(product);
  const options = {
    variant: !elements.itemVariantLabel?.classList.contains("hidden") ? elements.itemVariant.value : "",
    size: enabled.size ? elements.itemSize.value : "",
    sugar: enabled.sugar ? elements.itemSugar.value : "",
    ice: enabled.ice ? elements.itemIce.value : "",
    coffee: enabled.coffee ? elements.itemCoffee.value : "",
    toppings: enabled.toppings ? selectedToppings : [],
    note: elements.itemNote.value.trim()
  };
  state.cart.push({
    id: crypto.randomUUID(),
    productId: product.id,
    name: product.name,
    image_url: product.image_url || "",
    qty: 1,
    price: Number(product.price || 0),
    sku: product.sku || "",
    barcode: product.barcode || "",
    brand: product.brand || "",
    discount: Number(product.discount || 0),
    options
  });
  state.productSearchQuery = "";
  elements.productSearch.value = "";
  closeItemCustomizer();
  renderAll();
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
  return blob;
}

async function saveReceiptPdf() {
  const blob = await downloadReceiptAsPdf();
  const fileName = `receipt-${state.latestReceipt?.invoiceNo || Date.now()}.pdf`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function shareReceiptFile() {
  const blob = await downloadReceiptAsPdf();
  const fileName = `receipt-${state.latestReceipt?.invoiceNo || Date.now()}.pdf`;
  const file = new File([blob], fileName, { type: "application/pdf" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: fileName });
    return true;
  }
  return false;
}

function createMockBackend() {
  const listeners = new Set();
  const createCategorySeed = (shopId, name, shopType) => ({
    id: crypto.randomUUID(),
    shop_id: shopId,
    name,
    enable_size: shopType === "retail",
    enable_sugar: shopType !== "retail",
    enable_ice: shopType !== "retail",
    enable_coffee: shopType !== "retail",
    enable_toppings: false,
    created_at: new Date().toISOString()
  });
  const seed = () => ({
    sessionUserId: null,
    shops: [{ id: "shop-admin", name: "Nilaa Main Shop", shop_type: "fnb", status: "active", created_at: new Date().toISOString() }],
    settings: [{
      id: crypto.randomUUID(),
      shop_id: "shop-admin",
      business_name: "Nilaa Main Shop",
      business_description: "",
      payment_method: "both",
      qr_image_url: "",
      receipt_name: "nilaa-os",
      receipt_footer: "Thanks you bong! please come again.",
      shop_logo_url: "",
      receipt_address: "",
      receipt_contact: "",
      receipt_manager: "",
      receipt_note: "",
      option_sizes: "Small\nMedium\nLarge",
      option_sugar_levels: "0%\n50%\n100%",
      option_ice_levels: "No ice\nLess ice\nNormal ice",
      option_coffee_levels: "Light\nNormal\nStrong",
      option_toppings: "",
      order_counter: 1
    }],
    users: [],
    categories: [
      createCategorySeed("shop-admin", "Coffee", "fnb")
    ],
    products: [
      { id: crypto.randomUUID(), shop_id: "shop-admin", name: "កាហ្វេទឹកកក", price: 1.5, stock_qty: 20, low_stock_at: 5, category_id: null },
      { id: crypto.randomUUID(), shop_id: "shop-admin", name: "តែទឹកដោះគោ", price: 2, stock_qty: 15, low_stock_at: 5, category_id: null }
    ],
    expenses: [],
    orders: [],
    customers: []
  });
  const load = () => {
    const store = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || "null") || seed();
    store.shops = (store.shops || []).map((item) => ({ shop_type: "fnb", ...item }));
    store.categories ||= [];
    store.settings ||= [];
    store.products ||= [];
    store.customers ||= [];
    return store;
  };
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
      return user ? { id: user.id, username: user.username, email: user.email, phone: user.phone, role: user.role, shop_id: user.shop_id, status: user.status } : null;
    },
    async getShop(shopId) {
      const store = load();
      return store.shops.find((item) => item.id === shopId) || null;
    },
    async fetchDashboard(shopId, role) {
      const store = load();
      return {
        categories: store.categories.filter((item) => item.shop_id === shopId),
        products: store.products.filter((item) => item.shop_id === shopId),
        expenses: store.expenses.filter((item) => item.shop_id === shopId && item.date === todayKey()).reverse(),
        orders: store.orders.filter((item) => item.shop_id === shopId && item.date === todayKey()).reverse(),
        customers: (store.customers || []).filter((item) => item.shop_id === shopId),
        users: role === "admin" ? store.users : store.users.filter((item) => item.shop_id === shopId),
        settings: store.settings.find((item) => item.shop_id === shopId) || null,
        capabilities: { settings: true, payments: true, customers: true }
      };
    },
    async fetchPlatformData() {
      const store = load();
      return { shops: store.shops, users: store.users };
    },
    async saveProduct(shopId, payload) {
      const store = load();
      const existing = store.products.find((item) => item.shop_id === shopId && item.name.toLowerCase() === payload.name.toLowerCase());
      if (existing) {
        Object.assign(existing, payload);
        save(store);
        return existing;
      }
      const created = { id: crypto.randomUUID(), shop_id: shopId, ...payload };
      store.products.push(created);
      save(store);
      return created;
    },
    async saveCategory(shopId, payload) {
      const store = load();
      store.categories ||= [];
      const existing = store.categories.find((item) => item.shop_id === shopId && item.name.toLowerCase() === payload.name.toLowerCase());
      if (existing) Object.assign(existing, payload);
      else store.categories.push({ id: crypto.randomUUID(), shop_id: shopId, ...payload, created_at: new Date().toISOString() });
      save(store);
      return store.categories.find((item) => item.shop_id === shopId && item.name.toLowerCase() === payload.name.toLowerCase());
    },
    async deleteCategory(shopId, categoryId) {
      const store = load();
      store.categories = (store.categories || []).filter((item) => !(item.shop_id === shopId && item.id === categoryId));
      store.products = store.products.map((item) => item.category_id === categoryId ? { ...item, category_id: null } : item);
      save(store);
    },
    async deleteProduct(shopId, productId) {
      const store = load();
      store.products = store.products.filter((item) => !(item.shop_id === shopId && item.id === productId));
      save(store);
    },
    async createExpense(shopId, payload, profile) {
      const store = load();
      const expense = { id: crypto.randomUUID(), shop_id: shopId, note: payload.note, amount: payload.amount, created_by: profile.username, created_at: new Date().toISOString(), date: todayKey() };
      store.expenses.push(expense);
      save(store);
      return expense;
    },
    async deleteExpense(shopId, expenseId) {
      const store = load();
      store.expenses = store.expenses.filter((item) => !(item.shop_id === shopId && item.id === expenseId));
      save(store);
    },
    async saveCustomer(shopId, payload) {
      const store = load();
      store.customers ||= [];
      const normalizedPhone = normalizePhone(payload.phone);
      const existing = store.customers.find((item) => item.shop_id === shopId && normalizePhone(item.phone) === normalizedPhone);
      if (existing) {
        Object.assign(existing, payload, { updated_at: new Date().toISOString() });
        save(store);
        return existing;
      }
      const created = { id: crypto.randomUUID(), shop_id: shopId, ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      store.customers.push(created);
      save(store);
      return created;
    },
    async checkout(shopId, payload, profile) {
      const store = load();
      const settings = store.settings.find((item) => item.shop_id === shopId);
      const counter = Number(settings?.order_counter || 1);
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
        invoice_no: payload.invoiceNo || `#${counter}`,
        buyer_name: payload.buyerName,
        buyer_phone: payload.buyerPhone,
        payment_method: payload.paymentMethod,
        items: payload.items,
        subtotal: payload.subtotal,
        subtotal_discount: payload.subtotalDiscount || 0,
        tax: payload.tax || 0,
        store_credit_used: payload.storeCreditUsed || 0,
        fee: payload.fee,
        total: payload.total,
        status: "completed",
        created_by: profile.username,
        created_at: new Date().toISOString(),
        date: todayKey()
      };
      store.orders.push(order);
      if (payload.buyerPhone || payload.buyerName) {
        store.customers ||= [];
        const normalizedPhone = normalizePhone(payload.buyerPhone);
        let customer = store.customers.find((item) => item.shop_id === shopId && normalizePhone(item.phone) === normalizedPhone);
        if (!customer) {
          customer = {
            id: crypto.randomUUID(),
            shop_id: shopId,
            name: payload.buyerName,
            phone: payload.buyerPhone,
            member_code: "",
            store_credit_balance: 0,
            loyalty_points: 0,
            created_at: new Date().toISOString()
          };
          store.customers.push(customer);
        }
        customer.name = payload.buyerName || customer.name;
        customer.phone = payload.buyerPhone || customer.phone;
        customer.last_order_at = new Date().toISOString();
        customer.loyalty_points = Number(customer.loyalty_points || 0) + Math.floor(Number(payload.total || 0));
        if (payload.storeCreditUsed) {
          customer.store_credit_balance = Math.max(0, Number(customer.store_credit_balance || 0) - Number(payload.storeCreditUsed || 0));
        }
      }
      if (settings) settings.order_counter = counter + 1;
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
      if (!["owner", "business_owner", "admin"].includes(profile.role)) throw new Error("Only owner can create users.");
      const store = load();
      let shopId = profile.shop_id || profile.shopId;
      if (payload.scope === "platform") {
        shopId = crypto.randomUUID();
        const shopType = payload.shopType || "fnb";
        store.shops.push({ id: shopId, name: payload.shopName, shop_type: shopType, status: "active", created_at: new Date().toISOString() });
        store.settings.push({
          id: crypto.randomUUID(),
          shop_id: shopId,
          ...defaultSettingsForShopType(shopType),
          business_name: payload.shopName,
          receipt_name: payload.shopName || "nilaa-os"
        });
        const defaultCategories = shopType === "retail" ? retailDefaultCategories() : fnbDefaultCategories();
        store.categories.push(...defaultCategories.map((name) => createCategorySeed(shopId, name, shopType)));
      }
      const user = { id: crypto.randomUUID(), username: payload.username, email: payload.username, phone: payload.phone, password: payload.password, role: payload.role, shop_id: shopId, status: "active", created_at: new Date().toISOString() };
      store.users.push(user);
      save(store);
      return user;
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
      <div class="divider"></div>${receipt.items.map((item) => `<div class="row"><span>${item.qty}</span><span>${safeText(item.name)}${safeText(itemOptionsInlineText(item))}</span><span>${money(item.qty * item.price)}</span></div>`).join("")}
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
      const [categoriesRes, productsRes, expensesRes, ordersRes, usersRes, settingsRes, customersRes] = await Promise.all([
        supabase.from("categories").select("*").eq("shop_id", shopId).order("name"),
        supabase.from("products").select("*").eq("shop_id", shopId).order("name"),
        supabase.from("expenses").select("*").eq("shop_id", shopId).eq("date", todayKey()).order("created_at", { ascending: false }),
        supabase.from("orders").select("*").eq("shop_id", shopId).eq("date", todayKey()).order("created_at", { ascending: false }),
        role === "admin"
          ? supabase.from("users").select("*").order("created_at", { ascending: false })
          : supabase.from("users").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }),
        capabilities.settings
          ? supabase.from("settings").select("*").eq("shop_id", shopId).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        capabilities.customers
          ? supabase.from("customers").select("*").eq("shop_id", shopId).order("last_order_at", { ascending: false })
          : Promise.resolve({ data: [], error: null })
      ]);

      for (const result of [categoriesRes, productsRes, expensesRes, ordersRes, usersRes, customersRes]) {
        if (result.error) throw result.error;
      }

      return {
        categories: categoriesRes.data || [],
        products: productsRes.data || [],
        expenses: expensesRes.data || [],
        orders: (ordersRes.data || []).map((row) => ({ ...row, items: row.items || [] })),
        customers: customersRes.data || [],
        users: usersRes.data || [],
        settings: settingsRes.error ? null : settingsRes.data || null,
        capabilities
      };
    },
    async fetchPlatformData() {
      const [shopsRes, usersRes] = await Promise.all([
        supabase.from("shops").select("*").order("created_at", { ascending: false }),
        supabase.from("users").select("*").order("created_at", { ascending: false })
      ]);
      if (shopsRes.error) throw shopsRes.error;
      if (usersRes.error) throw usersRes.error;
      return { shops: shopsRes.data || [], users: usersRes.data || [] };
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
        let { data, error } = await supabase.from("products").update(payload).eq("id", existing.id).select("*").single();
        if (error && columnMissing(error)) {
          const {
            image_url: _imageUrl,
            category_id: _categoryId,
            sort_order: _sortOrder,
            is_popular: _isPopular,
            cost_price: _costPrice,
            barcode: _barcode,
            sku: _sku,
            brand: _brand,
            supplier: _supplier,
            color: _color,
            size_label: _sizeLabel,
            discount: _discount,
            variant_options: _variantOptions,
            enable_size: _enableSize,
            enable_sugar: _enableSugar,
            enable_ice: _enableIce,
            enable_coffee: _enableCoffee,
            enable_toppings: _enableToppings,
            ...legacyPayload
          } = payload;
          const fallback = await supabase.from("products").update(legacyPayload).eq("id", existing.id).select("*").single();
          data = fallback.data;
          error = fallback.error;
        }
        if (error) throw error;
        return data;
      } else {
        let { data, error } = await supabase.from("products").insert({ shop_id: shopId, ...payload }).select("*").single();
        if (error && columnMissing(error)) {
          const {
            image_url: _imageUrl,
            category_id: _categoryId,
            sort_order: _sortOrder,
            is_popular: _isPopular,
            cost_price: _costPrice,
            barcode: _barcode,
            sku: _sku,
            brand: _brand,
            supplier: _supplier,
            color: _color,
            size_label: _sizeLabel,
            discount: _discount,
            variant_options: _variantOptions,
            enable_size: _enableSize,
            enable_sugar: _enableSugar,
            enable_ice: _enableIce,
            enable_coffee: _enableCoffee,
            enable_toppings: _enableToppings,
            ...legacyPayload
          } = payload;
          const fallback = await supabase.from("products").insert({ shop_id: shopId, ...legacyPayload }).select("*").single();
          data = fallback.data;
          error = fallback.error;
        }
        if (error) throw error;
        return data;
      }
    },
    async saveCategory(shopId, payload) {
      const { data: existing, error: checkError } = await supabase
        .from("categories")
        .select("id")
        .eq("shop_id", shopId)
        .eq("name", payload.name)
        .maybeSingle();
      if (checkError) throw checkError;
      if (existing) {
        const { error } = await supabase.from("categories").update(payload).eq("id", existing.id);
        if (error) throw error;
        return { id: existing.id, shop_id: shopId, ...payload };
      }
      const { data, error } = await supabase
        .from("categories")
        .insert({ shop_id: shopId, ...payload })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    async deleteCategory(shopId, categoryId) {
      const { error: clearError } = await supabase
        .from("products")
        .update({ category_id: null })
        .eq("shop_id", shopId)
        .eq("category_id", categoryId);
      if (clearError) throw clearError;
      const { error } = await supabase.from("categories").delete().eq("shop_id", shopId).eq("id", categoryId);
      if (error) throw error;
    },
    async deleteProduct(_shopId, productId) {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    },
    async createExpense(shopId, payload, profile) {
      const { data, error } = await supabase.from("expenses").insert({
        shop_id: shopId,
        note: payload.note,
        amount: payload.amount,
        created_by: profile.username,
        created_at: new Date().toISOString(),
        date: todayKey()
      }).select("*").single();
      if (error) throw error;
      return data;
    },
    async deleteExpense(_shopId, expenseId) {
      const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
      if (error) throw error;
    },
    async saveCustomer(shopId, payload) {
      const { data: existing, error: lookupError } = await supabase
        .from("customers")
        .select("id")
        .eq("shop_id", shopId)
        .eq("phone", payload.phone)
        .maybeSingle();
      if (lookupError && !relationMissing(lookupError)) throw lookupError;
      const customerRecord = {
        shop_id: shopId,
        name: payload.name,
        phone: payload.phone,
        member_code: payload.member_code,
        store_credit_balance: payload.store_credit_balance,
        loyalty_points: payload.loyalty_points,
        last_order_at: payload.last_order_at || null
      };
      if (existing?.id) {
        let { data, error } = await supabase.from("customers").update(customerRecord).eq("id", existing.id).select("*").single();
        if (error && columnMissing(error)) {
          const { member_code: _memberCode, store_credit_balance: _credit, loyalty_points: _points, ...legacyCustomerRecord } = customerRecord;
          const fallback = await supabase.from("customers").update(legacyCustomerRecord).eq("id", existing.id).select("*").single();
          data = fallback.data;
          error = fallback.error;
        }
        if (error) throw error;
        return data;
      }
      let { data, error } = await supabase.from("customers").insert(customerRecord).select("*").single();
      if (error && columnMissing(error)) {
        const { member_code: _memberCode, store_credit_balance: _credit, loyalty_points: _points, ...legacyCustomerRecord } = customerRecord;
        const fallback = await supabase.from("customers").insert(legacyCustomerRecord).select("*").single();
        data = fallback.data;
        error = fallback.error;
      }
      if (error) throw error;
      return data;
    },
    async checkout(shopId, payload, profile) {
      const settingsAvailable = await detectTable("settings");
      let nextCounter = 1;
      if (settingsAvailable) {
        const { data: settingsRow } = await supabase.from("settings").select("order_counter").eq("shop_id", shopId).maybeSingle();
        nextCounter = Number(settingsRow?.order_counter || 1);
      }
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
        invoice_no: payload.invoiceNo || payload.invoice_no || `#${nextCounter}`,
        buyer_name: payload.buyerName,
        buyer_phone: payload.buyerPhone,
        payment_method: payload.paymentMethod,
        items: payload.items,
        subtotal: payload.subtotal,
        subtotal_discount: payload.subtotalDiscount,
        tax: payload.tax,
        store_credit_used: payload.storeCreditUsed,
        fee: payload.fee,
        total: payload.total,
        status: "completed",
        created_by: profile.username,
        created_at: new Date().toISOString(),
        date: todayKey()
      };

      let { data, error } = await supabase.from("orders").insert(orderRecord).select("*").single();
      if (error && columnMissing(error)) {
        const {
          buyer_phone: _buyerPhone,
          payment_method: _paymentMethod,
          subtotal_discount: _subtotalDiscount,
          tax: _tax,
          store_credit_used: _storeCreditUsed,
          ...legacyOrderRecord
        } = orderRecord;
        const legacyResult = await supabase.from("orders").insert(legacyOrderRecord).select("*").single();
        data = legacyResult.data;
        error = legacyResult.error;
      }
      if (error) throw error;
      if (payload.buyerName || payload.buyerPhone) {
        const customersAvailable = await detectTable("customers");
        const { data: existingCustomer } = customersAvailable
          ? await supabase.from("customers").select("*").eq("shop_id", shopId).eq("phone", payload.buyerPhone).maybeSingle()
          : { data: null };
        let customerInsert = await supabase.from("customers").upsert({
          ...(existingCustomer?.id ? { id: existingCustomer.id } : {}),
          shop_id: shopId,
          name: payload.buyerName,
          phone: payload.buyerPhone,
          member_code: existingCustomer?.member_code || null,
          store_credit_balance: Math.max(0, Number(existingCustomer?.store_credit_balance || 0) - Number(payload.storeCreditUsed || 0)),
          loyalty_points: Number(existingCustomer?.loyalty_points || 0) + Math.floor(Number(payload.total || 0)),
          last_order_at: new Date().toISOString()
        }, { onConflict: "id" });
        if (customerInsert.error && columnMissing(customerInsert.error)) {
          customerInsert = await supabase.from("customers").upsert({
            shop_id: shopId,
            name: payload.buyerName,
            phone: payload.buyerPhone,
            last_order_at: new Date().toISOString()
          });
        }
        if (customerInsert.error && !relationMissing(customerInsert.error)) console.warn(customerInsert.error);
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
      if (settingsAvailable) {
        await supabase
          .from("settings")
          .upsert({ shop_id: shopId, order_counter: nextCounter + 1, updated_at: new Date().toISOString() }, { onConflict: "shop_id" });
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
      if (!["owner", "business_owner", "admin"].includes(profile.role)) throw new Error("Only owner can create users.");
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
      if (payload.scope === "platform") {
        const shopType = payload.shopType || "fnb";
        const { data: shop, error: shopError } = await supabase
          .from("shops")
          .insert({ name: payload.shopName, shop_type: shopType, status: "active" })
          .select("*")
          .single();
        if (shopError) throw shopError;
        shopId = shop.id;
        const defaultCategories = (shopType === "retail" ? retailDefaultCategories() : fnbDefaultCategories()).map((name) => ({
          shop_id: shopId,
          name,
          enable_size: shopType === "retail",
          enable_sugar: shopType !== "retail",
          enable_ice: shopType !== "retail",
          enable_coffee: shopType !== "retail",
          enable_toppings: false
        }));
        await supabase.from("categories").insert(defaultCategories);
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
      if (payload.scope === "platform") {
        await supabase.from("settings").upsert({
          shop_id: shopId,
          ...defaultSettingsForShopType(payload.shopType || "fnb"),
          business_name: payload.shopName,
          receipt_name: payload.shopName || "nilaa-os",
          updated_at: new Date().toISOString()
        }, { onConflict: "shop_id" });
      }
      return profileRecord;
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
        receipt_address: payload.receipt_address,
        receipt_contact: payload.receipt_contact,
        receipt_manager: payload.receipt_manager,
        receipt_note: payload.receipt_note,
        retail_tax_rate: payload.retail_tax_rate,
        retail_barcode_mode: payload.retail_barcode_mode,
        retail_store_credit_label: payload.retail_store_credit_label,
        retail_loyalty_label: payload.retail_loyalty_label,
        option_sizes: payload.option_sizes,
        option_sugar_levels: payload.option_sugar_levels,
        option_ice_levels: payload.option_ice_levels,
        option_coffee_levels: payload.option_coffee_levels,
        option_toppings: payload.option_toppings,
        order_counter: payload.order_counter,
        updated_at: new Date().toISOString()
      };
      let { error } = await supabase.from("settings").upsert(settingsRecord, { onConflict: "shop_id" });
      if (error && columnMissing(error)) {
        const legacySettings = {
          shop_id: shopId,
          business_name: payload.business_name,
          business_description: payload.business_description,
          payment_method: payload.payment_method,
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
        <div class="divider"></div>${receipt.items.map((item) => `<div class="row"><span>${item.qty}</span><span>${safeText(item.name)}${safeText(itemOptionsInlineText(item))}</span><span>${money(item.qty * item.price)}</span></div>`).join("")}
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
  const data = await backend.fetchDashboard(state.profile.shop_id || state.profile.shopId, isPlatformAdminProfile(state.profile) ? "admin" : state.profile.role);
  state.categories = (data.categories || []).map((row) => ({
    ...row,
    enable_size: row.enable_size ?? true,
    enable_sugar: row.enable_sugar ?? true,
    enable_ice: row.enable_ice ?? true,
    enable_coffee: row.enable_coffee ?? true,
    enable_toppings: row.enable_toppings ?? false
  }));
  state.products = data.products.map((row) => ({
    ...row,
    stock_qty: Number(row.stock_qty ?? row.stockQty ?? 0),
    price: Number(row.price || 0),
    cost_price: Number(row.cost_price || 0),
    discount: Number(row.discount || 0),
    low_stock_at: Number(row.low_stock_at ?? row.lowStockAt ?? 0),
    variant_options: Array.isArray(row.variant_options) ? row.variant_options : []
  }));
  state.expenses = data.expenses.map((row) => ({ ...row, amount: Number(row.amount || 0) }));
  state.orders = data.orders.map((row) => ({
    ...row,
    subtotal: Number(row.subtotal || 0),
    subtotal_discount: Number(row.subtotal_discount || 0),
    tax: Number(row.tax || 0),
    store_credit_used: Number(row.store_credit_used || 0),
    fee: Number(row.fee || 0),
    total: Number(row.total || 0)
  }));
  state.customers = (data.customers || []).map((row) => ({
    ...row,
    store_credit_balance: Number(row.store_credit_balance || 0),
    loyalty_points: Number(row.loyalty_points || 0)
  }));
  state.users = data.users;
  state.settings = data.settings ? { ...defaultSettings(), ...data.settings } : defaultSettings();
  state.capabilities = { settings: true, payments: true, customers: true, ...(data.capabilities || {}) };
  state.platformData = isPlatformAdminProfile(state.profile) && backend.fetchPlatformData
    ? await backend.fetchPlatformData()
    : { shops: [], users: [] };
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
    state.categories = [];
    state.products = [];
    state.expenses = [];
    state.orders = [];
    state.customers = [];
    state.users = [];
    state.cart = [];
    state.pendingPaymentOrder = null;
    state.latestReceipt = null;
    state.customerExpanded = false;
    state.platformData = { shops: [], users: [] };
    state.platformAdminView = "adminChooser";
    elements.paymentModal.classList.add("hidden");
    renderAll();
    return;
  }
  state.profile = await backend.getProfile(user.id || user.uid);
  state.shop = state.profile ? await backend.getShop(state.profile.shop_id || state.profile.shopId) : null;
  await loadDashboardData();
  state.platformAdminView = isPlatformAdminProfile(state.profile) ? "adminChooser" : currentShopType();
  state.route = defaultRouteForCurrentUser();
  renderAll();
}

function currentProductByName(name) {
  return state.products.find((item) => item.name.toLowerCase() === name.trim().toLowerCase());
}

function currentProductBySearch(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return null;
  return state.products.find((item) =>
    String(item.name || "").toLowerCase() === needle ||
    String(item.sku || "").toLowerCase() === needle ||
    String(item.barcode || "").toLowerCase() === needle
  ) || null;
}

function resetOrderInputs() {
  if (elements.productSearch) elements.productSearch.value = "";
  if (elements.productQty) elements.productQty.value = 1;
  if (elements.productPrice) elements.productPrice.value = "";
}

function syncProductFormPreview(product = null) {
  const imageUrl = product?.image_url || "";
  elements.productImagePreview.src = imageUrl || "";
  elements.productImagePreview.classList.toggle("hidden", !imageUrl);
  const options = productOptionState(product || {});
  if (elements.productCategorySelect) elements.productCategorySelect.value = product?.category_id || product?.categoryId || "";
  if (elements.productBarcodeInput) elements.productBarcodeInput.value = product?.barcode || "";
  if (elements.productSkuInput) elements.productSkuInput.value = product?.sku || "";
  if (elements.productCostPriceInput) elements.productCostPriceInput.value = product?.cost_price ?? "";
  if (elements.productBrandInput) elements.productBrandInput.value = product?.brand || "";
  if (elements.productSupplierInput) elements.productSupplierInput.value = product?.supplier || "";
  if (elements.productColorInput) elements.productColorInput.value = product?.color || "";
  if (elements.productSizeLabelInput) elements.productSizeLabelInput.value = product?.size_label || "";
  if (elements.productDiscountInput) elements.productDiscountInput.value = product?.discount ?? "";
  if (elements.productVariantsInput) elements.productVariantsInput.value = Array.isArray(product?.variant_options) ? product.variant_options.join("\n") : (product?.variant_options || "");
  if (elements.productEnableSize) elements.productEnableSize.checked = options.size;
  if (elements.productEnableSugar) elements.productEnableSugar.checked = options.sugar;
  if (elements.productEnableIce) elements.productEnableIce.checked = options.ice;
  if (elements.productEnableCoffee) elements.productEnableCoffee.checked = options.coffee;
  if (elements.productEnableToppings) elements.productEnableToppings.checked = options.toppings;
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
elements.adminSystemButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.adminSystem;
    if (!isPlatformAdminProfile()) return;
    state.platformAdminView = target === "admin" ? "admin" : target;
    setRoute(target === "admin" ? "admin" : target === "fnb" || target === "retail" ? "pos" : "adminChooser");
    openDrawer(false);
  });
});
[
  elements.adminShopTypeFnb,
  elements.adminShopTypeRetail
].forEach((button) => {
  button?.addEventListener("click", () => {
    const shopType = button.dataset.adminShopType || "fnb";
    if (elements.adminShopType) elements.adminShopType.value = shopType;
    updateShellVisibility();
  });
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
elements.ordersSearchInput?.addEventListener("input", () => {
  state.ordersSearchQuery = elements.ordersSearchInput.value.trim();
  renderOrdersHistory();
});

elements.customerSearchInput?.addEventListener("input", () => {
  state.customerSearchQuery = elements.customerSearchInput.value.trim();
  renderCustomers();
});

elements.productNameInput?.addEventListener("input", () => {
  const existing = currentProductByName(elements.productNameInput.value);
  if (!existing) {
    if (canEditProductMeta()) {
      elements.productPriceInput.value = "";
      elements.productLowStockInput.value = "5";
    }
    elements.productStockInput.value = "0";
    syncProductFormPreview();
    if (elements.productCategorySelect?.value) {
      applyCategoryDefaultsToProductForm(elements.productCategorySelect.value);
    }
    return;
  }
  elements.productPriceInput.value = existing.price ?? "";
  elements.productStockInput.value = existing.stock_qty ?? 0;
  elements.productLowStockInput.value = existing.low_stock_at ?? 5;
  syncProductFormPreview(existing);
});

elements.productCategorySelect?.addEventListener("change", () => {
  const existing = currentProductByName(elements.productNameInput.value);
  if (!existing) {
    applyCategoryDefaultsToProductForm(elements.productCategorySelect.value);
  }
});

elements.productImageInput?.addEventListener("change", () => {
  previewImage(elements.productImageInput, elements.productImagePreview);
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
    const savedExpense = await runWithStatus({
      title: state.language === "en" ? "Saving expense" : "កំពុងរក្សាទុកចំណាយ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Expense saved" : "រក្សាទុកបាន"
    }, () => backend.createExpense(state.profile.shop_id || state.profile.shopId, { note, amount }, state.profile));
    state.expenses.unshift(savedExpense || {
      id: crypto.randomUUID(),
      shop_id: state.profile.shop_id || state.profile.shopId,
      note,
      amount,
      created_by: state.profile.username,
      created_at: new Date().toISOString(),
      date: todayKey()
    });
  } catch (error) {
    window.alert(error.message || t("saveExpenseFailed"));
    return;
  }
  elements.expenseForm.reset();
  renderAll();
});

elements.expenseList.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-expense-id]");
  if (!target || !state.profile) return;
  await runWithStatus({
    title: state.language === "en" ? "Removing expense" : "កំពុងលុបចំណាយ",
    message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
    successTitle: state.language === "en" ? "Expense removed" : "លុបបាន"
  }, () => backend.deleteExpense(state.profile.shop_id || state.profile.shopId, target.dataset.expenseId));
  state.expenses = state.expenses.filter((item) => item.id !== target.dataset.expenseId);
  renderAll();
});

elements.productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  const name = elements.productNameInput.value.trim();
  const existing = currentProductByName(name);
  const price = canEditProductMeta() ? Number(elements.productPriceInput.value) : Number(existing?.price || 0);
  const stock_qty = Number(elements.productStockInput.value);
  const low_stock_at = canEditProductMeta() ? Number(elements.productLowStockInput.value) : Number(existing?.low_stock_at ?? existing?.lowStockAt ?? 5);
  if (!name || price < 0 || stock_qty < 0 || low_stock_at < 0) {
    window.alert(t("productInvalid"));
    return;
  }
  if (!canEditProductMeta() && !existing) {
    window.alert(t("stockOnlyWarning"));
    return;
  }
  try {
    const image_url = elements.productImageInput.files?.[0]
      ? await readFileAsDataUrl(elements.productImageInput.files[0])
      : existing?.image_url || "";
    const category_id = canEditProductMeta() ? (elements.productCategorySelect.value || null) : (existing?.category_id || null);
    const variant_options = canEditProductMeta()
      ? elements.productVariantsInput.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
      : (existing?.variant_options || []);
    const optionPayload = canEditProductMeta()
      ? {
          enable_size: elements.productEnableSize?.checked ?? true,
          enable_sugar: elements.productEnableSugar?.checked ?? true,
          enable_ice: elements.productEnableIce?.checked ?? true,
          enable_coffee: elements.productEnableCoffee?.checked ?? true,
          enable_toppings: elements.productEnableToppings?.checked ?? false
        }
      : {
          enable_size: existing?.enable_size ?? true,
          enable_sugar: existing?.enable_sugar ?? true,
          enable_ice: existing?.enable_ice ?? true,
          enable_coffee: existing?.enable_coffee ?? true,
          enable_toppings: existing?.enable_toppings ?? false
        };
    const payload = {
      name,
      image_url,
      price,
      stock_qty,
      low_stock_at,
      active: true,
      category_id,
      barcode: canEditProductMeta() ? elements.productBarcodeInput.value.trim() : (existing?.barcode || ""),
      sku: canEditProductMeta() ? elements.productSkuInput.value.trim() : (existing?.sku || ""),
      cost_price: canEditProductMeta() ? Number(elements.productCostPriceInput.value || 0) : Number(existing?.cost_price || 0),
      brand: canEditProductMeta() ? elements.productBrandInput.value.trim() : (existing?.brand || ""),
      supplier: canEditProductMeta() ? elements.productSupplierInput.value.trim() : (existing?.supplier || ""),
      color: canEditProductMeta() ? elements.productColorInput.value.trim() : (existing?.color || ""),
      size_label: canEditProductMeta() ? elements.productSizeLabelInput.value.trim() : (existing?.size_label || ""),
      discount: canEditProductMeta() ? Number(elements.productDiscountInput.value || 0) : Number(existing?.discount || 0),
      variant_options,
      ...optionPayload
    };
    const savedProduct = await runWithStatus({
      title: state.language === "en" ? "Saving product" : "កំពុងរក្សាទុកទំនិញ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Product saved" : "រក្សាទុកបាន"
    }, () => backend.saveProduct(state.profile.shop_id || state.profile.shopId, payload));
    if (existing) {
      Object.assign(existing, savedProduct || payload);
    } else {
      state.products.push(savedProduct || { id: crypto.randomUUID(), shop_id: state.profile.shop_id || state.profile.shopId, ...payload });
    }
  } catch (error) {
    window.alert(error.message || t("saveProductFailed"));
    return;
  }
  elements.productForm.reset();
  elements.productStockInput.value = "0";
  elements.productLowStockInput.value = "5";
  syncProductFormPreview();
  renderAll();
});

elements.productList.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-product-id]");
  if (!target || !state.profile) return;
  await runWithStatus({
    title: state.language === "en" ? "Removing product" : "កំពុងលុបទំនិញ",
    message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
    successTitle: state.language === "en" ? "Product removed" : "លុបបាន"
  }, () => backend.deleteProduct(state.profile.shop_id || state.profile.shopId, target.dataset.productId));
  state.products = state.products.filter((item) => item.id !== target.dataset.productId);
  renderAll();
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
  const order = state.orders.find((item) => item.id === deleteTarget.dataset.orderId);
  if (order) {
    order.items.forEach((item) => {
      const product = state.products.find((row) => row.id === item.productId);
      if (product) product.stock_qty += item.qty;
    });
  }
  state.orders = state.orders.filter((item) => item.id !== deleteTarget.dataset.orderId);
  renderAll();
};

elements.orderList.addEventListener("click", handleOrderAction);
elements.ordersHistoryList?.addEventListener("click", handleOrderAction);

elements.adminCreateUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  try {
    const createdUser = await runWithStatus({
      title: state.language === "en" ? "Creating user" : "កំពុងបង្កើតអ្នកប្រើ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "User created" : "បង្កើតបាន"
    }, () => backend.createUser({
      username: elements.newUsername.value.trim(),
      phone: elements.newPhone.value.trim(),
      password: elements.newPassword.value.trim(),
      role: elements.newUserRole.value,
      scope: "team"
    }, state.profile));
    state.users.unshift(createdUser || {
      id: crypto.randomUUID(),
      username: elements.newUsername.value.trim(),
      email: elements.newUsername.value.trim(),
      phone: elements.newPhone.value.trim(),
      role: elements.newUserRole.value,
      shop_id: state.profile.shop_id || state.profile.shopId,
      status: "active",
      created_at: new Date().toISOString()
    });
    elements.adminCreateUserForm.reset();
    renderAll();
  } catch (error) {
    window.alert(error.message || t("createUserFailed"));
  }
});

elements.adminPlatformForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile || !isPlatformAdminProfile()) return;
  try {
    await runWithStatus({
      title: state.language === "en" ? "Creating shop" : "កំពុងបង្កើតហាង",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Shop created" : "បង្កើតបាន"
    }, () => backend.createUser({
      username: elements.adminUsername.value.trim(),
      phone: elements.adminPhone.value.trim(),
      password: elements.adminPassword.value.trim(),
      shopName: elements.adminShopName.value.trim(),
      shopType: elements.adminShopType?.value || "fnb",
      role: "owner",
      scope: "platform"
    }, state.profile));
    elements.adminPlatformForm.reset();
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
elements.resetOrderCounterButton?.addEventListener("click", () => {
  if (elements.settingsOrderCounter) elements.settingsOrderCounter.value = "1";
});

elements.categoryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  const name = elements.categoryNameInput.value.trim();
  if (!name) {
    window.alert(t("categoryMissing"));
    return;
  }
  const payload = {
    name,
    enable_size: elements.categoryEnableSize.checked,
    enable_sugar: elements.categoryEnableSugar.checked,
    enable_ice: elements.categoryEnableIce.checked,
    enable_coffee: elements.categoryEnableCoffee.checked,
    enable_toppings: elements.categoryEnableToppings.checked
  };
  try {
    const saved = await runWithStatus({
      title: state.language === "en" ? "Saving category" : "កំពុងរក្សាទុកប្រភេទ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Category saved" : "រក្សាទុកបាន"
    }, () => backend.saveCategory(state.profile.shop_id || state.profile.shopId, payload));
    const existingIndex = state.categories.findIndex((item) => item.id === saved.id || item.name.toLowerCase() === saved.name.toLowerCase());
    if (existingIndex >= 0) state.categories[existingIndex] = { ...state.categories[existingIndex], ...saved };
    else state.categories.push({ shop_id: state.profile.shop_id || state.profile.shopId, ...saved });
    elements.categoryForm.reset();
    renderCategories();
    renderProducts();
  } catch (error) {
    window.alert(error.message || t("saveCategoryFailed"));
  }
});

elements.categoryList?.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-category-id]");
  if (!target || !state.profile) return;
  try {
    await runWithStatus({
      title: state.language === "en" ? "Removing category" : "កំពុងលុបប្រភេទ",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: state.language === "en" ? "Category removed" : "លុបបាន"
    }, () => backend.deleteCategory(state.profile.shop_id || state.profile.shopId, target.dataset.categoryId));
    state.categories = state.categories.filter((item) => item.id !== target.dataset.categoryId);
    state.products = state.products.map((item) => item.category_id === target.dataset.categoryId ? { ...item, category_id: null } : item);
    renderAll();
  } catch (error) {
    window.alert(error.message || t("deleteCategoryFailed"));
  }
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
      shop_logo_url: profileImage,
      receipt_address: elements.settingsReceiptAddress.value.trim(),
      receipt_contact: elements.settingsReceiptContact.value.trim(),
      receipt_manager: elements.settingsReceiptManager.value.trim(),
      receipt_note: elements.settingsReceiptNote.value.trim(),
      retail_tax_rate: Number(elements.settingsRetailTaxRate?.value || 0),
      retail_barcode_mode: elements.settingsRetailBarcodeMode?.value || "camera",
      retail_store_credit_label: elements.settingsRetailStoreCreditLabel?.value?.trim() || "Store credit",
      retail_loyalty_label: elements.settingsRetailLoyaltyLabel?.value?.trim() || "Loyalty points",
      option_sizes: elements.settingsOptionSizes.value.trim(),
      option_sugar_levels: elements.settingsOptionSugar.value.trim(),
      option_ice_levels: elements.settingsOptionIce.value.trim(),
      option_coffee_levels: elements.settingsOptionCoffee.value.trim(),
      option_toppings: elements.settingsOptionToppings.value.trim(),
      order_counter: Math.max(1, Number(elements.settingsOrderCounter.value || 1))
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
    renderAll();
  } catch (error) {
    window.alert(error.message || t("saveSettingsFailed"));
  }
});

elements.customerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.profile) return;
  const payload = {
    name: elements.customerNameInput.value.trim(),
    phone: elements.customerPhoneInput.value.trim(),
    member_code: elements.customerMemberCodeInput.value.trim(),
    store_credit_balance: Number(elements.customerStoreCreditInput.value || 0),
    loyalty_points: Number(elements.customerLoyaltyPointsInput.value || 0)
  };
  if (!payload.name || !payload.phone) {
    window.alert(state.language === "en" ? "Please enter member name and phone." : "សូមបញ្ចូលឈ្មោះ និងលេខទូរស័ព្ទសមាជិក។");
    return;
  }
  try {
    const savedCustomer = await runWithStatus({
      title: state.language === "en" ? "Saving member" : "កំពុងរក្សាទុកសមាជិក",
      message: state.language === "en" ? "Please wait..." : "សូមរង់ចាំ...",
      successTitle: t("customerSaved")
    }, () => backend.saveCustomer(state.profile.shop_id || state.profile.shopId, payload));
    const phone = normalizePhone(payload.phone);
    const index = state.customers.findIndex((item) => normalizePhone(item.phone) === phone);
    if (index >= 0) state.customers[index] = { ...state.customers[index], ...(savedCustomer || payload) };
    else state.customers.unshift(savedCustomer || { id: crypto.randomUUID(), shop_id: state.profile.shop_id || state.profile.shopId, ...payload });
    elements.customerForm.reset();
    renderAll();
  } catch (error) {
    window.alert(error.message || t("createUserFailed"));
  }
});

elements.closeReceiptButton.addEventListener("click", closeReceipt);
elements.closeItemButton?.addEventListener("click", closeItemCustomizer);
elements.cancelItemButton?.addEventListener("click", closeItemCustomizer);
elements.addItemToCartButton?.addEventListener("click", addCustomizedItemToCart);
elements.itemModal?.addEventListener("click", (event) => {
  if (event.target.id === "itemModal") closeItemCustomizer();
});
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
elements.payCardButton?.addEventListener("click", () => choosePaymentMethod("card"));
elements.payBankButton?.addEventListener("click", () => choosePaymentMethod("bank_transfer"));
elements.paySplitButton?.addEventListener("click", () => choosePaymentMethod("split"));
elements.payStoreCreditButton?.addEventListener("click", () => choosePaymentMethod("store_credit"));
elements.paymentBackButton.addEventListener("click", backToPaymentChoice);
elements.markPaidButton.addEventListener("click", completePayment);
elements.receiptBackButton.addEventListener("click", closeReceipt);
elements.printReceiptButton.addEventListener("click", () => window.print());
elements.downloadReceiptButton.addEventListener("click", async () => {
  if (!state.latestReceipt) return;
  try {
    await saveReceiptPdf();
  } catch (error) {
    try {
      const file = await backend.generateReceiptPdf(state.latestReceipt);
      makeDownload(file);
    } catch (fallbackError) {
      window.alert(fallbackError.message || error.message || t("createPdfFailed"));
    }
  }
});
elements.shareReceiptButton?.addEventListener("click", async () => {
  if (!state.latestReceipt) return;
  try {
    const shared = await shareReceiptFile();
    if (!shared) {
      await saveReceiptPdf();
    }
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
