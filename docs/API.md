# Dokumentasi REST API SisaBaik

## 1. Informasi Umum

REST API SisaBaik digunakan untuk mengelola penawaran makanan berlebih dan pemesanan.

- Base URL: `http://127.0.0.1:3000`
- Prefix API: `/api`
- Format request dan response: JSON.
- Content-Type untuk request JSON: `application/json`.
- Aplikasi masih berjalan secara lokal dan belum menerapkan autentikasi pengguna.

## 2. Format Response

Response berhasil:

```json
{
  "success": true,
  "data": {}
}
```

Response gagal:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Pesan kesalahan."
  }
}
```

## 3. Endpoint Penawaran

### 3.1 GET /api/penawaran

Menampilkan daftar penawaran dengan pencarian, filter, dan pagination.

Parameter query:

| Parameter | Keterangan |
|---|---|
| q | Pencarian nama penawaran atau nama usaha, maksimal 100 karakter |
| kategori | Filter kategori, maksimal 40 karakter |
| status | Filter status penawaran |
| tersedia | `true` untuk penawaran yang masih tersedia; default `false` |
| page | Nomor halaman, default 1 |
| limit | Jumlah data per halaman, default 10, maksimal 50 |

Status yang diterima: `draft`, `aktif`, `habis`, `kedaluwarsa`.

Contoh:

```http
GET /api/penawaran?q=roti&kategori=roti&status=aktif&tersedia=true&page=1&limit=10
```

Response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "jumlah": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0,
    "q": "roti",
    "kategori": "roti",
    "status": "aktif",
    "tersedia": true
  }
}
```

Data diurutkan berdasarkan ID terbaru. Jika halaman valid tetapi tidak memiliki hasil, `data` berupa array kosong dan `meta.jumlah` tetap menunjukkan jumlah total data yang cocok dengan filter.

### 3.2 GET /api/penawaran/:id

Menampilkan detail penawaran berdasarkan ID positif.

Contoh:

```http
GET /api/penawaran/1
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "penyediaId": "1",
    "penyedia": "Nama Usaha",
    "nama": "Roti Sisa",
    "kategori": "roti",
    "hargaNormal": 10000,
    "hargaPenawaran": 5000,
    "stok": 10,
    "satuan": "paket",
    "status": "aktif",
    "berakhirPada": "2027-01-01T12:00:00.000Z",
    "dibuatPada": "2026-11-01T10:00:00.000Z"
  }
}
```

Contoh data hanya ilustrasi format response.

### 3.3 POST /api/penawaran

Membuat penawaran baru.

Field request:

| Field | Tipe | Ketentuan |
|---|---|---|
| penyediaId | String angka | ID penyedia positif |
| nama | String | 3–120 karakter |
| kategori | String | 1–40 karakter |
| hargaNormal | Integer | 1–999999999999 |
| hargaPenawaran | Integer | 0–999999999999 dan tidak melebihi hargaNormal |
| stok | Integer | 0–2147483647 |
| satuan | String | 1–20 karakter |
| status | String | draft, aktif, habis, kedaluwarsa |
| berakhirPada | String | ISO 8601 dengan zona waktu, harus di masa depan |

Contoh request:

```json
{
  "penyediaId": "1",
  "nama": "Roti Sisa Hari Ini",
  "kategori": "roti",
  "hargaNormal": 10000,
  "hargaPenawaran": 5000,
  "stok": 10,
  "satuan": "paket",
  "status": "aktif",
  "berakhirPada": "2027-01-01T12:00:00+07:00"
}
```

Response berhasil menggunakan HTTP `201 Created`, menyertakan header `Location` menuju `/api/penawaran/:id`, dan body berisi data penawaran.

Penyedia harus terdaftar, aktif, dan memiliki peran penyedia.

### 3.4 PUT /api/penawaran/:id

Memperbarui penawaran berdasarkan ID.

PUT menggunakan seluruh field penawaran yang diwajibkan pada POST. Request tidak boleh hanya mengirim sebagian field.

`penyediaId` harus tetap sama dengan penyedia awal. ID penawaran, penyedia, dan waktu pembuatan tidak dapat diubah melalui request.

Response berhasil menggunakan HTTP `200 OK` dan mengembalikan data penawaran terbaru.

### 3.5 DELETE /api/penawaran/:id

Menghapus penawaran berdasarkan ID.

- HTTP `204 No Content` jika berhasil.
- Tidak mengembalikan response body.
- HTTP `404` jika penawaran tidak ditemukan.
- HTTP `409` jika data masih digunakan oleh riwayat pesanan atau relasinya tidak dapat dihapus.

