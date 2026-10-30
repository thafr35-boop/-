import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  FileCode, 
  Github, 
  Layers, 
  Share2, 
  ArrowRight,
  ExternalLink,
  Laptop,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { generateAndroidProjectZip } from '../utils/apkProjectGenerator';

interface ApkStudioModalProps {
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const ApkStudioModal: React.FC<ApkStudioModalProps> = ({
  onInstallPwa,
  canInstallPwa = false
}) => {
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'abdulrahman_dhafir_android_apk_project_v2.zip';
      link.click();
      URL.revokeObjectURL(url);
      setDownloadReady(true);
      setTimeout(() => setDownloadReady(false), 4000);
    } catch (err) {
      console.error('Failed to generate APK zip', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleDirectApkClick = () => {
    setApkDownloaded(true);
    setTimeout(() => setApkDownloaded(false), 5000);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>ملف APK جاهز وموقّع رسمياً للتحميل المباشر</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white">
            تحميل تطبيق عبدالرحمن ظافر للهواتف الذكية (APK جاهز للتثبيت)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            تم بناء ملف التطبيق <strong className="text-amber-400 font-mono">Abdulrahman-Dhafir-Smartphones.apk</strong> وتوقيعه رقمياً بنجاح. يدعم مشاركة الصور من الاستوديو وتوجيهها إلى (كتالوج / منتج جديد / منتج موجود)، إضافة عدة صور للمنتج، وبدون أي ملاحظات مشوشة أسفل الصور.
          </p>
        </div>

        {/* Big Download Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0 w-full sm:w-auto">
          
          {/* DIRECT APK DOWNLOAD BUTTON */}
          <a
            href="/Abdulrahman-Dhafir-Smartphones.apk"
            download="Abdulrahman-Dhafir-Smartphones.apk"
            onClick={handleDirectApkClick}
            className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 transition-all transform active:scale-95 border border-amber-300/40"
          >
            {apkDownloaded ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>جاري تحميل ملف الـ APK لهاتفك...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 text-slate-950" />
                <span>تحميل ملف APK المباشر (1.5 MB)</span>
              </>
            )}
          </a>

          {/* Download Project Source Zip */}
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isGeneratingZip}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
            title="تحميل كود المشروع المصدري الكامل لأندرويد ستوديو"
          >
            {isGeneratingZip ? (
              <span>جاري تجميع السورس...</span>
            ) : downloadReady ? (
              <span className="text-emerald-400">تم تنزيل السورس!</span>
            ) : (
              <>
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>سورس المشروع (.ZIP)</span>
              </>
            )}
          </button>

          {/* Instant PWA Install on Android */}
          <button
            type="button"
            onClick={onInstallPwa}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>تثبيت PWA فوري</span>
          </button>
        </div>
      </div>

      {/* APK File Specs Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              بيانات ومواصفات حزمة الـ APK المُنشأة:
            </h3>
          </div>
          <a
            href="/Abdulrahman-Dhafir-Smartphones.apk"
            download="Abdulrahman-Dhafir-Smartphones.apk"
            className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل APK مباشر الآن</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-semibold">اسم الحزمة (Package ID)</span>
            <span className="font-mono font-bold text-slate-800 text-[11px]">com.abdulrahmandhafir.smartphones</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-semibold">حجم الملف</span>
            <span className="font-black text-slate-800">1.5 ميجابايت (سريع التثبيت)</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-semibold">التوقيع الرقمي (Signature)</span>
            <span className="font-bold text-emerald-700">موقّع (v1 + v2 + v3 Verified)</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-semibold">التوافق</span>
            <span className="font-bold text-slate-800">أندرويد 5.0 حتى أندرويد 14+</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Build Methods Explained */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Method 1: GitHub Actions (Free, Automated Cloud Build in 2 minutes) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                موصى به • مجاني وبدون برامج
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                الطريقة الأولى: استخراج وتحديث APK سحابياً عبر GitHub Actions
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            يحتوي ملف المشروع المرفق على ملف إعداد البناء السحابي <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">.github/workflows/build-apk.yml</code>. عند رفع هذا المجلد إلى حسابك في GitHub، يقوم خادم لينكس السحابي بإنتاج ملف <strong className="text-slate-900">Abdulrahman-Dhafir-Smartphones-APK.apk</strong> تلقائياً:
          </p>

          <ol className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">١</span>
              <span>حمّل ملف الـ ZIP بالضغط على زر "سورس المشروع (.ZIP)".</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">٢</span>
              <span>ارفع محتويات المجلد إلى مستودع (Repository) جديد في حسابك على GitHub.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">٣</span>
              <span>اضغط على تبويب <strong>Actions</strong> داخل المستودع، وستجد عملية البناء تعمل مباشرة.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">٤</span>
              <span>خلال دقيقتين تجد ملف الـ APK متاحاً للتحميل المباشر والتثبيت الفوري على هاتفك!</span>
            </li>
          </ol>
        </div>

        {/* Method 2: Android Studio Local Build */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 border border-amber-500/30 flex items-center justify-center font-black">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                للمطورين وأصحاب أجهزة الكمبيوتر
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                الطريقة الثانية: الفتح والبناء عبر Android Studio
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            المشروع متوافق 100% مع أحدث إصدارات Android Studio مع دعم Android 14 (API 34) وحزمة الأدوات الرسمية:
          </p>

          <ol className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">١</span>
              <span>افتح برنامج Android Studio واختر <strong>Open</strong> ثم حدد مجلد المشروع.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">٢</span>
              <span>انتظر اكتمال مزامنة Gradle التلقائية (Sync Project with Gradle Files).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">٣</span>
              <span>من القائمة العلوية اضغط: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</code></span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">٤</span>
              <span>اضغط على رابط <strong>locate</strong> في الإشعار لتحصل على ملف <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">app-debug.apk</code> جاهزاً لنقله لهاتفك.</span>
            </li>
          </ol>
        </div>

      </div>

      {/* Technical Integration Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span>ما تم تضمينه وتحديثه في كود الأندرويد الأصلي (Java & Manifest):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">استقبال مشاركة الصور (Send & Send Multiple)</h4>
            <p className="text-[11px] text-slate-500">
              تسجيل فلتر الـ Intent في <code className="text-amber-700">AndroidManifest.xml</code> لاستقبال الصور الفردية والجماعية من أي تطبيق في الهاتف.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">جسر الجافا سكريبت (JS Bridge)</h4>
            <p className="text-[11px] text-slate-500">
              دالة <code className="text-amber-700">flushPendingImagesToWebApp</code> لتحويل الصور إلى Base64 وتمريرها تلقائياً لنافذة توجيه الصور الذكية.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">محدد ملفات الكاميرا والاستوديو (FileChooser)</h4>
            <p className="text-[11px] text-slate-500">
              دعم رفع عدة صور معاً من الكاميرا أو المعرض مباشرة داخل تطبيق الـ WebView بدون أي أخطاء.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
