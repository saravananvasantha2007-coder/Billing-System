# 🍛 Annapoorna Bhavan - Hotel & Tiffin Billing Web App (SmartPOS)

A high-performance, ready-to-sell Restaurant & Tiffin Center Point-of-Sale (POS) and Billing Web Application built with **React**, **Tailwind CSS**, and **Vite**.

Designed specifically for South Indian hotels, tiffin centers, tea shops, mess, and fast-food counters. Works **100% offline**, features dynamic **UPI QR Code** generation, **58mm/80mm Thermal Receipt** printing, and instant **WhatsApp Bill** sharing.

---

## ⚡ Live Local Server
- **Local URL:** `http://localhost:3000`
- **Network URL (Mobile/Tablet on same Wi-Fi):** `http://<your-ip>:3000`

---

## 💎 Features Built for Indian Hotels (Justifying ₹5,000 - ₹10,000 Price)

1. **🎨 2-Minute White-Label Rebranding**
   - Single central configuration file (`src/config/shopConfig.js`) controls shop name in English & Tamil, tagline, address, phone, GSTIN, FSSAI, UPI ID, brand colors, and tax rates.
   - Also fully editable directly from the **Settings** screen in the browser with live localStorage synchronization.

2. **🇮🇳 Complete Bilingual Tamil & English UI**
   - Instant 1-click toggle between தமிழ் (Tamil) and English for all screens, receipts, and reports.

3. **📲 Dynamic Amount UPI QR Code**
   - Automatically generates a scannable UPI QR code on screen with the **exact bill amount** and merchant UPI ID (PhonePe, GPay, Paytm, BHIM, CRED).
   - Generates 100% offline using HTML5 canvas.

4. **🖨️ Thermal Printer Ready (58mm / 80mm)**
   - Formatted in classic ESC/POS thermal slip style with shop details, token number, itemized rates, GST (CGST+SGST), and greetings.
   - Works with any Bluetooth or USB thermal printer (TVS, Epson, NGX, POS-58).

5. **💬 1-Click WhatsApp Bill Sharing**
   - Formats a clean invoice and opens WhatsApp directly to send the bill to the customer's phone number without saving contacts.

6. **🔒 Staff Mode vs Owner PIN Mode**
   - Waiters and cashiers operate in **Staff Mode** (they can bill and print).
   - Confidential financial reports, gross sales, settings, and bill deletions are locked behind a **4-digit Owner PIN** (Default PIN: `1234`).

7. **📊 Real-Time Analytics & CSV Reports**
   - Today's sales, bills count, average bill value, Dine-in vs Takeaway ratio, Cash vs UPI split, top 5 selling items, and a 7-day sales trend chart.
   - 1-click CSV export for Excel / Tally accounting.

8. **⚡ Fast Touchscreen Billing & Cart Drawer**
   - Mobile-first responsive layout with category filters, bilingual live search, and inline `[-] Qty [+]` counters on dish cards.
   - Audio feedback sound effects using Web Audio API (zero external files required).

9. **📱 PWA Offline Support**
   - Manifest and service worker installed so it can be added to any Android or iOS home screen and run like a native app without an internet connection.

---

## 🚀 How to Run Locally

