import React, { useRef, useEffect } from "react";
import QRCode from "qrcode";
import { Printer, MessageSquare, X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  formatCurrency,
  formatDateTime,
  shareBillOnWhatsApp
} from "../utils/formatters";

export const ThermalReceipt = () => {
  const {
    config,
    lang,
    t,
    activeBillForPrint,
    setActiveBillForPrint,
    updateConfig
  } = useApp();

  const printQrCanvasRef = useRef(null);

  const bill = activeBillForPrint;

  // Render UPI QR onto receipt canvas
  useEffect(() => {
    if (bill && printQrCanvasRef.current) {
      const upiText = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(
        config.payeeName
      )}&am=${bill.grandTotal}&cu=INR&tn=${encodeURIComponent(
        `Bill ${bill.billNumber}`
      )}`;
      QRCode.toCanvas(
        printQrCanvasRef.current,
        upiText,
        {
          width: 120,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff"
          }
        },
        (e) => {
          if (e) console.error(e);
        }
      );
    }
  }, [bill, config]);

  if (!bill) return null;

  const is80mm = config.printerPaperWidth === "80mm";
  const rollWidthClass = is80mm ? "w-[80mm] max-w-[80mm]" : "w-[58mm] max-w-[58mm]";

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    shareBillOnWhatsApp(bill, config);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Top Control Bar */}
        <div className="p-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              {t("printerWidth")}:
            </span>
            <div className="inline-flex bg-slate-700 p-0.5 rounded-lg text-xs font-bold">
              <button
                onClick={() => updateConfig({ printerPaperWidth: "58mm" })}
                className={`px-2 py-1 rounded transition ${
                  !is80mm ? "bg-rose-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => updateConfig({ printerPaperWidth: "80mm" })}
                className={`px-2 py-1 rounded transition ${
                  is80mm ? "bg-rose-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                80mm
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setActiveBillForPrint(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Preview Area */}
        <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-800/50 flex-1">
          
          {/* THE ACTUAL THERMAL RECEIPT SLIP */}
          <div
            id="thermal-receipt"
            className={`bg-white text-black p-3 rounded shadow-lg font-mono text-[11px] leading-tight select-text ${rollWidthClass}`}
          >
            {/* Header */}
            <div className="text-center space-y-0.5">
              <div className="text-sm font-black tracking-wider uppercase font-sans">
                {config.shopNameEn}
              </div>
              <div className="text-xs font-bold text-gray-700 font-sans">
                {config.shopNameTa}
              </div>
              <div className="text-[10px] text-gray-600">
                {config.taglineEn}
              </div>
              <div className="text-[10px] text-gray-800">
                {config.addressEn}
              </div>
              <div className="text-[10px] font-bold">
                Phone: {config.phone}
              </div>
              {config.gstNumber && (
                <div className="text-[10px] font-bold">
                  GSTIN: {config.gstNumber}
                </div>
              )}
              {config.fssaiNumber && (
                <div className="text-[9px] text-gray-700">
                  FSSAI Lic: {config.fssaiNumber}
                </div>
              )}
            </div>

            <div className="my-1.5 border-b border-black border-dashed"></div>

            {/* Bill Meta */}
            <div className="text-[10px] space-y-0.5">
              <div className="flex justify-between font-bold">
                <span>BILL: {bill.billNumber}</span>
                <span className="text-xs bg-black text-white px-1 font-black">
                  TOKEN #{bill.tokenNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>DATE: {formatDateTime(bill.createdAt)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>
                  ORDER: {bill.orderType === "takeaway" ? "PARCEL / TAKEAWAY (பார்சல்)" : "DINE-IN (உள்ளே சாப்பிட)"}
                </span>
              </div>
              {bill.customerPhone && (
                <div>PHONE: {bill.customerPhone}</div>
              )}
            </div>

            <div className="my-1.5 border-b border-black border-dashed"></div>

            {/* Items Table */}
            <div>
              <div className="flex justify-between font-bold pb-1 text-[10px]">
                <span className="flex-1">ITEM</span>
                <span className="w-8 text-center">QTY</span>
                <span className="w-12 text-right">RATE</span>
                <span className="w-14 text-right">AMT</span>
              </div>
              <div className="border-b border-gray-400 border-dotted mb-1"></div>

              {bill.items.map((item, index) => (
                <div key={index} className="py-0.5">
                  <div className="font-bold text-[10.5px]">
                    {item.nameEn}
                  </div>
                  {item.nameTa && (
                    <div className="text-[9px] text-gray-600 font-sans">
                      {item.nameTa}
                    </div>
                  )}
                  <div className="flex justify-between text-[10px]">
                    <span className="flex-1"></span>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <span className="w-12 text-right">{item.price.toFixed(0)}</span>
                    <span className="w-14 text-right font-bold">
                      {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-1.5 border-b border-black border-dashed"></div>

            {/* Calculations Breakdown */}
            <div className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{bill.subtotal.toFixed(2)}</span>
              </div>

              {bill.parcelFee > 0 && (
                <div className="flex justify-between">
                  <span>Parcel Box Charges:</span>
                  <span>₹{bill.parcelFee.toFixed(2)}</span>
                </div>
              )}

              {bill.discountAmount > 0 && (
                <div className="flex justify-between font-bold">
                  <span>Discount:</span>
                  <span>-₹{bill.discountAmount.toFixed(2)}</span>
                </div>
              )}

              {bill.taxAmount > 0 && (
                <>
                  <div className="flex justify-between text-[10px] text-gray-700">
                    <span>CGST (2.5%):</span>
                    <span>₹{(bill.taxAmount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-700">
                    <span>SGST (2.5%):</span>
                    <span>₹{(bill.taxAmount / 2).toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="border-b-2 border-black my-1"></div>

              {/* Grand Total */}
              <div className="flex justify-between text-sm font-black pt-0.5">
                <span>NET TOTAL:</span>
                <span>₹{bill.grandTotal.toFixed(2)}</span>
              </div>

              <div className="border-b border-black border-dashed my-1"></div>

              {/* Payment Mode */}
              <div className="flex justify-between text-[10px] font-bold">
                <span>PAYMENT MODE:</span>
                <span className="uppercase">{bill.paymentMode}</span>
              </div>

              {bill.paymentMode === "cash" && bill.receivedAmount > bill.grandTotal && (
                <div className="flex justify-between text-[10px]">
                  <span>CASH TENDERED:</span>
                  <span>₹{bill.receivedAmount.toFixed(2)}</span>
                </div>
              )}
              {bill.changeAmount > 0 && (
                <div className="flex justify-between text-[10px] font-bold">
                  <span>CHANGE RETURNED:</span>
                  <span>₹{bill.changeAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* UPI QR on Bill (Optional scan for records/payment) */}
            <div className="mt-2 text-center flex flex-col items-center">
              <canvas ref={printQrCanvasRef} className="mx-auto" />
              <div className="text-[9px] text-gray-600 mt-0.5">
                Scan to pay via UPI / GPay
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="mt-2 pt-1 border-t border-black border-dotted text-center space-y-0.5">
              <div className="text-[10px] font-bold font-sans">
                {config.receiptFooterTa}
              </div>
              <div className="text-[9px] font-sans">
                {config.receiptFooterEn}
              </div>
              <div className="text-[8px] text-gray-500 pt-1">
                {config.poweredBy}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Slip</span>
          </button>
        </div>

      </div>
    </div>
  );
};
