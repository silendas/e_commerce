import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import CartItemRow from "./CartItemRow";
import CheckoutButton from "./CheckoutButton";

export default async function CartPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const cartItems = await db.cartItem.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeItems = cartItems.filter(
    (item) => item.product && item.product.deletedAt === null
  );

  const validItemsForCheckout = activeItems.filter(
    (item) => item.product.stock > 0
  );

  const totalPrice = validItemsForCheckout.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

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
        KEMBALI BELANJA
      </Link>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-10">
        Keranjang <span className="text-blue-600">Belanja</span>
      </h1>

      {activeItems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 uppercase tracking-tight">
            Wah, keranjangmu kosong!
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
            Yuk, cari produk impianmu dan masukkan ke keranjang sekarang juga.
          </p>
          <Link
            href="/"
            className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10"
          >
            Mulai Eksplorasi
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            {activeItems.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50 sticky top-24">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Total Barang</span>
                <span className="font-bold text-gray-900">
                  {activeItems.length} Produk
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-gray-900 font-bold">Estimasi Total</span>
                <span className="font-black text-2xl text-blue-600 tracking-tighter">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <CheckoutButton disabled={totalPrice === 0} />

            <p className="text-[10px] text-gray-400 text-center mt-4 font-medium uppercase tracking-tighter">
              Stok aman dikurangi setelah pembayaran berhasil
            </p>
          </div>
        </div>
      )}
    </div>
  );
}