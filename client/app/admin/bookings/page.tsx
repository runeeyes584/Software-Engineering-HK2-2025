export default function BookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý Đặt chỗ</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Khách hàng</th>
            <th className="border px-4 py-2">Tour</th>
            <th className="border px-4 py-2">Ngày đặt</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Nguyễn Văn B</td>
            <td className="border px-4 py-2">Tour Đà Lạt</td>
            <td className="border px-4 py-2">10/07/2024</td>
            <td className="border px-4 py-2">Đã xác nhận</td>
            <td className="border px-4 py-2">
              <button className="text-blue-600 mr-2">Xem</button>
              <button className="text-red-600">Hủy</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
} 