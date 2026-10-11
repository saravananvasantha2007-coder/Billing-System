import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Printer,
  Trash2,
  MessageSquare,
  Filter,
  Eye,
  AlertTriangle,
  Receipt,
  Download,
  RotateCcw
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  formatCurrency,
  formatDateTime,
  formatTimeOnly,
  shareBillOnWhatsApp,
  downloadCsv
} from "../utils/formatters";

export const BillHistory = () => {
  const {
    config,
    lang,
    t,
    orders,
    deleteOrder,
    clearAllOrders,
    setActiveBillForPrint,
    requireOwnerAuth,
    isOwnerMode
  } = useApp();

  const [dateFilter, setDateFilter] = useState("all"); // 'all' | 'today' | 'yesterday' | 'week' | 'month'
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [billToDelete, setBillToDelete] = useState(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      // Date match
      let dateMatch = true;
      if (dateFilter === "today") {
        dateMatch = orderDate.toDateString() === todayStr;
      } else if (dateFilter === "yesterday") {
        dateMatch = orderDate.toDateString() === yesterdayStr;
      } else if (dateFilter === "week") {
        dateMatch = orderDate >= sevenDaysAgo;
      } else if (dateFilter === "month") {
        dateMatch = orderDate >= startOfMonth;
      }

      // Payment mode match
      let payMatch = true;
      if (paymentFilter !== "all") {
        payMatch = order.paymentMode === paymentFilter;
      }

      // Search match
      const q = searchQuery.toLowerCase().trim();
      let searchMatch = true;
      if (q) {
        searchMatch =
          order.billNumber?.toLowerCase().includes(q) ||
          String(order.tokenNumber).includes(q) ||
          order.customerPhone?.includes(q) ||
          order.customerName?.toLowerCase().includes(q);
      }

      return dateMatch && payMatch && searchMatch;
    });
  }, [orders, dateFilter, paymentFilter, searchQuery]);

  const totalFilteredSales = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  }, [filteredOrders]);

  const handleReprint = (order) => {
    setActiveBillForPrint(order);
  };

  const handleWhatsApp = (order) => {
    shareBillOnWhatsApp(order, config);
  };

  const handleDeletePrompt = (order) => {
    // Requires Owner authentication to delete bills
    requireOwnerAuth(() => {
      setBillToDelete(order);
    });
  };

  const confirmDelete = () => {
    if (billToDelete) {
      deleteOrder(billToDelete.id);
      setBillToDelete(null);
    }
  };

  const handleClearAllPrompt = () => {
    requireOwnerAuth(() => {
      setShowClearAllConfirm(true);
    });
  };

  const confirmClearAll = () => {
    clearAllOrders();
    setShowClearAllConfirm(false);
  };

  // Export filtered bills to CSV
  const handleExportCsv = () => {
    const rows = filteredOrders.map((o) => ({
      "Bill Number": o.billNumber,
      "Token No": o.tokenNumber,
      Date: formatDateTime(o.createdAt),
      "Order Type": o.orderType,
      "Customer Phone": o.customerPhone || "-",
      "Items Count": o.items?.length || 0,
      Subtotal: o.subtotal,
      "Parcel Fee": o.parcelFee,
      Discount: o.discountAmount,
      GST: o.taxAmount,
      "Grand Total (₹)": o.grandTotal,
      "Payment Mode": o.paymentMode
    }));
    downloadCsv(`Hotel_Bills_${dateFilter}_${Date.now()}.csv`, rows);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Title & Summary Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("navBills")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ta"
              ? "முந்தைய பில்களை பார்க்க, மறுபிரிண்ட் செய்ய மற்றும் வாட்ஸ்அப்பில் பகிர"
              : "Search past orders, reprint thermal receipts and share via WhatsApp"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 text-right">
            <span className="text-[11px] font-bold text-rose-700 block">
              {filteredOrders.length} {t("totalBillsFound")}
            </span>
            <span className="text-lg font-black text-rose-950">
              {formatCurrency(totalFilteredSales)}
            </span>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={filteredOrders.length === 0}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {orders.length > 0 && (
            <button
              onClick={handleClearAllPrompt}
              className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-red-200"
              title="Clear all billing history"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>{lang === "ta" ? "வரலாற்றை அழிக்க" : "Clear All History"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bill No, Token or Phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Date Range Tabs */}
          <div className="sm:col-span-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: t("allDates") },
              { id: "today", label: t("today") },
              { id: "yesterday", label: t("yesterday") },
              { id: "week", label: t("last7Days") },
              { id: "month", label: t("thisMonth") }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateFilter(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  dateFilter === tab.id
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payment Mode Filter */}
          <div className="sm:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">{t("allPaymentModes")}</option>
              <option value="cash">Cash Only</option>
              <option value="upi">UPI QR Only</option>
              <option value="card">Card Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* Bills Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-14 text-center">
            <Receipt className="w-12 h-12 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-600 font-bold text-sm">
              {lang === "ta" ? "பில்கள் எதுவும் இல்லை" : "No bills in history"}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              {lang === "ta"
                ? "பில்லிங் பக்கத்தில் புதிய பில் போட்டு பிரிண்ட் செய்யவும்"
                : "Create a new order in the Billing POS to start generating bills"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Token / Bill</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Order Type</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((order) => {
                  const itemsSummary = order.items
                    ?.map((i) => `${i.nameEn} x${i.quantity}`)
                    .join(", ");

                  return (
                    <tr key={order.id} className="hover:bg-rose-50/40 transition">
                      {/* Token & Bill */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                            #{order.tokenNumber}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">
                              {order.billNumber}
                            </div>
                            {order.customerPhone && (
                              <div className="text-[10px] text-slate-500">
                                📱 {order.customerPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        <div>{formatTimeOnly(order.createdAt)}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short"
                          })}
                        </div>
                      </td>

                      {/* Order Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {order.orderType === "takeaway" ? (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200">
                            Parcel (பார்சல்)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                            Dine-In (உள்ளே)
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4 max-w-xs truncate text-slate-700" title={itemsSummary}>
                        {itemsSummary}
                      </td>

                      {/* Payment Mode */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                            order.paymentMode === "upi"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : order.paymentMode === "card"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {order.paymentMode}
                        </span>
                      </td>

                      {/* Grand Total */}
                      <td className="py-3 px-4 whitespace-nowrap text-right font-black text-sm text-slate-900">
                        {formatCurrency(order.grandTotal)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Reprint */}
                          <button
                            onClick={() => handleReprint(order)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title={t("reprint")}
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* WhatsApp */}
                          <button
                            onClick={() => handleWhatsApp(order)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title={t("shareWhatsApp")}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          {/* Delete (with PIN prompt) */}
                          <button
                            onClick={() => handleDeletePrompt(order)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title={t("deleteBill")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Single Bill Modal */}
      {billToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t("deleteBill")}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t("confirmDelete")}
              </p>
              <div className="text-xs font-mono font-bold text-slate-700 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                {billToDelete.billNumber} • Token #{billToDelete.tokenNumber} • {formatCurrency(billToDelete.grandTotal)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setBillToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {t("deleteBill")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear ALL History Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === "ta" ? "முழு பில் வரலாற்றையும் அழிக்கவா?" : "Clear All Billing History?"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === "ta"
                  ? "இது அனைத்து முந்தைய பில்களையும் நிரந்தரமாக அழிக்கும். இதற்குப் பிறகு புதிய பில்கள் #1 இலிருந்து தொடங்கும்."
                  : "This will permanently remove all past bills and start fresh with a 0 clean slate. Token numbers will restart from #1."}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmClearAll}
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
