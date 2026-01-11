import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createHash } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    if (order_id.includes("payment_notif_test")) {
      console.log("🛠️ Midtrans Test Connection: Success");
      return NextResponse.json({ message: "Test notification ignored" });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const payloadForHash = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const generatedHash = createHash("sha512")
      .update(payloadForHash)
      .digest("hex");

    if (generatedHash !== signature_key) {
      console.error("❌ Invalid Signature! Seseorang mencoba memanipulasi data.");
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    console.log(`--- 💬 Webhook Received: Order ${order_id} [${transaction_status}] ---`);

    const isSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    const isFailed =
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire";

    if (isSuccess) {
      await db.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: order_id },
          include: { items: true },
        });

        if (!order) throw new Error(`Order ${order_id} tidak ditemukan di database`);
        
        if (order.status === "PAID") return;

        await tx.order.update({
          where: { id: order_id },
          data: { 
            status: "PAID",
            paymentType: payment_type
          },
        });

        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      });
      console.log(`✅ Order ${order_id} BERHASIL diupdate ke PAID via ${payment_type}.`);
    } 
    
    else if (isFailed) {
      await db.order.update({
        where: { id: order_id },
        data: { status: "CANCELLED" },
      });
      console.log(`🚨 Order ${order_id} dibatalkan atau expired.`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("❌ Webhook Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}