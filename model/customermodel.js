const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: "true",
  },
  email: {
    type: "String",
    required: "true",
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
