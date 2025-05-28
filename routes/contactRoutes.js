/**
 * Routes untuk API Contact
 *
 * File ini berisi definisi route untuk endpoint /contact
 * Mendemonstrasikan penggunaan middleware untuk validasi data
 */

const express = require("express");
const router = express.Router();

// Import controller
const contactController = require("../controllers/contactController");

// Import middleware
const validator = require("../middlewares/validator");
const queryParser = require("../middlewares/queryParser");
const authenticate = require("../middlewares/authentication");

// Import model/schema
const {
  ContactSchema,
  ContactUpdateSchema,
  ContactPartialUpdateSchema,
} = require("../models/contact");
const logger = require("../middlewares/logger");

router.use(logger);
/**
 * GET /contact
 *
 * Mendapatkan semua data kontak
 * Menggunakan middleware queryParser untuk memproses query parameters
 */
router.get("/", queryParser, contactController.getAllContacts);

/**
 * GET /contact/:id
 *
 * Mendapatkan data kontak berdasarkan ID
 */
router.get("/:id", contactController.getContactById);

/**
 * POST /contact
 *
 * Membuat kontak baru
 * Menggunakan middleware:
 * - authenticate: Memvalidasi API key
 * - validator: Memvalidasi body request dengan ContactSchema
 */
router.post(
  "/",
  authenticate,
  validator(ContactSchema),
  contactController.createContact
);

/**
 * PUT /contact
 *
 * Mengupdate seluruh data kontak
 * Menggunakan middleware:
 * - authenticate: Memvalidasi API key
 * - validator: Memvalidasi body request dengan ContactUpdateSchema
 */
router.put(
  "/",
  authenticate,
  validator(ContactUpdateSchema),
  contactController.updateContact
);

/**
 * PATCH /contact
 *
 * Mengupdate sebagian data kontak
 * Menggunakan middleware:
 * - authenticate: Memvalidasi API key
 * - validator: Memvalidasi body request dengan ContactPartialUpdateSchema
 */
router.patch(
  "/",
  authenticate,
  validator(ContactPartialUpdateSchema),
  contactController.partialUpdateContact
);

/**
 * DELETE /contact/:id
 *
 * Menghapus data kontak berdasarkan ID
 * Menggunakan middleware:
 * - authenticate: Memvalidasi API key
 */
router.delete("/:id", authenticate, contactController.deleteContact);

module.exports = router;
