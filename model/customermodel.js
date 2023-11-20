const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: "true",
  },
  email: {
    type: "String",
    required: "true",
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  password: {
    type: "String",
    required: "true",
  },
  bookings: {
    type: "string",
  },
});

const customermodel = mongoose.model("customers", customerSchema);

module.exports = customermodel;
