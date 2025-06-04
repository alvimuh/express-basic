const express = require("express");
const router = express.Router();

const {
  getInvoices,
  createInvoices,
} = require("../controllers/invoiceController");

router.get("/", getInvoices);
router.post("/", createInvoices);

module.exports = router;
