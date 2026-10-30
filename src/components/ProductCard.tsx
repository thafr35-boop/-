import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Sparkles, 
  ShoppingCart, 
  Eye, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { Product, PriceTier, Currency } from '../types';

interface ProductCardProps {
  product: Product;
  priceTier: PriceTier;
  currency: Currency;
  isCustomerView: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAddImages: (product: Product) => void;
  onStampProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenLightbox: (images: string[], initialIndex: number, title: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priceTier,
  currency,
  isCustomerView,
  onEdit,
  onDelete,
  onAddImages,
  onStampProduct,
  onAddToCart,
  onOpenLightbox
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Conversion rate helpers
  const formatPrice = (sarPrice: number) => {
    let finalVal = sarPrice;
    let symbol = 'ر.س';
    if (currency === 'USD') {
      finalVal = Math.round(sarPrice / 3.75);
      symbol = '$';
    } else if (currency === 'YER') {
      finalVal = Math.round(sarPrice * 142);
      symbol = 'ر.ي';
    }
    return {
      amount: finalVal.toLocaleString('en-US'),
      symbol
    };
  };

  const getActivePrice = () => {
    switch (priceTier) {
      case 'wholesale':
        return product.wholesalePrice;
      case 'vip':
        return product.vipPrice;
      case 'retail':
      default:
        return product.retailPrice;
    }
  };

  const activePrice = getActivePrice();
  const formattedPrice = formatPrice(activePrice);
  const retailFormatted = formatPrice(product.retailPrice);

  const images = product.images && product.images.length > 0 ? product.images : [''];
  const hasMultipleImages = images.length > 1;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden text-right">
      
      {/* Product Image Carousel Area */}
      <div className="relative aspect-square bg-slate-900 overflow-hidden cursor-pointer">
        <img
          src={images[currentImageIndex] || ''}
          alt={product.name}
          onClick={() => onOpenLightbox(images, currentImageIndex, product.name)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Multiple Images Indicator Badge */}
        {hasMultipleImages && (
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 z-10 shadow-sm">
            <span>📷</span>
            <span>{currentImageIndex + 1} / {images.length} صور</span>
          </div>
        )}

        {/* Category Pill on top-left */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-700 z-10">
          {product.category}
        </div>

        {/* Carousel Navigation Arrows if multiple images */}
        {hasMultipleImages && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <button
              type="button"
              onClick={handlePrevImage}
              className="p-1.5 rounded-full bg-slate-950/80 hover:bg-amber-500 text-white hover:text-slate-950 pointer-events-auto transition-all shadow-md"
              title="الصورة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="p-1.5 rounded-full bg-slate-950/80 hover:bg-amber-500 text-white hover:text-slate-950 pointer-events-auto transition-all shadow-md"
              title="الصورة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dots indicator at bottom of image */}
        {hasMultipleImages && (
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === idx ? 'bg-amber-400 w-4' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick View Fullscreen trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLightbox(images, currentImageIndex, product.name);
          }}
          className="absolute bottom-2.5 left-2.5 p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="عرض الصور بالحجم الكامل"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* SKU & Views */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              {product.sku}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>{product.views} مشاهدة</span>
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Technical Specs Summary */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.specs}
          </p>
        </div>

        {/* Price & Stock Section */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                {priceTier === 'retail' && 'سعر التجزئة المعتمد'}
                {priceTier === 'wholesale' && 'سعر الجملة B2B'}
                {priceTier === 'vip' && 'سعر الموزع VIP'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
                  {formattedPrice.amount}
                </span>
                <span className="text-xs font-extrabold text-slate-700">
                  {formattedPrice.symbol}
                </span>
              </div>
            </div>

            {/* If Wholesale/VIP and not customer view, show savings/retail comp */}
            {priceTier !== 'retail' && !isCustomerView && (
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">قطاعي</span>
                <span className="text-xs font-bold text-slate-400 line-through">
                  {retailFormatted.amount} {retailFormatted.symbol}
                </span>
              </div>
            )}
          </div>

          {/* Stock Availability status */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-emerald-700">متوفر {product.stock} حبة</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-rose-600">نفذت الكمية</span>
                </>
              )}
            </div>
            {product.moq > 1 && (
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
                أقل طلب جملة: {product.moq}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit, Delete, Add Photos, Stamp, Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          
          {/* Main Action Bar */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Stamp Image Button */}
            <button
              type="button"
              onClick={() => onStampProduct(product)}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
              title="ختم الصورة بالأسعار والمواصفات ومشاركتها عبر واتساب"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ختم ومشاركة</span>
            </button>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
              <span>طلب / سلة</span>
            </button>
          </div>

          {/* Secondary Action Toolbar: Edit, Delete, and Add More Images */}
          <div className="flex items-center justify-between gap-1 pt-1 text-slate-600">
            {/* Quick Add More Images Button */}
            <button
              type="button"
              onClick={() => onAddImages(product)}
              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-slate-200 transition-all"
              title="إضافة صور إضافية لهذا الهاتف"
            >
              <PlusCircle className="w-3 h-3 text-emerald-600" />
              <span>+ صور إضافية</span>
            </button>

            <div className="flex items-center gap-1">
              {/* Edit Product (Requested by user) */}
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 transition-all"
                title="تعديل بيانات وصور المنتج"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Delete Product (Requested by user) */}
              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all"
                title="حذف هذا المنتج من الكتالوج"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
