"use client";

import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddToCartButton({ 
  productId, 
  isLoggedIn,
  stock,
  quantity = 1
}: { 
  productId: string; 
  isLoggedIn: boolean;
  stock: number;
  quantity?: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (stock <= 0) return;

    try {
      setLoading(true);
      await addToCart(productId, quantity);
      alert(`Berhasil menambahkan ${quantity} produk ke keranjang!`);
    } catch (error: any) {
      alert(error.message || "Gagal menambah ke keranjang");
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = stock <= 0;

  return (
    <button
      onClick={handleAdd}
      disabled={loading || isOutOfStock}
      className={`mt-3 w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
        isOutOfStock
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white border-gray-400 text-black hover:bg-black hover:text-white hover:border-black active:scale-95 shadow-sm"
      }`}
    >
      {loading ? "MEMPROSES..." : isOutOfStock ? "STOK HABIS" : "TAMBAH KE KERANJANG"}
    </button>
  );
}