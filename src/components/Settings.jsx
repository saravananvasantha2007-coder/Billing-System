import React, { useState } from "react";
import {
  Save,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Printer,
  Store,
  DollarSign,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Settings = () => {
  const {
    config,
    updateConfig,
    lang,
    t,
    menu,
    orders,
    clearAllOrders,
    resetToDemoData
  } = useApp();

  const [formData, setFormData] = useState({ ...config });
  const [newPin, setNewPin] = useState(config.ownerPin || "1234");
  const [saveMessage, setSaveMessage] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateConfig({
      ...formData,
      ownerPin: newPin || "1234",
      taxRatePercent: Number(formData.taxRatePercent) || 0,
      parcelCharge: Number(formData.parcelCharge) || 0
    });
    setSaveMessage(t("settingsSaved"));
    setTimeout(() => setSaveMessage(""), 4000);
  };

  // Full System Backup to JSON
  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      appName: "Hotel Billing App White-Label",
      config: formData,
      menu,
      orders
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `Hotel_POS_Backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restore from JSON file
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.config) {
          updateConfig(imported.config);
          setFormData(imported.config);
        }
        if (imported.menu && Array.isArray(imported.menu)) {
          localStorage.setItem("hotel_menu_items", JSON.stringify(imported.menu));
        }
        if (imported.orders && Array.isArray(imported.orders)) {
          localStorage.setItem("hotel_billing_orders", JSON.stringify(imported.orders));
        }
        alert(
          lang === "ta"
            ? "பேக்கப் வெற்றிகரமாக மீட்டமைக்கப்பட்டது! பக்கம் புதுப்பிக்கப்படுகிறது."
            : "Backup restored successfully! Reloading application..."
        );
        window.location.reload();
      } catch (err) {
        alert("Invalid backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      
      {/* Page Title */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("settingsTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ta"
              ? "கடை பெயர், முகவரி, ஜிஎஸ்டி, UPI ID மற்றும் பேக்கப் அமைப்புகள்"
              : "Rebrand store, update GST/UPI settings, change PIN, and manage backups"}
          </p>
        </div>

        {saveMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: SHOP IDENTITY (White-Label) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Store className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              {t("shopDetails")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("shopNameEn")} *
              </label>
              <input
                type="text"
                required
                value={formData.shopNameEn || ""}
                onChange={(e) => handleChange("shopNameEn", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("shopNameTa")} *
              </label>
              <input
                type="text"
                required
                value={formData.shopNameTa || ""}
                onChange={(e) => handleChange("shopNameTa", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("taglineEn")}
              </label>
              <input
                type="text"
                value={formData.taglineEn || ""}
                onChange={(e) => handleChange("taglineEn", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("taglineTa")}
              </label>
              <input
                type="text"
                value={formData.taglineTa || ""}
                onChange={(e) => handleChange("taglineTa", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("phone")} *
              </label>
              <input
                type="text"
                required
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("whatsapp")} (91XXXXXXXXXX)
              </label>
              <input
                type="text"
                value={formData.whatsappNumber || ""}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                {t("addressEn")}
              </label>
              <input
                type="text"
                value={formData.addressEn || ""}
                onChange={(e) => handleChange("addressEn", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                {t("addressTa")}
              </label>
              <input
                type="text"
                value={formData.addressTa || ""}
                onChange={(e) => handleChange("addressTa", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: TAXES & CHARGES */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              GST Tax & Takeaway Charges
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("gstNumber")}
              </label>
              <input
                type="text"
                value={formData.gstNumber || ""}
                onChange={(e) => handleChange("gstNumber", e.target.value)}
                placeholder="33AAAAA0000A1Z5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500 uppercase"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("fssaiNumber")}
              </label>
              <input
                type="text"
                value={formData.fssaiNumber || ""}
                onChange={(e) => handleChange("fssaiNumber", e.target.value)}
                placeholder="12423001000456"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("taxRate")}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.taxRatePercent || 0}
                onChange={(e) => handleChange("taxRatePercent", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("parcelFee")}
              </label>
              <input
                type="number"
                value={formData.parcelCharge || 0}
                onChange={(e) => handleChange("parcelCharge", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol || "₹"}
                onChange={(e) => handleChange("currencySymbol", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.isTaxEnabled ?? true}
                  onChange={(e) => handleChange("isTaxEnabled", e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span>{t("enableTax")}</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: UPI & THERMAL PRINTER */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <QrCode className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              UPI Payments & Printer Roll
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("upiId")} *
              </label>
              <input
                type="text"
                required
                value={formData.upiId || ""}
                onChange={(e) => handleChange("upiId", e.target.value)}
                placeholder="merchant@okaxis"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("payeeName")}
              </label>
              <input
                type="text"
                value={formData.payeeName || ""}
                onChange={(e) => handleChange("payeeName", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t("printerWidth")}
              </label>
              <select
                value={formData.printerPaperWidth || "58mm"}
                onChange={(e) => handleChange("printerPaperWidth", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="58mm">58mm (2-Inch Mini Thermal)</option>
                <option value="80mm">80mm (3-Inch Standard POS)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: SECURITY PIN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              {t("ownerPinChange")}
            </h2>
          </div>

          <div className="max-w-xs text-xs space-y-1">
            <label className="font-bold text-slate-700 block">
              Owner Security PIN (4 Digits)
            </label>
            <input
              type="password"
              maxLength="6"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-center text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <p className="text-[11px] text-slate-400">
              Protects Dashboard, Reports, Menu deletions and Settings from staff.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-black shadow-lg shadow-rose-200 transition flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{t("saveSettings")}</span>
          </button>
        </div>
      </form>

      {/* SECTION 5: DATA BACKUP & RESTORE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Download className="w-5 h-5 text-rose-600" />
          <h2 className="text-base font-extrabold text-slate-900">
            {t("dataManagement")}
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          {lang === "ta"
            ? "உங்கள் ஹோட்டல் பில்லிங் டேட்டாவை எப்போது வேண்டுமானாலும் கணினியில் அல்லது போனில் சேமித்து வைக்கலாம்."
            : "Save an offline backup copy of all orders, menu dishes and shop configurations."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Download JSON */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{t("backupData")}</span>
          </button>

          {/* Restore JSON */}
          <label className="cursor-pointer py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200 text-center">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>{t("restoreData")}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {/* Clear History */}
          <button
            type="button"
            onClick={() => setShowClearHistoryConfirm(true)}
            className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-red-200"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>{lang === "ta" ? "முழு வரலாற்றையும் அழிக்க" : "Clear All History"}</span>
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-rose-200"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>{t("resetDemo")}</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t("resetDemo")}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === "ta"
                  ? "இது அனைத்து தற்போதைய தரவுகளையும் அழித்து ஆரம்ப டெமோ மெனு மற்றும் மாதிரிகளை மீட்டமைக்கும்."
                  : "This will reset all current configurations and demo menu to default factory settings."}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                  window.location.reload();
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === "ta" ? "முழு வரலாற்றையும் அழிக்கவா?" : "Clear All History?"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === "ta"
                  ? "இது அனைத்து முந்தைய பில்களையும் நிரந்தரமாக நீக்கும்."
                  : "This will permanently delete all past billing orders and start fresh."}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowClearHistoryConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => {
                  clearAllOrders();
                  setShowClearHistoryConfirm(false);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {lang === "ta" ? "ஆம், அழிக்கவும்" : "Yes, Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
