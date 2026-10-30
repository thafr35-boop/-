#!/bin/bash
set -e

echo "=== Compiling Abdulrahman Dhafir Smartphones APK ==="

BUILD_DIR="build_apk_temp"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/gen"
mkdir -p "$BUILD_DIR/obj"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/assets"

ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"

# 1. Strings & resources
cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">عبدالرحمن ظافر للهواتف الذكية</string>
</resources>
EOF

# 2. AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.abdulrahmandhafir.smartphones"
    android:versionCode="2"
    android:versionName="2.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:label="@string/app_name"
        android:allowBackup="true"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:configChanges="orientation|screenSize|keyboardHidden">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- استقبال مشاركة صورة واحدة من الاستوديو -->
            <intent-filter android:label="@string/app_name">
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="image/*" />
            </intent-filter>

            <!-- استقبال مشاركة عدة صور من الاستوديو دفعة واحدة -->
            <intent-filter android:label="@string/app_name">
                <action android:name="android.intent.action.SEND_MULTIPLE" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="image/*" />
            </intent-filter>

        </activity>
    </application>
</manifest>
EOF

# 3. Copy web assets to app
cp -r "extracted_app/abdulrahman_dhafir_android_apk_project (1)/app/src/main/assets/"* "$BUILD_DIR/assets/"

# 4. Generate R.java
echo "-> 1/6 Generating R.java via aapt..."
aapt package -f -m \
  -J "$BUILD_DIR/gen" \
  -M "$BUILD_DIR/AndroidManifest.xml" \
  -S "$BUILD_DIR/res" \
  -I "$ANDROID_JAR"

# 5. Create MainActivity.java
mkdir -p "$BUILD_DIR/src/com/abdulrahmandhafir/smartphones"
cat << 'EOF' > "$BUILD_DIR/src/com/abdulrahmandhafir/smartphones/MainActivity.java"
package com.abdulrahmandhafir.smartphones;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import org.json.JSONArray;

public class MainActivity extends Activity {
    private WebView webView;
    private ArrayList<String> pendingSharedBase64Images = new ArrayList<String>();
    private boolean pageLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setDatabaseEnabled(true);

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                pageLoaded = true;
                flushPendingImagesToWebApp();
            }
        });

        handleGalleryShareIntent(getIntent());
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleGalleryShareIntent(intent);
        if (pageLoaded) {
            flushPendingImagesToWebApp();
        }
    }

    private void handleGalleryShareIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String type = intent.getType();

        if (type != null && type.startsWith("image/")) {
            if (Intent.ACTION_SEND.equals(action)) {
                Uri imageUri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
                if (imageUri != null) {
                    String b64 = uriToDataUrl(imageUri, type);
                    if (b64 != null) pendingSharedBase64Images.add(b64);
                }
            } else if (Intent.ACTION_SEND_MULTIPLE.equals(action)) {
                ArrayList<Uri> imageUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
                if (imageUris != null) {
                    for (int i = 0; i < imageUris.size(); i++) {
                        Uri uri = imageUris.get(i);
                        String b64 = uriToDataUrl(uri, type);
                        if (b64 != null) pendingSharedBase64Images.add(b64);
                    }
                }
            }
        }
    }

    private String uriToDataUrl(Uri uri, String mimeType) {
        try {
            InputStream is = getContentResolver().openInputStream(uri);
            if (is == null) return null;
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int nRead;
            byte[] data = new byte[16384];
            while ((nRead = is.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            buffer.flush();
            is.close();
            String base64 = Base64.encodeToString(buffer.toByteArray(), Base64.NO_WRAP);
            return "data:" + (mimeType != null ? mimeType : "image/jpeg") + ";base64," + base64;
        } catch (Exception e) {
            return null;
        }
    }

    private void flushPendingImagesToWebApp() {
        if (pendingSharedBase64Images.isEmpty()) return;
        JSONArray jsonArray = new JSONArray(pendingSharedBase64Images);
        pendingSharedBase64Images.clear();
        final String jsCode = "if (window.receiveSharedGalleryImages) { window.receiveSharedGalleryImages(" + jsonArray.toString() + "); }";
        webView.post(new Runnable() {
            @Override
            public void run() {
                if (android.os.Build.VERSION.SDK_INT >= 19) {
                    webView.evaluateJavascript(jsCode, null);
                } else {
                    webView.loadUrl("javascript:" + jsCode);
                }
            }
        });
    }
}
EOF

# 6. Compile Java using ecj
echo "-> 2/6 Compiling Java code using ecj..."
ecj -1.8 -proc:none -d "$BUILD_DIR/obj" \
  -cp "$ANDROID_JAR" \
  "$BUILD_DIR/gen/com/abdulrahmandhafir/smartphones/R.java" \
  "$BUILD_DIR/src/com/abdulrahmandhafir/smartphones/MainActivity.java"

# 7. Convert bytecode to Dalvik classes.dex
echo "-> 3/6 Converting bytecode to classes.dex using dalvik-exchange..."
dalvik-exchange --dex --output="$BUILD_DIR/bin/classes.dex" "$BUILD_DIR/obj"

# 8. Package APK with aapt
echo "-> 4/6 Packaging APK with aapt..."
aapt package -f \
  -M "$BUILD_DIR/AndroidManifest.xml" \
  -S "$BUILD_DIR/res" \
  -A "$BUILD_DIR/assets" \
  -I "$ANDROID_JAR" \
  -F "$BUILD_DIR/bin/unaligned.apk"

# 9. Add classes.dex into unaligned.apk
echo "-> 5/6 Adding classes.dex to APK..."
cd "$BUILD_DIR/bin"
aapt add "unaligned.apk" "classes.dex"
cd ../..

# 10. Align APK with zipalign
echo "-> 6/6 Aligning and signing APK..."
zipalign -v -p 4 "$BUILD_DIR/bin/unaligned.apk" "$BUILD_DIR/bin/aligned.apk"

# 11. Generate Release Keystore & Sign with apksigner
KEYSTORE="$BUILD_DIR/release-key.jks"
keytool -genkey -v -keystore "$KEYSTORE" -alias dhafir -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass dhafir123 -keypass dhafir123 \
  -dname "CN=Abdulrahman Dhafir, OU=Smartphones, O=Dhafir, L=Sanaa, ST=Sanaa, C=YE"

mkdir -p public
FINAL_APK="public/Abdulrahman-Dhafir-Smartphones.apk"
apksigner sign --ks "$KEYSTORE" --ks-pass pass:dhafir123 --key-pass pass:dhafir123 --out "$FINAL_APK" "$BUILD_DIR/bin/aligned.apk"

echo "=== APK Successfully Built and Verified ==="
apksigner verify --verbose "$FINAL_APK"
ls -lh "$FINAL_APK"
