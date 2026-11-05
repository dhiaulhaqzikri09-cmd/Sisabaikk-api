# SisaBaik API

REST API untuk aplikasi SisaBaik yang mengelola penawaran makanan berlebih dan pemesanan menggunakan Express.js dan PostgreSQL.

## 1. Teknologi

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)

## 2. Persyaratan

Pastikan sudah tersedia:

- Node.js versi 22 atau lebih baru.
- PostgreSQL.
- Database bernama `sisabaik_dev`.

## 3. Instalasi

Clone repository dan masuk ke folder proyek:

```bash
git clone <URL_REPOSITORY>
cd Sisabaikk-api
```

Instal dependensi:

```bash
npm install
```

Salin `.env.example` menjadi `.env`, kemudian sesuaikan konfigurasi database lokal:

```env
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=sisabaik_dev
PGUSER=postgres
PGPASSWORD=isi_password_postgresql_lokal
```

Jangan membagikan atau mengunggah file `.env` karena berisi konfigurasi rahasia.

## 4. Persiapan Database

Pastikan PostgreSQL berjalan dan database `sisabaik_dev` sudah tersedia.

Jalankan pemeriksaan koneksi database:

```bash
npm run db:check -- 0
```

Skema dan data awal mengikuti instruksi pada Bab 6. Jangan menjalankan ulang skrip skema yang menghapus tabel pada database yang sudah berisi data penting.

## 5. Menjalankan Server

Mode pengembangan:

```bash
npm run dev
```

Server berjalan di:

```text
http://127.0.0.1:3000
```

## 6. Pengujian

Jalankan pengujian API:

```bash
npm run api:test
```

Jalankan pengujian konkurensi:

```bash
node scripts/uji-konkurensi.js
```

Pengujian konkurensi membuat data penawaran dan pesanan uji pada database. Gunakan database khusus pengembangan.

## 7. Kontrak API

- Prefix endpoint: `/api`
- Format pertukaran data: JSON.
- Identitas penawaran menggunakan ID numerik.
- Field identitas pembeli pada pemesanan adalah `emailPembeli`, bukan `namaPemesan`.
- Aplikasi masih berjalan secara lokal dan belum menerapkan autentikasi pengguna.

Dokumentasi endpoint, parameter, contoh request, dan response tersedia pada `docs/API.md`.

## 8. Keamanan dan Konfigurasi

- Jangan commit `.env`.
- Jangan commit `node_modules`.
- Gunakan database pengembangan untuk pengujian.
- Jangan menjalankan pengujian yang mengubah data pada database produksi.