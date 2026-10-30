import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Printer, 
  User, 
  MapPin, 
  Phone,
  FileText
} from 'lucide-react';
import { Product, CartItem, Order, PriceTier, Currency } from '../types';

interface OrdersViewProps {
  cart: CartItem[];
  products: Product[];
  orders: Order[];
  priceTier: PriceTier;
  currency: Currency;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onUpdateCartNote: (productId: string, note: string) => void;
  onRemoveCartItem: (productId: string) => void;
  onClearCart: () => void;
  onCreateOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  storePhone?: string;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  cart,
  products,
  orders,
  priceTier,
  currency,
  onUpdateCartQty,
  onUpdateCartNote,
  onRemoveCartItem,
  onClearCart,
  onCreateOrder,
  onUpdateOrderStatus,
  storePhone = '967771234567'
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('صنعاء - شارع صخر - يرجى فحص الضمان والختم');
  const [paymentMethod, setPaymentMethod] = useState('تحويل بنكي / محفظة إلكترونية');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Cart products calculations
  const cartWithProducts = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    let unitPrice = prod ? prod.retailPrice : 0;
    if (priceTier === 'wholesale' && prod) unitPrice = prod.wholesalePrice;
    if (priceTier === 'vip' && prod) unitPrice = prod.vipPrice;

