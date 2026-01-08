"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { updateProfile, changePassword } from "../actions/user";

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || ""
      });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-[0.3em] text-[10px]">Loading Profile</p>
        </div>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile(formData);
    if (res.success) {
      await update();
      setIsEditing(false);
      setMessage({ type: "success", text: res.success });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: res.error || "" });
    }
    setLoading(false);
  };

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await changePassword(passData);
    if (res.success) {
      setShowPassModal(false);
      setPassData({ currentPassword: "", newPassword: "" });
      setMessage({ type: "success", text: res.success });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between px-2">
          <Link href="/" className="group flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 hover:bg-black transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-blue-600 group-hover:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-700 group-hover:text-white">Kembali</span>
          </Link>
        </div>

        {message.text && (
          <div className={`mb-8 p-5 rounded-3xl border-2 font-black text-[11px] uppercase tracking-[0.1em] shadow-lg animate-in fade-in slide-in-from-top-4 ${
            message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-[45px] border border-gray-100 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          
          <div className="px-6 sm:px-12 pb-12">
            <div className="relative -mt-20 mb-8">
              <div className="w-36 h-36 sm:w-40 sm:h-40 bg-white p-2 rounded-[40px] shadow-2xl mx-auto sm:mx-0">
                <div className="w-full h-full bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-5xl font-black italic shadow-inner">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 mb-12 text-center sm:text-left">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-slate-900 leading-none">{formData.name}</h1>
                <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <p className="text-blue-700 text-xs font-black uppercase tracking-wider">{formData.email}</p>
                </div>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-slate-900 text-white px-10 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:shadow-none transition-all duration-300 transform active:scale-95"
                >
                  Ubah Profil
                </button>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nama Lengkap</label>
                  <input 
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full rounded-2xl px-6 py-4.5 text-sm font-bold transition-all duration-300 ${
                      isEditing 
                      ? "bg-white border-2 border-blue-600 shadow-xl shadow-blue-50 text-slate-900" 
                      : "bg-slate-50 border-2 border-transparent text-slate-500 cursor-not-allowed"
                    }`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Alamat Email</label>
                  <input 
                    disabled={!isEditing}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full rounded-2xl px-6 py-4.5 text-sm font-bold transition-all duration-300 ${
                      isEditing 
                      ? "bg-white border-2 border-blue-600 shadow-xl shadow-blue-50 text-slate-900" 
                      : "bg-slate-50 border-2 border-transparent text-slate-500 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in slide-in-from-bottom-2">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-lg shadow-blue-100 transition disabled:opacity-50"
                  >
                    Simpan Perubahan
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition"
                  >
                    Batal
                  </button>
                </div>
              )}
            </form>

            <div className="mt-16 pt-10 border-t border-slate-100">
              <div className="bg-slate-900 rounded-[35px] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="text-center sm:text-left">
                  <h3 className="text-white font-black text-lg uppercase tracking-tight">Privasi & Keamanan</h3>
                  <p className="text-slate-400 text-xs font-medium mt-2 max-w-[280px]">Kelola kata sandi Anda untuk memastikan akun tetap aman dan terlindungi.</p>
                </div>
                <button 
                  onClick={() => setShowPassModal(true)}
                  className="w-full sm:w-auto bg-white text-slate-900 px-10 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all duration-300 active:scale-95"
                >
                  Ganti Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {showPassModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[45px] p-10 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-500">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-10 sm:hidden"></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Ganti<br/><span className="text-blue-600">Password</span></h2>
              
              <form onSubmit={handlePassChange} className="mt-10 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password Lama</label>
                  <input 
                    required
                    type="password"
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4.5 text-sm font-bold outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password Baru</label>
                  <input 
                    required
                    type="password"
                    value={passData.newPassword}
                    onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4.5 text-sm font-bold outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-4 pt-6">
                  <button 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    Konfirmasi Perubahan
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowPassModal(false)}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 transition"
                  >
                    Batalkan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}