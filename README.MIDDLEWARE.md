# Express.js Middleware Tutorial

## Apa itu Middleware?

Middleware adalah fungsi yang memiliki akses ke objek request (req), objek response (res), dan fungsi middleware berikutnya dalam siklus request-response aplikasi. Middleware dapat:

- Menjalankan kode apapun
- Memodifikasi objek request dan response
- Mengakhiri siklus request-response
- Memanggil middleware berikutnya dalam stack

## Jenis-jenis Middleware di Express.js

### 1. Application-level Middleware

Middleware yang terikat ke instance aplikasi Express menggunakan `app.use()` atau `app.METHOD()` (seperti app.get, app.post, dll).

```javascript
// Contoh application-level middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next(); // Memanggil middleware berikutnya
});
```

### 2. Router-level Middleware

Middleware yang terikat ke instance router Express. Cara kerjanya sama dengan application-level middleware, tetapi hanya berlaku untuk rute tertentu.

```javascript
// Contoh router-level middleware
const router = express.Router();

router.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
});

// Kemudian diikat ke aplikasi
app.use('/contact', router);
```

### 3. Error-handling Middleware

Middleware yang menangani error. Memiliki 4 parameter (err, req, res, next).

```javascript
// Contoh error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### 4. Built-in Middleware

Middleware bawaan Express seperti `express.json()`, `express.urlencoded()`, dan `express.static()`.

```javascript
// Contoh built-in middleware
app.use(express.json()); // Untuk parsing application/json
app.use(express.urlencoded({ extended: true })); // Untuk parsing application/x-www-form-urlencoded
app.use(express.static('public')); // Untuk menyajikan file statis
```

### 5. Third-party Middleware

Middleware pihak ketiga yang dapat ditambahkan untuk menambah fungsionalitas ke aplikasi Express.

```javascript
// Contoh third-party middleware
const morgan = require('morgan');
app.use(morgan('dev')); // HTTP request logger
```

## Implementasi Middleware dalam Proyek

### 1. Logger Middleware (`./middlewares/logger.js`)

Middleware ini mencatat informasi tentang setiap request yang masuk.

```javascript
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

module.exports = logger;
```

### 2. Error Handler Middleware (`./middlewares/errorHandler.js`)

Middleware ini menangani error yang terjadi selama proses request.

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = errorHandler;
```

### 3. Authentication Middleware (`./middlewares/authentication.js`)

Middleware ini memvalidasi API key yang dikirim dalam header request.

```javascript
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    const error = new Error('Unauthorized: Invalid API key');
    error.status = 401;
    return next(error);
  }
  
  next();
};

module.exports = authenticate;
```

### 4. Validator Middleware (`./middlewares/validator.js`)

Middleware ini memvalidasi data yang dikirim dalam request body menggunakan Zod.

```javascript
const validator = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    const zodError = error;
    const formattedErrors = {};
    
    zodError.errors.forEach((err) => {
      const path = err.path.join('.');
      formattedErrors[path] = err.message;
    });
    
    res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: formattedErrors
    });
  }
};

module.exports = validator;
```

### 5. Query Parser Middleware (`./middlewares/queryParser.js`)

Middleware ini memproses query parameters untuk paginasi dan pencarian.

```javascript
const queryParser = (req, res, next) => {
  // Parse page dan limit untuk paginasi
  req.query.page = parseInt(req.query.page) || 1;
  req.query.limit = parseInt(req.query.limit) || 10;
  
  // Hitung skip untuk paginasi
  req.query.skip = (req.query.page - 1) * req.query.limit;
  
  // Parse search query
  if (req.query.search) {
    req.query.searchRegex = new RegExp(req.query.search, 'i');
  }
  
  next();
};

module.exports = queryParser;
```

## Cara Menggunakan Middleware

### Application-level Middleware

```javascript
// Middleware untuk semua route
app.use(logger);

// Middleware untuk route spesifik
app.use('/api', authenticate);
```

### Router-level Middleware

```javascript
// Middleware untuk semua route di router
router.use(queryParser);

// Middleware untuk route spesifik di router
router.post('/', validator(ContactSchema), contactController.createContact);
```

### Error-handling Middleware

```javascript
// Selalu tempatkan di akhir stack middleware
app.use(errorHandler);
```

## Best Practices Menggunakan Middleware

1. **Urutkan middleware dengan benar**
   - Middleware yang memproses request body (seperti `express.json()`) harus ditempatkan sebelum route handler yang membutuhkannya

2. **Gunakan next() dengan benar**
   - Selalu panggil `next()` untuk melanjutkan ke middleware berikutnya
   - Panggil `next(error)` untuk melompat ke error-handling middleware

3. **Pisahkan middleware ke dalam modul terpisah**
   - Memudahkan maintenance dan testing

4. **Gunakan middleware untuk validasi data**
   - Validasi input sebelum diproses oleh controller

5. **Gunakan middleware untuk autentikasi dan otorisasi**
   - Pisahkan logika autentikasi dari logika bisnis

## Kesimpulan

Middleware adalah konsep fundamental dalam Express.js yang memungkinkan kita untuk memecah aplikasi menjadi bagian-bagian yang lebih kecil dan dapat digunakan kembali. Dengan memahami dan menggunakan middleware dengan benar, kita dapat membuat aplikasi Express.js yang lebih modular, maintainable, dan scalable.
