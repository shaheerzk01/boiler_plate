"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/auth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useAuthRedirect();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="h-full flex flex-col items-center justify-center text-black p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-opacity-90"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
