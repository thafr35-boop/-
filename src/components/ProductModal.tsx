import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Star, 
  Plus, 
  Save, 
  Smartphone, 
  AlertTriangle 
} from 'lucide-react';
import { Product, CatalogCategory } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  categories: CatalogCategory[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  initialImages?: string[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  categories,
  onSaveProduct,
  onDeleteProduct,
  initialImages = []
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [sku, setSku] = useState('');
  const [retailPrice, setRetailPrice] = useState<number>(0);
  const [wholesalePrice, setWholesalePrice] = useState<number>(0);
  const [vipPrice, setVipPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [moq, setMoq] = useState<number>(1);
  const [specs, setSpecs] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setCustomCategory('');
      setSku(productToEdit.sku);
      setRetailPrice(productToEdit.retailPrice);
      setWholesalePrice(productToEdit.wholesalePrice);
      setVipPrice(productToEdit.vipPrice);
      setStock(productToEdit.stock);
      setMoq(productToEdit.moq);
      setSpecs(productToEdit.specs);
      setImages(productToEdit.images && productToEdit.images.length > 0 ? [...productToEdit.images] : []);
    } else {
      // New product defaults
      setName('');
      setCategory(categories[1]?.name || 'الهواتف الرائدة');
      setCustomCategory('');
      setSku('AD-' + Math.floor(1000 + Math.random() * 9000));
      setRetailPrice(3500);
      setWholesalePrice(3300);
      setVipPrice(3200);
      setStock(15);
      setMoq(1);
      setSpecs('نسخة أصلية مضمونة لدى عبدالرحمن ظافر للهواتف الذكية - ضمان سنتين معتمد');
      setImages(initialImages && initialImages.length > 0 ? [...initialImages] : []);
    }
    setShowDeleteConfirm(false);
  }, [productToEdit, isOpen, initialImages, categories]);

  if (!isOpen) return null;

  // Handle image files upload
  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(indexToPrimary, 1);
      return [item, ...copy];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalCategory = customCategory.trim() || category;
    const finalProduct: Product = {
      id: productToEdit ? productToEdit.id : 'p-' + Date.now(),
      name: name.trim(),
      category: finalCategory,
      sku: sku.trim() || ('AD-' + Math.floor(1000 + Math.random() * 9000)),
      retailPrice: Number(retailPrice) || 0,
      wholesalePrice: Number(wholesalePrice) || Number(retailPrice) * 0.9,
      vipPrice: Number(vipPrice) || Number(retailPrice) * 0.85,
      stock: Number(stock) || 0,
      moq: Number(moq) || 1,
      views: productToEdit ? productToEdit.views : 1,
      specs: specs.trim(),
      images: images.length > 0 ? images : [''],
      selectedForShare: productToEdit ? productToEdit.selectedForShare : true,
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveProduct(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden text-right">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {productToEdit ? 'تعديل بيانات وصور المنتج' : 'إضافة هاتف أو منتج جديد إلى الكتالوج'}
              </h2>
              <p className="text-xs text-slate-400">
                {productToEdit ? `كود المنتج: ${productToEdit.sku}` : 'أدخل المواصفات والأسعار وألبوم الصور'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto custom-scroll flex-1 space-y-4">
          
          {/* SECTION 1: Multiple Images Management (Requirement 3) */}
          <div className="space-y-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>ألبوم صور الهاتف (صور متعددة لجميع الزوايا)</span>
                <span className="text-[11px] text-slate-400">({images.length} صور مضافة)</span>
              </label>
              
              <label className="cursor-pointer px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة صور</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageFiles(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Images Grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                {images.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    className={`relative aspect-square rounded-xl border overflow-hidden bg-slate-900 group ${
                      idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-700'
                    }`}
                  >
                    <img src={imgUrl} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    
                    {/* Primary Badge */}
                    {idx === 0 ? (
                      <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        الرئيسية
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="absolute top-1 right-1 bg-slate-950/80 hover:bg-amber-500 text-slate-300 hover:text-slate-950 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="تعيين كصورة رئيسية للغلاف"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    )}

                    {/* Delete Image button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 left-1 bg-rose-600/90 hover:bg-rose-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="حذف هذه الصورة"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-bold">لا توجد صور لهذا الهاتف بعد</p>
                <p className="text-[11px] text-slate-500 mt-1">اضغط على زر "إضافة صور" أو اسحب الصور هنا</p>
              </div>
            )}
          </div>

          {/* SECTION 2: General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                اسم الهاتف أو المنتج بالكامل *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: آيفون 16 برو ماكس سعة 256 جيجابايت - تيتانيوم صحراوي"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Category / Catalog */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                الكتالوج / التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCustomCategory('');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
                <option value="__custom__">+ كتالوج جديد...</option>
              </select>
              {category === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="اكتب اسم الكتالوج الجديد..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white mt-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              )}
            </div>

            {/* SKU / Code */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                رمز الموديل (SKU / الكود)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="AD-IP16PM-256"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* SECTION 3: Pricing Tiers (Retail, Wholesale, VIP) */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400">
              تسعير المستويات (بالريال السعودي SAR):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  سعر التجزئة (قطاعي)
                </label>
                <input
                  type="number"
                  min="0"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  سعر الجملة (B2B)
                </label>
                <input
                  type="number"
                  min="0"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  سعر موزع VIP
                </label>
                <input
                  type="number"
                  min="0"
                  value={vipPrice}
                  onChange={(e) => setVipPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Stock & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                الكمية المتوفرة بالمخزن
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                أقل كمية لطلب الجملة (MOQ)
              </label>
              <input
                type="number"
                min="1"
                value={moq}
                onChange={(e) => setMoq(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                المواصفات الفنية والضمان
              </label>
              <textarea
                rows={2}
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="مثال: شريحة A18 Pro، كاميرا 48 ميجابكسل، ضمان وكالة سنتين لدى عبدالرحمن ظافر"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            {/* Delete button if editing (Requested by user) */}
            {productToEdit && onDeleteProduct ? (
              <div>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف المنتج</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-rose-950 border border-rose-600 rounded-xl p-1 text-xs">
                    <span className="text-[11px] text-rose-300 font-bold px-1.5">تأكيد الحذف؟</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteProduct(productToEdit.id);
                        onClose();
                      }}
                      className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black"
                    >
                      نعم، احذف
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{productToEdit ? 'حفظ التعديلات' : 'إضافة المنتج للكتالوج'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