    return {
      ...item,
      product: prod,
      unitPrice,
      total: unitPrice * item.qty
    };
  }).filter(item => item.product !== undefined);

  const totalSAR = cartWithProducts.reduce((sum, item) => sum + item.total, 0);

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
    return `${finalVal.toLocaleString('en-US')} ${symbol}`;
  };

  const handleCheckoutWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartWithProducts.length === 0) return;

    const itemsSummary = cartWithProducts.map(i => `${i.qty}× ${i.product!.name} (${i.note ? 'ملاحظة: ' + i.note : ''})`).join(' + ');

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customer: customerName.trim() || 'عميل المتجر',
      phone: customerPhone.trim() || 'غير محدد',
      address: customerAddress.trim() || 'استلام من المعرض',
      payment: paymentMethod,
      tier: priceTier === 'retail' ? 'تجزئة' : (priceTier === 'wholesale' ? 'جملة B2B' : 'موزع VIP'),
      itemsSummary,
      totalSAR,
      status: 'pending',
      time: 'الآن'
    };

    onCreateOrder(newOrder);

    // Prepare WhatsApp Message
    const text = `*طلب شراء جديد من متجر عبدالرحمن ظافر للهواتف الذكية* 📱🛍️
━━━━━━━━━━━━━━━━━━━
🏷️ *رقم الطلب:* #${newOrder.id}
👤 *العميل:* ${newOrder.customer}
📞 *الهاتف:* ${newOrder.phone}
📍 *العنوان:* ${newOrder.address}
💳 *طريقة الدفع:* ${newOrder.payment}
💼 *مستوى التسعير:* ${newOrder.tier}
━━━━━━━━━━━━━━━━━━━
📦 *تفاصيل المنتجات المطلوبة:*
${cartWithProducts.map((i, idx) => `${idx + 1}. ${i.product!.name}
   - الكمية: ${i.qty} حبة | السعر: ${formatPrice(i.unitPrice)}
   ${i.note ? '   - ملاحظة العميل: ' + i.note : ''}`).join('\n')}
━━━━━━━━━━━━━━━━━━━
💰 *الإجمالي المستحق:* ${formatPrice(totalSAR)}
━━━━━━━━━━━━━━━━━━━
يرجى تأكيد الحجز وتجهيز الشحن فوراً. شكراً لتعاملكم مع عبدالرحمن ظافر للهواتف الذكية!`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    onClearCart();
    setOrderPlacedSuccess(true);
    setTimeout(() => setOrderPlacedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Title */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              سلة المبيعات وإدارة طلبات العملاء
            </h2>
            <p className="text-xs text-slate-500">
              تجهيز فواتير الطلبات وإرسالها مباشرة إلى واتساب مع الحفظ في سجل الطلبات
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all"
          >
            تفريغ السلة
          </button>
        )}
      </div>

      {/* Grid: Cart + Checkout Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* RIGHT: Cart Items List (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span>المنتجات بالسلة</span>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-black">
                {cartWithProducts.length}
              </span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              المستوى: {priceTier === 'retail' ? 'تجزئة' : (priceTier === 'wholesale' ? 'جملة B2B' : 'موزع VIP')}
            </span>
          </div>

          {cartWithProducts.length > 0 ? (
            <div className="space-y-3">
              {cartWithProducts.map((item) => (
                <div key={item.productId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product!.images[0] || ''}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product!.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="text-amber-600 font-extrabold">{formatPrice(item.unitPrice)}</span>
                          <span>•</span>
                          <span>كود: {item.product!.sku}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector + Remove */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateCartQty(item.productId, -1)}
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-slate-900">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateCartQty(item.productId, 1)}
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveCartItem(item.productId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Specific Note (Color, capacity, warranty) */}
                  <input
                    type="text"
                    value={item.note || ''}
                    onChange={(e) => onUpdateCartNote(item.productId, e.target.value)}
                    placeholder="ملاحظة خاصة على هذا الهاتف (مثل: لون تيتانيوم صحراوي، فحص الضمان)..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              ))}

              {/* Total Row */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <span className="text-xs font-black text-amber-950">الإجمالي الكلي للسلة:</span>
                <span className="text-lg font-black text-amber-700">{formatPrice(totalSAR)}</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">السلة فارغة حالياً</p>
              <p className="text-[11px] text-slate-400">تصفح الكتالوج واضغط على "طلب / سلة" لإضافة الهواتف هنا</p>
            </div>
          )}
        </div>

        {/* LEFT: Customer Info & Checkout Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-amber-600" />
            <span>بيانات العميل وإنهاء الطلب</span>
          </h3>

          <form onSubmit={handleCheckoutWhatsApp} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                اسم العميل أو المعرض *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: المهندس طارق / محلات الصقر للاتصالات"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                رقم الهاتف أو الواتساب
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="967771234567"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                عنوان التوصيل أو الفرع
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="صنعاء - شارع صخر / الرياض - حي الستين"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                طريقة الدفع المتفق عليها
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="تحويل بنكي / محفظة إلكترونية">تحويل بنكي / محفظة إلكترونية</option>
                <option value="نقداً عند الاستلام (COD)">نقداً عند الاستلام (COD)</option>
                <option value="آجل لتجار الجملة المعتمدين">آجل لتجار الجملة المعتمدين</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={cartWithProducts.length === 0}
              className={`w-full py-3 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all ${
                cartWithProducts.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>إرسال الطلب واعتماده عبر واتساب</span>
            </button>
          </form>

          {orderPlacedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تم إنشاء الطلب وفتح محادثة واتساب بنجاح!</span>
            </div>
          )}
        </div>

      </div>

      {/* SECTION 2: Orders History & Status Management */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>سجل الطلبات السابقة وحالات التوصيل</span>
        </h3>

        <div className="space-y-3">
          {orders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                    #{ord.id}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900">{ord.customer}</h4>
                  <span className="text-[11px] text-slate-400">• {ord.time}</span>
                </div>
                <p className="text-xs text-slate-600">{ord.itemsSummary}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>📍 {ord.address}</span>
                  <span>•</span>
                  <span>💰 {formatPrice(ord.totalSAR)}</span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={ord.status}
                  onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                  className="bg-white text-xs font-bold border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="pending">⏳ قيد الانتظار</option>
                  <option value="confirmed">✅ تم التأكيد</option>
                  <option value="shipped">🚚 جاري الشحن</option>
                  <option value="delivered">🎉 تم التسليم</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
