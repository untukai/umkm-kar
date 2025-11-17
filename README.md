# KODIK - Aplikasi Android (Hybrid WebView)

Ini adalah versi Android dari marketplace KODIK, yang dibangun menggunakan pendekatan hybrid. Aplikasi native Android (Kotlin, Jetpack Compose) bertindak sebagai "pembungkus" untuk aplikasi web canggih (React) yang berjalan di dalam komponen `WebView`.

Aplikasi web dimuat dari aset lokal (`app/src/main/assets`), memungkinkannya berfungsi bahkan saat offline.

## Otomatisasi Build dengan GitHub Actions

Proyek ini dikonfigurasi dengan alur kerja GitHub Actions (`.github/workflows/main.yml`). Setiap kali ada perubahan yang di-push ke branch `main`, GitHub akan secara otomatis:
1. Menyiapkan lingkungan build Android.
2. Menjalankan proses kompilasi menggunakan Gradle.
3. Menghasilkan file `app-debug.apk`.

File APK yang sudah jadi dapat diunduh dari tab **Actions** di halaman repositori GitHub setelah build berhasil (ditandai dengan centang hijau).