# Dokumentasi API SisaBaik

## 1. Informasi Umum

Base URL lokal:

`http://127.0.0.1:3001`

Prefix API:

`/api`

Format request dan response menggunakan JSON. Endpoint yang membutuhkan autentikasi menggunakan header:

`Authorization: Bearer <accessToken>`

Untuk request POST dan PUT, gunakan:

`Content-Type: application/json`

## 2. Health Check

### GET /api/health

Memeriksa koneksi API dan database.

Response sukses: `200 OK`.

## 3. Autentikasi

### POST /api/auth/registrasi

Registrasi akun pembeli.

Body:

```json
{
  "namaLengkap": "Siti Baru",
  "email": "siti.baru@example.test",
  "kataSandi": "gunakan-kata-sandi-kuat"
}