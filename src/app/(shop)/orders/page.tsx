import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-amber-200 text-amber-600 border-amber-100";
      case "PAID":
        return "bg-blue-200 text-blue-600 border-blue-100";
      case "COMPLETED":
        return "bg-green-200 text-green-600 border-green-100";
      case "CANCELLED":
        return "bg-red-200 text-red-600 border-red-100";
      default:
        return "bg-gray-200 text-gray-600 border-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT": return "Menunggu Pembayaran";
      case "PAID": return "Sudah Dibayar";
      case "COMPLETED": return "Selesai";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/"
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
        KEMBALI KE BERANDA
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Pesanan <span className="text-blue-600">Saya</span>
          </h1>
          <p className="text-gray-400 text-[10px] mt-3 font-black uppercase tracking-[0.2em]">
            Riwayat transaksi • {orders.length} Total Pesanan
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-2xl">
            📦
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Belum ada riwayat pesanan
          </p>
          <Link 
            href="/" 
            className="mt-6 bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95"
          >
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="group bg-white border border-gray-100 p-7 rounded-[32px] transition-all hover:shadow-2xl hover:shadow-gray-200/50 hover:border-transparent flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border shadow-sm ${getStatusStyle(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-black text-xl text-gray-900 tracking-tight leading-tight">
                    #{order.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                    {order._count.items} Jenis Produk
                  </p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Pembayaran</p>
                  <p className="font-black text-xl text-blue-600 tracking-tighter">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </p>
                </div>
                
                <Link
                  href={`/orders/${order.id}`}
                  className="bg-gray-300 text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 flex items-center gap-2"
                >
                  Detail
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}