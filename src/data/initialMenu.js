/**
 * Pre-loaded Demo Menu (18+ Authentic South Indian Hotel & Tiffin Items)
 * Realistic ₹ prices, Tamil + English names, category mapping, and images.
 */

export const INITIAL_CATEGORIES = [
  { id: "all", nameEn: "All Items", nameTa: "அனைத்தும்", icon: "🍽️" },
  { id: "breakfast", nameEn: "Breakfast", nameTa: "காலை உணவு", icon: "🥞" },
  { id: "lunch", nameEn: "Lunch", nameTa: "மதிய உணவு", icon: "🍛" },
  { id: "dinner", nameEn: "Dinner", nameTa: "இரவு உணவு", icon: "🫓" },
  { id: "snacks", nameEn: "Snacks", nameTa: "சிற்றுண்டி", icon: "🥟" },
  { id: "drinks", nameEn: "Drinks", nameTa: "பானங்கள்", icon: "☕" }
];

export const INITIAL_MENU = [
  // Breakfast
  {
    id: "item-1",
    nameEn: "Idli (2 Pcs)",
    nameTa: "இட்லி (2)",
    category: "breakfast",
    price: 30,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Steamed soft rice cakes served with hot sambar and 2 chutneys",
    descriptionTa: "பஞ்சு போன்ற இட்லி, சாம்பார் மற்றும் 2 வகை சட்னியுடன்"
  },
  {
    id: "item-2",
    nameEn: "Medu Vada (1 Pc)",
    nameTa: "மெது வடை (1)",
    category: "breakfast",
    price: 20,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Crisp golden lentil fritter with coconut chutney & sambar",
    descriptionTa: "மொறுமொறுப்பான உளுந்து வடை தேங்காய் சட்னியுடன்"
  },
  {
    id: "item-3",
    nameEn: "Special Masala Dosa",
    nameTa: "ஸ்பெஷல் மசாலா தோசை",
    category: "breakfast",
    price: 70,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Crispy roasted dosa stuffed with spicy tempered potato masala",
    descriptionTa: "மணம் கமழும் உருளைக்கிழங்கு மசாலா நிரப்பப்பட்ட மொறுமொறு தோசை"
  },
  {
    id: "item-4",
    nameEn: "Ghee Roast Dosa",
    nameTa: "நெய் ரோஸ்ட் தோசை",
    category: "breakfast",
    price: 85,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Crispy golden paper thin dosa drizzled with pure aromatic ghee",
    descriptionTa: "சுத்தமான பசு நெய்யில் சுட்ட மொறுமொறு ரோஸ்ட்"
  },
  {
    id: "item-5",
    nameEn: "Ghee Ven Pongal",
    nameTa: "நெய் வெண் பொங்கல்",
    category: "breakfast",
    price: 55,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Piping hot rice lentil porridge tempered with pepper, cumin, ghee cashews",
    descriptionTa: "மிளகு, சீரகம், முந்திரி தாளித்த சுவையான நெய் பொங்கல்"
  },
  {
    id: "item-6",
    nameEn: "Poori Masala (2 Pcs)",
    nameTa: "பூரி மசாலா (2)",
    category: "breakfast",
    price: 60,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Fluffy deep fried whole wheat flatbreads with rich potato kurma",
    descriptionTa: "உப்பலான பூரி மற்றும் ருசியான உருளைக்கிழங்கு மசாலா"
  },

  // Lunch
  {
    id: "item-7",
    nameEn: "South Indian Meals",
    nameTa: "தென்னிந்திய சாப்பாடு",
    category: "lunch",
    price: 110,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Ponni rice, Sambar, Rasam, Kara Kuzhambu, Kootu, Poriyal, Appalam & Curd",
    descriptionTa: "பொன்னி சாதம், சாம்பார், ரசம், காரக்குழம்பு, கூட்டு, பொரியல், அப்பளம், தயிர்"
  },
  {
    id: "item-8",
    nameEn: "Mini Tiffin Combo",
    nameTa: "மினி டிபன் காம்போ",
    category: "lunch",
    price: 95,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "1 Mini Masala Dosa, 1 Idli, 1 Vada, Pongal & Rava Kesari sweet",
    descriptionTa: "மினி தோசை, 1 இட்லி, 1 வடை, பொங்கல் & ரவா கேசரி"
  },
  {
    id: "item-9",
    nameEn: "Sambar Rice with Appalam",
    nameTa: "சாம்பார் சாதம் & அப்பளம்",
    category: "lunch",
    price: 55,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Hot aromatic lentil rice topped with ghee and crispy appalam",
    descriptionTa: "நெய் மணம் கமழும் சாம்பார் சாதம் மற்றும் அப்பளம்"
  },
  {
    id: "item-10",
    nameEn: "Curd Rice with Pickle",
    nameTa: "தயிர் சாதம் & ஊறுகாய்",
    category: "lunch",
    price: 50,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Cool tempered curd rice with mustard, pomegranate and mango pickle",
    descriptionTa: "தாளித்த குளிர்ச்சியான தயிர் சாதம் மற்றும் மாங்காய் ஊறுகாய்"
  },

  // Dinner
  {
    id: "item-11",
    nameEn: "Malabar Parotta (2 Pcs)",
    nameTa: "பரோட்டா (2) சால்னாவுடன்",
    category: "dinner",
    price: 50,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Soft, flaky layered parottas served with rich spiced vegetable salna",
    descriptionTa: "மிருதுவான அடுக்கு பரோட்டா மற்றும் சுவையான காய்கறி சால்னா"
  },
  {
    id: "item-12",
    nameEn: "Chapati (2 Pcs) Kurma",
    nameTa: "சப்பாத்தி (2) குருமாவுடன்",
    category: "dinner",
    price: 50,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Healthy soft whole wheat flatbreads with coconut veg kurma",
    descriptionTa: "மென்மையான கோதுமை சப்பாத்தி மற்றும் காய்கறி குருமா"
  },
  {
    id: "item-13",
    nameEn: "Onion Rava Dosa",
    nameTa: "வெங்காய ரவா தோசை",
    category: "dinner",
    price: 75,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Crisp, porous semolina crepe garnished with sautéed onions and cashews",
    descriptionTa: "பொன்னிற மொறுமொறு ரவா தோசை வெங்காயம் மற்றும் முந்திரியுடன்"
  },

  // Snacks
  {
    id: "item-14",
    nameEn: "Onion Bajji (2 Pcs)",
    nameTa: "வெங்காய பஜ்ஜி (2)",
    category: "snacks",
    price: 30,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Crispy batter fried onion slices served with spicy red chutney",
    descriptionTa: "மொறுமொறு வெங்காய பஜ்ஜி கார சட்னியுடன்"
  },
  {
    id: "item-15",
    nameEn: "Rava Kesari Sweet",
    nameTa: "ரவா கேசரி இனிப்பு",
    category: "snacks",
    price: 35,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Traditional saffron semolina pudding loaded with pure ghee & cashews",
    descriptionTa: "நெய்யில் வறுத்த முந்திரி திராட்சை கலந்த சுவையான ரவா கேசரி"
  },

  // Drinks
  {
    id: "item-16",
    nameEn: "South Indian Filter Coffee",
    nameTa: "கும்பகோணம் ஃபில்டர் காபி",
    category: "drinks",
    price: 25,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Authentic strong decoction degree coffee served in traditional dabarah set",
    descriptionTa: "பித்தளை டவரா செட்டில் மணக்கும் திக் ஃபில்டர் காபி"
  },
  {
    id: "item-17",
    nameEn: "Special Masala Tea",
    nameTa: "ஸ்பெஷல் மசாலா டீ",
    category: "drinks",
    price: 20,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Hot brewed tea with crushed ginger, cardamom and aromatic spices",
    descriptionTa: "இஞ்சி ஏலக்காய் தட்டிய சுடச்சுட மசாலா டீ"
  },
  {
    id: "item-18",
    nameEn: "Fresh Lime Soda",
    nameTa: "ஃப்ரெஷ் லெமன் சோடா",
    category: "drinks",
    price: 35,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Chilled sparkling lime drink (Sweet & Salt) for quick digestion",
    descriptionTa: "குளிர்ச்சியான புத்துணர்ச்சி தரும் எலுமிச்சை சோடா"
  },
  {
    id: "item-19",
    nameEn: "Chilled Rose Milk",
    nameTa: "ஜில் ரோஸ் மில்க்",
    category: "drinks",
    price: 40,
    isVeg: true,
    available: true,
    image: "https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80",
    descriptionEn: "Traditional fragrant chilled milk infused with sweet Damascus rose syrup",
    descriptionTa: "சுவையான குளிர்ந்த ரோஸ் சிரப் பால்"
  }
];

export const loadMenuItems = () => {
  try {
    const saved = localStorage.getItem("hotel_menu_items");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load menu from localStorage", e);
  }
  return INITIAL_MENU;
};

export const saveMenuItems = (items) => {
  try {
    localStorage.setItem("hotel_menu_items", JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save menu to localStorage", e);
  }
};
