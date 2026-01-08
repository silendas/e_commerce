"use server"

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const description = formData.get("description") as string;
  
  const file = formData.get("image") as File;
  let imagePath = "";

  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    
    await fs.writeFile(filePath, buffer);
    imagePath = `/uploads/${fileName}`;
  }

  await db.product.create({
    data: { name, price, stock, description, image: imagePath }
  });

  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const description = formData.get("description") as string;
  
  const file = formData.get("image") as File;
  let dataToUpdate: any = { name, price, stock, description };

  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    
    await fs.writeFile(filePath, buffer);
    dataToUpdate.image = `/uploads/${fileName}`;
  }

  await db.product.update({
    where: { id },
    data: dataToUpdate
  });

  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await db.product.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
  revalidatePath("/admin/products");
}