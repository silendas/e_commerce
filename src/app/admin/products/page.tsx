import db from "@/lib/db";
import ProductClient from "./ProductClient";

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const query = resolvedSearchParams.q || "";
  const pageSize = 10;

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    db.product.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <ProductClient 
      initialProducts={products} 
      currentPage={page} 
      totalPages={totalPages} 
      searchQuery={query}
    />
  );
}