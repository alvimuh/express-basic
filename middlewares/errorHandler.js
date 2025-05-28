/**
 * Error Handler Middleware
 * 
 * Middleware ini berfungsi untuk menangani error yang terjadi selama proses request.
 * 
 * Penjelasan:
 * - Middleware ini memiliki 4 parameter (err, req, res, next)
 * - Express secara otomatis mengenali middleware dengan 4 parameter sebagai error handler
 * - Middleware ini harus ditempatkan setelah semua route dan middleware lainnya
 * - Menangkap semua error yang terjadi dan mengirimkan response yang sesuai
 */

function errorHandler(err, req, res, next) {
  // Log error untuk debugging
  console.error(err.stack);
  
  // Kirim response error yang terformat dengan baik
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Terjadi kesalahan pada server",
    // Jika dalam mode development, tambahkan stack trace
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

module.exports = errorHandler;
