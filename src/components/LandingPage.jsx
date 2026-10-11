import React from "react";
import {
  Zap,
  Printer,
  QrCode,
  WifiOff,
  ChevronRight,
  TrendingUp,
  Receipt,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/formatters";

export const LandingPage = () => {
  const { config, lang, t, setActiveTab, orders } = useApp();

  // Calculate today's sales
  const todayStr = new Date().toDateString();
  const todaysOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr);
  const todaysSales = todaysOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);

  const features = [
    {
      icon: Zap,
      title: lang === "ta" ? "3 நொடி பில்லிங்" : "3-Second Billing",
      desc: lang === "ta" ? "விரல் தொடுதலில் மின்னல் வேக ஆர்டர் மற்றும் டோக்கன்." : "Lightning-fast touch selection with instant token printing."
    },
    {
      icon: WifiOff,
      title: lang === "ta" ? "100% ஆஃப்லைன் வசதி" : "100% Offline Ready",
      desc: lang === "ta" ? "இன்டர்நெட் கட்டானாலும் பில்லிங் நிற்காது. டேட்டா போனில் சேமிக்கப்படும்." : "Works without internet. All data securely saved in your browser."
    },
    {
      icon: QrCode,
      title: lang === "ta" ? "துல்லியமான UPI QR" : "Dynamic Amount UPI QR",
      desc: lang === "ta" ? "பில் தொகைக்கான QR கோடு திரையில் தோன்றும். வாடிக்கையாளர் ஸ்கேன் செய்து செலுத்தலாம்." : "Generates QR code with exact bill amount for instant UPI payments."
    },
    {
      icon: Printer,
      title: lang === "ta" ? "தெர்மல் பிரிண்டர் ஆதரவு" : "Thermal Receipt & WhatsApp",
      desc: lang === "ta" ? "58mm மற்றும் 80mm பிரிண்டர்களில் உடனடியாக அச்சிடலாம் அல்லது வாட்ஸ்அப்பில் அனுப்பலாம்." : "One-click 58mm/80mm thermal print and instant WhatsApp receipt sharing."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-slate-50 py-8 sm:py-14 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs sm:text-sm font-bold border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                <span>{t("heroBadge")}</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                  <span className="block text-rose-600">
                    {lang === "ta" ? config.shopNameTa : config.shopNameEn}
                  </span>
                  <span className="text-slate-800 text-2xl sm:text-3xl lg:text-4xl block mt-1 font-bold">
                    {lang === "ta" ? config.shopNameEn : config.shopNameTa}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto lg:mx-0">
                  {lang === "ta" ? config.taglineTa : config.taglineEn}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("pos")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-base font-bold shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Receipt className="w-5 h-5" />
                  <span>{t("startBilling")}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setActiveTab("menu")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-base font-bold transition shadow-sm active:scale-95"
                >
                  <Utensils className="w-5 h-5 text-rose-600" />
                  <span>{t("viewMenu")}</span>
                </button>
              </div>

              {/* Quick Counter Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">{t("todaysSales")}</div>
                  <div className="text-lg sm:text-xl font-extrabold text-rose-600 mt-0.5">
                    {formatCurrency(todaysSales)}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">{t("totalBills")}</div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                    {todaysOrders.length}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">{t("fastCounter")}</div>
                  <div className="text-lg sm:text-xl font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-5 h-5" /> Active
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Food Image Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                  <img
                    src={config.heroImageUrl || "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80"}
                    alt="South Indian Traditional Food"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-rose-200">
                          {config.phone}
                        </div>
                        <div className="text-sm font-bold truncate">
                          {lang === "ta" ? config.addressTa : config.addressEn}
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs">
                        GST: {config.gstNumber ? "ACTIVE" : "NONE"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-10 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === "ta" ? "ஹோட்டல்களுக்கான பிரத்யேக வசதிகள்" : "Built Specifically for Small Indian Hotels"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {lang === "ta" ? "விலையுயர்ந்த சாஃப்ட்வேர் வாடகை இன்றி, எளிய நேரடி பில்லிங்." : "Zero monthly cloud fees. Simple, fast and rock-solid."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} {config.shopNameEn}. {config.receiptFooterEn}
          </div>
          <div className="text-rose-600 font-semibold">
            {config.poweredBy}
          </div>
        </div>
      </footer>
    </div>
  );
};
