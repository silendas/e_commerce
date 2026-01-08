"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const successMessage = searchParams.get("success");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau Password salah!");
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition mb-6 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          KEMBALI KE BERANDA
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Selamat Datang</h1>
          <p className="text-gray-500 text-sm mt-2">Masuk ke akunmu untuk melanjutkan belanja.</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3">
            <span className="text-xl">✅</span> {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Email</label>
            <input name="email" type="email" placeholder="nama@email.com" className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-black" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-black" required />
          </div>
          <button type="submit" disabled={isLoading} className={`w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition shadow-lg shadow-black/10 mt-4 active:scale-95 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"}`}>
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}