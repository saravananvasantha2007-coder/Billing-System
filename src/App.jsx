import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { PosScreen } from "./components/PosScreen";
import { Dashboard } from "./components/Dashboard";
import { BillHistory } from "./components/BillHistory";
import { MenuManagement } from "./components/MenuManagement";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { PaymentModal } from "./components/PaymentModal";
import { SuccessModal } from "./components/SuccessModal";
import { ThermalReceipt } from "./components/ThermalReceipt";
import { OwnerPinModal } from "./components/OwnerPinModal";

const MainApp = () => {
  const {
    activeTab,
    setActiveTab,
    clearCart,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    activeBillForPrint,
    setActiveBillForPrint,
    isOwnerPinModalOpen,
    setIsOwnerPinModalOpen
  } = useApp();

  // Global Keyboard Shortcuts (F2 for New Bill, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        clearCart();
        setActiveTab("pos");
      } else if (e.key === "Escape") {
        if (isPaymentModalOpen) setIsPaymentModalOpen(false);
        if (isSuccessModalOpen) setIsSuccessModalOpen(false);
        if (activeBillForPrint) setActiveBillForPrint(null);
        if (isOwnerPinModalOpen) setIsOwnerPinModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    clearCart,
    setActiveTab,
    isPaymentModalOpen,
    isSuccessModalOpen,
    activeBillForPrint,
    isOwnerPinModalOpen,
    setIsPaymentModalOpen,
    setIsSuccessModalOpen,
    setActiveBillForPrint,
    setIsOwnerPinModalOpen
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 pb-16 lg:pb-6">
        {activeTab === "landing" && <LandingPage />}
        {activeTab === "pos" && <PosScreen />}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "bills" && <BillHistory />}
        {activeTab === "menu" && <MenuManagement />}
        {activeTab === "reports" && <Reports />}
        {activeTab === "settings" && <Settings />}
      </main>

      {/* Global Interactive Modals */}
      <PaymentModal />
      <SuccessModal />
      <ThermalReceipt />
      <OwnerPinModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
