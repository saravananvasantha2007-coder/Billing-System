import React, { useState } from "react";
import { Lock, X, Delete, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export const OwnerPinModal = () => {
  const {
    isOwnerPinModalOpen,
    setIsOwnerPinModalOpen,
    verifyPin,
    lang,
    t
  } = useApp();

  const [enteredPin, setEnteredPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOwnerPinModalOpen) return null;

  const handleKeyPress = (num) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + num;
      setEnteredPin(next);
      setErrorMessage("");

      // Auto verify when 4 digits reached
      if (next.length === 4) {
        setTimeout(() => {
          const success = verifyPin(next);
          if (!success) {
            setErrorMessage(
              lang === "ta" ? "தவறான PIN! மீண்டும் முயலவும்." : "Incorrect PIN. Try again."
            );
            setEnteredPin("");
          }
        }, 100);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMessage("");
  };

  const handleClear = () => {
    setEnteredPin("");
    setErrorMessage("");
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const success = verifyPin(enteredPin);
    if (!success) {
      setErrorMessage(
        lang === "ta" ? "தவறான PIN! மீண்டும் முயலவும்." : "Incorrect PIN. Try again."
      );
      setEnteredPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center shadow-2xl border border-rose-100 space-y-4 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="w-8 h-8"></div>
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <button
            onClick={() => {
              setIsOwnerPinModalOpen(false);
              setEnteredPin("");
              setErrorMessage("");
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h2 className="text-base font-black text-slate-900">
            {t("unlockOwner")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "ta"
              ? "டாஷ்போர்டு மற்றும் அறிக்கைகளை பார்க்க 4 இலக்க PIN ஐ உள்ளிடவும்"
              : "Enter 4-digit Owner PIN to access confidential reports & settings"}
          </p>
        </div>

        {/* PIN Indicators (4 Dots) */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = enteredPin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? "bg-rose-600 scale-110 shadow-sm shadow-rose-300"
                    : "bg-slate-200 border border-slate-300"
                }`}
              ></div>
            );
          })}
        </div>

        {errorMessage && (
          <div className="text-xs font-bold text-red-600 animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* Touch-Friendly Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(String(num))}
              className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-lg font-black transition active:scale-95 border border-slate-200 shadow-xs"
            >
              {num}
            </button>
          ))}

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition active:scale-95 border border-slate-200"
          >
            C
          </button>

          {/* 0 */}
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-lg font-black transition active:scale-95 border border-slate-200 shadow-xs"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 border border-slate-200"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-semibold pt-1">
          Demo Default PIN: <span className="font-mono font-bold text-slate-600">1234</span>
        </div>

      </div>
    </div>
  );
};
