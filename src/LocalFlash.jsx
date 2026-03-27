
import { useState, useEffect, useRef, useCallback } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const CITIES = [
  { id: "bhopal", name: "Bhopal", state: "MP" },
  { id: "mumbai", name: "Mumbai", state: "MH" },
  { id: "delhi", name: "Delhi", state: "DL" },
  { id: "bangalore", name: "Bangalore", state: "KA" },
  { id: "hyderabad", name: "Hyderabad", state: "TS" },
];

const VENDORS = [
  { id: "v1", name: "ZapTech Electronics", category: "Electronics", logo: "⚡", rating: 4.7, verified: true, color: "#6366f1" },
  { id: "v2", name: "StyleHouse Fashion", category: "Fashion", logo: "👗", rating: 4.5, verified: true, color: "#ec4899" },
  { id: "v3", name: "FreshBite Foods", category: "Food", logo: "🍔", rating: 4.8, verified: true, color: "#f59e0b" },
  { id: "v4", name: "GlowUp Beauty", category: "Beauty", logo: "💄", rating: 4.6, verified: false, color: "#8b5cf6" },
  { id: "v5", name: "SportsPro Gear", category: "Sports", logo: "🏋️", rating: 4.4, verified: true, color: "#10b981" },
  { id: "v6", name: "HomeNest Decor", category: "Home", logo: "🏠", rating: 4.3, verified: true, color: "#f97316" },
];

const SALE_EVENTS = [
  {
    id: "evt1",
    title: "Mega Tech Blast",
    subtitle: "Up to 80% off on gadgets",
    banner: "⚡",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    startTime: Date.now() - 3600000,
    endTime: Date.now() + 7200000,
    status: "active",
    city: "bhopal",
    vendorSlots: ["v1", "v5"],
    totalDeals: 24,
    totalOrders: 1847,
  },
  {
    id: "evt2",
    title: "Fashion Fiesta",
    subtitle: "Trendy looks, crazy prices",
    banner: "👗",
    gradient: "from-pink-500 via-rose-500 to-red-600",
    startTime: Date.now() + 3600000,
    endTime: Date.now() + 14400000,
    status: "upcoming",
    city: "bhopal",
    vendorSlots: ["v2", "v4"],
    totalDeals: 18,
    totalOrders: 0,
  },
  {
    id: "evt3",
    title: "Foodie Frenzy",
    subtitle: "Best bites at half price",
    banner: "🍔",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    startTime: Date.now() - 7200000,
    endTime: Date.now() - 3600000,
    status: "ended",
    city: "bhopal",
    vendorSlots: ["v3"],
    totalDeals: 12,
    totalOrders: 3210,
  },
];

const DEALS = [
  { id: "d1", eventId: "evt1", vendorId: "v1", title: "AirPods Pro Clone", category: "Audio", image: "🎧", originalPrice: 4999, salePrice: 999, discount: 80, stock: 50, sold: 37, rating: 4.5, reviews: 128, description: "Premium wireless earbuds with noise cancellation", featured: true },
  { id: "d2", eventId: "evt1", vendorId: "v1", title: "Smart Watch X10", category: "Wearables", image: "⌚", originalPrice: 8999, salePrice: 1799, discount: 80, stock: 30, sold: 22, rating: 4.3, reviews: 89, description: "Feature-rich smartwatch with health tracking", featured: false },
  { id: "d3", eventId: "evt1", vendorId: "v5", title: "Resistance Band Set", category: "Fitness", image: "💪", originalPrice: 1499, salePrice: 299, discount: 80, stock: 100, sold: 78, rating: 4.6, reviews: 234, description: "5-piece resistance band set for home workouts", featured: false },
  { id: "d4", eventId: "evt1", vendorId: "v1", title: "Bluetooth Speaker", category: "Audio", image: "🔊", originalPrice: 3499, salePrice: 699, discount: 80, stock: 45, sold: 33, rating: 4.4, reviews: 156, description: "360° surround sound portable speaker", featured: true },
  { id: "d5", eventId: "evt1", vendorId: "v5", title: "Yoga Mat Premium", category: "Fitness", image: "🧘", originalPrice: 2999, salePrice: 599, discount: 80, stock: 60, sold: 41, rating: 4.7, reviews: 201, description: "Anti-slip eco-friendly yoga mat", featured: false },
  { id: "d6", eventId: "evt1", vendorId: "v1", title: "USB-C Hub 7-in-1", category: "Accessories", image: "🔌", originalPrice: 2499, salePrice: 499, discount: 80, stock: 80, sold: 55, rating: 4.2, reviews: 97, description: "7 ports including HDMI, USB 3.0 and more", featured: false },
];

const MYSTERY_REWARDS = [
  { type: "coupon", value: "20OFF", label: "₹200 OFF coupon", probability: 0.4 },
  { type: "coupon", value: "50OFF", label: "₹500 OFF coupon", probability: 0.2 },
  { type: "product", value: "d3", label: "Free Resistance Band Set!", probability: 0.1 },
  { type: "coupon", value: "10OFF", label: "₹100 OFF coupon", probability: 0.3 },
];

const WHEEL_SEGMENTS = [
  { label: "5% OFF", color: "#6366f1", value: 5 },
  { label: "10% OFF", color: "#ec4899", value: 10 },
  { label: "₹50 OFF", color: "#f59e0b", value: "50flat" },
  { label: "20% OFF", color: "#10b981", value: 20 },
  { label: "Try Again", color: "#94a3b8", value: null },
  { label: "₹100 OFF", color: "#f97316", value: "100flat" },
  { label: "15% OFF", color: "#8b5cf6", value: 15 },
  { label: "Free Ship", color: "#06b6d4", value: "freeship" },
];

const MOCK_ORDERS = [
  { id: "ORD001", dealId: "d1", status: "delivered", amount: 999, date: "2024-01-15", timeline: ["placed", "confirmed", "packed", "shipped", "delivered"] },
  { id: "ORD002", dealId: "d4", status: "shipped", amount: 699, date: "2024-01-18", timeline: ["placed", "confirmed", "packed", "shipped"] },
  { id: "ORD003", dealId: "d2", status: "packed", amount: 1799, date: "2024-01-20", timeline: ["placed", "confirmed", "packed"] },
];

const ANALYTICS_DATA = [
  { month: "Aug", sales: 42000, orders: 38, conversion: 3.2 },
  { month: "Sep", sales: 58000, orders: 52, conversion: 4.1 },
  { month: "Oct", sales: 71000, orders: 67, conversion: 5.0 },
  { month: "Nov", sales: 95000, orders: 89, conversion: 6.2 },
  { month: "Dec", sales: 142000, orders: 128, conversion: 8.1 },
  { month: "Jan", sales: 118000, orders: 104, conversion: 7.3 },
];

// ─── MOCK API ─────────────────────────────────────────────────────────────────

const simulateDelay = (ms = 600) => new Promise(r => setTimeout(r, ms));

const mockFetch = async (fn) => {
  await simulateDelay();
  return fn();
};

// ─── STORE (ZUSTAND-LIKE with useReducer) ─────────────────────────────────────

