import React from "react";
import {
  UtensilsCrossed,
  Receipt,
  LayoutDashboard,
  History,
  BookOpen,
  BarChart3,
  Settings,
  Lock,
  Unlock,
  PlusCircle,
  Languages,
  Store
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Navbar = () => {
  const {
    config,
    lang,
    toggleLang,
    t,
    activeTab,
    setActiveTab,
    isOwnerMode,
    requireOwnerAuth,
    lockStaffMode,
    clearCart
  } = useApp();

  const navItems = [
    { id: "landing", label: t("navHome"), icon: Store, ownerOnly: false },
    { id: "pos", label: t("navBilling"), icon: Receipt, ownerOnly: false, badge: "POS" },
    { id: "dashboard", label: t("navDashboard"), icon: LayoutDashboard, ownerOnly: true },
    { id: "bills", label: t("navBills"), icon: History, ownerOnly: false },
    { id: "menu", label: t("navMenu"), icon: BookOpen, ownerOnly: false },
    { id: "reports", label: t("navReports"), icon: BarChart3, ownerOnly: true },
    { id: "settings", label: t("navSettings"), icon: Settings, ownerOnly: true }
  ];

  const handleNavClick = (tabId, ownerOnly) => {
    if (ownerOnly && !isOwnerMode) {
      requireOwnerAuth(() => setActiveTab(tabId));
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-rose-100 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Info */}
          <div
            onClick={() => setActiveTab("landing")}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white text-2xl shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              {config.logoIcon || "🍛"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                  {lang === "ta" ? config.shopNameTa : config.shopNameEn}
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-700 rounded-md">
                  POS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1">
                {lang === "ta" ? config.taglineTa : config.taglineEn}
              </p>
            </div>
          </div>

          {/* Quick Actions & Auth Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* New Bill Button */}
            <button
              onClick={() => {
                clearCart();
                setActiveTab("pos");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">{t("newBill")}</span>
            </button>

            {/* Language Toggle (Tamil / English) */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border border-slate-200 active:scale-95"
              title="Toggle Tamil / English"
            >
              <Languages className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === "en" ? "தமிழ்" : "English"}</span>
            </button>

            {/* Owner vs Staff Mode Toggle */}
            {isOwnerMode ? (
              <button
                onClick={lockStaffMode}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition"
                title={t("lockStaff")}
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t("ownerMode")}</span>
              </button>
            ) : (
              <button
                onClick={() => requireOwnerAuth(() => {})}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold transition"
                title={t("unlockOwner")}
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{t("staffMode")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on small screens) */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.ownerOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  isActive
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-rose-50/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{item.label}</span>
                {item.ownerOnly && !isOwnerMode && (
                  <Lock className="w-3 h-3 text-slate-400 ml-0.5" />
                )}
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded ${
                      isActive ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
