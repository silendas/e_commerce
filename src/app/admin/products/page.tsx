import db from "@/lib/db";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stok Produk</h1>
        <Link
          href="/admin/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Produk
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left bg-gray-50">
            <th className="p-3">Nama</th>
            <th className="p-3">Harga</th>
            <th className="p-3">Stok</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3">Rp {p.price.toLocaleString()}</td>
              <td
                className={`p-3 font-bold ${
                  p.stock < 5 ? "text-red-600" : "text-green-600"
                }`}
              >
                {p.stock}
              </td>
              <td className="p-3 flex gap-2">
                <button className="text-blue-600 text-sm">Edit</button>
                <button className="text-red-600 text-sm">Hapus</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="p-10 text-center text-gray-400">
                Belum ada data produk.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
