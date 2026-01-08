import db from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <div className="bg-white min-h-screen text-black">
      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-square border">
            {product.image ? (
              <img 
                src={product.image} 
                className="w-full h-full object-cover" 
                alt={product.name} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">NO IMAGE</div>
            )}
          </div>

          <div className="flex flex-col">
            <nav className="flex text-sm text-gray-500 mb-4 gap-2">
              <Link href="/" className="hover:text-black">Home</Link>
              <span>/</span>
              <span className="text-black font-medium">Detail Produk</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-tighter">
              {product.name}
            </h1>
            
            <p className="text-2xl font-bold text-blue-600 mb-6">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            <div className="border-t border-b py-6 mb-6">
              <h3 className="font-bold mb-2">Deskripsi Produk</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || "Tidak ada deskripsi untuk produk ini."}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500">Stok Tersedia:</span>
                <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-bold">
                  {product.stock} pcs
                </span>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition">
                  Beli Sekarang
                </button>
                <button className="flex-1 border-2 border-black py-4 rounded-2xl font-bold hover:bg-gray-50 transition">
                  Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}