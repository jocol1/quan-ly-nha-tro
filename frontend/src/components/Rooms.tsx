import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, XMarkIcon, TrashIcon, PencilIcon, PlusIcon, HomeIcon } from '@heroicons/react/24/outline';

// Định nghĩa kiểu dữ liệu cho Phòng
interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
  status: 'occupied' | 'vacant';
  price: number;
  bathrooms: number;
  showerRooms: number;
}

const Rooms = () => {
  // DỮ LIỆU TĨNH MẪU - Bạn có thể sửa thông tin ở đây
  const staticRooms: Room[] = [
    { _id: '1', roomNumber: '101', floor: 1, status: 'occupied', price: 3000000, bathrooms: 1, showerRooms: 1 },
    { _id: '2', roomNumber: '102', floor: 1, status: 'vacant', price: 3200000, bathrooms: 1, showerRooms: 1 },
    { _id: '3', roomNumber: '201', floor: 2, status: 'occupied', price: 3500000, bathrooms: 1, showerRooms: 1 },
    { _id: '4', roomNumber: '202', floor: 2, status: 'vacant', price: 3500000, bathrooms: 1, showerRooms: 1 },
    { _id: '5', roomNumber: '301', floor: 3, status: 'vacant', price: 4000000, bathrooms: 2, showerRooms: 1 },
  ];

  const [rooms, setRooms] = useState<Room[]>(staticRooms);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Giả lập việc fetch dữ liệu
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRooms(staticRooms);
      setLoading(false);
    }, 500); // Tạo hiệu ứng load nhẹ cho chuyên nghiệp
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl font-semibold">Đang tải danh sách phòng...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Phòng (Chế độ Demo)</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition">
          <PlusIcon className="h-5 w-5 mr-2" /> Thêm phòng mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <motion.div
            key={room._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className={`p-1 ${room.status === 'occupied' ? 'bg-red-500' : 'bg-green-500'}`} />
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Phòng {room.roomNumber}</h3>
                  <p className="text-sm text-gray-500">Tầng {room.floor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  room.status === 'occupied' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {room.status === 'occupied' ? 'Đã thuê' : 'Trống'}
                </span>
              </div>

              <div className="space-y-2 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Giá thuê:</span>
                  <span className="font-semibold text-blue-600">{room.price.toLocaleString()} đ/tháng</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>WC/Tắm:</span>
                  <span>{room.bathrooms} WC - {room.showerRooms} Tắm</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedRoom(room); setIsModalOpen(true); }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Chi tiết
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal chi tiết đơn giản */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Thông tin Phòng {selectedRoom.roomNumber}</h2>
              <button onClick={() => setIsModalOpen(false)}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <p><strong>Trạng thái:</strong> {selectedRoom.status === 'occupied' ? 'Đã có người' : 'Phòng trống'}</p>
              <p><strong>Giá tiền:</strong> {selectedRoom.price.toLocaleString()} VNĐ</p>
              <p><strong>Vị trí:</strong> Tầng {selectedRoom.floor}</p>
              <p><strong>Tiện ích:</strong> Có {selectedRoom.bathrooms} nhà vệ sinh riêng.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-6 bg-dark-blue text-white py-3 rounded-xl font-bold shadow-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
