"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export type FormState = {
  error: string | null;
  success: string | null;
};

export async function registerUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
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

export async function updateProfile(data: { name: string; email: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const existingUser = await db.user.findFirst({
      where: { 
        email: data.email,
        NOT: { id: session.user.id } 
      }
    });

    if (existingUser) return { error: "Email sudah digunakan oleh akun lain." };

    await db.user.update({
      where: { id: session.user.id },
      data: { name: data.name, email: data.email },
    });
    
    revalidatePath("/profile");
    return { success: "Data berhasil diperbarui!" };
  } catch (e) {
    return { error: "Terjadi kesalahan sistem." };
  }
}

export async function changePassword(formData: any) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const { currentPassword, newPassword } = formData;

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) return { error: "User tidak ditemukan" };

  const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordsMatch) return { error: "Password lama salah!" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: "Password berhasil diganti!" };
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as any;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    revalidatePath("/admin/users");
    return { success: "User berhasil dibuat" };
  } catch (error) {
    return { error: "Email sudah terdaftar" };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as any;
  const password = formData.get("password") as string;

  try {
    const updateData: any = {
      name,
      email,
      role,
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await db.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/users");
    return { success: "User berhasil diperbarui" };
  } catch (error) {
    return { error: "Gagal memperbarui user" };
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/users");
    return { success: "User berhasil dihapus" };
  } catch (error) {
    return { error: "Gagal menghapus user" };
  }
}
