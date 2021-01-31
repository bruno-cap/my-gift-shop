// subscriber schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const subscriberModel = mongoose.model("Subscriber", subscriberSchema);
module.exports = subscriberModel;
