import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // Jika tidak ada session, tendang balik ke login
  if (!session) redirect("/login");

  return (
    <div className="p-10">
      <h1 className="text-xl">Halo, {session.user?.name}</h1>
      <p>Role kamu adalah: <strong>{(session.user as any).role}</strong></p>
    </div>
  );
}