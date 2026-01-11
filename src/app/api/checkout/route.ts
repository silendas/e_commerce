import { NextResponse } from 'next/server';
import db from "@/lib/db";
import { auth } from "@/auth";
import Midtrans from 'midtrans-client';

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string
});

export async function POST(req: Request) {
  try {
    // 1. Ambil session dari NextAuth
    const session = await auth();
    
    // Proteksi: Jika tidak ada session, tolak akses
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id; // ID didapat dari session (aman)
    const { cartItems, totalAmount } = await req.json();

    // 2. Buat Order di Database
    const newOrder = await db.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING_PAYMENT',
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtBuy: item.price
          }))
        }
      },
      // Include user untuk ambil email/nama buat dikirim ke Midtrans
      include: { user: true }
    });

    // 3. Siapkan Parameter Midtrans
    let parameter = {
      transaction_details: {
        order_id: newOrder.id,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: newOrder.user.name,
        email: newOrder.user.email,
      },
      enabled_payments: ["credit_card", "bank_transfer", "gopay", "shopeepay", "other_va"],
    };

    // 4. Request Snap Token
    const transaction = await snap.createTransaction(parameter);
    
    await db.order.update({
      where: { id: newOrder.id },
      data: { snapToken: transaction.token }
    });

    return NextResponse.json({ token: transaction.token, orderId: newOrder.id });

  } catch (error: any) {
    console.error("MIDTRANS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}