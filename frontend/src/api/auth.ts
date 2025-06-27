export const loginUser = async (email: string, password: string) => {
  const res = await fetch("http://localhost:8989/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch("http://localhost:8989/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const verifyOtp = async (userId: string, otp: string) => {
  const res = await fetch("http://localhost:8989/api/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
};

export const resendOtp = async (userId: string) => {
  const res = await fetch("http://localhost:8989/api/auth/resend-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
  return data;
};

export const logoutUser = async (token: string) => {
  const res = await fetch("http://localhost:8989/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};

export const deleteUser = async (userId: string, token: string) => {
  const res = await fetch(`http://localhost:8989/api/auth/delete/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ Include token here
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Delete failed");
  }

  return data;
};

export const getOtpWaitTime = async (userId: string): Promise<number> => {
    if (!userId) return 0;
  
    try {
      const res = await fetch("http://localhost:8989/api/auth/otp-wait-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch OTP wait time");
  
      return data.waitTime || 0;
    } catch (err) {
      console.error("Error fetching wait time:", err);
      return 0;
    }
  };
  