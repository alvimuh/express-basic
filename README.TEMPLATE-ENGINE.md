# Express.js Template Engine Tutorial

## Apa itu Template Engine?

Template engine memungkinkan kita untuk menggunakan file template statis dengan data dinamis dan menghasilkan dokumen HTML. Di Express.js, template engine memudahkan pembuatan halaman web dinamis dengan memisahkan logika aplikasi dari tampilan.

## Keuntungan Menggunakan Template Engine

1. **Pemisahan Concern**
   - Memisahkan logika aplikasi (JavaScript) dari tampilan (HTML)
   - Membuat kode lebih terorganisir dan mudah dipelihara

2. **Reusable Components**
   - Membuat komponen yang dapat digunakan kembali (partials)
   - Mengurangi duplikasi kode HTML

3. **Dynamic Content**
   - Menampilkan data dinamis dari server ke halaman web
   - Melakukan operasi logika sederhana dalam template

4. **Konsistensi UI**
   - Memastikan tampilan yang konsisten di seluruh aplikasi
   - Memudahkan perubahan tampilan secara global

## Template Engine yang Populer di Express.js

1. **EJS (Embedded JavaScript)**
   - Sintaks yang mirip dengan HTML
   - Menggunakan tag `<% %>` untuk kode JavaScript
   - Mudah dipelajari untuk pemula

2. **Pug (sebelumnya Jade)**
   - Sintaks yang lebih ringkas dari HTML
   - Menggunakan indentasi untuk struktur
   - Powerful untuk templating kompleks

3. **Handlebars**
   - Sintaks yang sederhana dengan `{{ }}`
   - Fokus pada logika minimal dalam template
   - Mendukung helper functions

4. **Mustache**
   - "Logic-less" templates
   - Portabilitas tinggi antar bahasa pemrograman
   - Sintaks yang sederhana

## Menggunakan EJS di Express.js

### 1. Instalasi EJS

```bash
npm install ejs
```

### 2. Konfigurasi di Express.js

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');

// Set direktori views
app.set('views', path.join(__dirname, 'views'));
```

### 3. Struktur Direktori untuk Views

```
/express-basic
├── views/                 # Direktori untuk template
│   ├── partials/          # Komponen yang dapat digunakan kembali
│   │   ├── header.ejs     # Header yang digunakan di semua halaman
│   │   └── footer.ejs     # Footer yang digunakan di semua halaman
│   ├── index.ejs          # Halaman utama
│   ├── contacts.ejs       # Halaman daftar kontak
│   └── error.ejs          # Halaman error
```

### 4. Membuat Template EJS

#### Contoh Template Dasar (`views/index.ejs`)

```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <h1><%= title %></h1>
    <p>Selamat datang di <%= title %></p>
    
    <% if (contacts.length > 0) { %>
        <ul>
            <% contacts.forEach(function(contact) { %>
                <li><%= contact.name %> - <%= contact.email %></li>
            <% }); %>
        </ul>
    <% } else { %>
        <p>Tidak ada kontak yang tersedia.</p>
    <% } %>
</body>
</html>
```

### 5. Menggunakan Partials

#### Header Partial (`views/partials/header.ejs`)

```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/contacts">Contacts</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>
```

#### Footer Partial (`views/partials/footer.ejs`)

```html
    <footer>
        <p>&copy; <%= new Date().getFullYear() %> Express Basic Tutorial</p>
    </footer>
</body>
</html>
```

#### Menggunakan Partials dalam Template (`views/contacts.ejs`)

```html
<%- include('partials/header') %>

<h1>Daftar Kontak</h1>

<% if (contacts.length > 0) { %>
    <table>
        <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
        </tr>
        <% contacts.forEach(function(contact) { %>
            <tr>
                <td><%= contact.name %></td>
                <td><%= contact.email %></td>
                <td><%= contact.phone %></td>
            </tr>
        <% }); %>
    </table>
<% } else { %>
    <p>Tidak ada kontak yang tersedia.</p>
<% } %>

<%- include('partials/footer') %>
```

### 6. Rendering Template dari Route

```javascript
// Render template sederhana dengan data
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Express Basic Tutorial',
    contacts: []
  });
});

// Render template dengan data dari database
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.render('contacts', { 
      title: 'Daftar Kontak',
      contacts: contacts
    });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});
```

## Sintaks EJS

### 1. Tag EJS

- `<% %>`: Untuk kode JavaScript tanpa output
- `<%= %>`: Untuk output yang di-escape (mencegah XSS)
- `<%- %>`: Untuk output yang tidak di-escape (untuk HTML)
- `<%# %>`: Untuk komentar (tidak dieksekusi)
- `<%_ %>`: Menghapus whitespace sebelum tag
- `<% _%>`: Menghapus whitespace setelah tag

