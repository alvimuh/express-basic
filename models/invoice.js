const mongoose = require("mongoose");

const InvoiceMongooseSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
    },
    amount: {
      type: Number,
    },
    productList: {
      type: Array,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const InvoiceModel = mongoose.model("Invoice", InvoiceMongooseSchema);

module.exports = InvoiceModel;
