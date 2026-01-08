"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createOrderFromCart() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const result = await db.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId: session.user.id },
        include: { product: true }
      });

      if (cartItems.length === 0) throw new Error("Keranjang kosong");

      const totalAmount = cartItems.reduce((acc, item) => 
        acc + (item.product.price * item.quantity), 0
      );

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          status: "PENDING_PAYMENT",
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtBuy: item.product.price
            }))
          }
        }
      });

      await tx.cartItem.deleteMany({ where: { userId: session.user.id } });

      return order;
    });

    revalidatePath("/cart");
    revalidatePath("/orders");
    return { success: true, orderId: result.id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function buyNow(productId: string, quantity: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const result = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId, deletedAt: null }
      });

      if (!product) throw new Error("Produk tidak ditemukan");
      if (product.stock < quantity) throw new Error("Stok tidak mencukupi");

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount: product.price * quantity,
          status: "PENDING_PAYMENT",
          items: {
            create: {
              productId: product.id,
              quantity: quantity,
              priceAtBuy: product.price
            }
          }
        }
      });

      return order;
    });

    revalidatePath("/orders");
    return { success: true, orderId: result.id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function processPayment(orderId: string) {
  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } }
      });

      if (!order) throw new Error("Order tidak ditemukan");
      if (order.status !== "PENDING_PAYMENT") throw new Error("Order sudah diproses");

      for (const item of order.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(`Stok ${item.product.name} tidak cukup`);
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" }
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    });

    revalidatePath("/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}