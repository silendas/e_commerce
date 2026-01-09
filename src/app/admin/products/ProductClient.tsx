"use client";

import { useState } from "react";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/product";
import { useRouter } from "next/navigation";

export default function ProductClient({ 
  initialProducts, 
  currentPage, 
  totalPages,
  searchQuery 
}: { 
  initialProducts: any[], 
  currentPage: number, 
  totalPages: number,
  searchQuery: string
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    router.push(`?q=${searchTerm}&page=1`);
  };

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setPreviewImage(product?.image || null);
    setDisplayPrice(product?.price ? product.price.toLocaleString("id-ID") : "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setPreviewImage(null);
    setDisplayPrice("");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setDisplayPrice(rawValue === "" ? "" : Number(rawValue).toLocaleString("id-ID"));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert("Maksimal 2MB!");
      e.target.value = "";
      setPreviewImage(null);
      return;
    }
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black font-sans">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Produk</h1>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-black text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-800 transition shadow-sm"
          >
            + Tambah Produk
          </button>
        </div>

        <div className="flex gap-2 w-full">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama produk atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-5 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-white transition shadow-sm font-medium"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-lg hover:scale-105 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em]">Info Produk</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em]">Harga Jual</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Stok</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[8px] text-gray-400 font-black uppercase">No Img</div>
                        )}
                      </div>
                      <div className="max-w-[250px] lg:max-w-[400px]">
                        <div className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">{p.name}</div>
                        <div className="text-[11px] text-gray-400 font-medium line-clamp-1 italic">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 whitespace-nowrap">
                    <div className="font-black text-slate-900 text-sm italic">Rp {p.price?.toLocaleString("id-ID")}</div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      p.stock <= 5 ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}>
                      {p.stock} Unit
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => openModal(p)} 
                        className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={async () => { if(confirm(`Hapus ${p.name}?`)) { await deleteProduct(p.id); window.location.reload(); } }} 
                        className="border border-gray-200 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:text-rose-600 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <span className="text-[10px] text-gray-300 font-black italic uppercase tracking-widest">Produk tidak ditemukan</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Hal {currentPage} dari {totalPages || 1}</p>
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
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 italic">{selectedProduct ? "Edit Produk" : "Produk Baru"}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-black text-2xl font-bold">&times;</button>
            </div>
            
            <form action={async (formData) => {
              try {
                if (selectedProduct) await updateProduct(selectedProduct.id, formData);
                else await createProduct(formData);
                closeModal();
                window.location.reload();
              } catch (e) { alert("Gagal menyimpan data!"); }
            }} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-48 rounded-[28px] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 relative group transition hover:border-black">
                  {previewImage ? <img src={previewImage} className="w-full h-full object-contain" alt="" /> : <div className="text-center text-gray-400"><span className="text-2xl block mb-1">+</span><span className="text-[10px] font-black uppercase tracking-widest">Foto Produk</span></div>}
                  <input name="image" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Produk</label>
                <input name="name" defaultValue={selectedProduct?.name || ""} className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Harga (Rp)</label>
                  <input type="text" value={displayPrice} onChange={handlePriceChange} className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition" required />
                  <input type="hidden" name="price" value={displayPrice.replace(/\./g, "")} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stok Unit</label>
                  <input name="stock" type="number" defaultValue={selectedProduct?.stock || ""} className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Deskripsi</label>
                <textarea name="description" defaultValue={selectedProduct?.description || ""} className="w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-medium h-24 focus:ring-2 focus:ring-black outline-none transition resize-none" />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-blue-600 transition">
                  Simpan Produk
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