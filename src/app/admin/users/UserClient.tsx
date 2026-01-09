"use client";

import { useState } from "react";
import { createUser, updateUser, deleteUser } from "@/app/actions/user";
import { useRouter } from "next/navigation";

export default function UserClient({ 
  initialUsers, 
  currentPage, 
  totalPages,
  searchQuery
}: { 
  initialUsers: any[], 
  currentPage: number, 
  totalPages: number,
  searchQuery: string
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    router.push(`?q=${searchTerm}&page=1`);
  };

  const openModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black font-sans">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen User</h1>
            <p className="text-gray-500 text-sm">Kelola hak akses dan informasi akun pengguna.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-black text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition shadow-lg shadow-black/10"
          >
            + Tambah User
          </button>
        </div>

        <div className="flex gap-2 w-full">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama atau email user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-5 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-white transition shadow-sm font-medium"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-lg hover:scale-105 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em]">Profil Pengguna</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em]">Email Address</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Role</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs border border-slate-200">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="font-black text-slate-900 text-sm uppercase tracking-tight italic">
                        {u.name}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-bold text-gray-600">{u.email}</div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      u.role === 'ADMIN' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => openModal(u)} 
                        className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={async () => { if(confirm(`Hapus user ${u.name}?`)) { await deleteUser(u.id); window.location.reload(); } }} 
                        className="border border-gray-200 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:text-rose-600 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <span className="text-[10px] text-gray-300 font-black italic uppercase tracking-widest">User tidak ditemukan</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Halaman {currentPage} dari {totalPages || 1}</p>
        <div className="flex gap-2">
          <button 
            onClick={() => router.push(`?q=${searchTerm}&page=${currentPage - 1}`)} 
            disabled={currentPage <= 1} 
            className="p-3 bg-white border border-gray-200 rounded-xl hover:border-black transition-all disabled:opacity-30 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => router.push(`?q=${searchTerm}&page=${currentPage + 1}`)} 
            disabled={currentPage >= totalPages} 
            className="p-3 bg-white border border-gray-200 rounded-xl hover:border-black transition-all disabled:opacity-30 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">{selectedUser ? "Edit User" : "User Baru"}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-black text-2xl font-bold">&times;</button>
            </div>
            
            <form action={async (formData) => {
              try {
                if (selectedUser) await updateUser(selectedUser.id, formData);
                else await createUser(formData);
                closeModal();
                window.location.reload();
              } catch (e) { alert("Gagal!"); }
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Lengkap</label>
                <input name="name" defaultValue={selectedUser?.name || ""} className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <input name="email" type="email" defaultValue={selectedUser?.email || ""} className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Password {selectedUser && <span className="text-[8px] font-medium lowercase">(Biarkan kosong jika tidak ganti)</span>}
                </label>
                <input 
                  name="password" 
                  type="password" 
                  className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition" 
                  required={!selectedUser}
                  placeholder={selectedUser ? "••••••••" : ""}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Akses Role</label>
                <select name="role" defaultValue={selectedUser?.role || "USER"} className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition appearance-none">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 pt-6">
                <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-blue-600 transition">
                  {selectedUser ? "Simpan Perubahan" : "Buat Akun Baru"}
                </button>
                <button type="button" onClick={closeModal} className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-rose-600 transition">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}