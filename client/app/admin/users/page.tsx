export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý Người dùng</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Tên</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Vai trò</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Nguyễn Văn A</td>
            <td className="border px-4 py-2">a@gmail.com</td>
            <td className="border px-4 py-2">Admin</td>
            <td className="border px-4 py-2">
              <button className="text-blue-600 mr-2">Sửa</button>
              <button className="text-red-600">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Thêm người dùng</button>
    </div>
  )
} 