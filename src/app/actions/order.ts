"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
// @ts-ignores
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

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

      // 1. Buat Order di Database dulu (tanpa token dulu)
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

      // 2. Minta Snap Token ke Midtrans
      const parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: totalAmount,
        },
        customer_details: {
          first_name: session.user.name,
          email: session.user.email,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      
      // 3. Update Order dengan Snap Token yang didapat
      await tx.order.update({
        where: { id: order.id },
        data: { snapToken: transaction.token }
      });

      await tx.cartItem.deleteMany({ where: { userId: session.user.id } });

      return order;
    });

    revalidatePath("/orders");
    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error("MIDTRANS ERROR:", error);
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

      const totalAmount = product.price * quantity;

      // 1. Buat Order
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
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

      // 2. Minta Snap Token
      const parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: totalAmount,
        },
        customer_details: {
          first_name: session.user.name,
          email: session.user.email,
        },
      };

      const transaction = await snap.createTransaction(parameter);

      // 3. Update Token
      await tx.order.update({
        where: { id: order.id },
        data: { snapToken: transaction.token }
      });

      return order;
    });

    revalidatePath("/orders");
    return { success: true, orderId: result.id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: "PAID" | "COMPLETED" | "CANCELLED") {
  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!order) throw new Error("Order tidak ditemukan");

      if (status === "PAID" && order.status === "PENDING_PAYMENT") {
        for (const item of order.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          
          if (!product || product.stock < item.quantity) {
            throw new Error(`Stok produk ${product?.name || ""} tidak mencukupi!`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      if (status === "CANCELLED" && order.status === "PAID") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status }
      });
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengupdate status");
  }
}