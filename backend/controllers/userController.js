import validator from "validator";
import userModel from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      token: token,
      message: "Login Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isExist = await userModel.findOne({ email: email });

    if (isExist) {
      return res.status(300).json({
        success: false,
        message: "User already exist",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(300).json({
        success: false,
        message: "Please enter valid emial",
      });
    }

    if (password.length < 6) {
      return res.status(300).json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to create user",
    });
  }
};
