import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Smartphone, 
  Flame, 
  Users, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';

interface RadarViewProps {
  products: Product[];
  onStampProduct: (product: Product) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ products, onStampProduct }) => {
  const sortedByViews = [...products].sort((a, b) => b.views - a.views);
  const totalViews = products.reduce((acc, p) => acc + p.views, 0);
  const topProduct = sortedByViews[0];

  return (
    <div className="space-y-6 text-right">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-3xl p-4 sm:p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>رادار العملاء المهتمين وتحليلات الطلب (Customer Radar)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                مباشر
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              تتبع الهواتف الأكثر طلباً وزيارة لمعرفة ما يبحث عنه زبائنك وتجارك بدقة
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/60 border border-indigo-500/20 px-3.5 py-2 rounded-2xl text-center">
            <span className="text-[11px] text-slate-400 block font-semibold">إجمالي المشاهدات</span>
            <span className="text-base font-black text-amber-400">{totalViews.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-indigo-500/20 px-3.5 py-2 rounded-2xl text-center">
            <span className="text-[11px] text-slate-400 block font-semibold">الأكثر طلباً</span>
            <span className="text-base font-black text-emerald-400">{topProduct ? topProduct.sku : '-'}</span>
          </div>
        </div>
      </div>

      {/* Grid: Most Wanted Phones Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* RIGHT: Top Viewed Ranking (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>ترتيب الهواتف حسب اهتمام العملاء والمشاهدات</span>
          </h3>

          <div className="space-y-3">
            {sortedByViews.map((prod, idx) => {
              const percentage = Math.round((prod.views / (topProduct?.views || 1)) * 100);

              return (
                <div key={prod.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        idx === 0 ? 'bg-amber-500 text-slate-950' : (idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-slate-200 text-slate-600')
                      }`}>
                        #{idx + 1}
                      </span>
                      <img
                        src={prod.images[0] || ''}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover bg-slate-900 border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{prod.category}</span>
                          <span>•</span>
                          <span className="text-amber-600 font-extrabold">{prod.retailPrice} ر.س</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-left">
                        <span className="text-xs font-black text-slate-900 block">{prod.views}</span>
                        <span className="text-[10px] text-slate-400">اهتمام</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onStampProduct(prod)}
                        className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all"
                        title="ختم صورة هذا الهاتف للترويج الفوري"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEFT: Insights & Advice (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>نصائح لزيادة مبيعات الهواتف</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>الهواتف الحاصلة على أكثر من 50 مشاهدة تحقق أعلى نسبة مبيعات عند ختم صورها ومشاركتها في مجموعات واتساب.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>إضافة أكثر من 3 صور للهاتف (الأمام، الخلف، الكاميرات) يرفع رغبة المشتري بنسبة 40%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>عروض الجملة المشكّلة هي الخيار المفضل لتجار التجزئة في المحافظات.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
