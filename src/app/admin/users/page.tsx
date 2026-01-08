import db from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    where: { deletedAt: null },
    orderBy: { role: "asc" }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-bold mb-6">Daftar Pengguna</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left bg-gray-50">
            <th className="p-3">Nama</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-3">{u.name}</td>
              <td className="p-3 text-gray-600">{u.email}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}