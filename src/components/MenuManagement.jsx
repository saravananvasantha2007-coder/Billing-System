import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  AlertCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { INITIAL_CATEGORIES } from "../data/initialMenu";
import { formatCurrency } from "../utils/formatters";

// Curated preset South Indian dish photo options
const PRESET_PHOTOS = [
  { name: "Idli Sambar", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80" },
  { name: "Crispy Dosa", url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80" },
  { name: "Medu Vada", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80" },
  { name: "Pongal / Rice", url: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80" },
  { name: "Meals Thali", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80" },
  { name: "Parotta Salna", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80" },
  { name: "Poori Masala", url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80" },
  { name: "Filter Coffee", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" },
  { name: "Masala Tea", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80" },
  { name: "Chilled Drinks", url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" }
];

export const MenuManagement = () => {
  const {
    lang,
    t,
    menu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    requireOwnerAuth,
    isOwnerMode
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    nameEn: "",
    nameTa: "",
    category: "breakfast",
    price: "",
    image: PRESET_PHOTOS[0].url,
    descriptionEn: "",
    descriptionTa: "",
    isVeg: true
  });

  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.nameEn?.toLowerCase().includes(q) ||
        item.nameTa?.toLowerCase().includes(q) ||
        String(item.price).includes(q);
      return matchCat && matchQuery;
    });
  }, [menu, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nameEn: "",
      nameTa: "",
      category: "breakfast",
      price: "",
      image: PRESET_PHOTOS[0].url,
      descriptionEn: "",
      descriptionTa: "",
      isVeg: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nameEn: item.nameEn || "",
      nameTa: item.nameTa || "",
      category: item.category || "breakfast",
      price: item.price || "",
      image: item.image || PRESET_PHOTOS[0].url,
      descriptionEn: item.descriptionEn || "",
      descriptionTa: item.descriptionTa || "",
      isVeg: item.isVeg ?? true
    });
    setIsModalOpen(true);
  };

  // Image file upload handler (converts to base64)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.price) return;

    const payload = {
      ...formData,
      price: Number(formData.price) || 0
    };

    if (editingItem) {
      updateMenuItem({ ...editingItem, ...payload });
    } else {
      addMenuItem(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Title & Add Button */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("menuTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "ta"
              ? "புதிய உணவுகளை சேர்க்க, விலையை திருத்த மற்றும் 'தீர்ந்துவிட்டது' என குறிக்க"
              : "Add new dishes, update prices, upload photos and toggle Sold Out status"}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addItem")}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                  selectedCategory === cat.id
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"
                }`}
              >
                <span>{cat.icon} </span>
                <span>{lang === "ta" ? cat.nameTa : cat.nameEn}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredItems.map((item) => {
          const isAvailable = item.available ?? true;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition ${
                isAvailable
                  ? "border-slate-200 hover:border-rose-300"
                  : "border-slate-300 bg-slate-50 opacity-70"
              }`}
            >
              {/* Photo & Status Banner */}
              <div className="relative h-32 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.nameEn}
                  className="w-full h-full object-cover"
                />

                {/* Sold Out Overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="px-2.5 py-1 bg-red-600 text-white font-black text-xs rounded-lg uppercase">
                      {t("soldOut")}
                    </span>
                  </div>
                )}

                {/* Price tag */}
                <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-xs font-black shadow">
                  {formatCurrency(item.price)}
                </div>

                {/* Category tag */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase">
                  {item.category}
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {lang === "ta" ? item.nameTa : item.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {lang === "ta" ? item.nameEn : item.nameTa}
                  </p>
                </div>

                {/* Status Toggle & Action Buttons */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Availability Toggle Button */}
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      isAvailable
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t("available")}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t("soldOut")}</span>
                      </>
                    )}
                  </button>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title={t("editItem")}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title={t("deleteDish")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-rose-100 space-y-4 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {editingItem ? t("editItem") : t("addItem")}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t("dishNameEn")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Masala Dosa"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t("dishNameTa")}
                  </label>
                  <input
                    type="text"
                    value={formData.nameTa}
                    onChange={(e) => setFormData({ ...formData, nameTa: e.target.value })}
                    placeholder="e.g. மசாலா தோசை"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t("category")} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="breakfast">Breakfast (காலை உணவு)</option>
                    <option value="lunch">Lunch (மதிய உணவு)</option>
                    <option value="dinner">Dinner (இரவு உணவு)</option>
                    <option value="snacks">Snacks (சிற்றுண்டி)</option>
                    <option value="drinks">Drinks (பானங்கள்)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t("sellingPrice")} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="50"
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t("imageUrl")}
                </label>
                
                {/* Photo Presets Grid */}
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {PRESET_PHOTOS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: p.url })}
                      className={`relative h-12 rounded-lg overflow-hidden border-2 transition ${
                        formData.image === p.url
                          ? "border-rose-600 ring-2 ring-rose-500/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Upload or Custom URL input */}
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none text-[11px]"
                  />
                  <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1 border border-slate-200 text-[11px]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black shadow-md shadow-rose-200 transition"
                >
                  {t("saveDish")}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t("deleteDish")}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t("confirmDeleteDish")}
              </p>
              <div className="text-xs font-bold text-slate-800 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                {itemToDelete.nameEn} ({itemToDelete.nameTa}) • {formatCurrency(itemToDelete.price)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {t("deleteDish")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
