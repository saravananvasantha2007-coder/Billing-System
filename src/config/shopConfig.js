/**
 * ============================================================================
 * 🏪 WHITE-LABEL CONFIGURATION FILE (வெள்ளை-லேபிள் உள்ளமைவு)
 * ============================================================================
 * Edit this ONE file to re-brand the entire billing system for ANY client
 * in under 2 minutes! (Tea shop, Tiffin center, Pure Veg, Non-Veg hotel, etc.)
 *
 * All values here serve as the factory default, and can also be updated
 * live through the app's "Settings" screen by the shop owner.
 * ============================================================================
 */

export const DEFAULT_SHOP_CONFIG = {
  // 🏷️ Shop Identity (English & Tamil)
  shopNameEn: "Annapoorna Bhavan",
  shopNameTa: "அன்னபூர்ணா பவன்",
  taglineEn: "Authentic South Indian Pure Veg & Tiffin",
  taglineTa: "சுவையான பாரம்பரிய தென்னிந்திய உணவகம்",
  logoIcon: "🍛", // Emoji or character badge
  logoText: "AB",

  // 🎨 Brand Colors (Red and White Theme)
  brandColor: "#e11d48", // Primary Crimson Red (Rose-600)
  brandColorHover: "#be123c",
  brandLightColor: "#fff1f2", // Rose-50
  accentColor: "#f59e0b", // Warm Amber

  // 📍 Contact & Location
  addressEn: "142, Car Street, Near Old Bus Stand, Salem - 636001",
  addressTa: "142, தேர் வீதி, பழைய பேருந்து நிலையம் அருகில், சேலம் - 636001",
  phone: "+91 98765 43210",
  whatsappNumber: "919876543210", // Format: 91XXXXXXXXXX (no plus, no spaces)

  // 🏛️ Official Registrations
  gstNumber: "33AAAAA0000A1Z5", // Indian GSTIN (State code 33 for TN)
  fssaiNumber: "12423001000456", // FSSAI Food License Number

  // 💰 Taxes & Charges
  taxRatePercent: 5.0, // Standard 5% GST for Restaurants (2.5% CGST + 2.5% SGST)
  isTaxEnabled: true, // Can be toggled off for small tea shops without GST
  currencySymbol: "₹",
  currencyCode: "INR",
  parcelCharge: 5.0, // ₹5 parcel packing charge per takeaway order

  // 📲 UPI Payment Settings (Dynamic QR code generation)
  upiId: "annapoornabhavan@okaxis", // The shop's UPI ID for GPay / PhonePe / Paytm / BHIM
  payeeName: "Annapoorna Bhavan", // Merchant / Account name on UPI

  // 🖨️ Thermal Printer Settings
  printerPaperWidth: "58mm", // "58mm" (Standard 2-inch roll) or "80mm" (3-inch roll)
  billNumberPrefix: "AB", // Bill number prefix, e.g., AB-1001

  // 🔒 Security PIN
  ownerPin: "1234", // 4-digit PIN for Owner Mode (access to Dashboard, Reports, Settings)

  // 📜 Thermal Bill Receipt Footers
  receiptFooterEn: "Thank You! Visit Again! Have a great day!",
  receiptFooterTa: "நன்றி! மீண்டும் வருக! இனிய நாளாக அமையட்டும்!",
  poweredBy: "SmartPOS • WhatsApp Billing Support",
  heroImageUrl: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80"
};

// Helper to load config from localStorage with fallback to DEFAULT_SHOP_CONFIG
export const loadShopConfig = () => {
  try {
    const saved = localStorage.getItem("hotel_shop_config");
    if (saved) {
      return { ...DEFAULT_SHOP_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load shop config from localStorage", e);
  }
  return DEFAULT_SHOP_CONFIG;
};

// Helper to save config to localStorage
export const saveShopConfig = (config) => {
  try {
    localStorage.setItem("hotel_shop_config", JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save shop config to localStorage", e);
  }
};
