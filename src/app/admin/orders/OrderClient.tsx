"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/order";

export default function OrderClient({
  initialOrders,
  currentPage,
  totalPages,
  searchQuery,
}: {
  initialOrders: any[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const [tempFilter, setTempFilter] = useState({
    status: searchParams.get("status") || "",
    start: searchParams.get("start") || "",
    end: searchParams.get("end") || "",
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchTerm);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (tempFilter.status) params.set("status", tempFilter.status);
    else params.delete("status");
    if (tempFilter.start) params.set("start", tempFilter.start);
    else params.delete("start");
    if (tempFilter.end) params.set("end", tempFilter.end);
    else params.delete("end");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const message =
      status === "CANCELLED"
        ? "Batalkan pesanan ini?"
        : `Ubah status ke ${status}?`;
    if (!confirm(message)) return;

    setLoadingId(id);
    try {
      await updateOrderStatus(id, status as any);
      setSelectedOrder(null);
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Gagal update status!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black font-sans">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Order
            </h1>
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition shadow-sm border ${
              tempFilter.status || tempFilter.start
                ? "bg-black text-white border-black"
                : "bg-gray-300 text-black border-gray-200 hover:bg-gray-400"
            }`}
          >
            {tempFilter.status || tempFilter.start
              ? "● Filter Aktif"
              : "Filter"}
          </button>
        </div>

        <div className="flex gap-2 w-full">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              placeholder="Cari Order ID atau nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-5 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-white transition shadow-sm font-medium"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-lg hover:scale-105 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em]">
                  Order & Tanggal
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em]">
                  Pelanggan
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em]">
                  Total Bayar
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                  Status
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-5">
                    <div className="font-black text-slate-900 text-sm italic uppercase tracking-tighter">
                      #{order.id.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">
                      {order.user?.name || "Guest"}
                    </div>
                    <div className="text-[10px] text-blue-600 font-medium italic">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="p-5 whitespace-nowrap">
                    <div className="font-black text-slate-900 text-sm italic">
                      Rp {order.totalAmount?.toLocaleString("id-ID")}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                        order.status === "COMPLETED"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : order.status === "PAID"
                          ? "bg-blue-50 border-blue-200 text-blue-600"
                          : order.status === "CANCELLED"
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-amber-50 border-amber-200 text-amber-600"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-black text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Halaman {currentPage} dari {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`?page=${currentPage - 1}`)}
            disabled={currentPage <= 1}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:border-black transition-all disabled:opacity-30 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={() => router.push(`?page=${currentPage + 1}`)}
            disabled={currentPage >= totalPages}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:border-black transition-all disabled:opacity-30 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6 italic">
              Filter Pesanan
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Status Transaksi
                </label>
                <select
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                  value={tempFilter.status}
                  onChange={(e) =>
                    setTempFilter({ ...tempFilter, status: e.target.value })
                  }
                >
                  <option value="">Semua Status</option>
                  <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
                  <option value="PAID">Sudah Dibayar</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Mulai
                  </label>
                  <input
                    type="date"
                    value={tempFilter.start}
                    onChange={(e) =>
                      setTempFilter({ ...tempFilter, start: e.target.value })
                    }
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Sampai
                  </label>
                  <input
                    type="date"
                    value={tempFilter.end}
                    onChange={(e) =>
                      setTempFilter({ ...tempFilter, end: e.target.value })
                    }
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={applyFilters}
                  className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]"
                >
                  Terapkan Filter
                </button>
                <button
                  onClick={() => {
                    setTempFilter({ status: "", start: "", end: "" });
                    router.push("?page=1");
                    setIsFilterOpen(false);
                  }}
                  className="w-full py-2 text-[10px] font-black uppercase text-gray-400"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Detail Pesanan
                </h2>
                <p className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase">
                  ID: {selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-black text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex justify-between items-center px-1">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Pelanggan
                  </p>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {selectedOrder.user?.name || "Guest"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Tanggal
                  </p>
                  <p className="text-sm font-black text-slate-900 uppercase">
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "id-ID",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Metode Pembayaran
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {selectedOrder.paymentType
                        ? selectedOrder.paymentType.replace(/_/g, " ")
                        : "Belum Ada"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-[0.15em]">
                  Produk yang dibeli:
                </p>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-start border-b border-gray-200/60 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">
                            No Img
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-black uppercase text-slate-900 truncate pr-2">
                            {item.product?.name || "Produk Dihapus"}
                          </p>
                          <p className="text-xs font-black italic text-slate-900 whitespace-nowrap">
                            Rp{" "}
                            {(
                              (item.priceAtBuy || 0) * item.quantity
                            ).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            ID: ...
                            {item.product?.id?.slice(-5).toUpperCase() || "N/A"}{" "}
                            <span className="mx-1">•</span> {item.quantity} PCS
                          </p>
                          <p className="text-[9px] text-gray-400 font-medium italic">
                            @ Rp{" "}
                            {(item.priceAtBuy || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6 pt-4 border-t-2 border-dashed border-gray-300">
                  <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
                    Total Bayar
                  </p>
                  <p className="text-xl font-black text-slate-900 italic">
                    Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {selectedOrder.status === "PENDING_PAYMENT" && (
                  <>
                    <button
                      disabled={!!loadingId}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.id, "PAID")
                      }
                      className="bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 transition disabled:opacity-50"
                    >
                      Konfirmasi Bayar
                    </button>
                    <button
                      disabled={!!loadingId}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.id, "CANCELLED")
                      }
                      className="border border-gray-200 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase hover:text-rose-600 transition disabled:opacity-50"
                    >
                      Batalkan
                    </button>
                  </>
                )}
                {selectedOrder.status === "PAID" && (
                  <>
                    <button
                      disabled={!!loadingId}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.id, "COMPLETED")
                      }
                      className="bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-600 transition disabled:opacity-50"
                    >
                      Selesaikan Pesanan
                    </button>
                    <button
                      disabled={!!loadingId}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.id, "CANCELLED")
                      }
                      className="border border-gray-200 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase hover:text-rose-600 transition disabled:opacity-50"
                    >
                      Batalkan & Restok
                    </button>
                  </>
                )}
                {(selectedOrder.status === "COMPLETED" ||
                  selectedOrder.status === "CANCELLED") && (
                  <div className="col-span-2 text-center py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Transaksi Final
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
