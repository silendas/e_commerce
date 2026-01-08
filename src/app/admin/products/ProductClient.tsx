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
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Produk</h1>
          <button 
            onClick={() => openModal()}
            className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-sm"
          >
            + Tambah Produk
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama produk atau deskripsi..."
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
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">Info Produk</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">Harga</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Stok</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={p.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[8px] text-gray-400 font-bold uppercase">No Img</div>
                      )}
                    </div>
                    <div className="max-w-[300px] lg:max-w-[500px]">
                      <div className="font-bold text-gray-900 truncate">{p.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-2 italic leading-relaxed">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap font-semibold text-gray-900">
                  Rp {p.price?.toLocaleString("id-ID")}
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.stock} pcs
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => openModal(p)} className="text-blue-600 hover:text-blue-800 text-sm font-bold">Edit</button>
                    <button onClick={async () => { if(confirm(`Hapus ${p.name}?`)) { await deleteProduct(p.id); window.location.reload(); } }} className="text-red-500 hover:text-red-700 text-sm font-bold">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {initialProducts.length === 0 && (
              <tr><td colSpan={4} className="p-20 text-center text-gray-400 italic">Produk tidak ditemukan.</td></tr>
            )}
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
              <h2 className="text-xl font-bold text-gray-900">{selectedProduct ? "Edit Produk" : "Produk Baru"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black text-3xl transition leading-none">&times;</button>
            </div>
            <form action={async (formData) => {
              try {
                if (selectedProduct) await updateProduct(selectedProduct.id, formData);
                else await createProduct(formData);
                closeModal();
                window.location.reload();
              } catch (e) { alert("Gagal menyimpan data!"); }
            }} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-56 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                  {previewImage ? <img src={previewImage} className="w-full h-full object-contain" alt="" /> : <div className="text-center text-gray-400"><span className="text-4xl block mb-1">+</span><span className="text-xs font-bold uppercase">Foto Produk</span></div>}
                  <input name="image" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Max 2MB • Format JPG, PNG</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 ml-1">Nama Produk</label>
                <input name="name" defaultValue={selectedProduct?.name || ""} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition" required placeholder="Masukkan nama barang..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Harga (Rp)</label>
                  <input type="text" value={displayPrice} onChange={handlePriceChange} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition" required placeholder="0" />
                  <input type="hidden" name="price" value={displayPrice.replace(/\./g, "")} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Stok</label>
                  <input name="stock" type="number" defaultValue={selectedProduct?.stock || ""} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition" required placeholder="0" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 ml-1">Deskripsi</label>
                <textarea name="description" defaultValue={selectedProduct?.description || ""} className="w-full border border-gray-200 p-3 rounded-xl h-28 outline-none focus:ring-2 focus:ring-black resize-y transition" placeholder="Tulis detail produk di sini..." />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition text-gray-600">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10">Simpan Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}