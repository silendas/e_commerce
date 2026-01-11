"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function PaymentButton({ 
  orderId, 
  snapToken 
}: { 
  orderId: string; 
  snapToken: string | null 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = () => {
    if (!snapToken) {
      alert("Token pembayaran tidak ditemukan. Hubungi admin.");
      return;
    }

    setLoading(true);

    // @ts-ignore
    window.snap.pay(snapToken, {
      onSuccess: function (result: any) {
        console.log("Success:", result);
        router.refresh();
      },
      onPending: function (result: any) {
        console.log("Pending:", result);
        alert("Selesaikan pembayaran Anda.");
        router.refresh();
      },
      onError: function (result: any) {
        console.error("Error:", result);
        alert("Pembayaran gagal!");
        setLoading(false);
      },
      onClose: function () {
        setLoading(false);
      },
    });
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all disabled:bg-gray-200 w-full md:w-auto shadow-lg shadow-blue-200"
      >
        {loading ? "MEMPROSES..." : "BAYAR SEKARANG"}
      </button>
    </>
  );
}