/**
 * Model Contact
 * 
 * File ini berisi definisi skema validasi untuk data kontak menggunakan Zod.
 */

const z = require("zod");

/**
 * Skema untuk validasi data kontak baru
 * - name: string dengan panjang maksimal 255 karakter
 * - email: string dengan format email yang valid
 * - mobileNumber: string untuk nomor telepon
 */
const ContactSchema = z.object({
  name: z.string().max(255, { message: "Nama tidak boleh lebih dari 255 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  mobileNumber: z.string().regex(/^[0-9]{10,13}$/, { message: "Nomor telepon harus berisi 10-13 digit angka" })
});

/**
 * Skema untuk validasi update data kontak
 * - Memperluas ContactSchema dengan menambahkan id
 */
const ContactUpdateSchema = ContactSchema.extend({
  id: z.number({ message: "ID harus berupa angka" })
});

/**
 * Skema untuk validasi update parsial data kontak
 * - Semua field bersifat opsional
 */
const ContactPartialUpdateSchema = ContactSchema.partial().extend({
  id: z.number({ message: "ID harus berupa angka" })
});

module.exports = {
  ContactSchema,
  ContactUpdateSchema,
  ContactPartialUpdateSchema
};
