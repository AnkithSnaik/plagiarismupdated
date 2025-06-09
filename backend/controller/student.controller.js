// backend/controller/student.controller.js
import Student from "../model/student.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"; // Import dotenv to load environment variables

dotenv.config(); // Load environment variables from .env file (ensure this is called in your main app.js/index.js as well)

// Use your .env secret, with a fallback for development/testing if .env is not yet set up
// IMPORTANT: In production, ensure process.env.JWT_SECRET is ALWAYS defined and is a strong, random key.
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_fallback_key_dont_use_in_prod";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Add logging to see what signup receives
    console.log("Signup request body:", { fullname, email, password: "******" }); // Log password masked

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      console.log(`Signup error: User with email '${email}' already exists.`);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashPassword = await bcryptjs.hash(password, 10);
    console.log(`Signup: Hashed password for ${email}.`);

    const newStudent = new Student({
      fullname,
      email,
      password: hashPassword,
    });

    await newStudent.save();
    console.log(`Signup: New user '${email}' saved to DB.`);

    // Generate JWT
    const token = jwt.sign({ id: newStudent._id }, JWT_SECRET, {
      expiresIn: "1d", // 1 day expiry
    });
    console.log(`Signup: JWT generated for '${email}'.`);
    console.log("Generated JWT (Signup):", token); // <-- ADDED THIS LINE

    res.status(201).json({
      message: "User created successfully",
      token,
      student: {
        _id: newStudent._id,
        fullname: newStudent.fullname,
        email: newStudent.email,
      },
    });
  } catch (error) {
    console.error("Signup ERROR: " + error.message); // Use console.error for errors
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- STEP 1: Log the incoming request body (Crucial for 400 errors!) ---
    // This will show if email and password are actually being received by the controller.
    console.log("Login request body received:", { email, password: password ? "******" : "undefined" }); // Mask password, handle undefined

    // Step 2: Basic input validation on the backend
    if (!email || !password) {
        console.log("Login error: Email or password is missing in the request body.");
        return res.status(400).json({ message: "Email and password are required." });
    }

    // Step 3: Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      console.log(`Login error: No student found with email '${email}'.`);
      // It's a common security practice to return a generic message
      // for both wrong email and wrong password to prevent enumeration attacks.
      return res.status(400).json({ message: "Invalid email or password." });
    }
    console.log(`Login: Student found with email '${email}'.`);

    // Step 4: Compare the provided password with the hashed password from the database
    // Ensure 'student.password' exists and is not null/undefined
    if (!student.password) {
        console.error(`Login error: Student '${email}' found, but no password hash exists in DB.`);
        return res.status(500).json({ message: "Internal Server Error: User data corrupted." });
    }
    const isMatch = await bcryptjs.compare(password, student.password);
    if (!isMatch) {
      console.log(`Login error: Password mismatch for student '${email}'.`);
      return res.status(400).json({ message: "Invalid email or password." });
    }
    console.log(`Login: Passwords match for student '${email}'.`);


    // Step 5: Generate a JWT token
    const token = jwt.sign({ id: student._id }, JWT_SECRET, {
      expiresIn: "1d", // 1 day expiry
    });
    console.log(`Login: JWT generated for student '${email}'.`);
    console.log("Generated JWT (Login):", token); // <-- ADDED THIS LINE

    // Step 6: Prepare student data to send to the frontend (exclude password hash)
    const studentWithoutPassword = {
        _id: student._id,
        fullname: student.fullname, // Assuming your Student model has a 'fullname' field
        email: student.email,
        // Add any other student details you want the frontend to have, e.g., role, etc.
    };

    // Step 7: Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      student: studentWithoutPassword,
    });
    console.log(`Login: Successfully logged in student '${email}'.`);

  } catch (error) {
    // Step 8: Handle any unexpected server errors
    console.error("Login ERROR (Internal Server Error): " + error.message); // Use console.error
    res.status(500).json({ message: "Internal Server Error" });
  }
};