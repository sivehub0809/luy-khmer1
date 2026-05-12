import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const defaultSettingsForShopType = (shopType: string) => ({
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
  order_counter: 1,
  retail_tax_rate: 0,
  retail_barcode_mode: "camera",
  retail_store_credit_label: "Store credit",
  retail_loyalty_label: "Loyalty points"
});

const fnbDefaultCategories = () => ["Coffee", "Milk tea", "Bakery", "Dessert"];
const retailDefaultCategories = () => ["General", "Drinks", "Snacks", "Personal care"];

const normalizePhone = (value: string) => String(value || "").replace(/\s+/g, "").trim();

const columnMissing = (error: unknown) => String((error as { message?: string })?.message || "").toLowerCase().includes("column");
const relationMissing = (error: unknown) => {
  const message = String((error as { message?: string })?.message || "").toLowerCase();
  return message.includes("schema cache") || message.includes("could not find the table") || message.includes("relation");
};

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get("SUPABASE_URL") || "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!url || !anonKey || !serviceRoleKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    const authHeader = request.headers.get("Authorization") || "";
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const adminClient = createClient(url, serviceRoleKey);

    const {
      data: { user: actor },
      error: actorError
    } = await userClient.auth.getUser();
    if (actorError || !actor) {
      return new Response(JSON.stringify({ error: "Authentication required." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: actorProfile, error: actorProfileError } = await adminClient
      .from("users")
      .select("*")
      .eq("id", actor.id)
      .single();
    if (actorProfileError || actorProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin only." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    const username = String(body?.username || "").trim();
    const email = username.toLowerCase();
    const phone = normalizePhone(body?.phone || "");
    const password = String(body?.password || "");
    const shopName = String(body?.shopName || "").trim();
    const shopType = body?.shopType === "retail" ? "retail" : "fnb";
    const role = String(body?.role || "owner").trim() || "owner";

    if (!username || !password || !shopName) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, phone, shopType, role }
    });
    if (authError || !authData.user?.id) {
      throw authError || new Error("Could not create auth user.");
    }

    let shop;
    let shopError;
    ({ data: shop, error: shopError } = await adminClient
      .from("shops")
      .insert({ name: shopName, shop_type: shopType, status: "active" })
      .select("*")
      .single());
    if (shopError && columnMissing(shopError)) {
      const fallback = await adminClient
        .from("shops")
        .insert({ name: shopName })
        .select("*")
        .single();
      shop = fallback.data;
      shopError = fallback.error;
    }
    if (shopError) throw shopError;

    const profileRecord = {
      id: authData.user.id,
      username,
      email,
      phone,
      role,
      shop_id: shop.id,
      status: "active",
      created_at: new Date().toISOString()
    };

    let profileInsert = await adminClient.from("users").upsert(profileRecord, { onConflict: "id" });
    if (profileInsert.error && columnMissing(profileInsert.error)) {
      const { email: _email, phone: _phone, ...legacyProfileRecord } = profileRecord;
      profileInsert = await adminClient.from("users").upsert(legacyProfileRecord, { onConflict: "id" });
    }
    if (profileInsert.error) throw profileInsert.error;

    if (phone) {
      const aliasUpsert = await adminClient.from("login_aliases").upsert({
        alias: phone,
        login_email: email,
        user_id: authData.user.id,
        shop_id: shop.id,
        updated_at: new Date().toISOString()
      });
      if (aliasUpsert.error && !relationMissing(aliasUpsert.error)) throw aliasUpsert.error;
    }

    const categories = (shopType === "retail" ? retailDefaultCategories() : fnbDefaultCategories()).map((name) => ({
      shop_id: shop.id,
      name,
      enable_size: shopType === "retail",
      enable_sugar: shopType !== "retail",
      enable_ice: shopType !== "retail",
      enable_coffee: shopType !== "retail",
      enable_toppings: false
    }));
    let categoryInsert = await adminClient.from("categories").insert(categories);
    if (categoryInsert.error && columnMissing(categoryInsert.error)) {
      categoryInsert = await adminClient.from("categories").insert(categories.map((item) => ({ shop_id: item.shop_id, name: item.name })));
    }
    if (categoryInsert.error && !relationMissing(categoryInsert.error)) throw categoryInsert.error;

    const defaultSettings = defaultSettingsForShopType(shopType);
    let settingsUpsert = await adminClient.from("settings").upsert({
      shop_id: shop.id,
      ...defaultSettings,
      business_name: shopName,
      receipt_name: shopName,
      updated_at: new Date().toISOString()
    }, { onConflict: "shop_id" });
    if (settingsUpsert.error && columnMissing(settingsUpsert.error)) {
      settingsUpsert = await adminClient.from("settings").upsert({
        shop_id: shop.id,
        business_name: shopName,
        business_description: defaultSettings.business_description,
        payment_method: defaultSettings.payment_method,
        qr_image_url: defaultSettings.qr_image_url,
        receipt_name: shopName,
        receipt_footer: defaultSettings.receipt_footer,
        shop_logo_url: defaultSettings.shop_logo_url,
        updated_at: new Date().toISOString()
      }, { onConflict: "shop_id" });
    }
    if (settingsUpsert.error && !relationMissing(settingsUpsert.error)) throw settingsUpsert.error;

    return new Response(JSON.stringify({
      ok: true,
      profile: profileRecord,
      shop
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String((error as Error)?.message || error) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
