import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { DEFAULT_SHOP_CONFIG, loadShopConfig, saveShopConfig } from "../config/shopConfig";
import { INITIAL_MENU, loadMenuItems, saveMenuItems } from "../data/initialMenu";
import { translations } from "../utils/translations";
import { sounds } from "../utils/audio";
import { generateBillNumber, generateDailyTokenNumber } from "../utils/formatters";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Language state: 'en' or 'ta'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("hotel_app_lang") || "en";
  });

  const toggleLang = () => {
    const next = lang === "en" ? "ta" : "en";
    setLang(next);
    localStorage.setItem("hotel_app_lang", next);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  // 2. White-label Shop Configuration
  const [config, setConfig] = useState(loadShopConfig);

  const updateConfig = (newConfig) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    saveShopConfig(updated);
  };

  // 3. Menu Management
  const [menu, setMenu] = useState(loadMenuItems);

  const addMenuItem = (item) => {
    const updated = [
      ...menu,
      {
        ...item,
        id: `item-${Date.now()}`,
        available: true
      }
    ];
    setMenu(updated);
    saveMenuItems(updated);
  };

  const updateMenuItem = (updatedItem) => {
    const updated = menu.map((m) => (m.id === updatedItem.id ? updatedItem : m));
    setMenu(updated);
    saveMenuItems(updated);
  };

  const deleteMenuItem = (itemId) => {
    const updated = menu.filter((m) => m.id !== itemId);
    setMenu(updated);
    saveMenuItems(updated);
  };

  const toggleItemAvailability = (itemId) => {
    const updated = menu.map((m) =>
      m.id === itemId ? { ...m, available: !m.available } : m
    );
    setMenu(updated);
    saveMenuItems(updated);
  };

  // 4. Orders / Bills History (Empty clean slate for real billing)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("hotel_billing_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const saveOrdersToStorage = (updatedOrders) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem("hotel_billing_orders", JSON.stringify(updatedOrders));
    } catch (e) {
      console.error(e);
    }
  };

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);
    setLastCreatedBill(newOrder);

    // Play sounds & confetti
    sounds.playSuccessChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Clear cart after checkout
    clearCart();
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
    return newOrder;
  };

  const deleteOrder = (orderId) => {
    const updated = orders.filter((o) => o.id !== orderId);
    saveOrdersToStorage(updated);
  };

  const clearAllOrders = () => {
    saveOrdersToStorage([]);
  };

  // 5. Active Screen Tab ('landing' | 'pos' | 'dashboard' | 'bills' | 'menu' | 'reports' | 'settings')
  const [activeTab, setActiveTab] = useState("pos");

  // 6. Security Mode: Owner Mode vs Staff Mode
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [isOwnerPinModalOpen, setIsOwnerPinModalOpen] = useState(false);
  const [pendingPinAction, setPendingPinAction] = useState(null);

  const requireOwnerAuth = (actionCallback) => {
    if (isOwnerMode) {
      actionCallback?.();
    } else {
      setPendingPinAction(() => actionCallback);
      setIsOwnerPinModalOpen(true);
    }
  };

  const verifyPin = (enteredPin) => {
    if (enteredPin === config.ownerPin) {
      setIsOwnerMode(true);
      setIsOwnerPinModalOpen(false);
      if (pendingPinAction) {
        pendingPinAction();
        setPendingPinAction(null);
      }
      return true;
    }
    sounds.playError();
    return false;
  };

  const lockStaffMode = () => {
    setIsOwnerMode(false);
    if (["dashboard", "reports", "settings"].includes(activeTab)) {
      setActiveTab("pos");
    }
  };

  // 7. Active Cart / Billing State (Clean token-based billing without table numbers)
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine-in"); // 'dine-in' | 'takeaway'
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [discountType, setDiscountType] = useState("percent"); // 'percent' | 'flat'
  const [discountValue, setDiscountValue] = useState(0);
  const [isTaxEnabled, setIsTaxEnabled] = useState(config.isTaxEnabled ?? true);

  // Sync tax enabled default with config
  useEffect(() => {
    setIsTaxEnabled(config.isTaxEnabled ?? true);
  }, [config.isTaxEnabled]);

  const addToCart = (item) => {
    if (!item.available) {
      sounds.playError();
      return;
    }
    sounds.playBeep();
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQty = (itemId, delta) => {
    sounds.playBeep();
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    sounds.playBeep();
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
    setCustomerPhone("");
    setCustomerName("");
  };

  // Financial Calculations for current cart
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const parcelFee =
    orderType === "takeaway" && cart.length > 0
      ? Number(config.parcelCharge || 0)
      : 0;

  let discountAmount = 0;
  if (discountValue > 0) {
    if (discountType === "percent") {
      discountAmount = (cartSubtotal * Number(discountValue)) / 100;
    } else {
      discountAmount = Number(discountValue);
    }
    discountAmount = Math.min(discountAmount, cartSubtotal);
  }

  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = isTaxEnabled
    ? Math.round((taxableAmount * Number(config.taxRatePercent || 0)) / 100)
    : 0;

  const grandTotal = Math.round(taxableAmount + parcelFee + taxAmount);

  // 8. Modals & Receipt Printing
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastCreatedBill, setLastCreatedBill] = useState(null);
  const [activeBillForPrint, setActiveBillForPrint] = useState(null);

  // Reset to factory clean data
  const resetToDemoData = () => {
    localStorage.removeItem("hotel_shop_config");
    localStorage.removeItem("hotel_menu_items");
    localStorage.removeItem("hotel_billing_orders");
    setConfig(DEFAULT_SHOP_CONFIG);
    setMenu(INITIAL_MENU);
    setOrders([]);
    clearCart();
  };

  return (
    <AppContext.Provider
      value={{
        // Lang
        lang,
        toggleLang,
        t,

        // Shop Config
        config,
        updateConfig,

        // Menu
        menu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,

        // Orders
        orders,
        addOrder,
        deleteOrder,
        clearAllOrders,

        // Navigation
        activeTab,
        setActiveTab,

        // Auth
        isOwnerMode,
        requireOwnerAuth,
        verifyPin,
        lockStaffMode,
        isOwnerPinModalOpen,
        setIsOwnerPinModalOpen,

        // Cart
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

        // Totals
        cartSubtotal,
        parcelFee,
        discountAmount,
        taxAmount,
        grandTotal,

        // Modals
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        lastCreatedBill,
        setLastCreatedBill,
        activeBillForPrint,
        setActiveBillForPrint,

        // Reset
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
