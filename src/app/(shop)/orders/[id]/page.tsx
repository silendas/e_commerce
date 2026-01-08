import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import PaymentButton from "./PaymentButton";

export default async function OrderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id: id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Tombol Kembali ke Daftar Pesanan */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition mb-8 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-3 h-3 group-hover:-translate-x-1 transition-transform"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        KEMBALI KE PESANAN SAYA
      </Link>

      <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50">
        <div className="p-8 md:p-10 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                Detail Transaksi
              </p>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
                #{order.id.slice(-6).toUpperCase()}
              </h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal Pesanan</p>
              <p className="font-bold text-sm text-black">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Item yang dipesan</h3>
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    {item.product.image && (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      {item.quantity} x Rp {item.priceAtBuy.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <p className="font-black text-sm text-gray-900">
                  Rp {(item.quantity * item.priceAtBuy).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total yang harus dibayar</p>
            <p className="text-3xl font-black text-blue-600 tracking-tighter">
              Rp {order.totalAmount.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="w-full md:w-auto">
            {order.status === "PENDING_PAYMENT" ? (
              <PaymentButton orderId={order.id} />
            ) : (
              <div className="flex flex-col items-center md:items-end">
                <div className="flex items-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-2xl border border-green-100 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                  <span className="font-black uppercase text-xs tracking-widest">Pembayaran Berhasil</span>
                </div>
                <p className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-tighter">Pesanan ini sudah diproses & stok diperbarui</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}