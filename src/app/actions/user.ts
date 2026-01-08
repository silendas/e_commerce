"use server"

import db from "@/lib/db";
import bcrypt from "bcryptjs";

export type FormState = {
  error: string | null;
  success: string | null;
};

export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Semua field harus diisi!", success: null };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: { name, email, password: hashedPassword },
    });
    
    return { success: "User berhasil dibuat!", error: null };
  } catch (error) {
    return { error: "Email sudah terdaftar.", success: null };
  }
}