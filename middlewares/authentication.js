/**
 * Authentication Middleware
 * 
 * Middleware ini berfungsi untuk memvalidasi API key yang dikirim oleh client.
 * 
 * Penjelasan:
 * - Middleware ini memeriksa header 'x-api-key' pada setiap request
 * - Jika API key valid, request dilanjutkan ke middleware berikutnya
 * - Jika API key tidak valid atau tidak ada, response error 401 (Unauthorized) dikirimkan
 * - Dalam contoh ini, kita menggunakan data dummy untuk API key
 */

// Data dummy untuk API key
const validApiKeys = [
  "sk_test_12345",
  "sk_test_67890",
  "sk_live_abcdef"
];

/**
 * Middleware untuk autentikasi API key
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function authenticate(req, res, next) {
  // Mengambil API key dari header request
  const apiKey = req.headers['x-api-key'];
  
  // Jika API key tidak ada
  if (!apiKey) {
    return res.status(401).json({
      status: "error",
      message: "API key tidak ditemukan. Tambahkan header 'x-api-key' pada request."
    });
  }
  
  // Memeriksa apakah API key valid
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      status: "error",
      message: "API key tidak valid."
    });
  }
  
  // Jika API key valid, tambahkan informasi user ke request object
  // Ini berguna untuk middleware atau handler berikutnya
  req.user = {
    apiKey: apiKey,
    // Dalam kasus nyata, kita bisa menambahkan informasi user lainnya
    // yang diambil dari database berdasarkan API key
    isLiveKey: apiKey.startsWith('sk_live_')
  };
  
  // Lanjutkan ke middleware berikutnya
  next();
}

module.exports = authenticate;
