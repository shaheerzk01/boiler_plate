import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "../utils/sendEmail";
import jwt from "jsonwebtoken";
import { addToBlacklist } from "../utils/tokenBlacklist";

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

const JWT_SECRET =
  "8569f9f588732049cf1b865aeac62c9c0deb07fab4ee19dd30e77876ec987714adeea3bbb0f08a2b8ba08702a10f91ce98f97a007531b15996b79b3653bc0627";

const JWT_EXPIR = "1d";


export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    if (!passwordPattern.test(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
      });
      return;
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date();
    const otpExpiresAt = new Date(now.getTime() + 2 * 60 * 1000);
    const otpLastSentAt = now;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      otpLastSentAt,
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      // Clean up user from DB if email fails
      await User.findByIdAndDelete(user._id);
      res.status(500).json({
        message: "Registration failed: could not send verification email",
        error: emailError,
      });
    }

    res.status(201).json({
      message: "User registered. Please verify your email.",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user || user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP or user not found" });
      return;
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      res.status(400).json({ message: "OTP has expired" });
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const now = new Date();

    const canResendAt = user.otpLastSentAt
      ? new Date(user.otpLastSentAt.getTime() + 30 * 1000) // 30 seconds
      : new Date(0);

    if (now < canResendAt) {
      const waitTime = Math.ceil(
        (canResendAt.getTime() - now.getTime()) / 1000
      );
      res.status(429).json({
        message: `Please wait ${waitTime} seconds before resending OTP.`,
      });
      return;
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newExpiry = new Date(now.getTime() + 2 * 60 * 1000);

    user.otp = newOtp;
    user.otpExpiresAt = newExpiry;
    user.otpLastSentAt = now;

    await user.save();

    await sendOtpEmail(user.email, newOtp);

    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (!user.isVerified) {
      res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIR }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(400).json({ message: 'Token not provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  addToBlacklist(token); 

  res.status(200).json({ message: 'Logout successful' });
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
}
