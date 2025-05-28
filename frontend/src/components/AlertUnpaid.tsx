import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from "react";
import axios from "axios";
import emailjs from 'emailjs-com';

interface Tenant {
  name: string;
  citizenId: string;
  isPaid?: boolean;
  email?: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  tenant?: Tenant;
}

const AlertUnpaid = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms");
        setRooms(response.data);
      } catch (err) {
        alert("Lỗi khi lấy dữ liệu phòng!");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const today = new Date();
  const isAfter26 = today.getDate() > 26;

  const unpaidRooms =
    isAfter26
      ? rooms.filter(
          (room) =>
            room.tenant &&
            room.tenant.isPaid === false
        )
      : [];

  const sendReminderEmail = async (tenantEmail: string, tenantName: string, roomNumber: string) => {
    if (!tenantEmail) {
      alert('Người thuê chưa có email!');
      return;
    }
    try {
      await emailjs.send(
        'service_pwyposb', // Thay bằng service ID của bạn
        'template_uherzex', // Thay bằng template ID của bạn
        {
          to_email: tenantEmail,
          tenant_name: tenantName,
          room_number: roomNumber,
        },
        'TLbN0IeyPcLfS1k7E' // Thay bằng user ID của bạn
      );
      alert('Đã gửi email nhắc nhở!');
    } catch (error) {
      alert('Gửi email thất bại!');
    }
  };

  if (!isAfter26) {
    return (
      <div className="p-6 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg">
        <ExclamationTriangleIcon className="h-7 w-7 text-blue-500" />
        <span className="text-blue-700 font-medium">
          Chỉ hiển thị cảnh báo sau ngày 26 hàng tháng.
        </span>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <ExclamationTriangleIcon className="h-7 w-7 text-red-500" />
        <h2 className="text-2xl font-bold text-red-600">
          Cảnh báo: Phòng chưa thanh toán sau ngày 26
        </h2>
      </div>
      {unpaidRooms.length === 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-center font-semibold">
          Tất cả các phòng đã thanh toán!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow text-sm">
            <thead>
              <tr className="bg-red-100 text-red-700">
                <th className="border p-2">Số phòng</th>
                <th className="border p-2">Người thuê</th>
                <th className="border p-2">CCCD</th>
                <th className="border p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {unpaidRooms.map((room) => (
                <tr key={room._id} className="hover:bg-red-50">
                  <td className="border p-2 font-semibold">{room.roomNumber}</td>
                  <td className="border p-2">{room.tenant?.name}</td>
                  <td className="border p-2">{room.tenant?.citizenId}</td>
                  <td className="border p-2 flex items-center gap-2">
                    {room.tenant?.email || "Không có"}
                    {room.tenant?.email && (
                      <button
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                        onClick={() =>
                          sendReminderEmail(room.tenant!.email!, room.tenant!.name!, room.roomNumber)
                        }
                      >
                        Nhắc đóng tiền
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-sm text-gray-500">
            Tổng cộng: <span className="font-bold text-red-600">{unpaidRooms.length}</span> phòng chưa thanh toán.
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertUnpaid;