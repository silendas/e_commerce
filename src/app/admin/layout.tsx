import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold italic">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/products" className="hover:bg-slate-800 p-2 rounded">Manajemen Produk</Link>
          <Link href="/admin/users" className="hover:bg-slate-800 p-2 rounded">Manajemen User</Link>
          <Link href="/" className="mt-10 text-sm text-gray-400">← Kembali ke Web</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}