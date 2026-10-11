import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  RotateCcw
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  formatCurrency,
  generateBillNumber,
  generateDailyTokenNumber
} from "../utils/formatters";

export const PaymentModal = () => {
  const {
    config,
    lang,
    t,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    cart,
    cartSubtotal,
    parcelFee,
    discountAmount,
    taxAmount,
    grandTotal,
    orderType,
    customerPhone,
    customerName,
    addOrder,
    orders
  } = useApp();

  const [paymentMode, setPaymentMode] = useState("cash"); // 'cash' | 'upi' | 'card'
  const [receivedCash, setReceivedCash] = useState(grandTotal);
  const qrCanvasRef = useRef(null);

  // Sync cash default to grandTotal whenever modal opens or total changes
  useEffect(() => {
    if (isPaymentModalOpen) {
      setReceivedCash(grandTotal);
      setPaymentMode("cash");
    }
  }, [isPaymentModalOpen, grandTotal]);

  // Next Token & Bill No preview
  const nextToken = generateDailyTokenNumber(orders);
  const nextBillNo = generateBillNumber(config.billNumberPrefix || "AB", orders);

  // NPCI standard UPI Payment URI
  const upiUri = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(
    config.payeeName
  )}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent(
    `Bill ${nextBillNo} Token ${nextToken}`
  )}`;

  // Generate dynamic QR code onto canvas when UPI tab is active
  useEffect(() => {
    if (paymentMode === "upi" && qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        upiUri,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: "#0f172a",
            light: "#ffffff"
          }
        },
        (error) => {
          if (error) console.error("Error generating UPI QR code", error);
        }
      );
    }
  }, [paymentMode, upiUri, grandTotal]);

  if (!isPaymentModalOpen) return null;

  // Change to return calculation
  const receivedNum = Number(receivedCash) || 0;
  const changeToReturn = Math.max(0, receivedNum - grandTotal);
  const isCashInsufficient = receivedNum < grandTotal;

  // Quick cash tender buttons
  const cashQuickOptions = [
    { label: t("exactAmount"), value: grandTotal },
    { label: "₹50", value: 50 },
    { label: "₹100", value: 100 },
    { label: "₹200", value: 200 },
    { label: "₹500", value: 500 },
    { label: "₹2000", value: 2000 }
  ].filter((opt) => opt.value >= grandTotal || opt.label === t("exactAmount"));

  const handleConfirmOrder = () => {
    const orderPayload = {
      billNumber: nextBillNo,
      tokenNumber: nextToken,
      orderType,
      customerPhone,
      customerName,
      items: cart,
      subtotal: cartSubtotal,
      parcelFee,
      discountAmount,
      taxRate: config.taxRatePercent || 5,
      taxAmount,
      grandTotal,
      paymentMode,
      receivedAmount: paymentMode === "cash" ? receivedNum : grandTotal,
      changeAmount: paymentMode === "cash" ? changeToReturn : 0
    };

    addOrder(orderPayload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-100 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-200 uppercase tracking-wider">
              {t("paymentTitle")} • Token #{nextToken}
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-0.5">
              {formatCurrency(grandTotal)}
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Mode Selector */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMode("cash")}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                paymentMode === "cash"
                  ? "border-rose-600 bg-rose-50/70 text-rose-800 shadow-sm"
                  : "border-slate-200 hover:border-rose-200 text-slate-600"
              }`}
            >
              <Banknote className="w-6 h-6 text-rose-600" />
              <span className="text-xs font-bold">{t("cash")}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode("upi")}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                paymentMode === "upi"
                  ? "border-rose-600 bg-rose-50/70 text-rose-800 shadow-sm"
                  : "border-slate-200 hover:border-rose-200 text-slate-600"
              }`}
            >
              <QrCode className="w-6 h-6 text-rose-600" />
              <span className="text-xs font-bold">{t("upi")}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode("card")}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                paymentMode === "card"
                  ? "border-rose-600 bg-rose-50/70 text-rose-800 shadow-sm"
                  : "border-slate-200 hover:border-rose-200 text-slate-600"
              }`}
            >
              <CreditCard className="w-6 h-6 text-rose-600" />
              <span className="text-xs font-bold">{t("card")}</span>
            </button>
          </div>

          {/* TAB 1: CASH PAYMENT */}
          {paymentMode === "cash" && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {t("receivedAmount")} (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-extrabold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={receivedCash}
                    onChange={(e) => setReceivedCash(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Quick Cash Tender Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {cashQuickOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReceivedCash(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                      receivedNum === opt.value
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-rose-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Return Change Highlight */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800">
                    {t("changeToReturn")}
                  </div>
                  <div className="text-xs text-emerald-600">
                    {lang === "ta" ? "வாடிக்கையாளரிடம் திருப்பிக் கொடு" : "Give back to customer"}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-700">
                  {formatCurrency(changeToReturn)}
                </div>
              </div>

              {isCashInsufficient && (
                <div className="text-xs text-amber-700 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200">
                  ⚠️ {lang === "ta" ? "செலுத்திய ரொக்கம் பில் தொகையை விட குறைவாக உள்ளது" : "Received cash is less than the bill amount."}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPI DYNAMIC QR PAYMENT */}
          {paymentMode === "upi" && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-3">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                <canvas ref={qrCanvasRef} className="rounded-lg" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  {t("scanUpiPrompt")}
                </p>
                <div className="text-[11px] font-semibold text-rose-600 mt-0.5">
                  UPI ID: <span className="font-mono">{config.upiId}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Payee: {config.payeeName} • Amount: <strong>{formatCurrency(grandTotal)}</strong>
                </div>
              </div>

              {/* Direct UPI App link for mobile phone cashier testing */}
              <a
                href={upiUri}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-xs font-bold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t("openUpiApp")}</span>
              </a>
            </div>
          )}

          {/* TAB 3: CARD PAYMENT */}
          {paymentMode === "card" && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {lang === "ta" ? "கார்டு மெஷின் மூலம் வசூலிக்கவும்" : "Swipe / Tap on POS Terminal"}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {t("cardPrompt")}
                </p>
              </div>
              <div className="text-base font-black text-rose-600">
                {formatCurrency(grandTotal)}
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirmOrder}
            disabled={paymentMode === "cash" && isCashInsufficient}
            className={`w-full py-3.5 px-4 rounded-xl text-base font-black shadow-lg transition flex items-center justify-center gap-2 ${
              paymentMode === "cash" && isCashInsufficient
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 active:scale-95"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>{t("confirmPayment")} ({formatCurrency(grandTotal)})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
