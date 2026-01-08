"use client";

import { updateCartQuantity, removeFromCart } from "@/app/actions/cart";
import { useState } from "react";

export default function CartItemRow({ item }: { item: any }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const isOutOfStock = item.product.stock <= 0;

  const handleUpdate = async (delta: number) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updateCartQuantity(item.id, delta);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`group relative flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-3xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100 ${isOutOfStock ? "bg-gray-50/50" : ""}`}>
      
      <div className="relative w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-50">
        {item.product.image ? (
          <img 
            src={item.product.image} 
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-50" : ""}`} 
            alt={item.product.name} 
          />
        ) : (
          <div className="text-[10px] font-black text-gray-300 uppercase">No Image</div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
              {item.product.name}
            </h3>
            <p className="text-blue-600 font-black text-xl mt-1 tracking-tighter">
              Rp {item.product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              isEditMode 
              ? "bg-yellow-300 text-black-500 hover:bg-yellow-400" 
              : "bg-yellow-300 text-black-500 hover:bg-yellow-400"
            }`}
          >
            {isEditMode ? "Selesai" : "Ubah"}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-6 min-h-[44px]">
          {isEditMode ? (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                <button 
                  onClick={() => handleUpdate(-1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all font-black disabled:opacity-20"
                >
                  {isUpdating ? ".." : "-"}
                </button>
                <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdate(1)}
                  disabled={isUpdating || item.quantity >= item.product.stock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all font-black disabled:opacity-20"
                >
                  {isUpdating ? ".." : "+"}
                </button>
              </div>

              <button 
                onClick={() => {
                  if(confirm("Hapus produk ini dari keranjang?")) removeFromCart(item.id);
                }}
                className="w-11 h-11 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"
                title="Hapus"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <span className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 text-gray-900 font-bold">
                {item.quantity}x
              </span>
              <span>Barang</span>
              {isOutOfStock && (
                <span className="text-red-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                  Stok Habis
                </span>
              )}
            </div>
          )}
          
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Subtotal</p>
            <p className="font-black text-gray-900 text-lg tracking-tighter">
              Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}