## 4. Endpoint Pesanan

### 4.1 GET /api/pesanan

Menampilkan daftar pesanan.

Parameter query:

| Parameter | Keterangan |
|---|---|
| page | Nomor halaman, default 1 |
| limit | Jumlah data per halaman, default 10, maksimal 50 |

Contoh:

```http
GET /api/pesanan?page=1&limit=10
```

Response memiliki `success`, `data`, dan `meta`.

### 4.2 GET /api/pesanan/:id

Menampilkan detail pesanan berdasarkan ID.

Response berisi informasi pesanan dan daftar item, termasuk:

- ID pembeli dan penyedia.
- Nama penyedia dan nama pemesan.
- Status pesanan.
- Total transaksi.
- Nilai stok terselamatkan.
- ID penawaran dan nama penawaran.
- Kuantitas.
- Harga satuan.
- Subtotal.
- Nilai stok terselamatkan per item.

### 4.3 POST /api/pesanan

Membuat pesanan baru.

Field request:

| Field | Tipe | Ketentuan |
|---|---|---|
| emailPembeli | String | Email pembeli yang valid, maksimal 254 karakter |
| items | Array | Berisi 1–10 item |
| penawaranId | String angka | ID penawaran positif |
| kuantitas | Integer | 1–1000 |

Contoh request:

```json
{
  "emailPembeli": "pembeli@example.test",
  "items": [
    {
      "penawaranId": "1",
      "kuantitas": 2
    }
  ]
}
```

Response berhasil menggunakan HTTP `201 Created` dan header `Location` menuju `/api/pesanan/:id`.

Aturan bisnis:

1. Pembeli harus terdaftar, aktif, dan memiliki peran `pembeli`.
2. Penawaran harus aktif dan belum kedaluwarsa.
3. Stok harus mencukupi.
4. ID penawaran tidak boleh berulang dalam satu pesanan.
5. Satu pesanan hanya boleh berisi penawaran dari satu penyedia.
6. Harga normal dan harga penawaran disimpan sebagai snapshot pada detail pesanan.
7. Stok dikurangi sesuai kuantitas yang dipesan.
8. Jika stok menjadi nol, status penawaran berubah menjadi `habis`.
9. Proses penyimpanan pesanan dan pengurangan stok menggunakan transaksi database.

## 5. Daftar Error HTTP

| HTTP | Kode | Keterangan |
|---|---|---|
| 400 | VALIDATION_ERROR | Data request tidak memenuhi validasi |
| 400 | INVALID_JSON | JSON tidak valid |
| 400 | DATA_CONSTRAINT | Data melanggar aturan database |
| 404 | OFFER_NOT_FOUND | Penawaran tidak ditemukan |
| 404 | ORDER_NOT_FOUND | Pesanan tidak ditemukan |
| 404 | BUYER_NOT_FOUND | Pembeli aktif tidak ditemukan |
| 404 | PROVIDER_NOT_FOUND | Penyedia aktif tidak ditemukan |
| 409 | INSUFFICIENT_STOCK | Stok tidak mencukupi |
| 409 | MIXED_PROVIDER | Pesanan berisi lebih dari satu penyedia |
| 409 | OFFER_UNAVAILABLE | Penawaran tidak tersedia |
| 409 | PROVIDER_IMMUTABLE | Penyedia tidak boleh diganti |
| 409 | ORDER_TOTAL_LIMIT | Total pesanan melewati kapasitas skema |
| 409 | REFERENCE_CONFLICT | Relasi tidak valid atau data masih digunakan |
| 409 | DATA_CONFLICT | Data unik sudah digunakan |
| 409 | TRANSACTION_BUSY | Transaksi sedang sibuk |
| 413 | PAYLOAD_TOO_LARGE | Payload melebihi 20 KB |
| 415 | JSON_REQUIRED | Content-Type harus application/json |
| 500 | INTERNAL_SERVER_ERROR | Kesalahan internal server |
| 503 | DATABASE_UNAVAILABLE | Database belum tersedia |

## 6. Batasan Aplikasi

- API masih berjalan pada lingkungan lokal.
- Belum tersedia autentikasi dan otorisasi pengguna.
- ID dikirim sebagai string digit positif untuk menjaga ketepatan ID database.
- Pemesanan hanya dapat dilakukan untuk satu penyedia dalam satu transaksi.
- Dokumentasi mengikuti endpoint dan validasi yang sudah diimplementasikan pada kode aplikasi.