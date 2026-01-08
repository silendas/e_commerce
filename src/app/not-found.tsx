"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-black">
      <div className="relative mb-8">
        <h1 className="text-[150px] font-black leading-none tracking-tighter text-gray-100 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🛍️</span>
        </div>
      </div>

      <div className="text-center max-w-md">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
          Waduh, Halamannya Hilang!
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Mungkin produk yang kamu cari sudah habis atau alamat link-nya salah
          ketik. Yuk, balik lagi ke beranda buat cari produk keren lainnya!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10 active:scale-95 text-sm"
          >
            Balik ke Beranda
          </Link>
          <button
            onClick={() => router.back()}
            className="border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition active:scale-95 text-sm"
          >
            Kembali Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
}
