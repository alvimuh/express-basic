/**
 * Database Configuration
 *
 * File ini berisi konfigurasi koneksi ke MongoDB menggunakan Mongoose
 */

const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Fungsi untuk menghubungkan aplikasi ke MongoDB
 *
 * Menggunakan connection string dari environment variable MONGODB_URI
 * Menerapkan opsi koneksi yang direkomendasikan untuk Mongoose 6+
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Menangani event disconnect
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Menangani event error
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Keluar dengan status error
  }
};

module.exports = connectDB;
