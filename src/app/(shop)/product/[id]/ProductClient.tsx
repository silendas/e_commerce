"use client";

import { useState } from "react";
import AddToCartButton from "../../../components/AddToCartButton";

export default function ProductClient({ 
  productId, 
  stock, 
  isLoggedIn 
}: { 
  productId: string; 
  stock: number; 
  isLoggedIn: boolean 
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-gray-100 rounded-2xl p-1 border border-gray-200 shadow-inner">
          <button 
            type="button"
            disabled={quantity <= 1 || stock <= 0}
            onClick={() => setQuantity(q => q - 1)}
            className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all font-black disabled:opacity-20 text-black"
          >
            -
          </button>
          
          <span className="w-12 text-center font-black text-lg text-black">
            {stock <= 0 ? 0 : quantity}
          </span>
          
          <button 
            type="button"
            disabled={quantity >= stock || stock <= 0}
            onClick={() => setQuantity(q => q + 1)}
            className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all font-black disabled:opacity-20 text-black"
          >
            +
          </button>
        </div>
        
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Pilih Jumlah
          </p>
          {stock > 0 && (
            <p className="text-[9px] text-blue-600 font-bold tracking-tighter">
              Maksimal beli {stock} unit
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <AddToCartButton 
            productId={productId}
            isLoggedIn={isLoggedIn}
            stock={stock}
            quantity={quantity}
          />
        </div>

        <button 
          disabled={stock <= 0}
          className="flex-1 border-2 border-black py-2.5 mt-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all active:scale-95 disabled:border-gray-200 disabled:text-gray-400"
        >
          Beli Langsung
        </button>
      </div>
    </div>
  );
}