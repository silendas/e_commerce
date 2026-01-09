import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-wider uppercase">
            Admin<span className="text-blue-500">Store</span>
          </h2>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Manajemen System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
          >
            <span className="text-sm font-medium">Manajemen User</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
          >
            <span className="text-sm font-medium">Manajemen Produk</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
          >
            <span className="text-sm font-medium">Manajemen Order</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-2 text-xs text-slate-500 hover:text-white transition"
          >
            ← Kembali ke Website
          </Link>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all font-medium text-sm">
              Keluar Sesi (Logout)
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">
        <header className="bg-white border-b h-16 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right">
              <p className="font-bold text-slate-900 leading-none">{session.user?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase">{session.user?.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
              {session.user?.name?.[0]}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}