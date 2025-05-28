/**
 * Controller untuk menangani operasi CRUD pada data kontak
 * 
 * File ini berisi fungsi-fungsi handler untuk route /contact
 */

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

// Data dummy untuk simulasi database
const contacts = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    mobileNumber: "0851234567890",
  },
];

/**
 * Mendapatkan semua data kontak
 */
function getAllContacts(req, res) {
  // Implementasi pagination jika ada query parameters
  const { page, limit, search } = req.parsedQuery || {};
  
  let filteredContacts = [...contacts];
  
  // Filter berdasarkan search query jika ada
  if (search) {
    filteredContacts = filteredContacts.filter(contact => 
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(successResponse(filteredContacts));
}

/**
 * Mendapatkan data kontak berdasarkan ID
 */
function getContactById(req, res) {
  const id = parseInt(req.params.id, 10);
  const contact = contacts.find(c => c.id === id);
  
  if (!contact) {
    return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
  }
  
  res.json(successResponse(contact));
}

/**
 * Membuat kontak baru
 */
function createContact(req, res) {
  // Body sudah divalidasi oleh middleware validator
  const newContact = {
    id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
    ...req.body
  };
  
  contacts.push(newContact);
  
  res.status(201).json(successResponse(newContact));
}

/**
 * Mengupdate seluruh data kontak (PUT)
 */
function updateContact(req, res) {
  // Body sudah divalidasi oleh middleware validator
  const { id } = req.body;
  const index = contacts.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
  }
  
  // Update seluruh data
  contacts[index] = {
    id,
    ...req.body
  };
  
  res.json(successResponse(contacts[index]));
}

/**
 * Mengupdate sebagian data kontak (PATCH)
 */
function partialUpdateContact(req, res) {
  // Body sudah divalidasi oleh middleware validator
  const { id } = req.body;
  const index = contacts.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
  }
  
  // Update hanya field yang diberikan
  contacts[index] = {
    ...contacts[index],
    ...req.body
  };
  
  res.json(successResponse(contacts[index]));
}

/**
 * Menghapus data kontak
 */
function deleteContact(req, res) {
  const id = parseInt(req.params.id, 10);
  const index = contacts.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json(errorResponse("Kontak tidak ditemukan"));
  }
  
  const deletedContact = contacts.splice(index, 1)[0];
  
  res.json(successResponse({ message: "Kontak berhasil dihapus", deletedContact }));
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  partialUpdateContact,
  deleteContact,
  successResponse,
  errorResponse
};
