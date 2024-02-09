const express = require("express");
const USER = require("../models/userSchema");
const router = express.Router();
var bcrypt = require("bcryptjs");
const { authenticate } = require("../middleware/authenticate");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  console.log("Received registration request:", { name, email }); // Log received data

  try {
    const preuser = await USER.findOne({ email: email });

    if (preuser) {
      console.log("User already exists:", email); // Log if user already exists
      return res.status(422).json({ error: "This email is already in use." });
    } else if (password !== cpassword) {
      console.log("Passwords do not match"); // Log if passwords don't match
      return res.status(422).json({ error: "Passwords do not match." });
    } else {
      const finaluser = new USER({
        name,
        email,
        password,
        cpassword,
      });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      finaluser.password = hash;
      const storedata = await finaluser.save();
      console.log("User registered successfully:", storedata); // Log successful registration
      res.status(201).json(storedata);
    }
  } catch (error) {
    console.error("Error occurred during registration:", error); // Log any errors
    return res
      .status(422)
      .json({ error: "Registration failed. Please try again." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", { email }); // Log received data

  if (!email || !password) {
    console.log("Required fields are empty"); // Log if required fields are empty
    return res.status(400).json({ error: "required fields are empty" });
  }

  try {
    const loginuser = await USER.findOne({ email: email });
    console.log("Found user:", loginuser); // Log if user is found

    if (loginuser) {
      const isMatch = await bcrypt.compare(password, loginuser.password);
      console.log("Password match:", isMatch); // Log if password matches

      if (!isMatch) {
        console.log("Invalid password"); // Log if password is invalid
        return res.status(400).json({ error: "Invalid password" });
      } else {
        let token = jwt.sign({ id: loginuser._id }, secretKey, {
          expiresIn: "1d",
        });

        // Send the token in the response header
        req.headers.authorization = `Bearer ${token}`;
        console.log("Login successful. Sending token:", token); // Log if login is successful

        res.status(200).json({ token, loginuser });
      }
    } else {
      console.log("User not found"); // Log if user is not found
      return res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error occurred during login:", error); // Log any errors
    res.status(400).json({ error: "An error occurred during login" });
  }
});

// user valid
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const ValidUserOne = await USER.findOne({ _id: req.userID });
    console.log(ValidUserOne);
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout
router.get("/logout", authenticate, async (req, res) => {
  try {
    // Clear the token sent in the header from the client-side
    req.headers.authorization = '';

    // Respond with a successful status
    res.status(201).json({ status: 201, message: "Logged out successfully" });
  } catch (error) {
    // If an error occurs, respond with an error status
    res.status(500).json({ status: 500, error: error.message });
  }
});

module.exports = router;
