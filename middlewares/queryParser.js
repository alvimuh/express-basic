/**
 * Query Parser Middleware
 * 
 * Middleware ini berfungsi untuk memproses query parameters dari URL.
 * 
 * Penjelasan:
 * - Middleware ini akan dijalankan untuk setiap request yang memiliki query parameters
 * - Mengubah format query parameters sesuai kebutuhan (misalnya: konversi string ke number)
 * - Menyimpan hasil parsing di req.parsedQuery untuk digunakan oleh handler berikutnya
 */

function queryParser(req, res, next) {
  const parsedQuery = {};
  
  // Contoh: konversi parameter 'page' dan 'limit' ke tipe number
  if (req.query.page) {
    parsedQuery.page = parseInt(req.query.page, 10) || 1;
  }
  
  if (req.query.limit) {
    parsedQuery.limit = parseInt(req.query.limit, 10) || 10;
  }
  
  // Salin semua query parameter lainnya
  Object.keys(req.query).forEach(key => {
    if (!parsedQuery[key]) {
      parsedQuery[key] = req.query[key];
    }
  });
  
  // Simpan hasil parsing di req object untuk digunakan oleh handler berikutnya
  req.parsedQuery = parsedQuery;
  
  // Lanjutkan ke middleware berikutnya
  next();
}

module.exports = queryParser;
