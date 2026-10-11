import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  Receipt,
  Utensils,
  TrendingUp,
  PieChart
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  formatCurrency,
  formatDateTime,
  downloadCsv
} from "../utils/formatters";

export const Reports = () => {
  const { lang, t, orders } = useApp();

  const [dateRange, setDateRange] = useState("month"); // 'today' | 'yesterday' | 'week' | 'month' | 'all'

  // Filter orders according to date range
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
      if (dateRange === "today") return orderDate.toDateString() === todayStr;
      if (dateRange === "yesterday") return orderDate.toDateString() === yesterdayStr;
      if (dateRange === "week") return orderDate >= sevenDaysAgo;
      if (dateRange === "month") return orderDate >= startOfMonth;
      return true; // 'all'
    });
  }, [orders, dateRange]);

  // Aggregate stats
  const totalSales = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  }, [filteredOrders]);

  const totalBills = filteredOrders.length;
  const avgBill = totalBills ? Math.round(totalSales / totalBills) : 0;

  // Item-wise sales breakdown
  const itemSummary = useMemo(() => {
    const map = {};
    let totalItemsCount = 0;

    filteredOrders.forEach((order) => {
      order.items?.forEach((i) => {
        const key = i.nameEn;
        if (!map[key]) {
          map[key] = {
            nameEn: i.nameEn,
            nameTa: i.nameTa,
            category: i.category,
            price: i.price,
            qtySold: 0,
            revenue: 0
          };
        }
        map[key].qtySold += i.quantity;
        map[key].revenue += i.price * i.quantity;
        totalItemsCount += i.quantity;
      });
    });

    const itemsArray = Object.values(map).sort((a, b) => b.revenue - a.revenue);
    return { items: itemsArray, totalItemsCount };
  }, [filteredOrders]);

  // Category breakdown
  const categorySummary = useMemo(() => {
    const catMap = {
      breakfast: { label: "Breakfast (காலை)", revenue: 0, count: 0 },
      lunch: { label: "Lunch (மதியம்)", revenue: 0, count: 0 },
      dinner: { label: "Dinner (இரவு)", revenue: 0, count: 0 },
      snacks: { label: "Snacks (சிற்றுண்டி)", revenue: 0, count: 0 },
      drinks: { label: "Drinks (பானங்கள்)", revenue: 0, count: 0 }
    };

    filteredOrders.forEach((o) => {
      o.items?.forEach((i) => {
        const cat = i.category || "breakfast";
        if (catMap[cat]) {
          catMap[cat].revenue += i.price * i.quantity;
          catMap[cat].count += i.quantity;
        }
      });
    });

    return Object.entries(catMap).map(([key, val]) => ({
      key,
      ...val,
      percent: totalSales > 0 ? Math.round((val.revenue / totalSales) * 100) : 0
    }));
  }, [filteredOrders, totalSales]);

  // Export 1: Bills CSV
  const handleExportBillsCsv = () => {
    const rows = filteredOrders.map((o) => ({
      "Bill Number": o.billNumber,
      "Token No": o.tokenNumber,
      "Date Time": formatDateTime(o.createdAt),
      "Order Type": o.orderType,
      "Phone Number": o.customerPhone || "-",
      "Payment Method": o.paymentMode,
      Subtotal: o.subtotal,
      "Parcel Charge": o.parcelFee,
      Discount: o.discountAmount,
      "GST Amount": o.taxAmount,
      "Grand Total (₹)": o.grandTotal
    }));
    downloadCsv(`Hotel_Bills_Report_${dateRange}_${Date.now()}.csv`, rows);
  };

  // Export 2: Item-wise CSV
  const handleExportItemsCsv = () => {
    const rows = itemSummary.items.map((i) => ({
      "Dish Name (EN)": i.nameEn,
      "Dish Name (TA)": i.nameTa || "",
      Category: i.category,
      "Unit Price (₹)": i.price,
      "Quantity Sold": i.qtySold,
      "Total Revenue (₹)": i.revenue,
      "Contribution %": totalSales > 0 ? ((i.revenue / totalSales) * 100).toFixed(1) + "%" : "0%"
    }));
    downloadCsv(`Hotel_Dish_Sales_${dateRange}_${Date.now()}.csv`, rows);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("reportsTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ta"
              ? "விற்பனை பகுப்பாய்வு மற்றும் கணக்கு தணிக்கை அறிக்கைகள் (Excel / CSV)"
              : "Financial summaries, item preparation demand, and exportable reports"}
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
          {[
            { id: "today", label: t("today") },
            { id: "yesterday", label: t("yesterday") },
            { id: "week", label: t("last7Days") },
            { id: "month", label: t("thisMonth") },
            { id: "all", label: t("allDates") }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateRange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                dateRange === tab.id
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("revenue")}
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            {formatCurrency(totalSales)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Filtered period gross
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("totalBills")}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {totalBills}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Completed orders
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("avgBillValue")}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(avgBill)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Average customer spend
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("itemsSold")}
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {itemSummary.totalItemsCount} pcs
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Across {itemSummary.items.length} menu items
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              {t("categorySales")}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Revenue contribution
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {categorySummary.map((cat) => (
            <div
              key={cat.key}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-800">{cat.label}</span>
                <span className="text-rose-600">{cat.percent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  style={{ width: `${cat.percent}%` }}
                  className="bg-rose-600 h-full rounded-full"
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-1">
                <span>{cat.count} sold</span>
                <span className="font-extrabold text-slate-900">
                  {formatCurrency(cat.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Item Sales Table with Export CSV Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {t("itemSales")}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === "ta" ? "ஒவ்வொரு உணவும் விற்ற எண்ணிக்கை மற்றும் வருவாய் விவரம்" : "Ranked by total revenue generation"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBillsCsv}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>{t("downloadBillsCsv")}</span>
            </button>
            <button
              onClick={handleExportItemsCsv}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("downloadItemsCsv")}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Dish Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Qty Sold</th>
                <th className="py-2.5 px-3 text-right">Total Revenue</th>
                <th className="py-2.5 px-3 text-right">% of Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {itemSummary.items.map((item, idx) => {
                const percent =
                  totalSales > 0 ? ((item.revenue / totalSales) * 100).toFixed(1) : 0;

                return (
                  <tr key={idx} className="hover:bg-rose-50/30 transition">
                    <td className="py-2.5 px-3 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.nameEn}</div>
                      {item.nameTa && (
                        <div className="text-[10px] text-slate-500">{item.nameTa}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 capitalize text-slate-600">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 font-semibold">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                      {item.qtySold}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-600">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 font-bold">
                      {percent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
