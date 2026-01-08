import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const user = await db.user.findUnique({
          where: { email, deletedAt: null },
        });

        if (!user || !user.password) return null;

        console.log("--- DEBUG LOGIN ---");
        console.log("Password dari Form:", credentials.password);
        console.log("Password di DB:", user.password);

        const isPasswordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        console.log("Hasil Match:", isPasswordMatch);
        console.log("-------------------");

        if (!isPasswordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
