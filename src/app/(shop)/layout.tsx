import { auth } from "@/auth";
import Navbar from "../components/Navbar";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <>
      <Navbar user={session?.user} />
      {children}
    </>
  );
}