const createStore = (initialState, reducer) => {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach(l => l(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

// ─── GLOBAL STATE (simple context-based) ─────────────────────────────────────

import { createContext, useContext, useReducer } from "react";

const AppContext = createContext(null);

const initialAppState = {
  panel: "user", // "user" | "vendor"
  auth: { user: null, vendor: null, isLoggedIn: false, isVendorLoggedIn: false },
  city: CITIES[0],
  cart: [],
  orders: MOCK_ORDERS,
  wallet: { balance: 2450, rewards: [] },
  vendorStore: {
    deals: DEALS.filter(d => ["v1", "v5"].includes(d.vendorId)),
    orders: MOCK_ORDERS,
    wallet: { balance: 18420, pending: 3200 },
    bids: [],
    promoSlots: [],
  },
  events: SALE_EVENTS,
  deals: DEALS,
  notifications: [
    { id: "n1", text: "Your order ORD001 was delivered!", read: false, time: "2h ago" },
    { id: "n2", text: "New flash sale starts in 1 hour!", read: false, time: "45m ago" },
    { id: "n3", text: "You won a ₹200 OFF coupon!", read: true, time: "1d ago" },
  ],
  toast: null,
  loading: {},
  mysteryOpened: false,
  spinResult: null,
  wheelSpun: false,
  giftMode: false,
  giftDetails: { recipientName: "", message: "", deliveryDate: "" },
  checkoutStep: 0,
  selectedPayment: "upi",
  promoCode: "",
  promoApplied: false,
  orderPlaced: false,
  selectedEvent: null,
  selectedDeal: null,
  vendorView: "dashboard",
  dealForm: { title: "", price: "", inventory: "", discount: "", eventId: "evt1", image: "📦", description: "" },
  flyerGenerated: false,
  bannerGenerated: false,
  bidAmount: "",
  bidPlaced: false,
  kycStep: 0,
  storeSetupStep: 0,
  vendorSignupDone: false,
  userOnboarded: false,
  userSignupStep: 0,
  purchaseTicker: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_PANEL": return { ...state, panel: action.payload };
    case "SET_CITY": return { ...state, city: action.payload };
    case "LOGIN_USER": return { ...state, auth: { ...state.auth, user: action.payload, isLoggedIn: true }, userOnboarded: true };
    case "LOGIN_VENDOR": return { ...state, auth: { ...state.auth, vendor: action.payload, isVendorLoggedIn: true }, vendorSignupDone: true };
    case "LOGOUT_USER": return { ...state, auth: { ...state.auth, user: null, isLoggedIn: false } };
    case "LOGOUT_VENDOR": return { ...state, auth: { ...state.auth, vendor: null, isVendorLoggedIn: false }, vendorSignupDone: false };
    case "ADD_TO_CART": {
      const existing = state.cart.find(i => i.dealId === action.payload.id);
      if (existing) return { ...state, cart: state.cart.map(i => i.dealId === action.payload.id ? { ...i, qty: i.qty + 1 } : i) };
      return { ...state, cart: [...state.cart, { dealId: action.payload.id, qty: 1, deal: action.payload }] };
    }
    case "REMOVE_FROM_CART": return { ...state, cart: state.cart.filter(i => i.dealId !== action.payload) };
    case "UPDATE_QTY": return { ...state, cart: state.cart.map(i => i.dealId === action.payload.id ? { ...i, qty: action.payload.qty } : i) };
    case "CLEAR_CART": return { ...state, cart: [] };
    case "SHOW_TOAST": return { ...state, toast: action.payload };
    case "HIDE_TOAST": return { ...state, toast: null };
    case "SET_LOADING": return { ...state, loading: { ...state.loading, [action.payload.key]: action.payload.val } };
    case "OPEN_MYSTERY": return { ...state, mysteryOpened: true, wallet: { ...state.wallet, rewards: [...state.wallet.rewards, action.payload] } };
    case "SPIN_WHEEL": return { ...state, spinResult: action.payload, wheelSpun: true };
    case "SET_GIFT_MODE": return { ...state, giftMode: action.payload };
    case "SET_GIFT_DETAILS": return { ...state, giftDetails: { ...state.giftDetails, ...action.payload } };
    case "SET_CHECKOUT_STEP": return { ...state, checkoutStep: action.payload };
    case "SET_PAYMENT": return { ...state, selectedPayment: action.payload };
    case "APPLY_PROMO": return { ...state, promoApplied: action.payload };
    case "PLACE_ORDER": return {
      ...state, orderPlaced: true, cart: [],
      orders: [{ id: `ORD${String(state.orders.length + 1).padStart(3, "0")}`, dealId: state.cart[0]?.dealId, status: "placed", amount: action.payload, date: new Date().toISOString().split("T")[0], timeline: ["placed"] }, ...state.orders]
    };
    case "SELECT_EVENT": return { ...state, selectedEvent: action.payload };
    case "SELECT_DEAL": return { ...state, selectedDeal: action.payload };
    case "SET_VENDOR_VIEW": return { ...state, vendorView: action.payload };
    case "UPDATE_DEAL_FORM": return { ...state, dealForm: { ...state.dealForm, ...action.payload } };
    case "CREATE_DEAL": {
      const newDeal = { id: `d${Date.now()}`, eventId: state.dealForm.eventId, vendorId: "v1", title: state.dealForm.title, category: "Custom", image: state.dealForm.image || "📦", originalPrice: Number(state.dealForm.price) * 1.5, salePrice: Number(state.dealForm.price), discount: Number(state.dealForm.discount), stock: Number(state.dealForm.inventory), sold: 0, rating: 0, reviews: 0, description: state.dealForm.description, featured: false };
      return { ...state, deals: [...state.deals, newDeal], vendorStore: { ...state.vendorStore, deals: [...state.vendorStore.deals, newDeal] } };
    }
    case "GENERATE_FLYER": return { ...state, flyerGenerated: true };
    case "GENERATE_BANNER": return { ...state, bannerGenerated: true };
    case "SET_BID": return { ...state, bidAmount: action.payload };
    case "PLACE_BID": return { ...state, bidPlaced: true, vendorStore: { ...state.vendorStore, bids: [...state.vendorStore.bids, { eventId: action.payload.eventId, amount: action.payload.amount, status: "active" }], wallet: { ...state.vendorStore.wallet, balance: state.vendorStore.wallet.balance - Number(action.payload.amount) } } };
    case "SET_KYC_STEP": return { ...state, kycStep: action.payload };
    case "SET_STORE_STEP": return { ...state, storeSetupStep: action.payload };
    case "SET_USER_SIGNUP_STEP": return { ...state, userSignupStep: action.payload };
    case "ADD_TICKER": return { ...state, purchaseTicker: [action.payload, ...state.purchaseTicker].slice(0, 5) };
    case "MARK_NOTIFICATIONS_READ": return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case "UPDATE_ORDER_STATUS": return { ...state, vendorStore: { ...state.vendorStore, orders: state.vendorStore.orders.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status, timeline: [...o.timeline, action.payload.status] } : o) } };
    default: return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

function useApp() {
  return useContext(AppContext);
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────

function formatCurrency(n) { return "₹" + Number(n).toLocaleString("en-IN"); }

function formatTime(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, "0")).join(":");
}

function getEventStatus(event) {
  const now = Date.now();
  if (now < event.startTime) return "upcoming";
  if (now > event.endTime) return "ended";
  return "active";
}

function stockPercent(deal) { return Math.round(((deal.stock - deal.sold) / deal.stock) * 100); }

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────

function Button({ children, onClick, variant = "primary", size = "md", disabled, className = "", loading }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:from-violet-700 hover:to-indigo-700",
    secondary: "bg-white border-2 border-violet-200 text-violet-700 hover:bg-violet-50",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200",
    ghost: "text-gray-600 hover:bg-gray-100",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm gap-1.5", md: "px-4 py-2.5 text-sm gap-2", lg: "px-6 py-3 text-base gap-2.5" };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled || loading}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
      {children}
    </button>
  );
}

