"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar({ user }: { user?: any }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${searchTerm}`);
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black tracking-tighter shrink-0">
          MY<span className="text-blue-600">STORE</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden md:block">
          <input
            type="text"
            placeholder="Cari produk impianmu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 border rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </form>

        <div className="flex items-center gap-3 sm:gap-5">
          {user ? (
            <>
              <div className="flex items-center gap-4 text-gray-600 mr-2">
                <Link href="/orders" title="Pesanan Saya" className="hover:text-black transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.112 11.536a.45.45 0 0 1-.449.493H4.232a.45.45 0 0 1-.449-.493l1.112-11.536a.45.45 0 0 1 .449-.493H18.815a.45.45 0 0 1 .449.493Z" />
                  </svg>
                </Link>
                <Link href="/cart" title="Keranjang" className="hover:text-black transition relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a.601.601 0 0 0-.165-.68.412.412 0 0 0-.51-.04l-9.144 2.152L5.5 5.065m0 0L4.475 3.033M10.5 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm6.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full min-w-[15px] text-center">
                    0
                  </span>
                </Link>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm border-2 border-gray-100 hover:scale-105 transition"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[60] animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Akun Saya</p>
                      <p className="text-sm font-bold truncate mt-1">{user.name}</p>
                    </div>

                    <div className="py-1">
                      {user.role === "ADMIN" ? (
                        <Link href="/admin/products" className="flex items-center px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50">
                           Manajemen Dashboard
                        </Link>
                      ) : (
                        <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                          Profil Saya
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-50 pt-1">
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link 
              href="/login" 
              className="bg-black text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}