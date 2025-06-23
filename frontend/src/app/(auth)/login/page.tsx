"use client"
import React, {useState} from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/api/auth'

const Login = () => {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await loginUser(email, password);

      localStorage.setItem('token', data.token);

      router.push('/dashboard'); 
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  }
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
      </form>
    </div>
  )
}

export default Login
