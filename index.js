const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const { BookingModel, customermodel } = require("./model/customermodel");

app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose
  .connect("mongodb+srv://suyash:12345@cluster0.tvfxood.mongodb.net/customer", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  });

app.post("/register", (req, res) => {
  customermodel
    .create(req.body)
    .then((customers) => res.json(customers))
    .catch((err) => res.json(err));
});

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await customermodel.findOne({ name: name });

    if (user) {
      if (user.password === password) {
        const token = jwt.sign(
          { userId: user._id, name: user.name, email: user.email },
          "1@3$",
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.cookie("name", user.name, { httpOnly: true, maxAge: 3600000 });
        res.cookie("email", user.email, { httpOnly: true, maxAge: 3600000 });
        console.log("Logged in");
        return res.json({ name: user.name, email: user.email, token });
      } else {
        console.log("Incorrect password");
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      console.log("User Invalid");
      return res.status(401).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("name");
  res.clearCookie("email");
  res.json({ message: "Logged out successfully" });
});

app.post("/submitTestDrive/:id", async (req, res) => {
  try {
    const newBooking = await BookingModel.create(req.body);
    res.json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/userIdByEmail/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await customermodel.findOne({ email });

    if (user) {
      res.json({ userId: user._id });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/search-customers", async (req, res) => {
  try {
    const logCustomers = await customermodel.find();
    res.json(logCustomers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve customers" });
  }
});

app.get("/checkEmail/:email", async (req, res) => {
  const userToCheck = req.params.email;
  try {
    const isExist = await customermodel.exists({ email: userToCheck });
    res.json({ isExist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getBookings/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const bookings = await BookingModel.find({ userId: userId });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/updateUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const updatedUser = await customermodel.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete-customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await customermodel.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    console.log("deleted");
    return res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete-booking/:id", async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const deletedAppointment = await BookingModel.findByIdAndDelete(
      appointmentId
    );

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    console.log("Deleted appointment:", deletedAppointment);
    return res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});


// Basic register
// app.post("/register", (req, res) => {
//   customermodel
//     .create(req.body)
//     .then((customers) => res.json(customers))
//     .catch((err) => res.json(err));
// });