### 2. Contoh Penggunaan Tag

```html
<!-- Variabel -->
<h1><%= title %></h1>

<!-- Kondisional -->
<% if (user) { %>
  <p>Selamat datang, <%= user.name %></p>
<% } else { %>
  <p>Silakan login</p>
<% } %>

<!-- Loop -->
<ul>
  <% items.forEach(function(item) { %>
    <li><%= item.name %></li>
  <% }); %>
</ul>

<!-- Include partial -->
<%- include('partials/header', { title: 'Judul Halaman' }) %>

<!-- HTML tidak di-escape -->
<%- htmlContent %>
```

## Server-side Rendering vs Client-side Rendering

### Server-side Rendering (SSR)

1. **Proses**:
   - Server mengambil data dari database
   - Server merender HTML dengan data tersebut
   - Server mengirim HTML lengkap ke browser

2. **Keuntungan**:
   - SEO yang lebih baik
   - Initial load yang lebih cepat
   - Bekerja pada browser tanpa JavaScript

3. **Contoh Implementasi**:

```javascript
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.render('contacts', { 
      title: 'Daftar Kontak',
      contacts: contacts
    });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});
```

### Client-side Rendering

1. **Proses**:
   - Server mengirim template HTML kosong
   - Browser mengeksekusi JavaScript untuk mengambil data dari API
   - JavaScript merender HTML dengan data tersebut

2. **Keuntungan**:
   - Pengalaman pengguna yang lebih interaktif
   - Mengurangi beban server
   - Single Page Application (SPA)

3. **Contoh Implementasi**:

```javascript
// Server route hanya mengirim template
app.get('/client-contacts', (req, res) => {
  res.render('client-contacts', { title: 'Daftar Kontak (Client-side)' });
});

// API endpoint untuk data
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

```html
<!-- client-contacts.ejs -->
<%- include('partials/header') %>

<h1>Daftar Kontak (Client-side)</h1>
<div id="contacts-container">Loading...</div>

<script>
  // Fetch data dari API dan render di client
  fetch('/api/contacts')
    .then(response => response.json())
    .then(contacts => {
      const container = document.getElementById('contacts-container');
      
      if (contacts.length === 0) {
        container.innerHTML = '<p>Tidak ada kontak yang tersedia.</p>';
        return;
      }
      
      let html = '<table><tr><th>Nama</th><th>Email</th><th>Telepon</th></tr>';
      contacts.forEach(contact => {
        html += `<tr>
          <td>${contact.name}</td>
          <td>${contact.email}</td>
          <td>${contact.phone}</td>
        </tr>`;
      });
      html += '</table>';
      
      container.innerHTML = html;
    })
    .catch(error => {
      document.getElementById('contacts-container').innerHTML = 
        `<p>Error: ${error.message}</p>`;
    });
</script>

<%- include('partials/footer') %>
```

## Hybrid Approach

Dalam banyak aplikasi modern, pendekatan hybrid sering digunakan:

1. **Initial Load dengan SSR**:
   - Halaman pertama dirender di server untuk load time yang cepat
   - Meningkatkan SEO

2. **Interaksi Selanjutnya dengan Client-side**:
   - Navigasi dan interaksi selanjutnya menggunakan AJAX
   - Memberikan pengalaman yang lebih responsif

## Best Practices

1. **Gunakan Layout yang Konsisten**
   - Buat partials untuk komponen yang digunakan berulang
   - Gunakan layout yang konsisten di seluruh aplikasi

2. **Pisahkan Logika dari Template**
   - Hindari logika kompleks dalam template
   - Lakukan pemrosesan data di controller

3. **Manfaatkan Caching**
   - Cache template yang sudah dirender untuk performa lebih baik
   - Gunakan strategi caching untuk data yang jarang berubah

4. **Validasi Data**
   - Selalu validasi data sebelum merender ke template
   - Gunakan helper functions untuk format data

5. **Keamanan**
   - Selalu gunakan `<%= %>` untuk mencegah XSS
   - Hanya gunakan `<%- %>` untuk konten yang terpercaya

## Kesimpulan

Template engine seperti EJS menyediakan cara yang efektif untuk membuat halaman web dinamis di Express.js. Dengan memahami konsep dan praktik terbaik dalam menggunakan template engine, kita dapat membuat aplikasi web yang lebih terstruktur, maintainable, dan user-friendly. Baik menggunakan server-side rendering, client-side rendering, atau pendekatan hybrid, template engine menjadi alat yang penting dalam pengembangan aplikasi web modern.
