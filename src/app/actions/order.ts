// app/actions/order.ts
"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

export async function createOrder(cartItems: { productId: string, quantity: number }[]) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const result = await db.$transaction(async (tx) => {
      let totalAmount = 0;

      // 1. Validasi Stok & Hitung Total
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Stok ${product?.name || 'produk'} tidak mencukupi`);
        }

        // 2. Kurangi Stok Langsung (Booking)
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        totalAmount += product.price * item.quantity;
      }

      // 3. Buat Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          status: "PENDING_PAYMENT",
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: 0, 
            }))
          }
        }
      });

      return newOrder;
    });

    return { success: true, orderId: result.id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}