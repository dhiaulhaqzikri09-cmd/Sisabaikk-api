# Hasil Pengujian REST API SisaBaik — Chapter 7

## 1. Informasi Pengujian

| Informasi | Keterangan |
|---|---|
| Nama aplikasi | SisaBaik API |
| Branch Git | feature/rest-postgresql |
| Database | sisabaik_dev |
| Server lokal | http://127.0.0.1:3000 |
| Framework | Express.js |
| Database | PostgreSQL |
| Lingkungan | Pengembangan lokal |
| Tanggal pengujian | 5 November 2026 |

Pengujian dilakukan menggunakan browser Chrome, Node.js, PowerShell, dan pgAdmin 4.

## 2. Matriks Hasil Pengujian

| No. | Skenario | Hasil aktual | Status verifikasi |
|---|---|---|---|
| 1 | JSON tidak valid | HTTP 400, kode INVALID_JSON | Terverifikasi |
| 2 | Content-Type salah | HTTP 415, kode JSON_REQUIRED | Terverifikasi |
| 3 | Payload melebihi 20 KB | HTTP 413 | Terverifikasi |
| 4 | Pemesanan dengan stok tidak cukup | HTTP 409, kode INSUFFICIENT_STOCK | Terverifikasi |
| 5 | Rollback ketika stok tidak cukup | Stok dan jumlah pesanan tetap sama setelah request gagal | Terverifikasi |
| 6 | Persistensi setelah restart server | Detail pesanan ID 5 masih dapat diakses setelah server dijalankan ulang | Terverifikasi |
| 7 | Dua request bersamaan pada stok terakhir | Script uji konkurensi dijalankan dan hasil dinyatakan sesuai oleh pengguna; output terminal tidak tersimpan | Terverifikasi secara konfirmasi, output belum terdokumentasi |
| 8 | Health dan GET koleksi | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 9 | ID tidak valid atau terlalu besar | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 10 | ID valid tetapi tidak ditemukan | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 11 | POST penawaran valid | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 12 | Harga tidak valid atau field tambahan | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 13 | PUT lengkap dan PUT tidak lengkap | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 14 | Kombinasi pencarian dan filter | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 15 | Pagination halaman di luar hasil | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 16 | Percobaan SQL injection pada pencarian | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 17 | DELETE tanpa riwayat pesanan | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 18 | DELETE dengan riwayat pesanan | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 19 | Pesanan lintas penyedia | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 20 | Pesanan valid dan snapshot harga | Belum dicatat bukti hasil aktual | Belum diverifikasi |
| 21 | Perubahan harga setelah pesanan | Belum dicatat bukti hasil aktual | Belum diverifikasi |

## 3. Detail Hasil Pengujian

### 3.1 JSON Tidak Valid

Request dikirim menggunakan body JSON yang tidak valid.

Hasil aktual:
- HTTP Status: 400
- Error Code: INVALID_JSON
- Pesan: JSON tidak valid.

### 3.2 Content-Type Tidak Sesuai

Request dikirim dengan Content-Type text/plain.

Hasil aktual:
- HTTP Status: 415
- Error Code: JSON_REQUIRED
- Pesan: Gunakan Content-Type application/json.

### 3.3 Payload Terlalu Besar

Request dikirim dengan payload yang melebihi batas 20 KB.

Hasil aktual:
- HTTP Status: 413
- Pengujian berhasil memicu penolakan payload.

### 3.4 Stok Tidak Mencukupi

Request pemesanan dilakukan dengan kuantitas 999 pada penawaran yang stoknya tidak mencukupi.

Hasil aktual:
- HTTP Status: 409
- Error Code: INSUFFICIENT_STOCK
- Pesan: Stok tidak mencukupi.

### 3.5 Rollback Transaksi

Sebelum dan sesudah request gagal, data diperiksa melalui pgAdmin 4.

Hasil aktual:
- Stok penawaran ID 6 tetap 2.
- Jumlah pesanan tetap 4.
- Tidak ada penambahan pesanan akibat request yang gagal.

Hasil menunjukkan bahwa perubahan stok dan header pesanan tidak diterapkan ketika transaksi gagal.

### 3.6 Persistensi Database

Server dihentikan menggunakan Ctrl+C, kemudian dijalankan kembali menggunakan npm run dev.

Pesanan ID 5 diperiksa melalui endpoint:

GET /api/pesanan/5

Hasil aktual:
- HTTP Status: 200.
- success: true.
- ID pesanan: 5.
- Status: menunggu-konfirmasi.
- Total transaksi: 10000.
- Nilai stok terselamatkan: 20000.
- Harga satuan: 5000.
- Subtotal: 10000.

Data tetap tersedia setelah server dimulai ulang.

### 3.7 Pengujian Konkurensi

Script scripts/uji-konkurensi.js dijalankan untuk menguji dua request bersamaan pada penawaran dengan stok awal 1.

Hasil yang diharapkan dari script:
- Satu request berhasil dengan HTTP 201.
- Satu request ditolak dengan HTTP 409.
- Stok akhir menjadi 0.
- Hanya satu pesanan berhasil dibuat.

Pengguna mengonfirmasi hasil sesuai, tetapi output terminal tidak tersimpan. Bukti output perlu dilengkapi jika tersedia.

## 4. Catatan Pengujian

1. Pengujian dilakukan pada database pengembangan sisabaik_dev.
2. Data uji yang dibuat selama pengujian tidak dihapus.
3. Database tidak di-reset selama pemeriksaan persistensi.
4. Pengujian yang belum memiliki bukti aktual tidak dinyatakan lulus.
5. Hasil pengujian konkurensi perlu dilengkapi dengan output terminal apabila tersedia.

## 5. Kesimpulan

Pengujian yang telah terverifikasi menunjukkan bahwa API dapat menangani JSON tidak valid, Content-Type yang tidak sesuai, payload berukuran besar, serta pemesanan dengan stok tidak mencukupi.

Pemeriksaan database juga menunjukkan bahwa rollback menjaga stok dan jumlah header pesanan ketika transaksi gagal. Data pesanan tetap tersedia setelah server dimulai ulang.

Pengujian lainnya perlu dilengkapi sebelum seluruh matriks Chapter 7 dinyatakan selesai.