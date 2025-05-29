/**
 * Model Contact
 *
 * File ini berisi definisi skema validasi untuk data kontak menggunakan Zod dan Mongoose.
 */

const z = require("zod");
const mongoose = require("mongoose");

/**
 * Skema untuk validasi data kontak baru menggunakan Zod
 * - name: string dengan panjang maksimal 255 karakter
 * - email: string dengan format email yang valid
 * - mobileNumber: string untuk nomor telepon
 */
const ContactSchema = z.object({
  name: z
    .string()
    .max(255, { message: "Nama tidak boleh lebih dari 255 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  mobileNumber: z.string().regex(/^[0-9]{10,13}$/, {
    message: "Nomor telepon harus berisi 10-13 digit angka",
  }),
});

/**
 * Skema untuk validasi update data kontak
 * - Memperluas ContactSchema dengan menambahkan id
 */
const ContactUpdateSchema = ContactSchema.extend({
  id: z.string({ message: "ID harus berupa string" }),
});

/**
 * Skema untuk validasi update parsial data kontak
 * - Semua field bersifat opsional
 */
const ContactPartialUpdateSchema = ContactSchema.partial().extend({
  id: z.string({ message: "ID harus berupa string" }),
});

/**
 * Skema Mongoose untuk model Contact
 *
 * Mongoose adalah ODM (Object Document Mapper) untuk MongoDB dan Node.js
 * yang menyediakan solusi berbasis skema untuk memodelkan data aplikasi.
 */
const ContactMongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      maxlength: [255, "Nama tidak boleh lebih dari 255 karakter"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Format email tidak valid",
      ],
    },
    mobileNumber: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Opsi untuk mengaktifkan virtuals saat mengkonversi ke JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Membuat model Contact dari skema
const Contact = mongoose.model("Contact", ContactMongooseSchema);

module.exports = {
  ContactSchema,
  ContactUpdateSchema,
  ContactPartialUpdateSchema,
  Contact, // Export model Mongoose
};
