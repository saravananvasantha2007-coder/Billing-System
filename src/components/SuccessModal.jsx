import React from "react";
import {
  CheckCircle2,
  Printer,
  Share2,
  PlusCircle,
  X,
  MessageSquare
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  formatCurrency,
  formatDateTime,
  shareBillOnWhatsApp
} from "../utils/formatters";

export const SuccessModal = () => {
  const {
    config,
    lang,
    t,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    lastCreatedBill,
    setActiveBillForPrint,
    clearCart,
    setActiveTab
  } = useApp();

  if (!isSuccessModalOpen || !lastCreatedBill) return null;

  const handlePrint = () => {
    setActiveBillForPrint(lastCreatedBill);
    // Allow React state to update before opening print window
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleWhatsAppShare = () => {
    shareBillOnWhatsApp(lastCreatedBill, config);
  };

  const handleNextOrder = () => {
    clearCart();
    setIsSuccessModalOpen(false);
    setActiveTab("pos");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-100 flex flex-col text-center animate-in zoom-in-95 duration-200">
        
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 sm:p-7 relative">
          <button
            onClick={() => setIsSuccessModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            {t("billSuccess")}
          </h2>

          <div className="mt-3 inline-block bg-white text-emerald-800 px-5 py-2 rounded-2xl shadow-lg">
            <span className="text-xs uppercase tracking-wider font-extrabold block text-emerald-600">
              {t("tokenNumber")}
            </span>
            <span className="text-3xl sm:text-4xl font-black">
              #{lastCreatedBill.tokenNumber}
            </span>
          </div>
        </div>

        {/* Bill Summary Details */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
            <div className="flex justify-between text-slate-500">
              <span>{t("billNumber")}:</span>
              <span className="font-mono font-bold text-slate-900">
                {lastCreatedBill.billNumber}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{t("amountToPay")}:</span>
              <span className="font-extrabold text-slate-900">
                {formatCurrency(lastCreatedBill.grandTotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{t("paymentMode")}:</span>
              <span className="font-bold uppercase text-emerald-700">
                {lastCreatedBill.paymentMode}
              </span>
            </div>
            {lastCreatedBill.changeAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                <span>{t("changeToReturn")}:</span>
                <span>{formatCurrency(lastCreatedBill.changeAmount)}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {/* Thermal Print */}
            <button
              onClick={handlePrint}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-black shadow-lg shadow-rose-200 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{t("printReceipt")}</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t("shareWhatsApp")}</span>
            </button>

            {/* Next Bill */}
            <button
              onClick={handleNextOrder}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("nextOrder")}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
