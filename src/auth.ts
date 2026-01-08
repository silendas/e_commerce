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
        
        const user = await db.user.findUnique({
          where: { 
            email: credentials.email as string,
            deletedAt: null // User yang di-soft delete tidak bisa login
          },
        });

        if (!user || !user.password) return null;

        const isPasswordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordMatch) return null;

        // Data yang dikembalikan di sini akan masuk ke token JWT
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});