import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Smartphone, 
  Image as ImageIcon,
  Palette,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Product, PriceTier, Currency } from '../types';

interface StampStudioProps {
  products: Product[];
  activeProductId: string;
  setActiveProductId: (id: string) => void;
  priceTier: PriceTier;
  setPriceTier: (tier: PriceTier) => void;
  currency: Currency;
  storePhone?: string;
}

export const StampStudio: React.FC<StampStudioProps> = ({
  products,
  activeProductId,
  setActiveProductId,
  priceTier,
  setPriceTier,
  currency,
  storePhone = '967771234567'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [theme, setTheme] = useState<'royal' | 'emerald' | 'minimal'>('royal');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showSpecs, setShowSpecs] = useState<boolean>(true);
  const [showContact, setShowContact] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const activeProduct = products.find(p => p.id === activeProductId) || products[0];

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [activeProductId]);

  const getTierLabel = () => {
    switch (priceTier) {
      case 'wholesale': return 'سعر الجملة (B2B)';
      case 'vip': return 'سعر موزع VIP';
      case 'retail':
      default: return 'سعر التجزئة المعتمد';
    }
  };

  const getPrice = () => {
    if (!activeProduct) return { amount: '0', symbol: 'ر.س' };
    let val = activeProduct.retailPrice;
    if (priceTier === 'wholesale') val = activeProduct.wholesalePrice;
    if (priceTier === 'vip') val = activeProduct.vipPrice;

    let symbol = 'ر.س';
    if (currency === 'USD') {
      val = Math.round(val / 3.75);
      symbol = '$';
    } else if (currency === 'YER') {
      val = Math.round(val * 142);
      symbol = 'ر.ي';
    }
    return { amount: val.toLocaleString('en-US'), symbol };
  };

  // Render the Clean Stamped Image onto HTML5 Canvas
  // NOTE: Requirement 1 explicitly states: "حذف الملاحظه التي تطبع اسفل المنتج"
  // So the bottom note is completely excluded from being drawn on the canvas!
  useEffect(() => {
    if (!activeProduct || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 720;
    canvas.height = 720;

    const currentImgUrl = activeProduct.images[selectedImageIndex] || activeProduct.images[0] || '';
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 1. Draw Canvas Background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = theme === 'minimal' ? '#ffffff' : (theme === 'emerald' ? '#022c22' : '#0f172a');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Product Photo with clean aspect ratio (top 530px)
      ctx.drawImage(img, 0, 0, 720, 530);

      // 3. Top Watermark Brand Badge ( ع.ظ - عبدالرحمن ظافر للهواتف الذكية )
      if (showWatermark) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(24, 24, 350, 56, 16);
        ctx.fill();

        // Gold Emblem
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(330, 32, 34, 40, 10);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px Tajawal, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ع.ظ', 347, 58);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 17px Tajawal, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('عبدالرحمن ظافر للهواتف الذكية', 318, 50);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '12px Tajawal, sans-serif';
        ctx.fillText('كتالوج الهواتف المعتمد • QuickSell Pro', 318, 69);
      }

      // 4. Price Badge Overlay (Top Right)
      if (showPrice) {
        const priceInfo = getPrice();
        const priceText = `${priceInfo.amount} ${priceInfo.symbol}`;

        ctx.fillStyle = theme === 'emerald' ? '#059669' : '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(470, 24, 226, 64, 18);
        ctx.fill();

        ctx.fillStyle = theme === 'emerald' ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 13px Tajawal, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(getTierLabel(), 583, 46);

        ctx.font = '900 24px Tajawal, sans-serif';
        ctx.fillText(priceText, 583, 76);
      }

      // 5. Clean Bottom Information Panel (Height: 190px)
      // Removed the custom note that used to print below the product!
      const footerBg = theme === 'minimal' ? '#f8fafc' : (theme === 'emerald' ? '#064e3b' : '#0f172a');
      ctx.fillStyle = footerBg;
      ctx.fillRect(0, 526, 720, 194);

      // Gold Accent Divider Line
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 526, 720, 4);

      const primaryText = theme === 'minimal' ? '#0f172a' : '#ffffff';
      const secondaryText = theme === 'minimal' ? '#475569' : '#cbd5e1';
      ctx.textAlign = 'right';

      // Product Title
      ctx.fillStyle = primaryText;
      ctx.font = 'bold 23px Tajawal, sans-serif';
      ctx.fillText(activeProduct.name.slice(0, 52), 690, 566);

      // Specs & SKU
      if (showSpecs) {
        ctx.fillStyle = secondaryText;
        ctx.font = '15px Tajawal, sans-serif';
        ctx.fillText(`${activeProduct.specs.slice(0, 68)} | كود: ${activeProduct.sku}`, 690, 602);
      }

      // Contact Line (clean and centered)
      if (showContact) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
        ctx.beginPath();
        ctx.roundRect(24, 634, 672, 54, 14);
        ctx.fill();

        ctx.fillStyle = theme === 'minimal' ? '#b45309' : '#fde68a';
        ctx.font = 'bold 16px Tajawal, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('للطلب والاستفسار: عبدالرحمن ظافر للهواتف الذكية • ضمان الوكيل وتوصيل سريع', 360, 668);
      }
    };

    img.src = currentImgUrl;
  }, [activeProduct, selectedImageIndex, theme, showWatermark, showPrice, showSpecs, showContact, priceTier, currency]);

  if (!activeProduct) return null;

  // Handle Download High-Res Image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Abdulrahman-Dhafir-${activeProduct.sku}-img${selectedImageIndex + 1}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // WhatsApp Share with formatted text
  const handleWhatsAppShare = () => {
    const priceInfo = getPrice();
    const text = `*عرض خاص من عبدالرحمن ظافر للهواتف الذكية* 📱✨
━━━━━━━━━━━━━━━
📌 *الهاتف:* ${activeProduct.name}
💰 *السعر (${getTierLabel()}):* ${priceInfo.amount} ${priceInfo.symbol}
📋 *المواصفات:* ${activeProduct.specs}
🏷️ *الكود:* ${activeProduct.sku}
✅ *الضمان:* ضمان الوكيل المعتمد سنتين لدى عبدالرحمن ظافر
━━━━━━━━━━━━━━━
📲 للطلب والحجز الفوري عبر واتساب مباشرة:
https://wa.me/${storePhone}?text=${encodeURIComponent('مرحباً عبدالرحمن ظافر، أرغب بطلب: ' + activeProduct.name + ' كود: ' + activeProduct.sku)}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Copy promotional text
  const handleCopyText = () => {
    const priceInfo = getPrice();
    const text = `📱 *${activeProduct.name}*
السعر: ${priceInfo.amount} ${priceInfo.symbol} (${getTierLabel()})
المواصفات: ${activeProduct.specs}
الضمان: سنتين معتمد لدى عبدالرحمن ظافر للهواتف الذكية
كود: ${activeProduct.sku}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-5 text-right">
      
      {/* Studio Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              استوديو ختم ومشاركة الصور (QuickSell Image Stamp)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              طباعة اسم الهاتف، السعر والشعار بدقة عالية للمشاركة عبر واتساب وحالات التواصل بدون ملاحظات مشوهة
            </p>
          </div>
        </div>

        {/* Price Tier Toggle inside Studio */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-700 text-xs">
          <button
            onClick={() => setPriceTier('retail')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              priceTier === 'retail' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            سعر التجزئة
          </button>
          <button
            onClick={() => setPriceTier('wholesale')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              priceTier === 'wholesale' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            سعر الجملة
          </button>
          <button
            onClick={() => setPriceTier('vip')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              priceTier === 'vip' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            موزع VIP
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Controls & Canvas Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* RIGHT (Controls & Product Selector): 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Product Switcher */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">
              اختر الهاتف المطلوب ختم صورته:
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto custom-scroll pr-1">
              {products.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveProductId(prod.id)}
                  className={`p-2.5 rounded-2xl border text-right flex items-center justify-between gap-2 transition-all ${
                    prod.id === activeProduct.id
                      ? 'bg-amber-50 border-amber-500 text-amber-950'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={prod.images[0] || ''} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-200" 
                    />
                    <div>
                      <h4 className="text-xs font-bold line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] text-slate-500">{prod.retailPrice} ر.س • {prod.images.length} صور</p>
                    </div>
                  </div>
                  {prod.id === activeProduct.id && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-Image Angle Selector for the Active Phone (Requirement 3) */}
          {activeProduct.images.length > 1 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                اختر الصورة / الزاوية المراد ختمها: ({activeProduct.images.length} صور متوفرة)
              </label>
              <div className="flex items-center gap-2 overflow-x-auto custom-scroll pb-1">
                {activeProduct.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center font-bold">
                      صورة {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Theme & Watermark Controls */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>تخصيص ثيم ومظهر الختم:</span>
            </h4>

            {/* Theme Select */}
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTheme('royal')}
                className={`py-2 px-2 rounded-xl border transition-all text-center ${
                  theme === 'royal' ? 'bg-slate-900 text-amber-400 border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                ملكي داكن
              </button>
              <button
                type="button"
                onClick={() => setTheme('emerald')}
                className={`py-2 px-2 rounded-xl border transition-all text-center ${
                  theme === 'emerald' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                واتساب أخضر
              </button>
              <button
                type="button"
                onClick={() => setTheme('minimal')}
                className={`py-2 px-2 rounded-xl border transition-all text-center ${
                  theme === 'minimal' ? 'bg-slate-100 text-slate-900 border-slate-400' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                أبيض نقي
              </button>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold">شعار المتجر</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold">شارة السعر</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSpecs}
                  onChange={(e) => setShowSpecs(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold">المواصفات والكود</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showContact}
                  onChange={(e) => setShowContact(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold">شريط التواصل</span>
              </label>
            </div>

            {/* Note clarification indicator (Requirement 1) */}
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 font-medium">
              ✅ تم حذف الملاحظات الإضافية أسفل المنتج لتظهر الصورة نظيفة وخالية من أي نصوص تشويشية.
            </div>
          </div>
        </div>

        {/* LEFT (Canvas Live Preview & Sharing Actions): 7 Cols */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center space-y-4">
          
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>معاينة الصورة المختومة المباشرة:</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              دقة عالية 720 × 720 مربعة مثالية لواتساب وإنستغرام
            </span>
          </div>

          {/* HTML5 Canvas Element */}
          <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-950 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Action Sharing Buttons */}
          <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            
            {/* WhatsApp Direct Share */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition-all transform active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة مباشرة عبر واتساب</span>
            </button>

            {/* Download High Res Image */}
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">تم تنزيل الصورة!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>تحميل الصورة المختومة (PNG)</span>
                </>
              )}
            </button>

            {/* Copy Ad Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="sm:col-span-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-black">تم نسخ نص العرض التسويقي بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>نسخ نص العرض التسويقي الجاهز</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
