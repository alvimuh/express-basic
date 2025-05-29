# Chapter 18: Menghubungkan Node.js dengan Database MongoDB

Materi ini menjelaskan cara menghubungkan aplikasi Node.js dengan database MongoDB menggunakan Express.js dan Mongoose.

## Daftar Isi

1. Dasar MongoDB: Struktur dokumen, koleksi, dan operasi CRUD
2. Menggunakan Mongoose untuk interaksi database
3. Proyek: Membuat sistem CRUD sederhana untuk data pelanggan

## Struktur Proyek

```
/express-basic
├── app.js                 # File utama aplikasi
├── config/                # Berisi konfigurasi aplikasi
│   └── database.js        # Konfigurasi koneksi MongoDB
├── controllers/           # Berisi fungsi-fungsi handler untuk route
│   └── contactController.js
├── middlewares/           # Berisi middleware yang digunakan dalam aplikasi
│   ├── errorHandler.js    # Middleware untuk menangani error
│   ├── logger.js          # Middleware untuk mencatat request
│   ├── queryParser.js     # Middleware untuk memproses query parameters
│   └── validator.js       # Middleware untuk validasi data
├── models/                # Berisi definisi skema data
│   └── contact.js         # Model Contact dengan Mongoose dan Zod
├── routes/                # Berisi definisi route
│   └── contactRoutes.js
├── .env                   # Environment variables (MongoDB URI, dll)
└── package.json           # Konfigurasi proyek dan dependensi
```

## 1. Dasar MongoDB

### Struktur Dokumen

MongoDB menyimpan data dalam format BSON (Binary JSON). Contoh dokumen kontak:

```json
{
  "_id": ObjectId("60d21b4667d0d8992e610c85"),
  "name": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "0851234567890",
  "createdAt": ISODate("2023-05-29T10:30:00Z")
}
```

### Koleksi dan Database

- **Koleksi**: Kumpulan dokumen, mirip dengan tabel di database relasional
- **Database**: Kumpulan koleksi

### Operasi CRUD

- **Create**: Membuat dokumen baru
- **Read**: Membaca dokumen dari database
- **Update**: Mengupdate dokumen yang ada
- **Delete**: Menghapus dokumen dari database

## 2. Menggunakan Mongoose

Mongoose adalah ODM (Object Document Mapper) untuk MongoDB dan Node.js yang menyediakan solusi berbasis skema untuk memodelkan data aplikasi.

### Instalasi Mongoose

```bash
npm install mongoose dotenv
```

### Konfigurasi Koneksi MongoDB

File `config/database.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Mendefinisikan Skema dan Model

File `models/contact.js`:

```javascript
const mongoose = require("mongoose");

const ContactMongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama harus diisi"],
    maxlength: [255, "Nama tidak boleh lebih dari 255 karakter"]
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Format email tidak valid"]
  },
  mobileNumber: {
    type: String,
    required: [true, "Nomor telepon harus diisi"],
    match: [/^[0-9]{10,13}$/, "Nomor telepon harus berisi 10-13 digit angka"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Contact = mongoose.model("Contact", ContactMongooseSchema);

module.exports = { Contact };
```

### Menghubungkan ke MongoDB di Aplikasi

File `app.js`:

```javascript
const express = require("express");
const app = express();
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Middleware dan routes...

const PORT = process.env.PORT || 3000;

// Menghubungkan ke MongoDB terlebih dahulu, kemudian menjalankan server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });
```

## 3. Implementasi CRUD dengan Mongoose

### Create - Membuat Dokumen Baru

```javascript
async function createContact(req, res) {
  try {
    // Body sudah divalidasi oleh middleware validator
    const newContact = await Contact.create(req.body);
    
    res.status(201).json(successResponse(newContact));
  } catch (error) {
    // Handle error
  }
}
```

### Read - Membaca Dokumen

```javascript
async function getAllContacts(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.parsedQuery || {};
    
    // Membuat query filter jika ada parameter search
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Menghitung total dokumen untuk pagination
    const total = await Contact.countDocuments(filter);
    
    // Mengambil data dengan pagination
    const contacts = await Contact.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    res.json(successResponse({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total
    }));
  } catch (error) {
    // Handle error
  }
}

async function getContactById(req, res) {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
    }
    
    res.json(successResponse(contact));
  } catch (error) {
    // Handle error
  }
}
```

### Update - Mengupdate Dokumen

```javascript
async function updateContact(req, res) {
  try {
    const { id, ...updateData } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
    }
    
    res.json(successResponse(updatedContact));
  } catch (error) {
    // Handle error
  }
}
```

### Delete - Menghapus Dokumen

```javascript
async function deleteContact(req, res) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
    }
    
    res.json(successResponse({ message: "Kontak berhasil dihapus", deletedContact }));
  } catch (error) {
    // Handle error
  }
}
```

## Endpoint API

- `GET /contact` - Mendapatkan semua kontak (dengan pagination dan search)
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
  -H "X-API-Key: your-api-key-here" \
  -d '{"name":"John Doe","email":"john@example.com","mobileNumber":"0851234567890"}'
```

### Mendapatkan semua kontak dengan pagination dan search

```bash
curl "http://localhost:3000/contact?page=1&limit=10&search=john"
```

### Mendapatkan kontak berdasarkan ID

```bash
curl "http://localhost:3000/contact/60d21b4667d0d8992e610c85"
```

### Mengupdate kontak

```bash
curl -X PUT http://localhost:3000/contact \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{"id":"60d21b4667d0d8992e610c85","name":"John Updated","email":"john.updated@example.com","mobileNumber":"0851234567890"}'
```

### Menghapus kontak

```bash
curl -X DELETE http://localhost:3000/contact/60d21b4667d0d8992e610c85 \
  -H "X-API-Key: your-api-key-here"
```

## Konsep Penting MongoDB

### Dokumen vs Tabel

MongoDB adalah database NoSQL berbasis dokumen, berbeda dengan database relasional yang berbasis tabel:

- **MongoDB**: Dokumen → Koleksi → Database
- **SQL**: Baris → Tabel → Database

### Kelebihan MongoDB

1. **Skema Fleksibel**: Dokumen dalam koleksi yang sama dapat memiliki struktur berbeda
2. **Skalabilitas Horizontal**: Mudah untuk mendistribusikan data ke beberapa server
3. **Format JSON**: Data disimpan dalam format yang mirip dengan objek JavaScript
4. **Performa Tinggi**: Untuk operasi baca dan tulis yang intensif

### Mongoose Hooks dan Middleware

Mongoose menyediakan hooks yang dapat digunakan untuk menjalankan fungsi sebelum atau sesudah operasi database:

```javascript
ContactMongooseSchema.pre('save', function(next) {
  // Kode yang dijalankan sebelum dokumen disimpan
  next();
});

ContactMongooseSchema.post('findOneAndUpdate', function(doc) {
  // Kode yang dijalankan setelah dokumen diupdate
});
```

### Validasi dengan Mongoose

Mongoose menyediakan validasi bawaan untuk memastikan data yang disimpan sesuai dengan skema:

```javascript
const ContactMongooseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email harus diisi"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Format email tidak valid"]
  }
});
```

## Prasyarat

1. Node.js dan npm terinstall
2. MongoDB terinstall (lokal atau menggunakan MongoDB Atlas)

## Cara Menjalankan

1. Clone repository
2. Install dependensi: `npm install`
3. Konfigurasi file `.env` dengan connection string MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/express-basic
   PORT=3000
   API_KEY=your-api-key-here
   ```
4. Jalankan aplikasi: `npm start`
5. Akses aplikasi di `http://localhost:3000`

## Referensi

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express.js Documentation](https://expressjs.com/)
