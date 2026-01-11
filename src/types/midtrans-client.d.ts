declare module "midtrans-client" {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: process.env.MIDTRANS_SERVER_KEY!;
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!;
    });
    createTransaction(parameter: any): Promise<{
      token: string;
      redirect_url: string;
    }>;
    transaction: {
      notification(notificationBody: any): Promise<any>;
      status(orderId: string): Promise<any>;
    };
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey?: string;
    });
    charge(parameter: any): Promise<any>;
  }
}