```bash
# 1. Navigate to project folder
cd hotel-billing-app

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

---

## 🌐 Free 1-Click Deployment (Netlify & Vercel)

### Option A: Free Deployment to Vercel (Recommended)
1. Push this folder to your GitHub account (or install [Vercel CLI](https://vercel.com/cli) via `npm i -g vercel`).
2. Run `vercel` in the project directory, or import your repository on [vercel.com](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**. Your live HTTPS link will be ready in 30 seconds!

### Option B: Free Deployment to Netlify
1. Run `npm run build` locally.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder into the Netlify drop zone.
4. Your billing site goes live instantly for free!

---

## 🏷️ How to Re-Brand for a New Client in 2 Minutes

Open [src/config/shopConfig.js](file:///c:/Users/admin/Downloads/hotel-billing-app/src/config/shopConfig.js) and modify:

```javascript
export const DEFAULT_SHOP_CONFIG = {
  shopNameEn: "Sri Murugan Tiffin Center",
  shopNameTa: "ஸ்ரீ முருகன் டிபன் சென்டர்",
  taglineEn: "Pure Ghee Tiffins & Hot Coffee",
  taglineTa: "சுவையான நெய் டிபன் மற்றும் ஃபில்டர் காபி",
  phone: "+91 94444 12345",
  whatsappNumber: "919444412345",
  addressEn: "75, Main Road, Madurai - 625001",
  addressTa: "75, மெயின் ரோடு, மதுரை - 625001",
  gstNumber: "33XXXXX1234X1Z1",
  taxRatePercent: 5.0,
  upiId: "srimurugan@upi",
  payeeName: "Sri Murugan Tiffin Center",
  printerPaperWidth: "58mm",
  ownerPin: "2026"
};
```
*Alternatively, log into the web app, navigate to **Settings**, edit these fields on screen, and click **Save Settings**!*

---

## 📖 Short User Guide for the Hotel Owner & Cashier (தமிழ் & English)

### 🇬🇧 English Guide
1. **Taking an Order:** Click **Billing (POS)**. Tap dishes to add them to the order. Use `+` and `-` to adjust quantity.
2. **Dine-in vs Parcel:** Select Table Number (e.g., T-1) or tap **Takeaway / Parcel** (auto-adds parcel fee).
3. **Collecting Payment:** Tap **PAY & PRINT**. Choose **Cash** (auto-calculates change) or **UPI** (displays dynamic QR code with exact amount).
4. **Printing Receipt:** Click **Print Thermal Bill** or press `Ctrl + P`. Click **Send via WhatsApp** to text the bill.
5. **Next Customer:** Tap **Next Order** or press `F2` on the keyboard.
6. **Owner Mode:** Tap **Staff Mode** in the top bar and enter PIN `1234` to unlock the sales Dashboard, Reports, and Settings.

---

### 🇮🇳 தமிழ் பயனர் கையேடு (Tamil User Manual)
1. **பில் போடுதல்:** **பில்லிங் (POS)** திரையில் தேவையான உணவுகளைத் தட்டினால் பில்லில் சேரும். `+` மற்றும் `-` மூலம் எண்ணிக்கையை மாற்றலாம்.
2. **சாப்பிடுதல் அல்லது பார்சல்:** மேலே உள்ள மேஜை எண் (Table No) அல்லது **பார்சல் (Takeaway)** என்பதைத் தேர்ந்தெடுக்கவும்.
3. **பணம் வசூலித்தல்:** **பணம் செலுத்தி பிரிண்ட் செய்க** பட்டனை அழுத்தவும்.
   - **ரொக்கம் (Cash):** பெற்ற தொகையை உள்ளிட்டால், மீதம் கொடுக்க வேண்டிய சில்லறை திரையில் பெரிதாகக் காட்டும்.
   - **UPI QR:** வாடிக்கையாளரின் போனில் GPay/PhonePe மூலம் ஸ்கேன் செய்ய துல்லியமான தொகைக்கான QR கோடு திரையில் தோன்றும்.
4. **பில் பிரிண்ட் & வாட்ஸ்அப்:** **தெர்மல் பில் பிரிண்ட்** கொடுத்து ரசீது அச்சிடலாம் அல்லது **வாட்ஸ்அப்பில் பில் அனுப்புக** மூலம் வாடிக்கையாளர் மொபைலுக்கு ரசீது அனுப்பலாம்.
5. **அடுத்த பில்:** **அடுத்த ஆர்டர்** பட்டனை அழுத்தவும் அல்லது கீபோர்டில் `F2` அழுத்தவும்.
6. **உரிமையாளர் முறை (Owner Mode):** பணியாளர்கள் பார்க்க முடியாத வகையில் இன்றைய மொத்த விற்பனை மற்றும் அறிக்கைகளை பார்க்க, மேலே உள்ள பட்டனை அழுத்தி ரகசிய PIN `1234` ஐ உள்ளிடவும்.

---

## 💼 5-Line Sales Pitch for the Hotel Owner (₹5,000 - ₹10,000 Deal)

> *"வணக்கம் ஐயா! மாதாந்திர வாடகை கட்டணமே இல்லாத, வாழ்நாள் முழுவதும் இலவசமாக இயங்கும் அதிவேக டச்-ஸ்கிரீன் பில்லிங் மென்பொருள் இது.*  
> *இன்டர்நெட் கட்டானாலும் பில்லிங் நிற்காது; வாடிக்கையாளர்கள் துல்லியமான தொகையை GPay/PhonePe-ல் ஸ்கேன் செய்து உடனடியாக பணம் செலுத்தலாம்.*  
> *58mm தெர்மல் பிரிண்டரில் டோக்கன் மற்றும் பில் அச்சிடலாம்; வாடிக்கையாளர் போனுக்கு ஒரே கிளிக்கில் வாட்ஸ்அப் ரசீதும் அனுப்பலாம்.*  
> *கேஷியர் உங்கள் விற்பனை கணக்குகளை மாற்ற முடியாதபடி ஓனர் PIN பாதுகாப்புடன் கூடிய முழுமையான அறிக்கை இதில் உள்ளது.*  
> *வெறும் ₹6,000 ஒருமுறை முதலீட்டில் உங்கள் ஹோட்டலை நவீன ஸ்மார்ட் ஹோட்டலாக மாற்றித் தருகிறோம்!"*
