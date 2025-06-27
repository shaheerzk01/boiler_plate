"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, resendOtp } from "@/api/auth";
import {useAuthRedirect} from "@/hooks/useAuthRedirect";
import { getOtpWaitTime } from "@/api/auth";

const OtpVerification = () => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  

  useAuthRedirect();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!userId) {
      setError("User ID not found. Please register again.");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(userId, otp);
      setSuccess("OTP verified successfully!");
      localStorage.removeItem("userId");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userId) return;
  
    try {
      setResendDisabled(true);
      await resendOtp(userId);
      setSuccess("OTP resent successfully.");
      setSecondsLeft(30); 
    } catch (err: any) {
      if (err?.response?.status === 429 && err.response?.data?.waitTime) {
        const wait = err.response.data.waitTime;
        setSecondsLeft(wait);
        setError(`Please wait ${wait}s before trying again.`);
      } else {
        setError(err.message || "Failed to resend OTP.");
      }
    }
  };
  

  // Countdown timer for resend
  useEffect(() => {
    if (secondsLeft <= 0) {
      setResendDisabled(false); // ✅ Re-enable resend button when timer ends
      return;
    }
  
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    const fetchWaitTime = async () => {
      if (!userId) return;
      const waitTime = await getOtpWaitTime(userId);
      if (waitTime > 0) {
        setSecondsLeft(waitTime);
        setResendDisabled(true);
      }
    };
    fetchWaitTime();
  }, [userId]);
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA] p-4">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Verify OTP
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-opacity-90"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
          Didn't receive OTP?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendDisabled || secondsLeft > 0}
            className="text-primary underline disabled:text-gray-400"
          >
            {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
