/**
 * Validator Middleware
 * 
 * Middleware ini berfungsi untuk memvalidasi data yang dikirim oleh client.
 * Menggunakan library Zod untuk validasi data dengan skema yang telah ditentukan.
 * 
 * Penjelasan:
 * - Middleware ini menerima skema Zod sebagai parameter
 * - Memvalidasi req.body dengan skema yang diberikan
 * - Jika valid, lanjutkan ke middleware berikutnya
 * - Jika tidak valid, kirim response error
 */

function validator(schema) {
  return (req, res, next) => {
    try {
      // Validasi data dengan skema Zod
      schema.parse(req.body);
      
      // Jika valid, lanjutkan ke middleware berikutnya
      next();
    } catch (error) {
      // Jika tidak valid, kirim response error
      res.status(400).json({
        status: "error",
        error: error.errors || error.message
      });
    }
  };
}

module.exports = validator;
