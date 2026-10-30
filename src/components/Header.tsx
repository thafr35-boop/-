import React from 'react';
import { 
  Smartphone, 
  Sparkles, 
  ShoppingCart, 
  BarChart3, 
  Download, 
  Share2, 
  Eye, 
  EyeOff, 
  PlusCircle, 
  DollarSign, 
  Layers
} from 'lucide-react';
import { PriceTier, Currency } from '../types';

interface HeaderProps {
  activeTab: 'catalog' | 'stamp' | 'orders' | 'radar' | 'apk';
  setActiveTab: (tab: 'catalog' | 'stamp' | 'orders' | 'radar' | 'apk') => void;
  priceTier: PriceTier;
  setPriceTier: (tier: PriceTier) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  isCustomerView: boolean;
  setIsCustomerView: (val: boolean) => void;
  cartCount: number;
  onOpenCart: () => void;
  onTriggerShareInput: () => void;
  onOpenNewProductModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  priceTier,
  setPriceTier,
  currency,
  setCurrency,
  isCustomerView,
  setIsCustomerView,
  cartCount,
  onOpenCart,
  onTriggerShareInput,
  onOpenNewProductModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        {/* Top Branding & Main Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-amber-500/20 shrink-0 border border-amber-300/40">
              ع.ظ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  عبدالرحمن ظافر للهواتف الذكية
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                    QuickSell Pro
                  </span>
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 live-dot"></span>
                نظام الكتالوج الذكي • مشاركة الصور وختم الأسعار • إصدار APK
              </p>
            </div>
          </div>

          {/* Action Buttons: Share from Gallery, Add Product, Currency, Price Tier */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Direct APK Download Link */}
            <a
              href="/Abdulrahman-Dhafir-Smartphones.apk"
              download="Abdulrahman-Dhafir-Smartphones.apk"
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
              title="تحميل ملف الـ APK المباشر لهاتفك الآن (1.5 MB)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل APK</span>
            </a>

            {/* Share / Receive Images Trigger (Requirement 2) */}
            <button
              onClick={onTriggerShareInput}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 flex items-center gap-1.5 transition-all transform active:scale-95"
              title="مشاركة أو اختيار صور من المعرض وتحديد الوجهة (كتالوج، منتج جديد، أو منتج موجود)"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة صور من المعرض</span>
            </button>

            {/* Quick Add Product */}
            <button
              onClick={onOpenNewProductModal}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">منتج جديد</span>
            </button>

            {/* Price Tier Switcher */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 text-xs">
              <button
                onClick={() => setPriceTier('retail')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  priceTier === 'retail'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                تجزئة
              </button>
              <button
                onClick={() => setPriceTier('wholesale')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  priceTier === 'wholesale'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                جملة B2B
              </button>
              <button
                onClick={() => setPriceTier('vip')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  priceTier === 'vip'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                موزع VIP
              </button>
            </div>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="العملة"
              className="bg-slate-800 text-white text-xs font-bold border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="SAR">ر.س (SAR)</option>
              <option value="USD">$ دولار (USD)</option>
              <option value="YER">ر.ي (YER)</option>
            </select>

            {/* Customer View Toggle */}
            <button
              onClick={() => setIsCustomerView(!isCustomerView)}
              className={`p-1.5 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all ${
                isCustomerView
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="إخفاء أسعار التكلفة وأرباح الجملة أثناء عرض الكتالوج للعميل"
            >
              {isCustomerView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white transition-all"
              title="سلة المبيعات والطلبات"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 border-t border-slate-800/80 mt-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>الكتالوج والهواتف</span>
          </button>

          <button
            onClick={() => setActiveTab('stamp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'stamp'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>استوديو ختم ومشاركة الصور</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>الطلبات والمبيعات</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'radar'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>رادار العملاء والتحليلات</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'apk'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحويل إلى APK وتثبيت PWA</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
