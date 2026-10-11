/**
 * Formatting and Helper Utilities
 */

// Format Currency in Indian Rupee format
export const formatCurrency = (amount, symbol = "₹") => {
  const num = Number(amount) || 0;
  return `${symbol}${num.toLocaleString("en-IN", {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
};

// Format Date & Time: "10 Oct 2026, 08:45 PM"
export const formatDateTime = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

// Format Time only: "08:45 PM"
export const formatTimeOnly = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

// Generate next bill number based on existing orders
export const generateBillNumber = (prefix = "AB", existingOrders = []) => {
  const today = new Date();
  const dateStr = today.toISOString().slice(2, 10).replace(/-/g, ""); // e.g. 261011
  const countToday = existingOrders.filter((o) => {
    const oDate = new Date(o.createdAt);
    return oDate.toDateString() === today.toDateString();
  }).length + 1;

  const paddedCount = String(countToday).padStart(3, "0");
  return `${prefix}-${dateStr}-${paddedCount}`;
};

// Generate next daily token number (e.g. 1, 2, 3...)
export const generateDailyTokenNumber = (existingOrders = []) => {
  const today = new Date();
  const countToday = existingOrders.filter((o) => {
    const oDate = new Date(o.createdAt);
    return oDate.toDateString() === today.toDateString();
  }).length + 1;
  return countToday;
};

// Generate WhatsApp invoice text
export const buildWhatsAppBillMessage = (order, config) => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.nameEn} x ${item.quantity} = ₹${(
          item.price * item.quantity
        ).toFixed(0)}`
    )
    .join("\n");

  const dineType =
    order.orderType === "takeaway" ? "📦 Takeaway (பார்சல்)" : "🍽️ Dine-In (உள்ளே சாப்பிட)";

  return `*${config.shopNameEn}*
_${config.shopNameTa}_
${config.addressEn}
Phone: ${config.phone}
--------------------------------
🧾 *BILL NO:* ${order.billNumber}
🔢 *TOKEN NO:* #${order.tokenNumber}
📅 *DATE:* ${formatDateTime(order.createdAt)}
📍 *TYPE:* ${dineType}
--------------------------------
*ITEMS ORDERED:*
${itemsText}
--------------------------------
Subtotal: ₹${order.subtotal.toFixed(0)}
${order.discountAmount > 0 ? `Discount: -₹${order.discountAmount.toFixed(0)}\n` : ""}${
    order.parcelFee > 0 ? `Parcel Box: ₹${order.parcelFee.toFixed(0)}\n` : ""
  }${order.taxAmount > 0 ? `GST (${config.taxRatePercent}%): ₹${order.taxAmount.toFixed(0)}\n` : ""}*GRAND TOTAL: ₹${order.grandTotal.toFixed(0)}*
Payment: ${order.paymentMode.toUpperCase()}
--------------------------------
${config.receiptFooterEn}
${config.receiptFooterTa}
_Powered by ${config.shopNameEn} SmartPOS_`;
};

// Open WhatsApp chat with prefilled bill
export const shareBillOnWhatsApp = (order, config) => {
  const message = buildWhatsAppBillMessage(order, config);
  const rawPhone = order.customerPhone || config.whatsappNumber;
  const cleanPhone = (rawPhone || "").replace(/[^0-9]/g, "");

  // If user entered 10 digit Indian number without country code, prefix 91
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  let url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  if (!cleanPhone) {
    url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
  window.open(url, "_blank");
};

// Download CSV helper
export const downloadCsv = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
