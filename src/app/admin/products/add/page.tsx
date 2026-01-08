import { createProduct } from "@/app/actions/product";

export default function AddProductPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

      <form
        action={async (formData) => {
          await createProduct(formData);
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block mb-1 font-medium">Nama Produk</label>
          <input
            name="name"
            type="text"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deskripsi</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
            rows={3}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Harga (Rp)</label>
            <input
              name="price"
              type="number"
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Stok</label>
            <input
              name="stock"
              type="number"
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">URL Gambar</label>
          <input
            name="image"
            type="text"
            placeholder="https://..."
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
          >
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}
