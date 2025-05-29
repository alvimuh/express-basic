/**
 * Controller untuk menangani operasi CRUD pada data kontak menggunakan MongoDB
 *
 * File ini berisi fungsi-fungsi handler untuk route /contact yang menggunakan
 * model Mongoose untuk berinteraksi dengan database MongoDB
 */

// Import model Contact yang sudah dibuat dengan Mongoose
const { Contact } = require("../models/contact");

/**
 * Fungsi untuk membuat response sukses
 * @param {any} data - Data yang akan dikirim dalam response
 * @returns {Object} - Object response dengan format yang konsisten
 */
function successResponse(data) {
  return {
    status: "success",
    data: data,
  };
}

/**
 * Fungsi untuk membuat response error
 * @param {string} error - Pesan error
 * @returns {Object} - Object response dengan format yang konsisten
 */
function errorResponse(error) {
  return {
    status: "error",
    error: error,
  };
}

/**
 * Mendapatkan semua data kontak
 *
 * Menggunakan async/await untuk menangani operasi asynchronous
 * dengan MongoDB melalui Mongoose
 */
async function getAllContacts(req, res) {
  try {
    // Implementasi pagination jika ada query parameters
    const { page = 1, limit = 10, search } = req.parsedQuery || {};

    // Membuat query filter jika ada parameter search
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // Case insensitive search
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Menghitung total dokumen untuk pagination
    const total = await Contact.countDocuments(filter);

    // Mengambil data dengan pagination
    const contacts = await Contact.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    res.json(
      successResponse({
        contacts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      })
    );
  } catch (error) {
    console.error("Error getting contacts:", error);
    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat mengambil data kontak"));
  }
}

async function getAllContactsMinimal(req, res) {
  try {
    const contacts = await Contact.find().select("name mobileNumber");
    res.json(successResponse(contacts));
  } catch (error) {
    console.error("Error getting contacts:", error);
    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat mengambil data kontak"));
  }
}

/**
 * Mendapatkan data kontak berdasarkan ID
 *
 * Menggunakan Mongoose findById untuk mencari dokumen berdasarkan ID
 */
async function getContactById(req, res) {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
    }

    res.json(successResponse(contact));
  } catch (error) {
    console.error("Error getting contact by ID:", error);

    // Jika error karena format ID tidak valid
    if (error.kind === "ObjectId") {
      return res.status(400).json(errorResponse("ID kontak tidak valid"));
    }

    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat mengambil data kontak"));
  }
}

/**
 * Membuat kontak baru
 *
 * Menggunakan Mongoose create untuk menyimpan dokumen baru ke MongoDB
 */
async function createContact(req, res) {
  try {
    // Body sudah divalidasi oleh middleware validator
    const newContact = await Contact.create(req.body);

    res.status(201).json(successResponse(newContact));
  } catch (error) {
    console.error("Error creating contact:", error);

    // Jika error karena duplikasi email (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json(errorResponse("Email sudah digunakan"));
    }

    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat membuat kontak baru"));
  }
}

/**
 * Mengupdate seluruh data kontak (PUT)
 *
 * Menggunakan Mongoose findByIdAndUpdate untuk mengupdate dokumen
 */
async function updateContact(req, res) {
  try {
    // Body sudah divalidasi oleh middleware validator
    const { id, ...updateData } = req.body;

    // Opsi { new: true } untuk mengembalikan dokumen yang sudah diupdate
    // Opsi { runValidators: true } untuk menjalankan validasi Mongoose saat update
    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedContact) {
      return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
    }

    res.json(successResponse(updatedContact));
  } catch (error) {
    console.error("Error updating contact:", error);

    // Jika error karena format ID tidak valid
    if (error.kind === "ObjectId") {
      return res.status(400).json(errorResponse("ID kontak tidak valid"));
    }

    // Jika error karena duplikasi email (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json(errorResponse("Email sudah digunakan"));
    }

    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat mengupdate kontak"));
  }
}

async function update(req, res) {
  try {
    const { id, name, email, mobileNumber } = req.body;
    await Contact.findByIdAndUpdate(id, {
      name,
      email,
      mobileNumber,
    });

    const updatedContact = await Contact.findById(id);

    res.json(successResponse(updatedContact));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat mengupdate kontak"));
  }
}

/**
 * Mengupdate sebagian data kontak (PATCH)
 *
 * Menggunakan Mongoose findByIdAndUpdate untuk mengupdate sebagian dokumen
 */
async function partialUpdateContact(req, res) {
  try {
    // Body sudah divalidasi oleh middleware validator
    const { id, ...updateData } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedContact) {
      return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
    }

    res.json(successResponse(updatedContact));
  } catch (error) {
    console.error("Error partially updating contact:", error);

    // Jika error karena format ID tidak valid
    if (error.kind === "ObjectId") {
      return res.status(400).json(errorResponse("ID kontak tidak valid"));
    }

    // Jika error karena duplikasi email (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json(errorResponse("Email sudah digunakan"));
    }

    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat mengupdate kontak"));
  }
}

/**
 * Menghapus data kontak
 *
 * Menggunakan Mongoose findByIdAndDelete untuk menghapus dokumen
 */
async function deleteContact(req, res) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
    }

    res.json(
      successResponse({ message: "Kontak berhasil dihapus", deletedContact })
    );
  } catch (error) {
    console.error("Error deleting contact:", error);

    // Jika error karena format ID tidak valid
    if (error.kind === "ObjectId") {
      return res.status(400).json(errorResponse("ID kontak tidak valid"));
    }

    res
      .status(500)
      .json(errorResponse("Terjadi kesalahan saat menghapus kontak"));
  }
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  partialUpdateContact,
  deleteContact,
  successResponse,
  errorResponse,

  getAllContactsMinimal,
  update,
};
