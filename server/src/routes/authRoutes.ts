import { Router } from "express";
import { registerUser, verifyOtp, resendOtp, loginUser, logoutUser, deleteUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);

router.delete('/delete/:userId', authMiddleware, deleteUser);

export default router;
