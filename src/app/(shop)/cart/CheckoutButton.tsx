"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrderFromCart } from "@/app/actions/order";

export default function CheckoutButton({ disabled }: { disabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!confirm("Lanjutkan pesanan?")) return;

    setLoading(true);
    try {
      const result = await createOrderFromCart();
      if (result.success) {
        router.push(`/orders/${result.orderId}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-xl active:scale-95"
    >
      {loading ? "MEMPROSES..." : "CHECKOUT SEKARANG"}
    </button>
  );
}