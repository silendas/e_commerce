import db from "@/lib/db";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  async function handleRegister(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) return;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) return redirect("/register?error=Email sudah digunakan");

    const hashedPassword = await hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    redirect("/login?success=Akun berhasil dibuat!");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition mb-6 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          KEMBALI KE BERANDA
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Daftar Akun</h1>
          <p className="text-gray-500 text-sm mt-2">Gabung sekarang dan mulai belanja produk impianmu.</p>
        </div>

        <form action={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Nama Lengkap</label>
            <input name="name" type="text" required placeholder="Contoh: Budi Santoso" className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Email</label>
            <input name="email" type="email" required placeholder="nama@email.com" className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Password</label>
            <input name="password" type="password" required placeholder="••••••••" className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-black" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg shadow-black/10 mt-4 active:scale-95">
            Buat Akun
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}