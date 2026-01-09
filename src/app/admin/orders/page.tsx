import db from "@/lib/db";
import OrderClient from "./OrderClient";

export default async function AdminOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    q?: string; 
    status?: string; 
    start?: string; 
    end?: string 
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = 10;

  const query = resolvedSearchParams.q || "";
  const statusFilter = resolvedSearchParams.status || undefined;
  
  const dateFilter = {
    ...(resolvedSearchParams.start && { gte: new Date(resolvedSearchParams.start) }),
    ...(resolvedSearchParams.end && { lte: new Date(`${resolvedSearchParams.end}T23:59:59`) }),
  };

  const [orders, totalCount] = await Promise.all([
    db.order.findMany({
      where: {
        AND: [
          {
            OR: [
              { id: { contains: query, mode: "insensitive" } },
              { user: { name: { contains: query, mode: "insensitive" } } },
              { user: { email: { contains: query, mode: "insensitive" } } },
            ],
          },
          statusFilter ? { status: statusFilter as any } : {},
          (resolvedSearchParams.start || resolvedSearchParams.end) ? { createdAt: dateFilter } : {},
        ],
      },
      include: {
        user: { 
          select: { 
            name: true, 
            email: true 
          } 
        },
        items: {
          include: {
            product: true
          }
        },
        _count: {
          select: { items: true }
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    db.order.count({
      where: {
        AND: [
          {
            OR: [
              { id: { contains: query, mode: "insensitive" } },
              { user: { name: { contains: query, mode: "insensitive" } } },
              { user: { email: { contains: query, mode: "insensitive" } } },
            ],
          },
          statusFilter ? { status: statusFilter as any } : {},
          (resolvedSearchParams.start || resolvedSearchParams.end) ? { createdAt: dateFilter } : {},
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <OrderClient 
      initialOrders={orders} 
      currentPage={page} 
      totalPages={totalPages} 
      searchQuery={query}
    />
  );
}