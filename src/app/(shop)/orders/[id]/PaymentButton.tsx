"use client";

import { useState } from "react";
import { processPayment } from "@/app/actions/order";

export default function PaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await processPayment(orderId);
    if (res.success) {
      alert("Pembayaran Berhasil! Stok telah dikurangi.");
      window.location.reload();
    } else {
      alert(res.message);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all disabled:bg-gray-200"
    >
      {loading ? "VERIFIKASI..." : "SIMULASI BAYAR"}
    </button>
  );
}