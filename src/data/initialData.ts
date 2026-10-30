import { Product, CatalogCategory, Order } from '../types';

// Helper to generate crisp, high-res smartphone SVG data URLs with distinct angles
function createPhoneSvgDataUrl(model: string, color: string, angle: string, accent = '#f59e0b'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </linearGradient>
      <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1e38" />
        <stop offset="50%" stop-color="#0d1b2a" />
        <stop offset="100%" stop-color="#000814" />
      </linearGradient>
      <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="24" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <!-- Background Backdrop -->
    <rect width="800" height="800" fill="url(#bg)"/>
    <circle cx="400" cy="380" r="280" fill="${accent}" opacity="0.08" filter="url(#glow)"/>
    <circle cx="400" cy="380" r="200" fill="#3b82f6" opacity="0.05"/>
    
    <!-- Phone Chassis Frame -->
    <g transform="translate(230, 90)">
      <!-- Outer Metal Border -->
      <rect x="0" y="0" width="340" height="620" rx="46" fill="#334155" stroke="${accent}" stroke-width="3" opacity="0.9"/>
      <rect x="6" y="6" width="328" height="608" rx="42" fill="url(#phoneBody)"/>
      
      <!-- Inner Screen / Back depending on angle -->
      ${angle.includes('الخلف') || angle.includes('الكاميرات') 
        ? `
        <!-- Phone Back View with Camera Island -->
        <rect x="20" y="20" width="300" height="580" rx="36" fill="${color}" opacity="0.95"/>
        <g transform="translate(36, 36)">
          <rect x="0" y="0" width="128" height="136" rx="28" fill="#0f172a" stroke="#475569" stroke-width="2"/>
          <circle cx="42" cy="42" r="24" fill="#020617" stroke="${accent}" stroke-width="2.5"/>
          <circle cx="42" cy="42" r="14" fill="#1e293b"/>
          <circle cx="42" cy="42" r="6" fill="#38bdf8"/>
          
          <circle cx="42" cy="94" r="24" fill="#020617" stroke="${accent}" stroke-width="2.5"/>
          <circle cx="42" cy="94" r="14" fill="#1e293b"/>
          <circle cx="42" cy="94" r="6" fill="#38bdf8"/>
          
          <circle cx="94" cy="68" r="22" fill="#020617" stroke="${accent}" stroke-width="2"/>
          <circle cx="94" cy="68" r="12" fill="#1e293b"/>
          <circle cx="94" cy="68" r="5" fill="#38bdf8"/>
          
          <circle cx="94" cy="32" r="8" fill="#fef08a" opacity="0.9"/>
        </g>
        <circle cx="170" cy="310" r="32" fill="#ffffff" opacity="0.1"/>
        <text x="170" y="540" fill="#94a3b8" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">عبدالرحمن ظافر للهواتف الذكية</text>
        ` 
        : `
        <!-- Phone Front Screen View -->
        <rect x="12" y="12" width="316" height="596" rx="38" fill="url(#screenGrad)"/>
        <!-- Dynamic Island / Punch Hole -->
        <rect x="110" y="26" width="96" height="24" rx="12" fill="#000000" stroke="#334155" stroke-width="1"/>
        <!-- Screen Content Graphic -->
        <circle cx="170" cy="240" r="90" fill="${accent}" opacity="0.25" filter="url(#glow)"/>
        <path d="M 60 420 Q 170 320 280 440" stroke="${accent}" stroke-width="3" fill="none" opacity="0.8"/>
        <path d="M 50 450 Q 170 370 290 470" stroke="#38bdf8" stroke-width="2" fill="none" opacity="0.7"/>
        <text x="170" y="248" fill="#ffffff" font-size="28" font-weight="900" text-anchor="middle" font-family="sans-serif">5G PRO</text>
        <text x="170" y="280" fill="${accent}" font-size="15" font-weight="bold" text-anchor="middle" font-family="sans-serif">120Hz OLED</text>
        `
      }
    </g>
    
    <!-- Floating Angle Badge -->
    <g transform="translate(60, 680)">
      <rect x="0" y="0" width="220" height="54" rx="16" fill="rgba(15, 23, 42, 0.9)" stroke="${accent}" stroke-width="1.5"/>
      <text x="110" y="34" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle" font-family="sans-serif">زاوية: ${angle}</text>
    </g>
    
    <!-- Model Tag -->
    <g transform="translate(520, 680)">
      <rect x="0" y="0" width="220" height="54" rx="16" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="110" y="34" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle" font-family="sans-serif">${model.slice(0, 16)}</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export const initialCategories: CatalogCategory[] = [
  { id: 'all', name: 'الكل', description: 'جميع الهواتف والإكسسوارات' },
  { id: 'flagship', name: 'الهواتف الرائدة', description: 'آبل آيفون وسامسونج ألترا الفئة العليا' },
  { id: 'foldable', name: 'الهواتف القابلة للطي', description: 'سلسلة Z Fold و Z Flip والهواتف المبتكرة' },
  { id: 'midrange', name: 'الفئة الاقتصادية والمتوسطة', description: 'شاومي وريدمي وسامسونج سلسلة A' },
  { id: 'accessories', name: 'إكسسوارات وضمان', description: 'شواحن سريعة، بكجات حماية وسماعات أصلية' },
  { id: 'wholesale', name: 'عروض وبكجات الجملة', description: 'عروض مخصصة لأصحاب المحلات والموزعين' }
];

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'آيفون 16 برو ماكس سعة 256 جيجابايت - تيتانيوم صحراوي',
    category: 'الهواتف الرائدة',
    sku: 'AD-IP16PM-256',
    retailPrice: 4850,
    wholesalePrice: 4620,
    vipPrice: 4550,
    stock: 18,
    moq: 1,
    views: 142,
    specs: 'شاشة Super Retina XDR مقاس 6.9 إنش - شريحة A18 Pro - كاميرا 48MP فيوجن - ضمان وكالة سنتين لدى عبدالرحمن ظافر',
    images: [
      createPhoneSvgDataUrl('iPhone 16 Pro Max', '#44403c', 'الواجهة الأمامية والجزيرة التفاعلية', '#f59e0b'),
      createPhoneSvgDataUrl('iPhone 16 Pro Max', '#292524', 'الجهة الخلفية وكاميرات التيتانيوم', '#d97706'),
      createPhoneSvgDataUrl('iPhone 16 Pro Max', '#1c1917', 'منظور جانبي وزر التحكم بالكاميرا', '#f59e0b')
    ],
    selectedForShare: true,
    createdAt: '2026-10-25'
  },
  {
    id: 'p2',
    name: 'سامسونج جالكسي Z Fold 6 سعة 512 جيجابايت - 5G شاشة مطوية',
    category: 'الهواتف القابلة للطي',
    sku: 'AD-ZFOLD6-512',
    retailPrice: 5990,
    wholesalePrice: 5650,
    vipPrice: 5520,
    stock: 9,
    moq: 1,
    views: 98,
    specs: 'شاشة ديناميكية أموليد 120Hz قابلة للطي - معالج Snapdragon 8 Gen 3 المطور - كفالة عبدالرحمن ظافر الذهبية المعتمدة',
    images: [
      createPhoneSvgDataUrl('Galaxy Z Fold 6', '#1e293b', 'وضع فتح الشاشة الكاملة 7.6 إنش', '#38bdf8'),
      createPhoneSvgDataUrl('Galaxy Z Fold 6', '#0f172a', 'الجهة الخلفية المفصلة المقاومة للصدمات', '#0284c7'),
      createPhoneSvgDataUrl('Galaxy Z Fold 6', '#334155', 'الشاشة الخارجية وحواف التيتانيوم', '#38bdf8')
    ],
    selectedForShare: true,
    createdAt: '2026-10-26'
  },
  {
    id: 'p3',
    name: 'سامسونج جالكسي S24 Ultra سعة 512 جيجا تيتانيوم رمادي',
    category: 'الهواتف الرائدة',
    sku: 'AD-S24U-512',
    retailPrice: 4290,
    wholesalePrice: 4050,
    vipPrice: 3980,
    stock: 24,
    moq: 1,
    views: 115,
    specs: 'قلم S-Pen الذكي مدمج - كاميرا 200 ميجابكسل بتقريب بصري 5x/10x - دعم كامل لذكاء Galaxy AI وسرعة خارقة',
    images: [
      createPhoneSvgDataUrl('S24 Ultra Titanium', '#374151', 'الواجهة الأمامية المسطحة مع القلم', '#f59e0b'),
      createPhoneSvgDataUrl('S24 Ultra Titanium', '#1f2937', 'ظهر الهاتف وكاميرات Ultra الرباعية', '#9ca3af')
    ],
    selectedForShare: false,
    createdAt: '2026-10-27'
  },
  {
    id: 'p4',
    name: 'شاومي 14 الترا (Xiaomi 14 Ultra) عدسات لايكا العالمية 512GB',
    category: 'الهواتف الرائدة',
    sku: 'AD-MI14U-512',
    retailPrice: 3890,
    wholesalePrice: 3650,
    vipPrice: 3580,
    stock: 12,
    moq: 1,
    views: 74,
    specs: 'مستشعر 1 إنش كاميرات Leica رباعية 50MP - شحن فائق السرعة 90W سلكي و 80W لاسلكي - شاشة 2K متدفقة',
    images: [
      createPhoneSvgDataUrl('Xiaomi 14 Ultra', '#18181b', 'حلقة عدسات لايكا الدائرية الاحترافية', '#ef4444'),
      createPhoneSvgDataUrl('Xiaomi 14 Ultra', '#27272a', 'شاشة الواجهة مع كفر الجلد الفاخر', '#f97316')
    ],
    selectedForShare: true,
    createdAt: '2026-10-28'
  },
  {
    id: 'p5',
    name: 'بكج الحماية والصوت الاحترافي VIP (سماعة ANC + شاحن MagSafe + كفر مدرع)',
    category: 'إكسسوارات وضمان',
    sku: 'AD-ACC-PRO3',
    retailPrice: 390,
    wholesalePrice: 260,
    vipPrice: 230,
    stock: 45,
    moq: 3,
    views: 86,
    specs: 'سماعة عزل ضوضاء ANC ببطارية 36 ساعة + شاحن لاسلكي مغناطيسي 25W سريع + جراب تيتانيوم مقاوم للسقوط',
    images: [
      createPhoneSvgDataUrl('Pro VIP Bundle', '#064e3b', 'محتويات البكج الكاملة داخل علبة فاخرة', '#10b981'),
      createPhoneSvgDataUrl('Pro VIP Bundle', '#065f46', 'الشاحن اللاسلكي والسماعة الأصلية', '#34d399')
    ],
    selectedForShare: true,
    createdAt: '2026-10-28'
  },
  {
    id: 'p6',
    name: 'عرض جملة تجار: طقم 5 هواتف رائدة مشكّلة الأكثر طلباً بالسوق',
    category: 'عروض وبكجات الجملة',
    sku: 'AD-BULK-5X',
    retailPrice: 19500,
    wholesalePrice: 18200,
    vipPrice: 17850,
    stock: 7,
    moq: 1,
    views: 53,
    specs: 'مخصص لأصحاب المعارض وتجار الجملة - أجهزة جديدة كرتون مصنعي مقفل - شحن مجاني مؤمن وسريع لجميع المحافظات',
    images: [
      createPhoneSvgDataUrl('Wholesale 5x Pack', '#312e81', 'صورة تشكيلة الهواتف الخمسة المختارة', '#818cf8'),
      createPhoneSvgDataUrl('Wholesale 5x Pack', '#1e1b4b', 'شهادات الضمان وكراتين الوكالة', '#a5b4fc')
    ],
    selectedForShare: false,
    createdAt: '2026-10-29'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-9841',
    customer: 'مؤسسة الصقر للاتصالات والهواتف',
    phone: '967771234567',
    address: 'صنعاء - شارع صخر - بجوار بنك الكريمي',
    payment: 'تحويل بنكي / محفظة إلكترونية',
    tier: 'سعر الجملة (B2B)',
    itemsSummary: '2× آيفون 16 برو ماكس + 1× سامسونج Z Fold 6 + 3× بكج VIP',
    totalSAR: 15670,
    status: 'confirmed',
    time: 'منذ ساعتين'
  },
  {
    id: 'ORD-9840',
    customer: 'المهندس طارق الزبيري',
    phone: '966501234567',
    address: 'الرياض - حي الملز - شارع الستين',
    payment: 'مدى / فيزا فورية',
    tier: 'سعر التجزئة (قطاعي)',
    itemsSummary: '1× آيفون 16 برو ماكس 256 جيجا تيتانيوم صحراوي',
    totalSAR: 4850,
    status: 'shipped',
    time: 'منذ 5 ساعات'
  }
];
