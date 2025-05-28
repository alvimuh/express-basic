# Express.js Middleware Tutorial

Proyek ini dibuat untuk mengajarkan konsep middleware di Express.js dengan penjelasan dalam Bahasa Indonesia.

## Struktur Proyek

```
/express-basic
├── app.js                 # File utama aplikasi
├── controllers/           # Berisi fungsi-fungsi handler untuk route
│   └── contactController.js
├── middlewares/           # Berisi middleware yang digunakan dalam aplikasi
│   ├── errorHandler.js    # Middleware untuk menangani error
│   ├── logger.js          # Middleware untuk mencatat request
│   ├── queryParser.js     # Middleware untuk memproses query parameters
│   └── validator.js       # Middleware untuk validasi data
├── models/                # Berisi definisi skema data
│   └── contact.js
├── routes/                # Berisi definisi route
│   └── contactRoutes.js
└── package.json           # Konfigurasi proyek dan dependensi
```

## Konsep Middleware yang Diajarkan

1. **Memahami middleware di Express.js**
   - Middleware application-level (`app.use(middleware)`)
   - Middleware router-level (`router.use(middleware)`)
   - Middleware built-in (`express.json()`)
   - Middleware error-handling (`errorHandler`)

2. **Menangani request body dan query parameters**
   - Menggunakan `express.json()` untuk memproses request body
   - Menggunakan middleware `queryParser` untuk memproses query parameters

3. **Menambahkan middleware untuk validasi data**
   - Menggunakan middleware `validator` dengan skema Zod untuk memvalidasi data

4. **Autentikasi dengan API key**
   - Menggunakan middleware `authentication` untuk memvalidasi API key
   - Menangani error 401 (Unauthorized) jika API key tidak valid

## Cara Menjalankan

1. Pastikan Node.js sudah terinstall
2. Install dependensi: `npm install`
3. Jalankan aplikasi: `npm start`
4. Akses aplikasi di `http://localhost:3000`

## Endpoint API

- `GET /contact` - Mendapatkan semua kontak
- `GET /contact/:id` - Mendapatkan kontak berdasarkan ID
- `POST /contact` - Membuat kontak baru
- `PUT /contact` - Mengupdate seluruh data kontak
- `PATCH /contact` - Mengupdate sebagian data kontak
- `DELETE /contact/:id` - Menghapus kontak

## Contoh Penggunaan

### Membuat kontak baru

```bash
curl -X POST http://localhost:3000/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","mobileNumber":"0851234567890"}'
```

### Mendapatkan semua kontak dengan query parameters

```bash
curl "http://localhost:3000/contact?page=1&limit=10&search=john"
```
