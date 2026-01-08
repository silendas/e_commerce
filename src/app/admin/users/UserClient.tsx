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
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Manajemen User</h1>
          <button 
            onClick={() => openModal()}
            className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-sm"
          >
            + Tambah User
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama atau email user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-black bg-white transition shadow-sm"
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => {setSearchTerm(""); router.push("?page=1")}}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black font-bold"
              >
                &times;
              </button>
            )}
          </div>
          <button 
            type="submit"
            className="bg-gray-200 text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition border border-gray-300"
          >
            Cari
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">Nama</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">Email</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Role</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 font-bold text-gray-900">{u.name}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'ADMIN' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => openModal(u)} className="text-blue-600 hover:text-blue-800 text-sm font-bold">Edit</button>
                    <button onClick={async () => { if(confirm(`Hapus user ${u.name}?`)) { await deleteUser(u.id); window.location.reload(); } }} className="text-red-500 hover:text-red-700 text-sm font-bold">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white text-sm">
          <p className="font-medium text-gray-500">Halaman {currentPage} dari {totalPages || 1}</p>
          <div className="flex gap-2">
            <button onClick={() => router.push(`?q=${searchTerm}&page=${currentPage - 1}`)} disabled={currentPage <= 1} className="px-4 py-2 border border-gray-200 rounded-xl bg-white font-bold disabled:opacity-30 transition hover:bg-gray-50">Prev</button>
            <button onClick={() => router.push(`?q=${searchTerm}&page=${currentPage + 1}`)} disabled={currentPage >= totalPages} className="px-4 py-2 border border-gray-200 rounded-xl bg-white font-bold disabled:opacity-30 transition hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{selectedUser ? "Edit User" : "User Baru"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black text-3xl transition leading-none">&times;</button>
            </div>

            <form action={async (formData) => {
              try {
                if (selectedUser) await updateUser(selectedUser.id, formData);
                else await createUser(formData);
                closeModal();
                window.location.reload();
              } catch (e) { alert("Gagal!"); }
            }} className="p-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>
                <input name="name" defaultValue={selectedUser?.name || ""} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition" required />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                <input name="email" type="email" defaultValue={selectedUser?.email || ""} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition" required />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Password {selectedUser && <span className="text-[10px] text-gray-400 font-normal">(Kosongkan jika tidak ganti)</span>}
                </label>
                <input 
                  name="password" 
                  type="password" 
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition" 
                  required={!selectedUser} 
                  placeholder={selectedUser ? "••••••••" : "Masukkan password baru"}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Role</label>
                <select name="role" defaultValue={selectedUser?.role || "USER"} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black bg-white transition">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition text-gray-600">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10">
                  {selectedUser ? "Simpan Perubahan" : "Buat User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}