import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  PlusCircle, 
  FolderPlus, 
  Sparkles,
  Smartphone,
  CheckCircle2,
  X
} from 'lucide-react';
import { Product, CatalogCategory, PriceTier, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  products: Product[];
  categories: CatalogCategory[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  priceTier: PriceTier;
  currency: Currency;
  isCustomerView: boolean;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddImagesToProduct: (product: Product) => void;
  onStampProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenNewProductModal: () => void;
  onAddNewCategory: (categoryName: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  categories,
  activeCategory,
  setActiveCategory,
  priceTier,
  currency,
  isCustomerView,
  onEditProduct,
  onDeleteProduct,
  onAddImagesToProduct,
  onStampProduct,
  onAddToCart,
  onOpenNewProductModal,
  onAddNewCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'views'>('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Lightbox state for multi-image viewing
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    images: string[];
    index: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    index: 0,
    title: ''
  });

  // Filter products by category, search, and stock
  let filtered = products.filter(p => {
    if (activeCategory !== 'الكل' && p.category !== activeCategory) {
      return false;
    }
    if (inStockOnly && p.stock <= 0) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sort
  if (sortBy === 'priceAsc') {
    filtered.sort((a, b) => a.retailPrice - b.retailPrice);
  } else if (sortBy === 'priceDesc') {
    filtered.sort((a, b) => b.retailPrice - a.retailPrice);
  } else if (sortBy === 'views') {
    filtered.sort((a, b) => b.views - a.views);
  }

  const handleOpenLightbox = (images: string[], initialIndex: number, title: string) => {
    setLightboxData({
      isOpen: true,
      images,
      index: initialIndex,
      title
    });
  };

  const handleSaveNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddNewCategory(newCatName.trim());
    setActiveCategory(newCatName.trim());
    setNewCatName('');
    setShowNewCatInput(false);
  };

  return (
    <div className="space-y-4 text-right">
      
      {/* Search & Top Action Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن هاتف، سعة، موديل، أو كود (مثل: آيفون 16، S24، Z Fold)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters, Stock Toggle, Layout, and Add Button */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            
            {/* In-Stock Filter */}
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3 py-2 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
                inStockOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>المتوفر بالمخزن فقط</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="featured">الأكثر تميزاً</option>
              <option value="views">الأكثر طلباً ومشاهدة</option>
              <option value="priceAsc">السعر: من الأقل للأعلى</option>
              <option value="priceDesc">السعر: من الأعلى للأقل</option>
            </select>

            {/* Layout switch */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setLayout('grid')}
                className={`p-1.5 rounded-lg transition-all ${layout === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                title="عرض شبكي"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-1.5 rounded-lg transition-all ${layout === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                title="عرض قائمة"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* New Product Trigger Button */}
            <button
              onClick={onOpenNewProductModal}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة هاتف جديد</span>
            </button>

          </div>

        </div>

        {/* Catalogs / Categories Scrollable Tabs */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto custom-scroll pb-1">
          {categories.map((cat) => {
            const count = cat.name === 'الكل'
              ? products.length
              : products.filter(p => p.category === cat.name).length;
            const isSelected = activeCategory === cat.name;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Add New Catalog button */}
          {!showNewCatInput ? (
            <button
              type="button"
              onClick={() => setShowNewCatInput(true)}
              className="px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 flex items-center gap-1 transition-all shrink-0"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ كتالوج جديد</span>
            </button>
          ) : (
            <form onSubmit={handleSaveNewCategory} className="flex items-center gap-1 shrink-0">
              <input
                type="text"
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="اسم الكتالوج..."
                className="bg-white border border-amber-400 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                حفظ
              </button>
              <button
                type="button"
                onClick={() => setShowNewCatInput(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Results Header Status */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
        <span>
          عرض <strong className="text-slate-900">{filtered.length}</strong> هاتف من أصل {products.length}
        </span>
        {activeCategory !== 'الكل' && (
          <span>
            ضمن كتالوج: <strong className="text-amber-600">{activeCategory}</strong>
          </span>
        )}
      </div>

      {/* Products Grid or List */}
      {filtered.length > 0 ? (
        <div className={layout === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          : "space-y-3"
        }>
          {filtered.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              priceTier={priceTier}
              currency={currency}
              isCustomerView={isCustomerView}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onAddImages={onAddImagesToProduct}
              onStampProduct={onStampProduct}
              onAddToCart={onAddToCart}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">لا توجد هواتف تطابق البحث الحالي</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            جرّب تغيير كلمات البحث أو اختر كتالوجاً آخر أو أضف منتجات جديدة بالصور
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenNewProductModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة هاتف لهذا الكتالوج</span>
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Fullscreen Multi-Image Viewing */}
      {lightboxData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxData(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-0 right-0 p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title & Counter */}
            <div className="text-center text-white mb-3 z-10">
              <h3 className="font-extrabold text-base">{lightboxData.title}</h3>
              <p className="text-xs text-amber-400 font-bold mt-0.5">
                صورة {lightboxData.index + 1} من {lightboxData.images.length}
              </p>
            </div>

            {/* Main Image Display */}
            <div className="relative max-h-[65vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
              <img
                src={lightboxData.images[lightboxData.index]}
                alt={lightboxData.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            {/* Thumbnails list */}
            {lightboxData.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full py-1">
                {lightboxData.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxData(prev => ({ ...prev, index: i }))}
                    className={`w-14 h-14 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      lightboxData.index === i ? 'border-amber-400 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
