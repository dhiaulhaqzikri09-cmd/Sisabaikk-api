# Hasil Pengujian SisaBaik API – Chapter 8

**Tanggal:** 6 November 2026

**Branch:** `feature/auth-rbac`

**Database:** `sisabaik_dev`

**Server lokal:** `http://127.0.0.1:3001`

**Node.js:** v24.21.0
## 1. Informasi Commit

**Commit implementasi autentikasi dan pembatasan akses:** `e2f33bb`

Pesan commit: `feat: add authentication and ownership checks`

## 2. Pengujian Autentikasi

Pengujian dilakukan melalui skrip `scripts/uji-auth.js`.

Hasil pengujian:
- Total 44 pemeriksaan HTTP dan assertion berhasil.
- Registrasi akun buyer dan provider.
- Login dan verifikasi token.
- Logout dan pencabutan sesi.
- Penolakan akses berdasarkan peran pengguna.
- Pembatasan akses penawaran berdasarkan kepemilikan.
- Pembatasan akses pesanan berdasarkan akun.
- Verifikasi snapshot harga dan jumlah stok.

**Hasil:** PASS.

## 3. Pengujian Pembatasan Akses

- Buyer tidak dapat membuat penawaran.
- Provider tidak dapat membuat pesanan.
- Provider tidak dapat mengubah penawaran milik provider lain.
- Buyer hanya dapat melihat pesanan miliknya.
- Provider hanya dapat melihat pesanan yang berkaitan dengan penawarannya.
- Akun tidak aktif tidak dapat menggunakan sesi.
- Token lama ditolak setelah logout.

**Hasil:** PASS.

## 4. Pengujian Rate Limit

- Login: 20 percobaan gagal diizinkan dalam batas pengujian, percobaan berikutnya terkena pembatasan.
- Registrasi: 50 percobaan diizinkan dalam batas pengujian, percobaan berikutnya terkena pembatasan.

**Hasil:** PASS.

## 5. Pengujian Transaksi Pesanan

- Pesanan berhasil dibuat oleh buyer.
- Stok penawaran berkurang sesuai jumlah pesanan.
- Harga pesanan tetap menggunakan snapshot harga saat transaksi dibuat.
- Buyer tidak dapat melihat pesanan milik akun lain.

**Hasil:** PASS.

## 6. Kesimpulan

Berdasarkan hasil pengujian, fitur autentikasi, otorisasi berdasarkan peran, pembatasan kepemilikan data, pencabutan sesi, rate limit, dan pengelolaan transaksi pesanan pada SisaBaik API telah berhasil melewati 44 pemeriksaan HTTP dan assertion.

Pengujian dilakukan pada lingkungan lokal menggunakan database praktikum `sisabaik_dev`.