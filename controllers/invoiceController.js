const invoice = require("../models/invoice");
const { Contact } = require("../models/contact");

async function getInvoices(req, res) {
  try {
    const dataInvoice = await invoice.find();
    const dataContact = await Contact.find();
    res.json({ message: "Get all invoices", data: dataInvoice });
  } catch (error) {
    res.staus(500).json(errorResponse("Terjadi kesalahan saat mengambil data"));
  }
}

function createInvoices(req, res) {
  res.json({ message: "Create invoice" });
}

module.exports = {
  getInvoices,
  createInvoices,
};
