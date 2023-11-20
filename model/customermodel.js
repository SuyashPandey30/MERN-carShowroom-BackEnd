// customermodel.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  carname: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
  },
});

const BookingModel = mongoose.model("Booking", bookingSchema);

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: {
    type: String,
  },
});

const customermodel = mongoose.model("Customer", customerSchema);

module.exports = { BookingModel, customermodel };

