/**
 * Logger Middleware
 *
 * Middleware ini berfungsi untuk mencatat (logging) setiap request yang masuk ke server.
 *
 * Penjelasan:
 * - Middleware ini akan dijalankan untuk setiap request yang masuk
 * - Mencatat method (GET, POST, dll), URL, dan waktu request
 * - Menggunakan fungsi next() untuk melanjutkan ke middleware berikutnya
 */

function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} (Function Middleware)`);

  // Lanjutkan ke middleware berikutnya
  next();
}

module.exports = logger;
