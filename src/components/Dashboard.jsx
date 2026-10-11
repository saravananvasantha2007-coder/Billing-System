import React, { useMemo } from "react";
import {
  TrendingUp,
  Receipt,
  DollarSign,
  UtensilsCrossed,
  Package,
  CreditCard,
  QrCode,
  Banknote,
  Award,
  ArrowUpRight,
  Calendar,
  Sparkles
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatCurrency, formatDateTime } from "../utils/formatters";

export const Dashboard = () => {
  const { config, lang, t, orders, setActiveTab } = useApp();

  const today = new Date();
  const todayDateStr = today.toDateString();

  // Filter orders for today
  const todaysOrders = useMemo(() => {
    return orders.filter(
      (o) => new Date(o.createdAt).toDateString() === todayDateStr
    );
  }, [orders, todayDateStr]);

  // Today's Gross Sales
  const todaySales = useMemo(() => {
    return todaysOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  }, [todaysOrders]);

  // Average bill value
  const avgBillValue = todaysOrders.length
    ? Math.round(todaySales / todaysOrders.length)
    : 0;

  // Dine-In vs Takeaway split
  const dineInCount = todaysOrders.filter((o) => o.orderType === "dine-in").length;
  const takeawayCount = todaysOrders.filter((o) => o.orderType === "takeaway").length;
  const dineInPercent = todaysOrders.length
    ? Math.round((dineInCount / todaysOrders.length) * 100)
    : 0;

  // Payment method breakdown for today
  const paymentBreakdown = useMemo(() => {
    let cash = 0;
    let upi = 0;
    let card = 0;

    todaysOrders.forEach((o) => {
      const mode = o.paymentMode || "cash";
      if (mode === "cash") cash += o.grandTotal;
      else if (mode === "upi") upi += o.grandTotal;
      else if (mode === "card") card += o.grandTotal;
    });

    const total = cash + upi + card || 1;
    return {
      cash: { amount: cash, percent: Math.round((cash / total) * 100) },
      upi: { amount: upi, percent: Math.round((upi / total) * 100) },
      card: { amount: card, percent: Math.round((card / total) * 100) }
    };
  }, [todaysOrders]);

  // Top 5 selling items today
  const top5Items = useMemo(() => {
    const itemMap = {};
    todaysOrders.forEach((o) => {
      o.items?.forEach((i) => {
        const key = i.nameEn;
        if (!itemMap[key]) {
          itemMap[key] = {
            nameEn: i.nameEn,
            nameTa: i.nameTa,
            category: i.category,
            price: i.price,
            qty: 0,
            revenue: 0
          };
        }
        itemMap[key].qty += i.quantity;
        itemMap[key].revenue += i.price * i.quantity;
      });
    });

    return Object.values(itemMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [todaysOrders]);

  // Last 7 days sales for weekly chart
  const weeklyData = useMemo(() => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.toDateString();
      const daySales = orders
        .filter((o) => new Date(o.createdAt).toDateString() === dStr)
        .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

      days.push({
        label: i === 0 ? "Today" : dayNames[d.getDay()],
        date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        sales: daySales
      });
    }

    const maxSales = Math.max(...days.map((d) => d.sales), 500);
    return { days, maxSales };
  }, [orders, today]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      
      {/* Page Title & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t("navDashboard")}
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded-md">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </p>
        </div>

        <button
          onClick={() => setActiveTab("pos")}
          className="self-start sm:self-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition flex items-center gap-1.5 active:scale-95"
        >
          <Receipt className="w-4 h-4" />
          <span>{t("startBilling")}</span>
        </button>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Sales Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("salesToday")}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(todaySales)}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Counter</span>
          </div>
        </div>

        {/* Bills Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("billsCount")}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {todaysOrders.length}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            {dineInCount} Dine-in • {takeawayCount} Parcel
          </div>
        </div>

        {/* Average Bill Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("avgBillValue")}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(avgBillValue)}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Per customer average
          </div>
        </div>

        {/* Dine-In vs Parcel Ratio */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("dineInVsTakeaway")}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {dineInPercent}% / {100 - dineInPercent}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden flex">
            <div
              style={{ width: `${dineInPercent}%` }}
              className="bg-rose-600 h-full"
              title="Dine-In"
            ></div>
            <div
              style={{ width: `${100 - dineInPercent}%` }}
              className="bg-amber-500 h-full"
              title="Takeaway"
            ></div>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Sales Trend Chart (7 Days SVG) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {t("weeklySalesTrend")}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === "ta" ? "கடந்த 7 நாட்களின் தினசரி வருவாய் விவரம்" : "Revenue by day for the past week"}
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
              7 Days
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 pt-4 flex items-end justify-between gap-2 sm:gap-4 px-2">
            {weeklyData.days.map((d, idx) => {
              const heightPercent = Math.max(
                8,
                Math.round((d.sales / weeklyData.maxSales) * 100)
              );
              const isToday = idx === weeklyData.days.length - 1;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-rose-600 transition">
                    {formatCurrency(d.sales)}
                  </span>
                  
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 group-hover:opacity-90 ${
                        isToday
                          ? "bg-gradient-to-t from-rose-600 to-rose-400 shadow-sm"
                          : "bg-gradient-to-t from-slate-400 to-slate-300"
                      }`}
                    ></div>
                  </div>

                  <div className="text-center">
                    <span
                      className={`text-xs block font-bold ${
                        isToday ? "text-rose-600 font-black" : "text-slate-600"
                      }`}
                    >
                      {d.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">
                      {d.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Mode Split */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {t("paymentSplit")}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === "ta" ? "இன்றைய கட்டண வகை விகிதம்" : "Cash vs UPI vs Card revenue split"}
            </p>
          </div>

          <div className="space-y-4">
            {/* Cash */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  {t("cash")}
                </span>
                <span className="text-slate-900">
                  {formatCurrency(paymentBreakdown.cash.amount)} ({paymentBreakdown.cash.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  style={{ width: `${paymentBreakdown.cash.percent}%` }}
                  className="bg-emerald-500 h-full rounded-full"
                ></div>
              </div>
            </div>

            {/* UPI */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  {t("upi")}
                </span>
                <span className="text-slate-900">
                  {formatCurrency(paymentBreakdown.upi.amount)} ({paymentBreakdown.upi.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  style={{ width: `${paymentBreakdown.upi.percent}%` }}
                  className="bg-blue-600 h-full rounded-full"
                ></div>
              </div>
            </div>

            {/* Card */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  {t("card")}
                </span>
                <span className="text-slate-900">
                  {formatCurrency(paymentBreakdown.card.amount)} ({paymentBreakdown.card.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  style={{ width: `${paymentBreakdown.card.percent}%` }}
                  className="bg-purple-600 h-full rounded-full"
                ></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-800 font-semibold text-center">
            {lang === "ta"
              ? "UPI வசூல் நேரடியாக உங்கள் வங்கிக் கணக்கில் சேரும்"
              : "UPI QR funds deposit directly into your bank account"}
          </div>
        </div>

      </div>

      {/* Top 5 Selling Dishes Today */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900">
              {t("top5Items")}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            By quantity sold
          </span>
        </div>

        {top5Items.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {t("noSalesYet")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {top5Items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:border-rose-300 hover:bg-white transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        idx === 0
                          ? "bg-amber-400 text-amber-950 shadow-sm"
                          : idx === 1
                          ? "bg-slate-300 text-slate-800"
                          : idx === 2
                          ? "bg-amber-700 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-rose-600">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                    {lang === "ta" ? item.nameTa : item.nameEn}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1">
                    {lang === "ta" ? item.nameEn : item.nameTa}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Sold:</span>
                  <span className="font-extrabold text-slate-900">{item.qty} pcs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
