# Express.js API & Frontend Integration Tutorial

Proyek ini dibuat untuk mengajarkan konsep middleware di Express.js dan integrasi API dengan frontend menggunakan penjelasan dalam Bahasa Indonesia.

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
├── public/                # File statis (CSS, JavaScript, gambar)
│   └── css/
│      └── style.css       # CSS kustom untuk aplikasi
├── routes/                # Berisi definisi route
│   └── contactRoutes.js
├── views/                 # Template EJS untuk rendering halaman
│   ├── partials/          # Komponen yang dapat digunakan kembali
│   │   ├── header.ejs     # Header yang digunakan di semua halaman
│   │   └── footer.ejs     # Footer yang digunakan di semua halaman
│   ├── index.ejs          # Halaman utama
│   ├── contacts.ejs       # Halaman daftar kontak (SSR)
│   ├── contact-form.ejs   # Form tambah kontak (Client-side)
│   └── error.ejs          # Halaman error
└── package.json           # Konfigurasi proyek dan dependensi
```

## Konsep yang Diajarkan

### 1. Middleware di Express.js
   - Middleware application-level (`app.use(middleware)`)
   - Middleware router-level (`router.use(middleware)`)
   - Middleware built-in (`express.json()`)
   - Middleware error-handling (`errorHandler`)

### 2. Menangani request body dan query parameters
   - Menggunakan `express.json()` untuk memproses request body
   - Menggunakan middleware `queryParser` untuk memproses query parameters

### 3. Validasi data
   - Menggunakan middleware `validator` dengan skema Zod untuk memvalidasi data

### 4. Autentikasi dengan API key
   - Menggunakan middleware `authentication` untuk memvalidasi API key
   - Menangani error 401 (Unauthorized) jika API key tidak valid

### 5. Server-side Rendering dengan EJS
   - Menggunakan EJS sebagai template engine
   - Merender HTML di server dengan data dinamis
   - Menggunakan partials untuk komponen yang dapat digunakan kembali

### 6. Client-side API Integration
   - Menggunakan Fetch API untuk berkomunikasi dengan backend
   - Menangani respons API dan memperbarui UI secara dinamis
   - Menangani error dan loading state

## Cara Menjalankan

1. Pastikan Node.js sudah terinstall
2. Install dependensi: `npm install`
3. Jalankan aplikasi: `npm start`
4. Akses aplikasi di `http://localhost:3000`

## Halaman Frontend

- **Halaman Utama**: `http://localhost:3000/`
  - Menampilkan penjelasan tentang dua pendekatan integrasi API dengan frontend

- **Server-side Rendering**: `http://localhost:3000/contacts`
  - Menampilkan daftar kontak yang diambil dari API
  - Data diambil menggunakan Fetch API dan dirender di browser

- **Client-side Integration**: `http://localhost:3000/contacts/add`
  - Form untuk menambahkan kontak baru
  - Data dikirim ke API menggunakan Fetch API

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
