"use server"

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const image = formData.get("image") as string;

  try {
    await db.product.create({
      data: { name, description, price, stock, image },
    });

    revalidatePath("/admin/products");
    return { success: "Produk berhasil ditambahkan!" };
  } catch (error) {
    return { error: "Gagal menambah produk." };
  }
}