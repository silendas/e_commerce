import db from "@/lib/db";
import UserClient from "./UserClient";

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const query = resolvedSearchParams.q || "";
  const pageSize = 10;

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <UserClient 
      initialUsers={users} 
      currentPage={page} 
      totalPages={totalPages} 
      searchQuery={query}
    />
  );
}