function Badge({ children, color = "violet" }) {
  const colors = { violet: "bg-violet-100 text-violet-700", green: "bg-emerald-100 text-emerald-700", red: "bg-red-100 text-red-700", amber: "bg-amber-100 text-amber-700", blue: "bg-blue-100 text-blue-700", gray: "bg-gray-100 text-gray-600", pink: "bg-pink-100 text-pink-700" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>{children}</span>;
}

function Card({ children, className = "", onClick, hover = false }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${hover ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">✕</button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const colors = { success: "bg-emerald-600", error: "bg-red-600", info: "bg-violet-600", warning: "bg-amber-600" };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${colors[toast.type] || "bg-gray-900"} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium animate-bounce-in max-w-sm`}>
      <span>{toast.icon || "✓"}</span> {toast.text}
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />;
}

function Input({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-400 outline-none text-sm text-gray-800 bg-white transition-colors"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-400 outline-none text-sm bg-white">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function CountdownTimer({ endTime, className = "" }) {
  const [remaining, setRemaining] = useState(endTime - Date.now());
  useEffect(() => {
    const iv = setInterval(() => setRemaining(endTime - Date.now()), 1000);
    return () => clearInterval(iv);
  }, [endTime]);
  const parts = formatTime(Math.max(0, remaining)).split(":");
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-black/20 backdrop-blur-sm text-white font-mono font-bold px-2 py-1 rounded-lg text-sm">{p}</span>
          {i < 2 && <span className="text-white/80 font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}

function StockBar({ deal }) {
  const pct = stockPercent(deal);
  const color = pct > 50 ? "from-emerald-400 to-teal-500" : pct > 20 ? "from-amber-400 to-orange-500" : "from-red-500 to-rose-600";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{deal.stock - deal.sold} left</span>
        <span>{deal.sold} sold</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`} style={{ width: `${100 - pct}%` }} />
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${active === tab.id ? "bg-white shadow text-violet-700" : "text-gray-500 hover:text-gray-700"}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── RECHARTS SIMPLE IMPLEMENTATION ──────────────────────────────────────────

function SimpleBarChart({ data, dataKey, color = "#6366f1" }) {
  const max = Math.max(...data.map(d => d[dataKey]));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d[dataKey] / max) * 100}%`, background: color, opacity: 0.8 + (i / data.length) * 0.2 }} />
          <span className="text-xs text-gray-500">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleLineChart({ data, dataKey, color = "#6366f1" }) {
  const max = Math.max(...data.map(d => d[dataKey]));
  const min = Math.min(...data.map(d => d[dataKey]));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 280 + 10;
    const y = 80 - ((d[dataKey] - min) / (max - min)) * 70;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 300 100" className="w-full h-24">
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 280 + 10;
        const y = 80 - ((d[dataKey] - min) / (max - min)) * 70;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

// ─── PANEL TOGGLE ─────────────────────────────────────────────────────────────

function PanelToggle() {
  const { state, dispatch } = useApp();
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex bg-gray-900 rounded-full p-1 shadow-2xl shadow-black/30 gap-1">
        {[{ id: "user", label: "🛍 User App" }, { id: "vendor", label: "🏪 Vendor Panel" }].map(p => (
          <button key={p.id} onClick={() => dispatch({ type: "SET_PANEL", payload: p.id })} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${state.panel === p.id ? "bg-violet-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── USER APP ─────────────────────────────────────────────────────────────────

function UserOnboarding() {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [detectedCity, setDetectedCity] = useState(null);

  const sendOtp = async () => {
    setLoading(true);
    await simulateDelay(1000);
    setOtpSent(true);
    setLoading(false);
    setStep(1);
  };

  const verifyOtp = async () => {
    setLoading(true);
    await simulateDelay(800);
    setStep(2);
    setLoading(false);
    // Detect city
    await simulateDelay(600);
    setDetectedCity(CITIES[0]);
  };

  const finish = () => {
    dispatch({ type: "LOGIN_USER", payload: { id: "u1", name: form.name || "Flash User", phone: form.phone } });
  };

  if (step === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-4xl font-black text-white">LocalFlash</h1>
        <p className="text-violet-200 mt-2">Hyperlocal Flash Sales, Near You</p>
      </div>
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Get Started</h2>
        <div className="space-y-4">
          <Input label="Your Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Enter your name" />
          <Input label="Mobile Number" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+91 98765 43210" type="tel" />
          <Select label="Country" value="IN" onChange={() => {}} options={[{ value: "IN", label: "🇮🇳 India" }, { value: "US", label: "🇺🇸 USA" }]} />
          <Button onClick={sendOtp} className="w-full" size="lg" loading={loading}>Send OTP →</Button>
        </div>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
        <button onClick={() => setStep(0)} className="text-gray-400 text-sm mb-4 flex items-center gap-1">← Back</button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Verify OTP</h2>
        <p className="text-gray-500 text-sm mb-5">Enter the 4-digit code sent to {form.phone}</p>
        <div className="space-y-4">
          <Input label="OTP Code" value={form.otp} onChange={v => setForm(f => ({ ...f, otp: v }))} placeholder="1234" type="number" />
          <p className="text-xs text-violet-600 font-semibold">Demo: any 4 digits work</p>
          <Button onClick={verifyOtp} className="w-full" size="lg" loading={loading} disabled={form.otp.length < 4}>Verify OTP →</Button>
        </div>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📍</div>
          <h2 className="text-xl font-bold text-gray-900">Detecting your location...</h2>
          {detectedCity && <p className="text-gray-500 text-sm mt-1">Found: <strong className="text-violet-600">{detectedCity.name}</strong></p>}
        </div>
        <div className="space-y-3">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => dispatch({ type: "SET_CITY", payload: c })} className={`w-full p-3 rounded-xl border-2 text-left font-semibold text-sm transition-all ${state.city.id === c.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-700 hover:border-violet-300"}`}>
              📍 {c.name}, {c.state}
            </button>
          ))}
          <Button onClick={finish} className="w-full mt-2" size="lg">Explore Deals →</Button>
        </div>
      </div>
    </div>
  );
}

function DealCard({ deal, compact = false }) {
  const { state, dispatch } = useApp();
  const [added, setAdded] = useState(false);

  const addToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", payload: deal });
    setAdded(true);
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: `${deal.title} added to cart!`, icon: "🛒" } });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Card hover onClick={() => dispatch({ type: "SELECT_DEAL", payload: deal })} className={compact ? "p-3" : "p-4"}>
      <div className="text-4xl text-center py-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-3">{deal.image}</div>
      {deal.featured && <Badge color="amber">⭐ Featured</Badge>}
      <h4 className={`font-bold text-gray-900 mt-1.5 ${compact ? "text-sm" : "text-base"}`}>{deal.title}</h4>
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`font-black text-violet-600 ${compact ? "text-base" : "text-lg"}`}>{formatCurrency(deal.salePrice)}</span>
        <span className="text-xs text-gray-400 line-through">{formatCurrency(deal.originalPrice)}</span>
        <Badge color="red">{deal.discount}% OFF</Badge>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
        <span>⭐ {deal.rating}</span>
        <span>({deal.reviews})</span>
      </div>
      <StockBar deal={deal} />
      <Button onClick={addToCart} className={`w-full mt-3 ${added ? "!from-emerald-500 !to-teal-600" : ""}`} size="sm">
        {added ? "✓ Added" : "Add to Cart"}
      </Button>
    </Card>
  );
}

function EventCard({ event, onClick }) {
  const status = getEventStatus(event);
  const statusColors = { active: "green", upcoming: "amber", ended: "gray" };
  return (
    <Card hover onClick={onClick} className="overflow-hidden">
      <div className={`bg-gradient-to-r ${event.gradient} p-5 relative`}>
        <div className="text-4xl mb-2">{event.banner}</div>
        <h3 className="font-black text-white text-lg">{event.title}</h3>
        <p className="text-white/80 text-sm">{event.subtitle}</p>
        {status === "active" && (
          <div className="mt-3">
            <p className="text-white/70 text-xs mb-1">Ends in</p>
            <CountdownTimer endTime={event.endTime} />
          </div>
        )}
        {status === "upcoming" && (
          <div className="mt-3">
            <p className="text-white/70 text-xs mb-1">Starts in</p>
            <CountdownTimer endTime={event.startTime} />
          </div>
        )}
        <div className="absolute top-4 right-4"><Badge color={statusColors[status]}>{status.toUpperCase()}</Badge></div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-4 text-sm text-gray-600">
          <span>🏪 {event.vendorSlots.length} vendors</span>
          <span>🎯 {event.totalDeals} deals</span>
          <span>📦 {event.totalOrders} orders</span>
        </div>
        {status === "active" && <Badge color="green">LIVE</Badge>}
      </div>
    </Card>
  );
}

function UserHomepage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  const [loadingDeals, setLoadingDeals] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoadingDeals(false), 1000);
    // Ticker simulation
    const names = ["Rahul", "Priya", "Amit", "Sneha", "Rohan", "Kavya"];
    const iv = setInterval(() => {
      const deal = DEALS[Math.floor(Math.random() * DEALS.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      dispatch({ type: "ADD_TICKER", payload: { name, deal: deal.title, time: "just now" } });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const activeEvents = state.events.filter(e => getEventStatus(e) === "active");
  const filteredDeals = activeTab === "all" ? state.deals : state.deals.filter(d => {
    const v = VENDORS.find(v => v.id === d.vendorId);
    return v?.category.toLowerCase() === activeTab;
  });

  return (
    <div className="space-y-5">
      {/* Hero Banner */}
      {activeEvents[0] && (
        <Card onClick={() => dispatch({ type: "SELECT_EVENT", payload: activeEvents[0] })} className={`overflow-hidden bg-gradient-to-r ${activeEvents[0].gradient} cursor-pointer`}>
          <div className="p-5">
            <Badge color="green">🔴 LIVE NOW</Badge>
            <h2 className="text-2xl font-black text-white mt-2">{activeEvents[0].title}</h2>
            <p className="text-white/80 text-sm mt-1">{activeEvents[0].subtitle}</p>
            <div className="mt-3 flex items-center gap-3">
              <CountdownTimer endTime={activeEvents[0].endTime} />
              <span className="text-white/70 text-sm">{activeEvents[0].totalDeals} deals</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-white text-sm">
              <span>🔥 {activeEvents[0].totalOrders.toLocaleString()} orders placed</span>
            </div>
          </div>
        </Card>
      )}

      {/* Purchase Ticker */}
      {state.purchaseTicker.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-3 space-y-1.5 border border-violet-100">
          <p className="text-xs font-bold text-violet-600 mb-2">🔥 People buying right now</p>
          {state.purchaseTicker.slice(0, 3).map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 animate-in fade-in">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white flex items-center justify-center font-bold text-xs">{t.name[0]}</div>
              <span><strong>{t.name}</strong> just bought <strong>{t.deal}</strong></span>
              <span className="ml-auto text-gray-400">{t.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: "🎰", label: "Spin Wheel", action: () => dispatch({ type: "SELECT_DEAL", payload: { _type: "spin" } }) },
          { icon: "🎁", label: "Mystery Box", action: () => dispatch({ type: "SELECT_DEAL", payload: { _type: "mystery" } }) },
          { icon: "🎫", label: "My Rewards", action: () => dispatch({ type: "SELECT_DEAL", payload: { _type: "rewards" } }) },
          { icon: "📍", label: "Change City", action: () => dispatch({ type: "SELECT_DEAL", payload: { _type: "city" } }) },
        ].map(a => (
          <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-semibold text-gray-600 text-center leading-tight">{a.label}</span>
          </button>
        ))}
      </div>

      {/* All Events */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">🎯 Sale Events</h3>
        <div className="space-y-3">
          {state.events.map(event => (
            <EventCard key={event.id} event={event} onClick={() => dispatch({ type: "SELECT_EVENT", payload: event })} />
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">⚡ Flash Deals</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["all", "electronics", "fashion", "food", "beauty", "sports"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === t ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {loadingDeals ? (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {filteredDeals.map(deal => <DealCard key={deal.id} deal={deal} compact />)}
          </div>
        )}
      </div>

      {/* Vendor Banners */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">🏪 Featured Vendors</h3>
        <div className="space-y-2">
          {VENDORS.slice(0, 3).map(v => (
            <Card key={v.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: v.color + "20" }}>{v.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{v.name}</span>
                  {v.verified && <Badge color="green">✓</Badge>}
                </div>
                <span className="text-xs text-gray-500">⭐ {v.rating} · {v.category}</span>
              </div>
              <Button size="sm" variant="secondary">Visit</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventPage({ event, onBack }) {
  const { state, dispatch } = useApp();
  const eventDeals = state.deals.filter(d => d.eventId === event.id);
  const status = getEventStatus(event);

  return (
    <div className="space-y-4">
      <div className={`bg-gradient-to-r ${event.gradient} rounded-3xl p-6 relative overflow-hidden`}>
        <button onClick={onBack} className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">←</button>
        <div className="text-5xl mt-2 mb-2">{event.banner}</div>
        <h2 className="text-2xl font-black text-white">{event.title}</h2>
        <p className="text-white/80 text-sm">{event.subtitle}</p>
        {status === "active" && (
          <div className="mt-3">
            <p className="text-white/70 text-xs mb-1">Ends in</p>
            <CountdownTimer endTime={event.endTime} />
          </div>
        )}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[["🏪", event.vendorSlots.length, "Vendors"], ["🎯", event.totalDeals, "Deals"], ["📦", event.totalOrders, "Orders"]].map(([icon, val, label]) => (
            <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
              <div className="text-lg font-black text-white">{val}</div>
              <div className="text-white/70 text-xs">{icon} {label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Participating Vendors */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Participating Vendors</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {event.vendorSlots.map(vid => {
            const v = VENDORS.find(v => v.id === vid);
            if (!v) return null;
            return (
              <div key={vid} className="flex-none text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-sm border border-gray-100" style={{ background: v.color + "15" }}>{v.logo}</div>
                <p className="text-xs font-semibold text-gray-700 mt-1 w-16 leading-tight">{v.name.split(" ")[0]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deals Grid */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">⚡ {eventDeals.length} Deals Available</h3>
        {eventDeals.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {eventDeals.map(deal => <DealCard key={deal.id} deal={deal} compact />)}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <p className="font-semibold">No deals yet in this event</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DealPage({ deal, onBack }) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState("info");
  const [qty, setQty] = useState(1);
  const vendor = VENDORS.find(v => v.id === deal.vendorId);
  const reviews = [
    { name: "Rahul K.", rating: 5, text: "Amazing product, super fast delivery!", date: "Jan 15" },
    { name: "Priya M.", rating: 4, text: "Good quality for the price. Highly recommend.", date: "Jan 12" },
    { name: "Amit S.", rating: 5, text: "Best deal I've gotten on this platform!", date: "Jan 10" },
  ];
  const qna = [
    { q: "Is this compatible with iPhone?", a: "Yes, works with all Bluetooth devices." },
    { q: "What's the battery life?", a: "Up to 24 hours with the case." },
  ];

  const addToCart = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: "ADD_TO_CART", payload: deal });
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: "Added to cart!", icon: "🛒" } });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">←</button>
        <h2 className="font-bold text-gray-900 flex-1">{deal.title}</h2>
      </div>

      {/* Image */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center h-48 text-7xl">
        {deal.image}
      </div>

      {/* Gift Toggle */}
      <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-2xl border border-pink-100">
        <span className="text-2xl">🎁</span>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">Send as Gift?</p>
          <p className="text-xs text-gray-500">Add a personal message</p>
        </div>
        <button onClick={() => dispatch({ type: "SET_GIFT_MODE", payload: !state.giftMode })} className={`w-12 h-6 rounded-full transition-all ${state.giftMode ? "bg-pink-500" : "bg-gray-300"}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${state.giftMode ? "ml-6" : "ml-0.5"}`} />
        </button>
      </div>

      {state.giftMode && (
        <Card className="p-4 space-y-3 border-2 border-pink-200">
          <Input label="Recipient Name" value={state.giftDetails.recipientName} onChange={v => dispatch({ type: "SET_GIFT_DETAILS", payload: { recipientName: v } })} placeholder="e.g. Mom" />
          <Input label="Message" value={state.giftDetails.message} onChange={v => dispatch({ type: "SET_GIFT_DETAILS", payload: { message: v } })} placeholder="Happy Birthday! 🎂" />
          <Input label="Delivery Date" value={state.giftDetails.deliveryDate} onChange={v => dispatch({ type: "SET_GIFT_DETAILS", payload: { deliveryDate: v } })} type="date" />
        </Card>
      )}

      {/* Price */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-black text-violet-600">{formatCurrency(deal.salePrice)}</p>
          <p className="text-gray-400 line-through text-sm">{formatCurrency(deal.originalPrice)}</p>
          <Badge color="red">🔥 {deal.discount}% OFF</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-gray-100 font-bold">−</button>
          <span className="font-bold text-lg w-8 text-center">{qty}</span>
          <button onClick={() => setQty(q => Math.min(10, q + 1))} className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold">+</button>
        </div>
      </div>

      <StockBar deal={deal} />

      {/* Tabs */}
      <Tabs tabs={[{ id: "info", label: "Info" }, { id: "reviews", label: `Reviews (${deal.reviews})` }, { id: "qna", label: "Q&A" }]} active={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && (
        <Card className="p-4 space-y-3">
          <p className="text-sm text-gray-700">{deal.description}</p>
          {vendor && (
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: vendor.color + "20" }}>{vendor.logo}</div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{vendor.name}</p>
                <p className="text-xs text-gray-500">⭐ {vendor.rating} · {vendor.verified ? "✓ Verified" : "Unverified"}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[["📦", "Free delivery"], ["🔄", "7-day returns"], ["✅", "Original product"], ["⚡", `ETA: ${Math.floor(Math.random()*3)+2} days`]].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-xs text-gray-600"><span>{icon}</span>{label}</div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                <div className="flex items-center gap-1">
                  {"⭐".repeat(r.rating)} <span className="text-xs text-gray-400 ml-1">{r.date}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{r.text}</p>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "qna" && (
        <div className="space-y-3">
          {qna.map((qa, i) => (
            <Card key={i} className="p-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">Q: {qa.q}</p>
              <p className="text-sm text-gray-600">A: {qa.a}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="h-20" />
      <div className="fixed bottom-20 left-0 right-0 max-w-lg mx-auto p-4">
        <Button onClick={addToCart} className="w-full" size="lg">
          🛒 Add to Cart · {formatCurrency(deal.salePrice * qty)}
        </Button>
      </div>
    </div>
  );
}

function SpinWheel() {
  const { state, dispatch } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(state.spinResult);

  const spin = async () => {
    if (state.wheelSpun) return;
    setSpinning(true);
    const spins = 5 + Math.random() * 5;
    const extra = Math.floor(Math.random() * 360);
    const totalDeg = spins * 360 + extra;
    setRotation(r => r + totalDeg);
    await simulateDelay(3000);
    const segIndex = Math.floor(((360 - (totalDeg % 360)) / 360) * WHEEL_SEGMENTS.length);
    const seg = WHEEL_SEGMENTS[segIndex % WHEEL_SEGMENTS.length];
    setResult(seg);
    dispatch({ type: "SPIN_WHEEL", payload: seg });
    setSpinning(false);
  };

  const segAngle = 360 / WHEEL_SEGMENTS.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch({ type: "SELECT_DEAL", payload: null })} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100">←</button>
        <h2 className="text-xl font-black text-gray-900">🎰 Spin The Wheel</h2>
      </div>
      <p className="text-gray-500 text-sm">Spin once per day to win exclusive discounts!</p>

      <div className="relative flex items-center justify-center my-6">
        {/* Wheel */}
        <div className="relative w-64 h-64" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 3s cubic-bezier(0.1,0.5,0.3,1)" : "none" }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {WHEEL_SEGMENTS.map((seg, i) => {
              const startAngle = (i * segAngle - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * segAngle - 90) * (Math.PI / 180);
              const x1 = 100 + 95 * Math.cos(startAngle);
              const y1 = 100 + 95 * Math.sin(startAngle);
              const x2 = 100 + 95 * Math.cos(endAngle);
              const y2 = 100 + 95 * Math.sin(endAngle);
              const midAngle = ((i + 0.5) * segAngle - 90) * (Math.PI / 180);
              const tx = 100 + 65 * Math.cos(midAngle);
              const ty = 100 + 65 * Math.sin(midAngle);
              return (
                <g key={i}>
                  <path d={`M100,100 L${x1},${y1} A95,95 0 0,1 ${x2},${y2} Z`} fill={seg.color} />
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="white" fontWeight="bold" transform={`rotate(${(i + 0.5) * segAngle + 90}, ${tx}, ${ty})`}>{seg.label}</text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="12" fill="white" />
            <circle cx="100" cy="100" r="8" fill="#6366f1" />
          </svg>
        </div>
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">▼</div>
      </div>

      {result ? (
        <Card className="p-5 text-center border-2 border-violet-200 bg-violet-50">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="font-black text-xl text-violet-700">You won: {result.label}!</h3>
          <p className="text-gray-500 text-sm mt-1">Saved to your wallet</p>
        </Card>
      ) : (
        <Button onClick={spin} className="w-full" size="lg" disabled={spinning || state.wheelSpun} loading={spinning}>
          {spinning ? "Spinning..." : state.wheelSpun ? "Already Spun Today" : "🎰 SPIN NOW!"}
        </Button>
      )}
    </div>
  );
}

function MysteryBox() {
  const { state, dispatch } = useApp();
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(state.mysteryOpened);
  const [reward, setReward] = useState(state.wallet.rewards[0] || null);

  const openBox = async () => {
    setOpening(true);
    await simulateDelay(2000);
    // Random reward
    const rand = Math.random();
    let cumulative = 0;
    let selected = MYSTERY_REWARDS[0];
    for (const r of MYSTERY_REWARDS) {
      cumulative += r.probability;
      if (rand < cumulative) { selected = r; break; }
    }
    setReward(selected);
    setOpened(true);
    dispatch({ type: "OPEN_MYSTERY", payload: selected });
    setOpening(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch({ type: "SELECT_DEAL", payload: null })} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100">←</button>
        <h2 className="text-xl font-black text-gray-900">🎁 Mystery Box</h2>
      </div>
      <p className="text-gray-500 text-sm">Purchase a mystery box for ₹99 and win amazing prizes!</p>

      <div className={`flex items-center justify-center py-12 text-9xl transition-all duration-500 ${opening ? "animate-bounce" : ""}`}>
        {opened ? (reward?.type === "product" ? "🏆" : "🎫") : opening ? "✨" : "🎁"}
      </div>

      {opened && reward ? (
        <Card className="p-5 text-center border-2 border-amber-200 bg-amber-50">
          <div className="text-4xl mb-2">🎊</div>
          <h3 className="font-black text-xl text-amber-700">You won: {reward.label}!</h3>
          {reward.type === "coupon" && <p className="text-sm text-gray-600 mt-1">Code: <strong className="bg-amber-100 px-2 py-0.5 rounded font-mono">{reward.value}</strong></p>}
          <p className="text-gray-500 text-xs mt-2">Applied to your wallet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 mb-2">What can you win?</h3>
            <div className="space-y-2">
              {MYSTERY_REWARDS.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${r.probability * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 w-40 text-right">{r.label}</span>
                </div>
              ))}
            </div>
          </Card>
          <Button onClick={openBox} className="w-full" size="lg" loading={opening} variant="warning">
            {opening ? "Opening..." : "🎁 Open Box · ₹99"}
          </Button>
        </div>
      )}
    </div>
  );
}

function RewardsPage() {
  const { state, dispatch } = useApp();
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch({ type: "SELECT_DEAL", payload: null })} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100">←</button>
        <h2 className="text-xl font-black text-gray-900">🎫 My Rewards</h2>
      </div>
      <Card className="p-5 bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <p className="text-4xl font-black">{formatCurrency(state.wallet.balance)}</p>
        <p className="text-sm mt-1 opacity-70">+ any earned rewards</p>
      </Card>
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Your Coupons</h3>
        {state.wallet.rewards.length > 0 ? (
          <div className="space-y-2">
            {state.wallet.rewards.map((r, i) => (
              <Card key={i} className="p-4 flex items-center gap-3">
                <span className="text-2xl">{r.type === "coupon" ? "🎫" : "🏆"}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{r.label}</p>
                  {r.type === "coupon" && <p className="text-xs text-gray-500 font-mono">{r.value}</p>}
                </div>
                <Badge color="green" className="ml-auto">Active</Badge>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🎫</div>
            <p>No rewards yet. Spin the wheel or open a mystery box!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CitySelector() {
  const { state, dispatch } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch({ type: "SELECT_DEAL", payload: null })} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100">←</button>
        <h2 className="text-xl font-black text-gray-900">📍 Change City</h2>
      </div>
      <div className="space-y-2">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => { dispatch({ type: "SET_CITY", payload: c }); dispatch({ type: "SELECT_DEAL", payload: null }); dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: `Switched to ${c.name}`, icon: "📍" } }); setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500); }} className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all flex items-center justify-between ${state.city.id === c.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-700 hover:border-violet-300"}`}>
            <span>📍 {c.name}, {c.state}</span>
            {state.city.id === c.id && <span className="text-violet-500">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function CartPage() {
  const { state, dispatch } = useApp();
  const [promoInput, setPromoInput] = useState("");
  const [step, setStep] = useState(state.checkoutStep);
  const [loading, setLoading] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState("morning");

  const subtotal = state.cart.reduce((sum, item) => sum + item.deal.salePrice * item.qty, 0);
  const discount = state.promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const placeOrder = async () => {
    setLoading(true);
    await simulateDelay(1500);
    dispatch({ type: "PLACE_ORDER", payload: total });
    dispatch({ type: "SET_CHECKOUT_STEP", payload: 3 });
    setStep(3);
    setLoading(false);
  };

  if (state.cart.length === 0 && step !== 3) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h3 className="font-bold text-gray-900 text-lg">Cart is Empty</h3>
      <p className="text-gray-500 text-sm mt-1">Add some deals to get started!</p>
    </div>
  );

  if (step === 3) return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
      <div className="text-7xl animate-bounce">🎉</div>
      <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
      <p className="text-gray-500">Your order is confirmed. Track it in Orders tab.</p>
      <Card className="p-5 w-full">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-mono font-bold">{state.orders[0]?.id}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Total Paid</span><span className="font-bold text-violet-600">{formatCurrency(total)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">ETA</span><span className="font-semibold">3-5 business days</span></div>
        </div>
      </Card>
      <Button onClick={() => setStep(0)} variant="secondary" className="w-full">Back to Shopping</Button>
    </div>
  );

  if (step === 2) return (
    <div className="space-y-4">
      <h2 className="font-black text-xl text-gray-900">💳 Payment</h2>
      <div className="space-y-3">
        {[{ id: "upi", icon: "📱", label: "UPI (Google Pay, PhonePe)" }, { id: "card", icon: "💳", label: "Credit / Debit Card" }, { id: "cod", icon: "💵", label: "Cash on Delivery" }].map(m => (
          <button key={m.id} onClick={() => dispatch({ type: "SET_PAYMENT", payload: m.id })} className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${state.selectedPayment === m.id ? "border-violet-500 bg-violet-50" : "border-gray-200 bg-white"}`}>
            <span className="text-2xl">{m.icon}</span>
            <span className="font-semibold text-sm">{m.label}</span>
            {state.selectedPayment === m.id && <span className="ml-auto text-violet-500 font-bold">✓</span>}
          </button>
        ))}
      </div>
      {state.giftMode && (
        <Card className="p-4 bg-pink-50 border-pink-200">
          <p className="text-sm font-bold text-pink-700">🎁 Gift Details Saved</p>
          <p className="text-xs text-pink-600">To: {state.giftDetails.recipientName || "—"} · {state.giftDetails.deliveryDate || "ASAP"}</p>
        </Card>
      )}
      <Card className="p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        {discount > 0 && <div className="flex justify-between text-green-600"><span>Promo Discount</span><span>-{formatCurrency(discount)}</span></div>}
        <div className="flex justify-between font-black text-base border-t pt-2"><span>Total</span><span className="text-violet-600">{formatCurrency(total)}</span></div>
      </Card>
      <div className="flex gap-2">
        <Button onClick={() => setStep(1)} variant="secondary" className="flex-1">← Back</Button>
        <Button onClick={placeOrder} className="flex-1" loading={loading} size="lg">Pay {formatCurrency(total)}</Button>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="space-y-4">
      <h2 className="font-black text-xl text-gray-900">📦 Delivery</h2>
      <div className="space-y-3">
        <Input label="Delivery Address" value="123, Main Street, Bhopal 462001" onChange={() => {}} />
        <div>
          <label className="text-sm font-semibold text-gray-700">Delivery Slot</label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {[{ id: "morning", label: "Morning", time: "9AM-12PM" }, { id: "afternoon", label: "Afternoon", time: "1PM-5PM" }, { id: "evening", label: "Evening", time: "6PM-9PM" }].map(s => (
              <button key={s.id} onClick={() => setDeliverySlot(s.id)} className={`p-3 rounded-xl border-2 text-center text-xs font-semibold transition-all ${deliverySlot === s.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200"}`}>
                <div className="font-bold">{s.label}</div>
                <div className="text-gray-400">{s.time}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={() => setStep(2)} className="w-full" size="lg">Proceed to Payment →</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="font-black text-xl text-gray-900">🛒 Cart ({state.cart.length})</h2>
      <div className="space-y-3">
        {state.cart.map(item => (
          <Card key={item.dealId} className="p-4 flex items-center gap-3">
            <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl">{item.deal.image}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{item.deal.title}</p>
              <p className="text-violet-600 font-bold">{formatCurrency(item.deal.salePrice)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.dealId, qty: Math.max(1, item.qty - 1) } })} className="w-7 h-7 rounded-full bg-gray-100 font-bold text-sm">−</button>
              <span className="font-bold w-4 text-center">{item.qty}</span>
              <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.dealId, qty: item.qty + 1 } })} className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-sm">+</button>
            </div>
            <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.dealId })} className="text-red-400 hover:text-red-600 ml-1">✕</button>
          </Card>
        ))}
      </div>
      {/* Promo Code */}
      <div className="flex gap-2">
        <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Promo code" className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:border-violet-400 outline-none" />
        <Button onClick={() => { if (promoInput.trim()) { dispatch({ type: "APPLY_PROMO", payload: true }); dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: "Promo applied! 10% off", icon: "🎫" } }); setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500); } }} size="md" variant="secondary">Apply</Button>
      </div>
      {state.promoApplied && <p className="text-green-600 text-sm font-semibold">✓ 10% discount applied</p>}
      <Card className="p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
        <div className="flex justify-between"><span>Delivery</span><span className="text-green-600">FREE</span></div>
        <div className="flex justify-between font-black text-base border-t pt-2"><span>Total</span><span className="text-violet-600">{formatCurrency(total)}</span></div>
      </Card>
      <Button onClick={() => setStep(1)} className="w-full" size="lg">Checkout →</Button>
    </div>
  );
}

function OrdersPage() {
  const { state } = useApp();
  const statusOrder = ["placed", "confirmed", "packed", "shipped", "delivered"];
  const statusIcons = { placed: "📋", confirmed: "✅", packed: "📦", shipped: "🚚", delivered: "🎉" };
  const statusColors = { placed: "blue", green: "green", packed: "amber", shipped: "violet", delivered: "green" };

  return (
    <div className="space-y-4">
      <h2 className="font-black text-xl text-gray-900">📦 My Orders</h2>
      {state.orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-2">📦</div><p>No orders yet</p></div>
      ) : (
        <div className="space-y-4">
          {state.orders.map(order => {
            const deal = DEALS.find(d => d.id === order.dealId);
            const currentStep = statusOrder.indexOf(order.status);
            return (
              <Card key={order.id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 font-mono text-sm">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge color={order.status === "delivered" ? "green" : "violet"}>{order.status.toUpperCase()}</Badge>
                    <p className="font-bold text-sm mt-1">{formatCurrency(order.amount)}</p>
                  </div>
                </div>
                {deal && (
                  <div className="flex items-center gap-3">
                    <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl">{deal.image}</div>
                    <p className="font-semibold text-sm text-gray-800">{deal.title}</p>
                  </div>
                )}
                {/* Timeline */}
                <div className="flex items-center gap-0">
                  {statusOrder.map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-none ${i <= currentStep ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                        {i <= currentStep ? statusIcons[s] : "○"}
                      </div>
                      {i < statusOrder.length - 1 && <div className={`flex-1 h-1 ${i < currentStep ? "bg-violet-600" : "bg-gray-100"}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  {statusOrder.map((s, i) => (
                    <span key={s} className={`text-xs font-semibold ${i <= currentStep ? "text-violet-600" : "text-gray-400"}`}>{s}</span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UserApp() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState("home");
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = state.notifications.filter(n => !n.read).length;
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  // Handle special modal views
  const selectedDeal = state.selectedDeal;
  if (selectedDeal?._type === "spin") return <div className="min-h-screen bg-gray-50 p-4 pb-24 max-w-lg mx-auto"><SpinWheel /></div>;
  if (selectedDeal?._type === "mystery") return <div className="min-h-screen bg-gray-50 p-4 pb-24 max-w-lg mx-auto"><MysteryBox /></div>;
  if (selectedDeal?._type === "rewards") return <div className="min-h-screen bg-gray-50 p-4 pb-24 max-w-lg mx-auto"><RewardsPage /></div>;
  if (selectedDeal?._type === "city") return <div className="min-h-screen bg-gray-50 p-4 pb-24 max-w-lg mx-auto"><CitySelector /></div>;
  if (selectedDeal && !selectedDeal._type) return <div className="min-h-screen bg-gray-50 p-4 pb-24 max-w-lg mx-auto"><DealPage deal={selectedDeal} onBack={() => dispatch({ type: "SELECT_DEAL", payload: null })} /></div>;
  if (state.selectedEvent) return <div className="min-h-screen bg-gray-50 p-4 pb-24 max-w-lg mx-auto"><EventPage event={state.selectedEvent} onBack={() => dispatch({ type: "SELECT_EVENT", payload: null })} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-30 px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">⚡ LocalFlash</span>
          </div>
          <button onClick={() => dispatch({ type: "SELECT_DEAL", payload: { _type: "city" } })} className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600">
            <span>📍</span><span className="font-semibold">{state.city.name}</span><span>▾</span>
          </button>
        </div>
        <button onClick={() => { setNotifOpen(true); dispatch({ type: "MARK_NOTIFICATIONS_READ" }); }} className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100">
          🔔
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{unread}</span>}
        </button>
        <button onClick={() => setActiveTab("cart")} className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100">
          🛒
          {cartCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-600 rounded-full text-white text-xs flex items-center justify-center font-bold">{cartCount}</span>}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 pb-36">
        {activeTab === "home" && <UserHomepage />}
        {activeTab === "cart" && <CartPage />}
        {activeTab === "orders" && <OrdersPage />}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="font-black text-xl text-gray-900">👤 Profile</h2>
            <Card className="p-5 bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">{(state.auth.user?.name || "U")[0]}</div>
                <div>
                  <h3 className="font-black text-xl">{state.auth.user?.name || "Flash User"}</h3>
                  <p className="text-white/70 text-sm">{state.auth.user?.phone || "+91 ..."}</p>
                  <Badge color="violet">Premium Member</Badge>
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-3">
              {[["📦", state.orders.length, "Orders"], ["🎫", state.wallet.rewards.length, "Rewards"], ["💰", formatCurrency(state.wallet.balance), "Wallet"]].map(([icon, val, label]) => (
                <Card key={label} className="p-3 text-center">
                  <div className="text-2xl">{icon}</div>
                  <div className="font-black text-gray-900">{val}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </Card>
              ))}
            </div>
            <Button onClick={() => dispatch({ type: "LOGOUT_USER" })} variant="danger" className="w-full">Sign Out</Button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-20 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-100 px-2 py-2 flex justify-around z-30">
        {[{ id: "home", icon: "🏠", label: "Home" }, { id: "cart", icon: "🛒", label: "Cart" }, { id: "orders", icon: "📦", label: "Orders" }, { id: "profile", icon: "👤", label: "Profile" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${activeTab === t.id ? "text-violet-600 bg-violet-50" : "text-gray-400 hover:text-gray-600"}`}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs font-semibold">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Notifications Modal */}
      <Modal isOpen={notifOpen} onClose={() => setNotifOpen(false)} title="🔔 Notifications">
        <div className="space-y-3">
          {state.notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${n.read ? "bg-gray-50" : "bg-violet-50 border border-violet-100"}`}>
              <div className="w-2 h-2 rounded-full mt-2 flex-none" style={{ background: n.read ? "#e5e7eb" : "#7c3aed" }} />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{n.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

// ─── VENDOR PANEL ─────────────────────────────────────────────────────────────

function VendorOnboarding() {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", businessName: "", gstin: "", pan: "", storeName: "", category: "Electronics", description: "" });
  const [loading, setLoading] = useState(false);

  const advance = async () => {
    setLoading(true);
    await simulateDelay(800);
    if (step < 2) { setStep(s => s + 1); dispatch({ type: "SET_KYC_STEP", payload: step + 1 }); }
    else dispatch({ type: "LOGIN_VENDOR", payload: { id: "v_new", name: form.name, email: form.email, businessName: form.businessName } });
    setLoading(false);
  };

  const steps = ["Account", "KYC", "Store Setup"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-indigo-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-3xl font-black text-white">Vendor Panel</h1>
          <p className="text-violet-300 mt-1">LocalFlash Partner Program</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-none ${i <= step ? "bg-violet-600 text-white" : "bg-white/10 text-white/40"}`}>{i < step ? "✓" : i + 1}</div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-violet-600" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-6">
          {steps.map((s, i) => <span key={s} className={`text-xs font-semibold ${i <= step ? "text-violet-300" : "text-white/30"}`}>{s}</span>)}
        </div>

        <div className="bg-white rounded-3xl p-6 space-y-4">
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
              <Input label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Your name" required />
              <Input label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@business.com" type="email" />
              <Input label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+91 ..." type="tel" />
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-900">KYC Verification</h2>
              <Input label="Business Name" value={form.businessName} onChange={v => setForm(f => ({ ...f, businessName: v }))} placeholder="Your Business Name" required />
              <Input label="GSTIN" value={form.gstin} onChange={v => setForm(f => ({ ...f, gstin: v }))} placeholder="22AAAAA0000A1Z5" />
              <Input label="PAN Number" value={form.pan} onChange={v => setForm(f => ({ ...f, pan: v }))} placeholder="AAAAA0000A" />
              <p className="text-xs text-gray-500 bg-amber-50 p-3 rounded-xl">📎 Document upload simulated for demo</p>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-gray-900">Setup Your Store</h2>
              <Input label="Store Name" value={form.storeName} onChange={v => setForm(f => ({ ...f, storeName: v }))} placeholder="Store Display Name" required />
              <Select label="Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={VENDORS.map(v => ({ value: v.category, label: v.category }))} />
              <Input label="Store Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="What do you sell?" />
            </>
          )}
          <Button onClick={advance} className="w-full" size="lg" loading={loading}>
            {step < 2 ? "Continue →" : "Launch Store 🚀"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function VendorDashboard() {
  const { state } = useApp();
  const myDeals = state.vendorStore.deals;
  const myOrders = state.vendorStore.orders;
  const pendingOrders = myOrders.filter(o => o.status === "placed" || o.status === "confirmed");

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(state.vendorStore.wallet.balance), icon: "💰", color: "from-violet-500 to-indigo-600" },
          { label: "Active Deals", value: myDeals.length, icon: "⚡", color: "from-pink-500 to-rose-600" },
          { label: "Orders", value: myOrders.length, icon: "📦", color: "from-amber-500 to-orange-500" },
          { label: "Pending", value: pendingOrders.length, icon: "⏳", color: "from-teal-500 to-emerald-600" },
        ].map(s => (
          <Card key={s.label} className="p-4 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-5`} />
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">📈 Revenue (6 months)</h3>
          <Badge color="green">+23% MoM</Badge>
        </div>
        <SimpleBarChart data={ANALYTICS_DATA} dataKey="sales" color="#7c3aed" />
        <div className="mt-3">
          <SimpleLineChart data={ANALYTICS_DATA} dataKey="conversion" color="#ec4899" />
          <p className="text-xs text-gray-500 text-center mt-1">Conversion Rate (%)</p>
        </div>
      </Card>

      {/* Active Events */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">🎯 Upcoming Sale Events</h3>
        <div className="space-y-3">
          {SALE_EVENTS.filter(e => e.status !== "ended").map(event => (
            <div key={event.id} className={`p-4 rounded-2xl bg-gradient-to-r ${event.gradient} text-white flex items-center gap-3`}>
              <span className="text-2xl">{event.banner}</span>
              <div className="flex-1">
                <p className="font-bold">{event.title}</p>
                <p className="text-sm opacity-80">{event.vendorSlots.length} vendor slots</p>
              </div>
              <Badge color={event.status === "active" ? "green" : "amber"}>{event.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">🛒 Recent Orders</h3>
        <div className="space-y-2">
          {myOrders.slice(0, 3).map(o => {
            const deal = DEALS.find(d => d.id === o.dealId);
            return (
              <div key={o.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="font-mono text-xs font-bold text-gray-500">{o.id}</span>
                <span className="flex-1 text-sm font-semibold text-gray-800 truncate">{deal?.title || "—"}</span>
                <Badge color={o.status === "delivered" ? "green" : "violet"}>{o.status}</Badge>
                <span className="font-bold text-sm">{formatCurrency(o.amount)}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function VendorEventMarketplace() {
  const { state, dispatch } = useApp();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const placeBid = async (event) => {
    if (!state.bidAmount || isNaN(state.bidAmount)) return;
    setLoading(true);
    await simulateDelay(1200);
    dispatch({ type: "PLACE_BID", payload: { eventId: event.id, amount: state.bidAmount } });
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: `Bid of ₹${state.bidAmount} placed!`, icon: "🎯" } });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500);
    setLoading(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xl text-gray-900">🎯 Event Marketplace</h2>
        <Badge color="violet">{SALE_EVENTS.filter(e => e.status !== "ended").length} Open</Badge>
      </div>
      <p className="text-sm text-gray-500">Bid for premium slots in upcoming flash sale events.</p>

      <div className="space-y-4">
        {SALE_EVENTS.map(event => {
          const existingBid = state.vendorStore.bids.find(b => b.eventId === event.id);
          const slotsLeft = 5 - event.vendorSlots.length;
          return (
            <Card key={event.id} className="overflow-hidden">
              <div className={`bg-gradient-to-r ${event.gradient} p-4 flex items-center gap-3`}>
                <span className="text-3xl">{event.banner}</span>
                <div className="flex-1 text-white">
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm opacity-80">{event.vendorSlots.length} vendors · {slotsLeft} slots left</p>
                </div>
                <Badge color={event.status === "active" ? "green" : event.status === "upcoming" ? "amber" : "gray"}>{event.status}</Badge>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[["🎯", event.totalDeals, "Deals"], ["📦", event.totalOrders, "Orders"], ["🏪", event.vendorSlots.length + "/5", "Slots"]].map(([icon, val, label]) => (
                    <div key={label} className="text-center bg-gray-50 rounded-xl p-2">
                      <div className="font-bold text-gray-900">{icon} {val}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
                {existingBid ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                    <span className="text-green-600">✓</span>
                    <p className="text-sm font-semibold text-green-700">Bid placed: {formatCurrency(existingBid.amount)}</p>
                    <Badge color="green">Active</Badge>
                  </div>
                ) : event.status !== "ended" && (
                  <Button onClick={() => setSelectedEvent(event)} className="w-full" size="sm">
                    🏷 Place Bid for Slot
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="🏷 Place Bid">
        {selectedEvent && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedEvent.gradient} text-white`}>
              <p className="font-bold">{selectedEvent.title}</p>
              <p className="text-sm opacity-80">{5 - selectedEvent.vendorSlots.length} slots remaining</p>
            </div>
            <p className="text-sm text-gray-600">Higher bids get featured placement. Minimum bid: ₹500</p>
            <Input label="Your Bid (₹)" value={state.bidAmount} onChange={v => dispatch({ type: "SET_BID", payload: v })} placeholder="e.g. 2000" type="number" />
            {/* Simulated ranking */}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-bold text-gray-600 mb-2">Current Bids (anonymous)</p>
              {[1800, 1200, 800].map((bid, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <span className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(bid / 2000) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{formatCurrency(bid)}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => placeBid(selectedEvent)} className="w-full" size="lg" loading={loading} disabled={!state.bidAmount}>
              Place Bid · {state.bidAmount ? formatCurrency(state.bidAmount) : "—"}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function VendorDealCreator() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const df = state.dealForm;

  const EMOJI_OPTIONS = ["📦", "⚡", "🎧", "⌚", "👗", "💄", "🏋️", "🍔", "📱", "💻", "🎮", "👟"];

  const createDeal = async () => {
    if (!df.title || !df.price || !df.inventory) return;
    setLoading(true);
    await simulateDelay(1000);
    dispatch({ type: "CREATE_DEAL" });
    setCreated(true);
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: "Deal created successfully!", icon: "⚡" } });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-black text-xl text-gray-900">⚡ Create Deal</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-gray-800">Deal Details</h3>
            <Input label="Deal Title" value={df.title} onChange={v => dispatch({ type: "UPDATE_DEAL_FORM", payload: { title: v } })} placeholder="e.g. Wireless Earbuds Pro" required />
            <Input label="Sale Price (₹)" value={df.price} onChange={v => dispatch({ type: "UPDATE_DEAL_FORM", payload: { price: v } })} placeholder="999" type="number" />
            <Input label="Inventory" value={df.inventory} onChange={v => dispatch({ type: "UPDATE_DEAL_FORM", payload: { inventory: v } })} placeholder="50" type="number" />
            <Input label="Discount (%)" value={df.discount} onChange={v => dispatch({ type: "UPDATE_DEAL_FORM", payload: { discount: v } })} placeholder="70" type="number" />
            <Input label="Description" value={df.description} onChange={v => dispatch({ type: "UPDATE_DEAL_FORM", payload: { description: v } })} placeholder="Product description..." />
            <Select label="Link to Event" value={df.eventId} onChange={v => dispatch({ type: "UPDATE_DEAL_FORM", payload: { eventId: v } })} options={SALE_EVENTS.map(e => ({ value: e.id, label: e.title }))} />
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Product Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} onClick={() => dispatch({ type: "UPDATE_DEAL_FORM", payload: { image: e } })} className={`w-10 h-10 rounded-xl text-xl transition-all ${df.image === e ? "bg-violet-100 ring-2 ring-violet-500" : "bg-gray-100 hover:bg-gray-200"}`}>{e}</button>
                ))}
              </div>
            </div>
          </Card>
          <Button onClick={createDeal} className="w-full" size="lg" loading={loading} disabled={!df.title || !df.price}>
            ⚡ Publish Deal
          </Button>
        </div>

        {/* Live Preview */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Live Preview</h3>
          {df.title ? (
            <DealCard deal={{
              id: "preview",
              title: df.title || "Your Deal Title",
              image: df.image || "📦",
              originalPrice: df.price ? Math.round(df.price * 1.5) : 0,
              salePrice: Number(df.price) || 0,
              discount: Number(df.discount) || 0,
              stock: Number(df.inventory) || 100,
              sold: 0,
              rating: 0,
              reviews: 0,
              featured: false,
            }} />
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
              <div className="text-4xl mb-2">👁</div>
              <p className="text-sm">Fill in details to see preview</p>
            </div>
          )}

          {created && (
            <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200">
              <p className="text-sm font-bold text-green-700">✓ Deal is now live in the event!</p>
              <p className="text-xs text-green-600 mt-1">Switch to User App to see it in the event.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VendorMarketing() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState({});
  const [campaignMsg, setCampaignMsg] = useState("");
  const [promoType, setPromoType] = useState("homepage");
  const [promoPurchased, setPromoPurchased] = useState({});

  const generate = async (type) => {
    setLoading(l => ({ ...l, [type]: true }));
    await simulateDelay(1500);
    dispatch({ type: type === "flyer" ? "GENERATE_FLYER" : "GENERATE_BANNER" });
    setLoading(l => ({ ...l, [type]: false }));
  };

  const purchasePromo = async (slot) => {
    setLoading(l => ({ ...l, [slot]: true }));
    await simulateDelay(1000);
    setPromoPurchased(p => ({ ...p, [slot]: true }));
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: `${slot} slot activated!`, icon: "🚀" } });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500);
    setLoading(l => ({ ...l, [slot]: false }));
  };

  const myDeal = state.vendorStore.deals[0];

  return (
    <div className="space-y-5">
      <h2 className="font-black text-xl text-gray-900">📣 Marketing Tools</h2>

      {/* Flyer Generator */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">🖼 Auto Flyer Generator</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Generate promotional flyers using your deal data and brand colors automatically.</p>
            <Button onClick={() => generate("flyer")} loading={loading.flyer} size="sm" className="w-full">Generate Flyer</Button>
          </div>
          {state.flyerGenerated ? (
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10 text-6xl">{myDeal?.image || "⚡"}</div>
              <Badge color="amber">⭐ FLASH DEAL</Badge>
              <div className="text-4xl mt-3">{myDeal?.image || "⚡"}</div>
              <h4 className="font-black text-lg mt-2">{myDeal?.title || "Amazing Deal"}</h4>
              <p className="text-2xl font-black text-yellow-300">{formatCurrency(myDeal?.salePrice || 999)}</p>
              <p className="text-sm opacity-70 line-through">{formatCurrency(myDeal?.originalPrice || 1999)}</p>
              <div className="mt-3 bg-white/20 rounded-xl px-3 py-1 inline-block">
                <span className="font-bold text-sm">{myDeal?.discount || 50}% OFF · LIMITED TIME</span>
              </div>
              <p className="text-xs mt-2 opacity-60">⚡ LocalFlash · {state.city.name}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">🖼</div>
              <p className="text-sm">Click to generate flyer</p>
            </div>
          )}
        </div>
      </Card>

      {/* Banner Generator */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">🎨 Banner Generator</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Create homepage banners for sponsored placement.</p>
            <Button onClick={() => generate("banner")} loading={loading.banner} size="sm" className="w-full">Generate Banner</Button>
          </div>
          {state.bannerGenerated ? (
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-2xl p-4 text-white flex items-center gap-3">
              <span className="text-5xl">{myDeal?.image || "⚡"}</span>
              <div>
                <Badge color="amber">SPONSORED</Badge>
                <h4 className="font-black text-base mt-1">{state.auth.vendor?.businessName || "Your Store"}</h4>
                <p className="text-sm opacity-80">Up to {myDeal?.discount || 50}% OFF today!</p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm">Click to generate banner</p>
            </div>
          )}
        </div>
      </Card>

      {/* Promotion Slots */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">🚀 Promotion Slots</h3>
        <div className="space-y-3">
          {[
            { id: "homepage", label: "Homepage Featured", price: "₹999/day", icon: "🏠", desc: "Top banner slot on homepage" },
            { id: "featured", label: "Featured Deal", price: "₹499/day", icon: "⭐", desc: "Featured badge on your deal" },
            { id: "flyer", label: "Flyer Placement", price: "₹299/day", icon: "📰", desc: "Flyer shown in event" },
          ].map(slot => (
            <div key={slot.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-2xl">{slot.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{slot.label}</p>
                <p className="text-xs text-gray-500">{slot.desc}</p>
                <p className="text-xs font-bold text-violet-600">{slot.price}</p>
              </div>
              {promoPurchased[slot.id] ? (
                <Badge color="green">Active ✓</Badge>
              ) : (
                <Button onClick={() => purchasePromo(slot.id)} loading={loading[slot.id]} size="sm">Buy</Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Campaign Creator */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">💬 Campaign Message</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            {["SMS", "WhatsApp"].map(t => (
              <button key={t} onClick={() => setCampaignMsg(t === "SMS" ? `🔥 FLASH SALE ALERT!\n${myDeal?.title || "Amazing Deal"} at ₹${myDeal?.salePrice || 999}!\nONLY ${myDeal?.stock || 50} left.\nBuy now: localflash.in/evt1` : `⚡ *LocalFlash Special*\nHey! Don't miss out on *${myDeal?.title || "this deal"}*!\n💰 Price: ₹${myDeal?.salePrice || 999} (was ₹${myDeal?.originalPrice || 1999})\n🔥 ${myDeal?.discount || 50}% OFF - Today Only!\nShop now 👉 localflash.in`)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${campaignMsg.includes(t === "SMS" ? "FLASH SALE" : "*LocalFlash") ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600"}`}>{t === "SMS" ? "📱 SMS" : "💚 WhatsApp"}</button>
            ))}
          </div>
          {campaignMsg && (
            <div className="bg-gray-50 rounded-xl p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{campaignMsg}</pre>
              <Button onClick={() => { navigator.clipboard?.writeText(campaignMsg); dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: "Copied to clipboard!", icon: "📋" } }); setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500); }} size="sm" variant="secondary" className="mt-2">Copy Message</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function VendorOrders() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState({});
  const orders = state.vendorStore.orders;

  const updateStatus = async (orderId, newStatus) => {
    setLoading(l => ({ ...l, [orderId]: true }));
    await simulateDelay(800);
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id: orderId, status: newStatus } });
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: `Order ${orderId} updated!`, icon: "✓" } });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500);
    setLoading(l => ({ ...l, [orderId]: false }));
  };

  const statusFlow = { placed: "confirmed", confirmed: "packed", packed: "shipped", shipped: "delivered" };
  const statusColors = { placed: "blue", confirmed: "violet", packed: "amber", shipped: "pink", delivered: "green" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xl text-gray-900">📦 Orders</h2>
        <Badge color="violet">{orders.length} total</Badge>
      </div>
      {orders.map(order => {
        const deal = DEALS.find(d => d.id === order.dealId);
        const next = statusFlow[order.status];
        return (
          <Card key={order.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
              <div className="text-right">
                <Badge color={statusColors[order.status] || "gray"}>{order.status}</Badge>
                <p className="font-bold mt-1">{formatCurrency(order.amount)}</p>
              </div>
            </div>
            {deal && (
              <div className="flex items-center gap-3 py-2 border-y border-gray-100">
                <span className="text-2xl">{deal.image}</span>
                <p className="font-semibold text-sm">{deal.title}</p>
              </div>
            )}
            {/* Invoice preview snippet */}
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 font-mono space-y-1">
              <div className="flex justify-between"><span>Invoice #{order.id}</span><span>{order.date}</span></div>
              <div className="flex justify-between"><span>{deal?.title || "—"}</span><span>{formatCurrency(order.amount)}</span></div>
              <div className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total</span><span>{formatCurrency(order.amount)}</span></div>
            </div>
            <div className="flex gap-2">
              {next && order.status !== "delivered" && (
                <Button onClick={() => updateStatus(order.id, next)} loading={loading[order.id]} size="sm" variant="success">
                  Mark as {next} →
                </Button>
              )}
              {order.status === "placed" && (
                <Button onClick={() => updateStatus(order.id, "cancelled")} size="sm" variant="danger">
                  Reject
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function VendorWallet() {
  const { state, dispatch } = useApp();
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDone, setWithdrawDone] = useState(false);

  const withdraw = async () => {
    setWithdrawing(true);
    await simulateDelay(1500);
    setWithdrawDone(true);
    setWithdrawing(false);
    dispatch({ type: "SHOW_TOAST", payload: { type: "success", text: "Withdrawal initiated!", icon: "💸" } });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2500);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-black text-xl text-gray-900">💰 Wallet</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 bg-gradient-to-br from-violet-600 to-indigo-700 text-white col-span-2">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-4xl font-black">{formatCurrency(state.vendorStore.wallet.balance)}</p>
          <div className="mt-2 flex gap-3 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">⏳ Pending: {formatCurrency(state.vendorStore.wallet.pending)}</span>
          </div>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">📊 Earnings Breakdown</h3>
        <div className="space-y-2">
          {ANALYTICS_DATA.map(d => (
            <div key={d.month} className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600 w-10">{d.month}</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full">
                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${(d.sales / 150000) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-900 w-20 text-right">{formatCurrency(d.sales)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">* After 10% platform commission</p>
      </Card>

      {/* Withdraw */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">💸 Withdraw Funds</h3>
        {withdrawDone ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">✅</div>
            <p className="font-bold text-green-600">Withdrawal of {formatCurrency(withdrawAmount)} initiated!</p>
            <p className="text-xs text-gray-500 mt-1">Will reflect in 1-3 business days</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Input label="Amount (₹)" value={withdrawAmount} onChange={setWithdrawAmount} placeholder="Enter amount" type="number" />
            <Select label="Bank Account" value="main" onChange={() => {}} options={[{ value: "main", label: "HDFC ****4521 (Primary)" }, { value: "sec", label: "SBI ****9876" }]} />
            <Button onClick={withdraw} className="w-full" loading={withdrawing} disabled={!withdrawAmount}>
              💸 Initiate Withdrawal
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function VendorAnalytics() {
  const [activeMetric, setActiveMetric] = useState("sales");
  const metrics = { sales: { label: "Revenue (₹)", color: "#7c3aed", key: "sales" }, orders: { label: "Orders", color: "#ec4899", key: "orders" }, conversion: { label: "Conversion %", color: "#10b981", key: "conversion" } };

  return (
    <div className="space-y-5">
      <h2 className="font-black text-xl text-gray-900">📈 Analytics</h2>

      {/* Metric Selector */}
      <Tabs tabs={Object.entries(metrics).map(([id, m]) => ({ id, label: m.label }))} active={activeMetric} onChange={setActiveMetric} />

      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">{metrics[activeMetric].label} – Last 6 Months</h3>
        <SimpleBarChart data={ANALYTICS_DATA} dataKey={metrics[activeMetric].key} color={metrics[activeMetric].color} />
      </Card>

      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Trend Line</h3>
        <SimpleLineChart data={ANALYTICS_DATA} dataKey={metrics[activeMetric].key} color={metrics[activeMetric].color} />
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(ANALYTICS_DATA.reduce((s, d) => s + d.sales, 0)), change: "+23%" },
          { label: "Total Orders", value: ANALYTICS_DATA.reduce((s, d) => s + d.orders, 0), change: "+18%" },
          { label: "Avg Order Value", value: formatCurrency(Math.round(ANALYTICS_DATA.reduce((s, d) => s + d.sales, 0) / ANALYTICS_DATA.reduce((s, d) => s + d.orders, 0))), change: "+5%" },
          { label: "Best Month", value: "Dec 2024", change: "142K revenue" },
        ].map(kpi => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs text-gray-500">{kpi.label}</p>
            <p className="font-black text-lg text-gray-900 mt-1">{kpi.value}</p>
            <Badge color="green">{kpi.change}</Badge>
          </Card>
        ))}
      </div>

      {/* Event Performance */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-3">Event Performance</h3>
        <div className="space-y-3">
          {SALE_EVENTS.map(event => (
            <div key={event.id} className={`p-3 rounded-xl bg-gradient-to-r ${event.gradient} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{event.banner}</span>
                  <span className="font-bold text-sm">{event.title}</span>
                </div>
                <span className="font-black">{event.totalOrders} orders</span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full h-2">
                <div className="bg-white h-full rounded-full" style={{ width: `${Math.min((event.totalOrders / 4000) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function VendorPanel() {
  const { state, dispatch } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "events", icon: "🎯", label: "Event Marketplace" },
    { id: "deals", icon: "⚡", label: "Create Deal" },
    { id: "marketing", icon: "📣", label: "Marketing" },
    { id: "orders", icon: "📦", label: "Orders" },
    { id: "wallet", icon: "💰", label: "Wallet" },
    { id: "analytics", icon: "📈", label: "Analytics" },
  ];

  const views = {
    dashboard: <VendorDashboard />,
    events: <VendorEventMarketplace />,
    deals: <VendorDealCreator />,
    marketing: <VendorMarketing />,
    orders: <VendorOrders />,
    wallet: <VendorWallet />,
    analytics: <VendorAnalytics />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-56" : "w-16"} transition-all bg-gray-900 flex flex-col min-h-screen sticky top-0 flex-none`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          {sidebarOpen && <span className="font-black text-white text-sm">LocalFlash<br /><span className="text-violet-400 text-xs font-normal">Vendor Panel</span></span>}
          <button onClick={() => setSidebarOpen(o => !o)} className="ml-auto text-gray-400 hover:text-white text-sm">{sidebarOpen ? "◀" : "▶"}</button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => dispatch({ type: "SET_VENDOR_VIEW", payload: item.id })} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${state.vendorView === item.id ? "bg-violet-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <span className="text-lg flex-none">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">{(state.auth.vendor?.name || "V")[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{state.auth.vendor?.name || "Vendor"}</p>
                <p className="text-gray-400 text-xs truncate">{state.auth.vendor?.businessName || "Store"}</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold mx-auto">{(state.auth.vendor?.name || "V")[0]}</div>
          )}
          <button onClick={() => dispatch({ type: "LOGOUT_VENDOR" })} className={`mt-2 text-red-400 hover:text-red-300 text-xs ${sidebarOpen ? "w-full text-left pl-1" : "block mx-auto text-center"}`}>{sidebarOpen ? "Sign Out" : "✕"}</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 pb-32 max-w-4xl">
          {views[state.vendorView] || <VendorDashboard />}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

function AppContent() {
  const { state } = useApp();

  return (
    <div className="relative">
      <Toast toast={state.toast} />

      {state.panel === "user" ? (
        state.auth.isLoggedIn ? <UserApp /> : <UserOnboarding />
      ) : (
        state.auth.isVendorLoggedIn ? <VendorPanel /> : <VendorOnboarding />
      )}

      <PanelToggle />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-in { 0% { transform: translateX(-50%) translateY(-20px); opacity: 0; } 100% { transform: translateX(-50%) translateY(0); opacity: 1; } }
        .animate-bounce-in { animation: bounce-in 0.3s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.3s ease-out; }
        .slide-in-from-bottom-4 { animation: slide-up 0.3s ease-out; }
        @keyframes slide-up { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <AppContent />
    </AppProvider>
  );
}
export default LocalFlash;
