// src/app/register/page.tsx
"use client"
import { useFormState } from "react-dom";
import { registerUser } from "../actions/user";

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, { error: null, success: null });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form action={formAction} className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Register</h1>

        {state?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            {state.success}
          </div>
        )}

        <input name="name" placeholder="Nama Lengkap" className="border p-2 rounded text-black focus:outline-blue-500" required />
        <input name="email" type="email" placeholder="Email" className="border p-2 rounded text-black focus:outline-blue-500" required />
        <input name="password" type="password" placeholder="Password" className="border p-2 rounded text-black focus:outline-blue-500" required />
        
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow">
          Daftar Sekarang
        </button>
      </form>
    </div>
  );
}