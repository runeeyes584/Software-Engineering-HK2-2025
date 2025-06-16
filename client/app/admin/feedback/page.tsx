export default function FeedbackPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý Phản hồi</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Khách hàng</th>
            <th className="border px-4 py-2">Nội dung</th>
            <th className="border px-4 py-2">Ngày gửi</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Nguyễn Văn C</td>
            <td className="border px-4 py-2">Dịch vụ rất tốt!</td>
            <td className="border px-4 py-2">05/07/2024</td>
            <td className="border px-4 py-2">
              <button className="text-blue-600 mr-2">Xem</button>
              <button className="text-red-600">Ẩn</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
} 