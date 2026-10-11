import React, { useState, useMemo } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  Package,
  Phone,
  User,
  Percent,
  Receipt,
  Tag,
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { INITIAL_CATEGORIES } from "../data/initialMenu";
import { formatCurrency } from "../utils/formatters";

export const PosScreen = () => {
  const {
    config,
    lang,
    t,
    menu,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    customerPhone,
    setCustomerPhone,
    customerName,
    setCustomerName,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    isTaxEnabled,
    setIsTaxEnabled,
    cartSubtotal,
    parcelFee,
    discountAmount,
    taxAmount,
    grandTotal,
    setIsPaymentModalOpen
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Filter menu items by category and search
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nameEn?.toLowerCase().includes(q) ||
        item.nameTa?.toLowerCase().includes(q) ||
        String(item.price).includes(q);
      return matchCategory && matchSearch;
    });
  }, [menu, selectedCategory, searchQuery]);

  // Map cart items for quick lookup on food card
  const cartItemMap = useMemo(() => {
    const map = {};
    cart.forEach((c) => {
      map[c.id] = c.quantity;
    });
    return map;
  }, [cart]);

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* ========================================================
            LEFT / MAIN PANEL: Categories, Search, Food Cards Grid
            ======================================================== */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
          
          {/* Search Bar & Order Mode Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dine-In / Takeaway Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-center sm:self-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setOrderType("dine-in")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  orderType === "dine-in"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>{t("dineIn")}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  orderType === "takeaway"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{t("takeaway")}</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {INITIAL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
                    isSelected
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-200"
                      : "bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/50"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{lang === "ta" ? cat.nameTa : cat.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* Items Count & Veg Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>
              {filteredItems.length} {lang === "ta" ? "உணவுகள் உள்ளன" : "dishes available"}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t("vegOnly")}
            </span>
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-3.5">
            {filteredItems.map((item) => {
              const inCartQty = cartItemMap[item.id] || 0;
              const isSoldOut = !item.available;

              return (
                <div
                  key={item.id}
                  className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm ${
                    isSoldOut
                      ? "opacity-60 border-slate-200 bg-slate-50"
                      : inCartQty > 0
                      ? "border-rose-400 ring-2 ring-rose-500/20 shadow-md"
                      : "border-slate-200 hover:border-rose-300 hover:shadow-md"
                  }`}
                >
                  {/* Food Photo Container */}
                  <div className="relative h-28 sm:h-36 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.nameEn}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />

                    {/* Veg Symbol Badge */}
                    <div className="absolute top-2 left-2 bg-white/95 p-1 rounded-md shadow-sm border border-slate-200">
                      <div className="w-3 h-3 border-2 border-emerald-600 flex items-center justify-center p-0.5 rounded-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                      </div>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-xs sm:text-sm font-extrabold shadow">
                      {formatCurrency(item.price)}
                    </div>

                    {/* Sold Out Overlay */}
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-black rounded-lg shadow uppercase tracking-wider">
                          {t("soldOut")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight line-clamp-1">
                        {lang === "ta" ? item.nameTa : item.nameEn}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {lang === "ta" ? item.nameEn : item.nameTa}
                      </p>
                    </div>

                    {/* Action Button: Either "ADD" or Quick "[-] Qty [+]" */}
                    <div className="mt-2.5 pt-1.5 border-t border-slate-100">
                      {isSoldOut ? (
                        <button
                          disabled
                          className="w-full py-1.5 bg-slate-200 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed"
                        >
                          {t("soldOut")}
                        </button>
                      ) : inCartQty > 0 ? (
                        <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl p-0.5">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white text-rose-600 hover:bg-rose-100 rounded-lg shadow-sm transition active:scale-95 font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-rose-700 text-xs sm:text-sm px-1.5">
                            {inCartQty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-sm transition active:scale-95 font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full py-1.5 sm:py-2 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl text-xs sm:text-sm font-bold border border-rose-200 hover:border-rose-600 transition flex items-center justify-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t("add")}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 font-bold text-sm">
                {lang === "ta" ? "உணவுகள் எதுவும் கிடைக்கவில்லை" : "No dishes found"}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {lang === "ta" ? "வேறு சொற்களை கொண்டு தேடவும்" : "Try a different search term or category"}
              </p>
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT PANEL: Cart & Billing Checkout (Desktop Side Panel)
            ======================================================== */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20">
          <CartPanelContent />
        </div>

      </div>

      {/* ========================================================
          MOBILE BOTTOM BAR & SLIDE-UP DRAWER (Mobile First POS)
          ======================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-rose-100 shadow-2xl p-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Cart summary trigger */}
          <button
            onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
            className="flex items-center gap-2.5 py-1 px-2 text-left"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                {cart.length} {t("item")} • {orderType === "takeaway" ? t("takeaway") : t("dineIn")}
                {isMobileCartOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </div>
              <div className="text-base font-black text-slate-900 leading-tight">
                {formatCurrency(grandTotal)}
              </div>
            </div>
          </button>

          {/* Quick Pay Button */}
          <button
            onClick={() => {
              if (cart.length > 0) setIsPaymentModalOpen(true);
            }}
            disabled={cart.length === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold shadow-md transition ${
              cart.length > 0
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{t("proceedToPay")} ({formatCurrency(grandTotal)})</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Sheet Overlay */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-base text-slate-900">{t("cartTitle")}</h3>
              </div>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-2">
              <CartPanelContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for the Cart Panel
const CartPanelContent = () => {
  const {
    config,
    lang,
    t,
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    orderType,
    customerPhone,
    setCustomerPhone,
    customerName,
    setCustomerName,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    isTaxEnabled,
    setIsTaxEnabled,
    cartSubtotal,
    parcelFee,
    discountAmount,
    taxAmount,
    grandTotal,
    setIsPaymentModalOpen
  } = useApp();

  const [showDiscount, setShowDiscount] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-rose-50 to-white border-b border-rose-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            🛒
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              {t("cartTitle")}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {cart.length} {lang === "ta" ? "வகைகள்" : "items selected"}
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t("clearCart")}</span>
          </button>
        )}
      </div>

      {/* Order Mode Status Banner (Dine-In or Parcel) */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold p-2.5 rounded-xl border bg-white border-slate-200">
          <div className="flex items-center gap-2">
            {orderType === "takeaway" ? (
              <>
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-amber-900 font-black block">{t("takeaway")}</span>
                  <span className="text-[10px] text-amber-600">{lang === "ta" ? "பார்சல் ஆர்டர்" : "Parcel Order"}</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-rose-900 font-black block">{t("dineIn")}</span>
                  <span className="text-[10px] text-rose-600">{lang === "ta" ? "உள்ளே சாப்பிட" : "Dine-In Counter"}</span>
                </div>
              </>
            )}
          </div>
          {orderType === "takeaway" && (
            <span className="text-amber-800 font-black bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              +₹{config.parcelCharge || 5}
            </span>
          )}
        </div>

        {/* Customer Phone for WhatsApp bill */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="WhatsApp No."
              className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer (Opt)"
              className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Items List (Scrollable) */}
      <div className="p-3 max-h-64 sm:max-h-72 overflow-y-auto divide-y divide-slate-100 flex-1">
        {cart.length === 0 ? (
          <div className="py-10 text-center">
            <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-500 text-xs font-semibold">{t("cartEmpty")}</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                  {lang === "ta" ? item.nameTa : item.nameEn}
                </h4>
                <div className="text-[11px] text-slate-500">
                  {formatCurrency(item.price)} x {item.quantity} ={" "}
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>

              {/* Counter Controls */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => updateCartQty(item.id, -1)}
                  className="w-6 h-6 flex items-center justify-center bg-white text-slate-700 hover:text-rose-600 rounded shadow-xs active:scale-90 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-black text-slate-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateCartQty(item.id, 1)}
                  className="w-6 h-6 flex items-center justify-center bg-white text-slate-700 hover:text-rose-600 rounded shadow-xs active:scale-90 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-slate-300 hover:text-rose-500 p-1"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Calculations & Order Summary */}
      {cart.length > 0 && (
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-2 text-xs">
          {/* Subtotal */}
          <div className="flex justify-between text-slate-600 font-medium">
            <span>{t("subtotal")}</span>
            <span className="font-bold text-slate-900">{formatCurrency(cartSubtotal)}</span>
          </div>

          {/* Parcel Fee */}
          {parcelFee > 0 && (
            <div className="flex justify-between text-amber-700 font-medium">
              <span>{t("parcelCharge")}</span>
              <span className="font-bold">+{formatCurrency(parcelFee)}</span>
            </div>
          )}

          {/* Discount Toggle & Input */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowDiscount(!showDiscount)}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {discountValue > 0
                  ? `${t("discount")} (-${formatCurrency(discountAmount)})`
                  : `+ ${t("discount")}`}
              </button>
              {discountAmount > 0 && (
                <span className="font-bold text-emerald-600">
                  -{formatCurrency(discountAmount)}
                </span>
              )}
            </div>

            {showDiscount && (
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded text-xs p-1 font-semibold"
                >
                  <option value="percent">% Off</option>
                  <option value="flat">₹ Flat</option>
                </select>
                <input
                  type="number"
                  min="0"
                  max={discountType === "percent" ? "100" : cartSubtotal}
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  placeholder="0"
                  className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                />
                {discountValue > 0 && (
                  <button
                    onClick={() => setDiscountValue(0)}
                    className="text-[10px] text-rose-500 font-bold ml-auto"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* GST Tax Toggle */}
          <div className="flex items-center justify-between text-slate-600 font-medium pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isTaxEnabled}
                onChange={(e) => setIsTaxEnabled(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-[11px]">
                {t("gstTax")} ({config.taxRatePercent}%)
              </span>
            </label>
            <span className="font-bold text-slate-900">
              {isTaxEnabled ? formatCurrency(taxAmount) : "₹0"}
            </span>
          </div>

          {/* Grand Total */}
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-slate-900">{t("grandTotal")}</span>
            <span className="text-xl font-black text-rose-600">
              {formatCurrency(grandTotal)}
            </span>
          </div>

          {/* Pay Button */}
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full mt-2 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-sm font-black shadow-lg shadow-rose-200 transition flex items-center justify-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span>{t("proceedToPay")} • {formatCurrency(grandTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
};
