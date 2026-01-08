import db from "@/lib/db";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  const products = await db.product.findMany({
    where: {
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
            <h2 className="text-3xl sm:text-5xl font-black mb-2">DISKON AKHIR TAHUN!</h2>
            <p className="text-gray-400">Dapatkan produk kualitas terbaik dengan harga miring.</p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
        </div>

        <h3 className="text-xl font-bold mb-6">
          {query ? `Hasil pencarian untuk "${query}"` : "Produk Terbaru"}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="group flex flex-col">
              <div className="bg-gray-100 rounded-2xl aspect-square overflow-hidden mb-3 relative">
                {p.image ? (
                  <img 
                    src={p.image} 
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">NO IMAGE</div>
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Lihat Detail
                  </span>
                </div>

                {p.stock <= 5 && p.stock > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                      Stok Terbatas
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <h4 className="font-bold text-sm line-clamp-1 group-hover:text-blue-600 transition">
                  {p.name}
                </h4>
                <p className="text-blue-600 font-black mt-1">
                  Rp {p.price.toLocaleString("id-ID")}
                </p>
                
                <button className="mt-3 w-full border border-gray-400 py-2 rounded-xl text-xs font-bold hover:bg-black hover:text-white hover:border-black transition duration-300">
                  Tambah ke Keranjang
                </button>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 italic font-medium">Maaf, produk "{query}" tidak ditemukan...</p>
            <Link href="/" className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">
              Lihat semua produk
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}