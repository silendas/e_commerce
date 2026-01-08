"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await auth();
  if (!session) throw new Error("Silahkan login terlebih dahulu");

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product || product.stock <= 0) throw new Error("Stok produk habis");

  const existingItem = await db.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    
    if (newQuantity > product.stock) {
      throw new Error(`Stok tidak mencukupi. Maksimal pembelian: ${product.stock}`);
    }

    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    if (quantity > product.stock) {
      throw new Error(`Stok tidak mencukupi. Tersisa: ${product.stock}`);
    }

    await db.cartItem.create({
      data: { 
        userId: session.user.id, 
        productId, 
        quantity: quantity 
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/");
}

export async function updateCartQuantity(id: string, delta: number) {
  const item = await db.cartItem.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!item) return;

  const newQuantity = item.quantity + delta;
  if (newQuantity <= 0) {
    await db.cartItem.delete({ where: { id } });
  } else if (newQuantity <= item.product.stock) {
    await db.cartItem.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  }

  revalidatePath("/cart");
}

export async function removeFromCart(id: string) {
  await db.cartItem.delete({ where: { id } });
  revalidatePath("/cart");
}