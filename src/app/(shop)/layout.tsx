// Contoh penggunaan di layout.tsx
import { auth } from "@/auth";
import db from "@/lib/db";
import Navbar from "../components/Navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  let cartCount = 0;
  if (session?.user) {
    cartCount = await db.cartItem.count({
      where: { userId: session.user.id },
    });
  }

  return (
    <>
      <Navbar user={session?.user} cartCount={cartCount} />
      {children}
    </>
  );
}
