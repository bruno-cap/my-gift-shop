// product schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  isBestseller: {
    type: Boolean,
    required: true,
  },

  picture: {
    type: String,
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },

  createdBy: {
    type: String,
    required: true,
  },
});

const productModel = mongoose.model("Product", productSchema); // the name specified here gets converted to lowercase plural
module.exports = productModel;
