/**
 * Express.js dan MongoDB Tutorial
 *
 * Aplikasi ini dibuat untuk mendemonstrasikan penggunaan Express.js dengan MongoDB
 * dengan penjelasan dalam Bahasa Indonesia.
 */

// Import dependencies
const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");

// Import routes
const contactRoutes = require("./routes/contactRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

// Import middleware
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const authenticate = require("./middlewares/authentication");

/**
 * Middleware Built-in: express.json()
 *
 * Penjelasan:
 * - Middleware ini memproses request body dengan format JSON
 * - Mengubah string JSON menjadi JavaScript object yang dapat diakses melalui req.body
 * - Middleware ini harus ditempatkan sebelum route handler yang membutuhkan akses ke req.body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Configure EJS as template engine
 *
 * Penjelasan:
 * - EJS (Embedded JavaScript) adalah template engine untuk Express.js
 * - Views akan disimpan di folder ./views
 * - File static (CSS, JS, images) akan disimpan di folder ./public
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "assets")));

/**
 * Middleware Application-level: Logger
 *
 * Penjelasan:
 * - Middleware ini dijalankan untuk setiap request yang masuk
 * - Mencatat method dan URL request
 * - Ditempatkan di awal untuk mencatat semua request
 */
// app.use(authenticate);

/**
 * Route untuk halaman utama
 */
app.get("/", (req, res) => {
  res.render("index", { title: "Express Basic Tutorial" });
});

/**
 * Route untuk halaman kontak (server-side rendering)
 */
app.get("/contacts", async (req, res) => {
  try {
    res.render("contacts", { title: "Daftar Kontak" });
  } catch (error) {
    res.status(500).render("error", { error });
  }
});

/**
 * Route untuk halaman form tambah kontak
 */
app.get("/contacts/add", (req, res) => {
  res.render("contact-form", { title: "Tambah Kontak Baru" });
});

/**
 * Middleware Router-level: contactRoutes
 *
 * Penjelasan:
 * - Middleware ini hanya dijalankan untuk route yang dimulai dengan /contact
 * - Mengelompokkan route terkait kontak dalam satu file terpisah
 * - Memudahkan pengelolaan dan pemeliharaan kode
 */
app.use("/api/contact", contactRoutes);
app.use("/api/invoice", invoiceRoutes);

/**
 * Middleware untuk menangani route yang tidak ditemukan
 *
 * Penjelasan:
 * - Middleware ini dijalankan jika tidak ada route yang cocok
 * - Ditempatkan setelah semua definisi route
 */
app.use((req, res, next) => {
  const error = new Error("Route tidak ditemukan");
  error.status = 404;
  next(error); // Meneruskan error ke middleware error handler
});

/**
 * Middleware Error Handler
 *
 * Penjelasan:
 * - Middleware ini menangani semua error yang terjadi selama proses request
 * - Ditempatkan sebagai middleware terakhir
 */
app.use(errorHandler);

/**
 * Menghubungkan ke MongoDB dan menjalankan server
 */
// Menggunakan port dari environment variable atau default 3000
const PORT = 3001;

// Menghubungkan ke MongoDB terlebih dahulu, kemudian menjalankan server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });
