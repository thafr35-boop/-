import React, { useState } from 'react';
import { 
  FolderPlus, 
  PlusSquare, 
  Layers, 
  X, 
  Check, 
  Smartphone, 
  Image as ImageIcon,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Product, CatalogCategory } from '../types';

interface ShareDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedImages: string[];
  categories: CatalogCategory[];
  products: Product[];
  onAddToCatalog: (categoryName: string, images: string[]) => void;
  onAddNewProductWithImages: (images: string[]) => void;
  onAppendImagesToProduct: (productId: string, images: string[]) => void;
}

export const ShareDestinationModal: React.FC<ShareDestinationModalProps> = ({
  isOpen,
  onClose,
  sharedImages,
  categories,
  products,
  onAddToCatalog,
  onAddNewProductWithImages,
  onAppendImagesToProduct
}) => {
  const [activeStep, setActiveStep] = useState<'choose_option' | 'select_catalog' | 'select_existing_product'>('choose_option');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[1]?.name || 'الهواتف الرائدة');
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  if (!isOpen || sharedImages.length === 0) return null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResetAndClose = () => {
    setActiveStep('choose_option');
    setSearchQuery('');
    setSelectedProductId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                تحديد وجهة الصور المشتركة
              </h2>
              <p className="text-xs text-slate-400">
                تم استقبال <span className="text-amber-400 font-bold">{sharedImages.length}</span> صورة بنجاح
              </p>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shared Images Preview Carousel Strip */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0">معاينة الصور:</span>
          {sharedImages.map((img, idx) => (
            <div key={idx} className="relative w-14 h-14 rounded-xl border border-slate-700 overflow-hidden shrink-0 bg-slate-800">
              <img src={img} alt={`shared-${idx}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] font-bold px-1 rounded text-white">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body: 3 Distinct Options Flow */}
        <div className="p-5 overflow-y-auto custom-scroll flex-1 space-y-4">
          
          {/* STEP 1: Main 3 Option Choices */}
          {activeStep === 'choose_option' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 font-semibold mb-2">
                اختر أين تريد توجيه هذه الصور المشتركة:
              </p>

              {/* Option 1: Add to Catalog */}
              <button
                type="button"
                onClick={() => setActiveStep('select_catalog')}
                className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all text-right flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      ١. إضافة إلى كتالوج
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      تخصيص الصور إلى كتالوج محدد أو إنشاء كتالوج جديد باسم تختاره
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 rotate-180 transition-all" />
              </button>

              {/* Option 2: Add as New Product */}
              <button
                type="button"
                onClick={() => {
                  onAddNewProductWithImages(sharedImages);
                  handleResetAndClose();
                }}
                className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 transition-all text-right flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <PlusSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                      ٢. إضافة كمنتج جديد
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      إنشاء بطاقة هاتف أو منتج جديد تكون هذه الصور ألبومه الأساسي
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 rotate-180 transition-all" />
              </button>

              {/* Option 3: Add to an Existing Product */}
              <button
                type="button"
                onClick={() => setActiveStep('select_existing_product')}
                className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 transition-all text-right flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors">
                      ٣. إضافة إلى منتج موجود من قبل
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      إلحاق هذه الصور بهاتف موجود مسبقاً لإضافة زوايا تصوير وصور متعددة
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 rotate-180 transition-all" />
              </button>
            </div>
          )}

          {/* STEP 2: Select or Create Catalog */}
          {activeStep === 'select_catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">اختر الكتالوج المستهدف:</span>
                <button
                  type="button"
                  onClick={() => setActiveStep('choose_option')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  رجوع للخيارات
                </button>
              </div>

              {/* Existing Catalogs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setNewCategoryName('');
                    }}
                    className={`p-3 rounded-xl border text-right text-xs font-bold flex items-center justify-between transition-all ${
                      selectedCategory === cat.name && !newCategoryName
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.name && !newCategoryName && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Or Create New Catalog */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400 font-semibold block mb-1">
                  أو أنشئ كتالوجاً جديداً:
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="مثال: سلسلة هواتف فيفو X100 Pro الجديدة..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const finalCat = newCategoryName.trim() || selectedCategory;
                    onAddToCatalog(finalCat, sharedImages);
                    handleResetAndClose();
                  }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all"
                >
                  تأكيد الإضافة إلى كتالوج ({newCategoryName.trim() || selectedCategory})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('choose_option')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select an Existing Product to Append Images */}
          {activeStep === 'select_existing_product' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">اختر الهاتف الذي تريد إضافة الصور إليه:</span>
                <button
                  type="button"
                  onClick={() => setActiveStep('choose_option')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  رجوع للخيارات
                </button>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الموديل أو الكود (مثال: آيفون 16، S24)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* Product Selection List */}
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll pr-1">
                {filteredProducts.map(prod => {
                  const isSelected = selectedProductId === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`w-full p-2.5 rounded-xl border text-right flex items-center justify-between gap-3 transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                          <img 
                            src={prod.images[0] || ''} 
                            alt={prod.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span>{prod.category}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">{prod.retailPrice} ر.س</span>
                            <span>•</span>
                            <span className="bg-slate-700 px-1.5 py-0.2 rounded text-[10px] text-slate-200">
                              يحتوي {prod.images.length} صور
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 flex gap-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={!selectedProductId}
                  onClick={() => {
                    if (selectedProductId) {
                      onAppendImagesToProduct(selectedProductId, sharedImages);
                      handleResetAndClose();
                    }
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${
                    selectedProductId 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  إلحاق {sharedImages.length} صور بهذا الهاتف
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('choose_option')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
