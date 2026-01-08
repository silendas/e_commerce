import db from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import ProductClient from "./ProductClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  
  const product = await db.product.findUnique({
    where: { id, deletedAt: null },
  });

  if (!product) notFound();

  return (
    <div className="bg-white min-h-screen text-black">
      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          KEMBALI KE BERANDA
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl shadow-gray-200/50">
            {product.image ? (
              <img 
                src={product.image} 
                className="w-full h-full object-cover" 
                alt={product.name} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 font-black tracking-widest text-xs uppercase">No Image Available</div>
            )}
            
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-black text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest">Stok Habis</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter leading-none">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-blue-600 tracking-tighter">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Deskripsi Produk</h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base whitespace-pre-line">
                  {product.description || "Tidak ada deskripsi untuk produk ini."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Status Stok:</span>
                <span className={`text-sm font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.stock > 0 ? `${product.stock} Unit Tersedia` : "Habis"}
                </span>
              </div>
            </div>

            <ProductClient 
              productId={product.id} 
              stock={product.stock} 
              isLoggedIn={!!session} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}