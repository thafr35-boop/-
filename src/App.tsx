/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { StampStudio } from './components/StampStudio';
import { OrdersView } from './components/OrdersView';
import { RadarView } from './components/RadarView';
import { ApkStudioModal } from './components/ApkStudioModal';
import { ShareDestinationModal } from './components/ShareDestinationModal';
import { ProductModal } from './components/ProductModal';
import { 
  Product, 
  CatalogCategory, 
  PriceTier, 
  Currency, 
  CartItem, 
  Order 
} from './types';
import { initialProducts, initialCategories, initialOrders } from './data/initialData';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

declare global {
  interface Window {
    receiveSharedGalleryImages?: (images: string[]) => void;
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ad_smartphones_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [categories, setCategories] = useState<CatalogCategory[]>(() => {
    const saved = localStorage.getItem('ad_smartphones_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCategories;
      }
    }
    return initialCategories;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ad_smartphones_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialOrders;
      }
    }
    return initialOrders;
  });

  const [cart, setCart] = useState<CartItem[]>([
    { productId: 'p1', qty: 1, note: 'تيتانيوم صحراوي - فحص الختم' }
  ]);

  const [activeTab, setActiveTab] = useState<'catalog' | 'stamp' | 'orders' | 'radar' | 'apk'>('catalog');
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [priceTier, setPriceTier] = useState<PriceTier>('retail');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [isCustomerView, setIsCustomerView] = useState<boolean>(false);
  const [activeStampProductId, setActiveStampProductId] = useState<string>('p1');

  // Shared Images Modal State (Requirement 2)
  const [sharedImages, setSharedImages] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Add / Edit Product Modal State (Requirement: "ضيف خيار تعديل المنتج او حذفه")
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [initialImagesForNewProduct, setInitialImagesForNewProduct] = useState<string[]>([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden File input ref for trigger
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // PWA install prompt event ref
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ad_smartphones_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ad_smartphones_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ad_smartphones_orders', JSON.stringify(orders));
  }, [orders]);

  // Hook for Android Native WebView Intent or Gallery Share
  useEffect(() => {
    window.receiveSharedGalleryImages = (images: string[]) => {
      if (images && images.length > 0) {
        setSharedImages(images);
        setIsShareModalOpen(true);
        showToast(`تم استقبال ${images.length} صور من استوديو الهاتف!`);
      }
    };

    // PWA Install Prompt Listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Clipboard Paste Listener for Images
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const pastedImages: string[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                pastedImages.push(event.target.result as string);
                if (pastedImages.length === 1) {
                  setSharedImages(pastedImages);
                  setIsShareModalOpen(true);
                  showToast('تم استقبال صورة من الحافظة!');
                }
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Trigger file selection for Gallery Share simulation
  const handleTriggerShareFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          setSharedImages(newImages);
          setIsShareModalOpen(true);
          e.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Requirement 2: Handling 3 Destination Actions
  // 1. Add to Catalog
  const handleAddToCatalog = (categoryName: string, images: string[]) => {
    // Add category if new
    if (!categories.some(c => c.name === categoryName)) {
      setCategories(prev => [...prev, {
        id: 'cat-' + Date.now(),
        name: categoryName,
        description: 'كتالوج خاص تم إنشاؤه عبر مشاركة الصور'
      }]);
    }

    // Create a new product with these images in that category
    const newProd: Product = {
      id: 'p-' + Date.now(),
      name: `${categoryName} - هاتف ذكي جديد`,
      category: categoryName,
      sku: 'AD-' + Math.floor(1000 + Math.random() * 9000),
      retailPrice: 2900,
      wholesalePrice: 2700,
      vipPrice: 2600,
      stock: 12,
      moq: 1,
      views: 1,
      specs: 'مواصفات ممتازة مع ضمان الوكيل المعتمد سنتين لدى عبدالرحمن ظافر',
      images: images,
      selectedForShare: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [newProd, ...prev]);
    setActiveCategory(categoryName);
    showToast(`تمت إضافة المنتج بنجاح إلى كتالوج (${categoryName})!`);
  };

  // 2. Add as New Product with modal
  const handleAddNewProductWithImages = (images: string[]) => {
    setProductToEdit(null);
    setInitialImagesForNewProduct(images);
    setIsProductModalOpen(true);
  };

  // 3. Append images to an existing product
  const handleAppendImagesToProduct = (productId: string, newImages: string[]) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          images: [...p.images, ...newImages]
        };
      }
      return p;
    }));
    const targetProd = products.find(p => p.id === productId);
    showToast(`تمت إضافة ${newImages.length} صور إضافية بنجاح إلى (${targetProd?.name || 'المنتج'})!`);
  };

  // Edit Product handler (Requested: "ضيف خيار تعديل المنتج او حذفه")
  const handleOpenEditProduct = (prod: Product) => {
    setProductToEdit(prod);
    setInitialImagesForNewProduct([]);
    setIsProductModalOpen(true);
  };

  // Delete Product handler (Requested: "ضيف خيار تعديل المنتج او حذفه")
  const handleDeleteProduct = (productId: string) => {
    const prodToDelete = products.find(p => p.id === productId);
    if (!prodToDelete) return;

    if (window.confirm(`هل أنت متأكد من حذف المنتج: "${prodToDelete.name}" نهائياً من الكتالوج؟`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      setCart(prev => prev.filter(item => item.productId !== productId));
      if (activeStampProductId === productId) {
        const remaining = products.filter(p => p.id !== productId);
        if (remaining.length > 0) setActiveStampProductId(remaining[0].id);
      }
      showToast(`تم حذف "${prodToDelete.name}" من الكتالوج بنجاح`);
    }
  };

  // Save (Create or Update) Product
  const handleSaveProduct = (savedProd: Product) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === savedProd.id);
      if (exists) {
        return prev.map(p => p.id === savedProd.id ? savedProd : p);
      }
      return [savedProd, ...prev];
    });

    // Ensure category exists
    if (!categories.some(c => c.name === savedProd.category)) {
      setCategories(prev => [...prev, {
        id: 'cat-' + Date.now(),
        name: savedProd.category
      }]);
    }

    showToast(`تم حفظ "${savedProd.name}" بنجاح!`);
  };

  // Quick Add Images to Product from card
  const handleQuickAddImages = (product: Product) => {
    // Open hidden input and remember target product
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e: any) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const imgs: string[] = [];
        let done = 0;
        Array.from(files).forEach((f: any) => {
          const r = new FileReader();
          r.onload = (ev) => {
            if (ev.target?.result) imgs.push(ev.target.result as string);
            done++;
            if (done === files.length) {
              handleAppendImagesToProduct(product.id, imgs);
              fileInputRef.current!.onchange = handleFilesSelected as any;
            }
          };
          r.readAsDataURL(f);
        });
      };
      fileInputRef.current.click();
    }
  };

  // Stamp product redirect
  const handleStampProduct = (prod: Product) => {
    setActiveStampProductId(prod.id);
    setActiveTab('stamp');
  };

  // Cart operations
  const handleAddToCart = (prod: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === prod.id);
      if (existing) {
        return prev.map(i => i.productId === prod.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { productId: prod.id, qty: 1, note: '' }];
    });
    showToast(`تمت إضافة "${prod.name}" إلى السلة`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.productId === productId) {
          const newQty = Math.max(1, i.qty + delta);
          return { ...i, qty: newQty };
        }
        return i;
      });
    });
  };

  const handleUpdateCartNote = (productId: string, note: string) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, note } : i));
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`تم تحديث حالة الطلب #${orderId}`);
  };

  const handleAddNewCategory = (catName: string) => {
    if (!categories.some(c => c.name === catName)) {
      setCategories(prev => [...prev, {
        id: 'cat-' + Date.now(),
        name: catName
      }]);
      showToast(`تم إنشاء كتالوج جديد: "${catName}"`);
    }
  };

  // Trigger PWA install
  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('شكراً لتثبيت تطبيق عبدالرحمن ظافر للهواتف الذكية!');
        }
        setDeferredPrompt(null);
      });
    } else {
      showToast('لتثبيت التطبيق على أندرويد: اضغط على خيارات المتصفح (⋮) ثم اختر "إضافة إلى الشاشة الرئيسية"');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-amber-500 selection:text-white">
      
      {/* Hidden File Input for Gallery Share & Direct Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Main App Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        priceTier={priceTier}
        setPriceTier={setPriceTier}
        currency={currency}
        setCurrency={setCurrency}
        isCustomerView={isCustomerView}
        setIsCustomerView={setIsCustomerView}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onOpenCart={() => setActiveTab('orders')}
        onTriggerShareInput={handleTriggerShareFiles}
        onOpenNewProductModal={() => {
          setProductToEdit(null);
          setInitialImagesForNewProduct([]);
          setIsProductModalOpen(true);
        }}
      />

      {/* Main App Body Views */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 flex-1 w-full">
        {activeTab === 'catalog' && (
          <CatalogView
            products={products}
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            priceTier={priceTier}
            currency={currency}
            isCustomerView={isCustomerView}
            onEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddImagesToProduct={handleQuickAddImages}
            onStampProduct={handleStampProduct}
            onAddToCart={handleAddToCart}
            onOpenNewProductModal={() => {
              setProductToEdit(null);
              setInitialImagesForNewProduct([]);
              setIsProductModalOpen(true);
            }}
            onAddNewCategory={handleAddNewCategory}
          />
        )}

        {activeTab === 'stamp' && (
          <StampStudio
            products={products}
            activeProductId={activeStampProductId}
            setActiveProductId={setActiveStampProductId}
            priceTier={priceTier}
            setPriceTier={setPriceTier}
            currency={currency}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            cart={cart}
            products={products}
            orders={orders}
            priceTier={priceTier}
            currency={currency}
            onUpdateCartQty={handleUpdateCartQty}
            onUpdateCartNote={handleUpdateCartNote}
            onRemoveCartItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onCreateOrder={handleCreateOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'radar' && (
          <RadarView
            products={products}
            onStampProduct={handleStampProduct}
          />
        )}

        {activeTab === 'apk' && (
          <ApkStudioModal
            onInstallPwa={handleInstallPwa}
            canInstallPwa={!!deferredPrompt}
          />
        )}
      </main>

      {/* Share Destination Modal (Requirement 2) */}
      <ShareDestinationModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        sharedImages={sharedImages}
        categories={categories}
        products={products}
        onAddToCatalog={handleAddToCatalog}
        onAddNewProductWithImages={handleAddNewProductWithImages}
        onAppendImagesToProduct={handleAppendImagesToProduct}
      />

      {/* Add / Edit Product Modal (Requirement: Edit & Delete) */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
          setInitialImagesForNewProduct([]);
        }}
        productToEdit={productToEdit}
        categories={categories}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        initialImages={initialImagesForNewProduct}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 bg-slate-900 border border-amber-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-slate-100">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Footer Status Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>عبدالرحمن ظافر للهواتف الذكية © 2026 • جميع الحقوق محفوظة</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>QuickSell Pro Engine</span>
            <span>•</span>
            <span className="text-emerald-400">متوافق مع Android 14 و APK</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
