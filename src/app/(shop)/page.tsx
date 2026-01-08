import db from "@/lib/db";
import Link from "next/link";
import { auth } from "@/auth";
import AddToCartButton from "../components/AddToCartButton";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const isLoggedIn = !!session;

  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  const products = await db.product.findMany({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white min-h-screen text-black">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-3xl p-8 mb-10 text-white flex flex-col justify-center h-48 sm:h-64 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black mb-2 tracking-tighter uppercase">
              DISKON AKHIR TAHUN!
            </h2>
            <p className="text-gray-400 font-medium">
              Dapatkan produk kualitas terbaik dengan harga miring.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute left-1/2 top-0 w-32 h-32 bg-purple-600 rounded-full blur-[80px] opacity-10"></div>
        </div>

        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-xs text-gray-400">
          {query ? (
            <span>Hasil pencarian untuk: <span className="text-black">"{query}"</span></span>
          ) : (
            "Koleksi Produk Terbaru"
          )}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((p) => (
            <div key={p.id} className="group flex flex-col bg-white">
              <Link href={`/product/${p.id}`} className="relative bg-gray-100 rounded-2xl aspect-square overflow-hidden mb-3 block">
                {p.image ? (
                  <img 
                    src={p.image} 
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-black tracking-widest uppercase">
                    No Image
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 uppercase tracking-widest">
                    Lihat Detail
                  </span>
                </div>

                {p.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                      Sold Out
                    </span>
                  </div>
                )}

                {p.stock > 0 && p.stock <= 5 && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                      Sisa {p.stock} Unit
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-col flex-1">
                <Link href={`/product/${p.id}`}>
                  <h4 className="font-bold text-sm line-clamp-1 group-hover:text-blue-600 transition tracking-tight">
                    {p.name}
                  </h4>
                </Link>
                <p className="text-blue-600 font-black mt-1 text-base">
                  Rp {p.price.toLocaleString("id-ID")}
                </p>
                
                <AddToCartButton 
                  productId={p.id} 
                  isLoggedIn={isLoggedIn} 
                  stock={p.stock} 
                />
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <div className="text-6xl mb-4 grayscale opacity-50">📦</div>
            <h4 className="text-lg font-bold text-gray-900">Produk Tidak Ditemukan</h4>
            <p className="text-gray-400 text-sm mt-1">
              Coba gunakan kata kunci lain atau cari kategori berbeda.
            </p>
            <Link 
              href="/" 
              className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg shadow-black/10"
            >
              Reset Pencarian
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}