import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserIcon, XMarkIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Tenant {
  _id: string;
  name: string;
  citizenId: string;
  phone: string;
  email: string;
  moveInDate: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
  status: 'occupied' | 'vacant';
  price: number;
  bathrooms: number;
  showerRooms: number;
  tenant?: Tenant;
}

const isAxiosError = (error: unknown): error is { response?: { data?: { message?: string } } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    floor: 1,
    status: 'vacant' as 'occupied' | 'vacant',
    price: 3000000,
    bathrooms: 1,
    showerRooms: 1,
  });
  const [editRoom, setEditRoom] = useState({
    _id: '',
    roomNumber: '',
    floor: 1,
    status: 'vacant' as 'occupied' | 'vacant',
    price: 3000000,
    bathrooms: 1,
    showerRooms: 1,
  });
  const [newTenant, setNewTenant] = useState({
    name: '',
    citizenId: '',
    phone: '',
    email: '',
    moveInDate: new Date().toISOString().split('T')[0],
  });
  const [showVacantOnly, setShowVacantOnly] = useState(false);
  const [showOccupiedOnly, setShowOccupiedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://nhatro-backend.onrender.com/api/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedRooms: Room[] = response.data;
      const roomsWithDefaults = fetchedRooms
        .map((room) => ({
          ...room,
          price: room.price || 3000000,
          floor: room.floor || 1,
          bathrooms: room.bathrooms || 1,
          showerRooms: room.showerRooms || 1,
        }))
        .sort((a, b) => {
          // Sắp xếp tăng dần theo số phòng (chuyển về số để so sánh)
          const numA = parseInt(a.roomNumber, 10);
          const numB = parseInt(b.roomNumber, 10);
          return numA - numB;
        });
      setRooms(roomsWithDefaults);
      applyFilters(roomsWithDefaults);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || 'Lỗi khi lấy dữ liệu phòng!');
      } else {
        alert('Lỗi không xác định khi lấy dữ liệu phòng!');
      }
    }
  };

  const applyFilters = (roomsToFilter: Room[]) => {
    let filtered = roomsToFilter;

    if (showVacantOnly) {
      filtered = filtered.filter((room) => room.status === 'vacant');
    } else if (showOccupiedOnly) {
      filtered = filtered.filter((room) => room.status === 'occupied');
    }

    filtered = filtered.filter(
      (room) => room.price >= priceRange.min && room.price <= (priceRange.max || Infinity)
    );

    setFilteredRooms(filtered);
  };

  useEffect(() => {
    setLoading(true);
    fetchRooms().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    applyFilters(rooms);
  }, [showVacantOnly, showOccupiedOnly, priceRange, rooms]);

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleAddRoom = async () => {
    if (!newRoom.roomNumber || newRoom.price <= 0 || newRoom.floor <= 0 || newRoom.bathrooms < 1 || newRoom.showerRooms < 1) {
      alert('Vui lòng nhập số phòng, tầng, giá phòng, số nhà vệ sinh và số nhà tắm hợp lệ!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://nhatro-backend.onrender.com/api/rooms',
        newRoom,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRooms();
      setIsAddRoomModalOpen(false);
      setNewRoom({ roomNumber: '', floor: 1, status: 'vacant', price: 3000000, bathrooms: 1, showerRooms: 1 });
      alert('Thêm phòng thành công!');
    } catch (err) {
      console.error('Error adding room:', err);
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || 'Thêm phòng thất bại!');
      } else {
        alert('Lỗi không xác định khi thêm phòng!');
      }
    }
  };

  const handleEditRoomModal = (room: Room) => {
    setEditRoom({
      _id: room._id,
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: room.status,
      price: room.price,
      bathrooms: room.bathrooms,
      showerRooms: room.showerRooms,
    });
    setIsEditRoomModalOpen(true);
  };

  const handleEditRoom = async () => {
    if (!editRoom.roomNumber || editRoom.price <= 0 || editRoom.floor <= 0 || editRoom.bathrooms < 1 || editRoom.showerRooms < 1) {
      alert('Vui lòng nhập số phòng, tầng, giá phòng, số nhà vệ sinh và số nhà tắm hợp lệ!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://nhatro-backend.onrender.com/api/rooms/${editRoom._id}`,
        {
          roomNumber: editRoom.roomNumber,
          floor: editRoom.floor,
          status: editRoom.status,
          price: editRoom.price,
          bathrooms: editRoom.bathrooms,
          showerRooms: editRoom.showerRooms,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRooms();
      setIsEditRoomModalOpen(false);
      alert('Cập nhật phòng thành công!');
    } catch (err) {
      console.error('Error updating room:', err);
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || 'Cập nhật phòng thất bại!');
      } else {
        alert('Lỗi không xác định khi cập nhật phòng!');
      }
    }
  };

  const handleDeleteRoom = async (room: Room) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa phòng ${room.roomNumber}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://nhatro-backend.onrender.com/api/rooms/${room._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRooms();
      alert('Xóa phòng thành công!');
    } catch (err) {
      console.error('Error deleting room:', err);
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || 'Xóa phòng thất bại!');
      } else {
        alert('Lỗi không xác định khi xóa phòng!');
      }
    }
  };

  const handleAddTenant = async () => {
    if (!selectedRoom) {
      alert('Không có phòng được chọn!');
      return;
    }
    if (!newTenant.name || !newTenant.citizenId || !newTenant.phone || !newTenant.moveInDate) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc: Họ tên, CCCD, SĐT, Ngày thuê!');
      return;
    }

    const moveInDate = new Date(newTenant.moveInDate);
    if (isNaN(moveInDate.getTime())) {
      alert('Ngày thuê không hợp lệ!');
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    const citizenIdRegex = /^[0-9]{9,12}$/;
    if (!phoneRegex.test(newTenant.phone)) {
      alert('Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.');
      return;
    }
    if (!citizenIdRegex.test(newTenant.citizenId)) {
      alert('CCCD không hợp lệ! Vui lòng nhập 9-12 chữ số.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Không tìm thấy token! Vui lòng đăng nhập lại.');
        return;
      }

      console.log('Selected Room ID:', selectedRoom._id);
      const roomResponse = await axios.get(`https://nhatro-backend.onrender.com/api/rooms/${selectedRoom._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const roomData: Room = roomResponse.data;
      if (roomData.status === 'occupied') {
        alert('Phòng đã có người thuê! Vui lòng chọn phòng trống.');
        return;
      }

      console.log('Dữ liệu gửi đi:', {
        name: newTenant.name,
        citizenId: newTenant.citizenId,
        phone: newTenant.phone,
        email: newTenant.email,
        room: selectedRoom._id,
        moveInDate: moveInDate,
      });

      await axios.post(
        'https://nhatro-backend.onrender.com/api/tenants',
        {
          name: newTenant.name,
          citizenId: newTenant.citizenId,
          phone: newTenant.phone,
          email: newTenant.email,
          room: selectedRoom._id,
          moveInDate: moveInDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRooms();
      setIsAddTenantModalOpen(false);
      setNewTenant({
        name: '',
        citizenId: '',
        phone: '',
        email: '',
        moveInDate: new Date().toISOString().split('T')[0],
      });
      alert('Thêm người thuê thành công!');
    } catch (err) {
      console.error('Error adding tenant:', err);
      if (isAxiosError(err)) {
        console.log('Thông báo lỗi backend:', err.response?.data?.message);
        alert(err.response?.data?.message || 'Thêm người thuê thất bại!');
      } else {
        alert('Lỗi không xác định khi thêm người thuê!');
      }
    }
  };

  const handleAddTenantModal = (room: Room) => {
    setSelectedRoom(room);
    setIsAddTenantModalOpen(true);
  };

  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const floor = room.floor;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  const floors = Object.keys(groupedRooms)
    .map(Number)
    .sort((a, b) => a - b);

  if (loading) {
    return <div className="p-4">Đang tải...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý phòng</h2>
        <button
          onClick={() => setIsAddRoomModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-md transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm phòng mới
        </button>
      </div>

      <div className="flex flex-wrap items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showVacantOnly}
            onChange={(e) => {
              setShowVacantOnly(e.target.checked);
              if (e.target.checked) setShowOccupiedOnly(false);
            }}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label className="text-gray-700">Chỉ hiển thị phòng trống</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOccupiedOnly}
            onChange={(e) => {
              setShowOccupiedOnly(e.target.checked);
              if (e.target.checked) setShowVacantOnly(false);
            }}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label className="text-gray-700">Chỉ hiển thị phòng đã thuê</label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">Lọc theo giá (VNĐ):</label>
          <input
            type="number"
            placeholder="Tối thiểu"
            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
            className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Tối đa"
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || Infinity })}
            className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {floors.length > 0 ? (
        floors.map((floor) => (
          <motion.div
            key={floor}
            className="bg-blue-50 p-5 rounded-lg shadow-md mb-6 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Tầng {floor} ({groupedRooms[floor].length} phòng)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {groupedRooms[floor].map((room) => (
                <motion.div
                  key={room._id}
                  className="bg-blue-100 p-2 rounded-lg shadow relative hover:shadow-lg transition-shadow duration-300 border border-blue-200"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-xs font-semibold text-gray-800">Phòng {room.roomNumber}</h4>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    Giá: {room.price.toLocaleString('vi-VN')} VNĐ/tháng
                  </p>
                  <p className="text-[10px] text-gray-600">Nhà vệ sinh: {room.bathrooms}</p>
                  <p className="text-[10px] text-gray-600">Nhà tắm: {room.showerRooms}</p>
                  <div className="flex items-center mt-0.5">
                    <div
                      className={`h-2 w-2 rounded-full mr-1 ${
                        room.status === 'occupied' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    ></div>
                    <p className="text-[10px] text-gray-600">{room.status === 'occupied' ? 'Đang thuê' : 'Trống'}</p>
                  </div>
                  {room.status === 'occupied' && room.tenant && (
                    <div className="group relative mt-0.5">
                      <div className="flex items-center">
                        <UserIcon className="h-3 w-3 mr-0.5 text-gray-600" />
                        <p className="text-[10px] text-gray-600">{room.tenant.name}</p>
                      </div>
                      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-[10px] p-1 rounded shadow-lg z-10">
                        <p>Tên: {room.tenant.name}</p>
                        <p>SĐT: {room.tenant.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-1 flex space-x-1 flex-wrap">
                    {room.status === 'vacant' ? (
                      <button
                        onClick={() => handleAddTenantModal(room)}
                        className="bg-blue-600 text-white px-1 py-0.5 text-[10px] rounded hover:bg-blue-700 transition-colors"
                      >
                        Thêm người thuê
                      </button>
                    ) : (
                      <button
                        onClick={() => handleViewDetails(room)}
                        className="bg-blue-600 text-white px-1 py-0.5 text-[10px] rounded hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                    )}
                    <button
                      onClick={() => handleEditRoomModal(room)}
                      className="bg-yellow-500 text-white px-1 py-0.5 text-[10px] rounded hover:bg-yellow-600 transition-colors"
                    >
                      <PencilIcon className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room)}
                      className="bg-red-500 text-white px-1 py-0.5 text-[10px] rounded hover:bg-red-600 transition-colors"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-600">Không có phòng nào để hiển thị.</p>
      )}

      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-blue-50 p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chi tiết phòng {selectedRoom.roomNumber}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <p><strong>Tầng:</strong> {selectedRoom.floor}</p>
            <p><strong>Giá:</strong> {selectedRoom.price.toLocaleString('vi-VN')} VNĐ/tháng</p>
            <p><strong>Nhà vệ sinh:</strong> {selectedRoom.bathrooms}</p>
            <p><strong>Nhà tắm:</strong> {selectedRoom.showerRooms}</p>
            <p><strong>Trạng thái:</strong> {selectedRoom.status === 'occupied' ? 'Đang thuê' : 'Trống'}</p>
            {selectedRoom.status === 'occupied' && selectedRoom.tenant && (
              <>
                <p><strong>Người thuê:</strong> {selectedRoom.tenant.name}</p>
                <p><strong>SĐT:</strong> {selectedRoom.tenant.phone}</p>
              </>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </motion.div>
        </div>
      )}

      {isAddRoomModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-blue-50 p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm phòng mới</h3>
              <button onClick={() => setIsAddRoomModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Số phòng (VD: 101, 201) *</label>
                <input
                  type="text"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Tầng *</label>
                <input
                  type="number"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Trạng thái</label>
                <select
                  value={newRoom.status}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, status: e.target.value as 'occupied' | 'vacant' })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  disabled
                >
                  <option value="vacant">Trống</option>
                  <option value="occupied">Đang thuê</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Giá phòng (VNĐ/tháng) *</label>
                <input
                  type="number"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({ ...newRoom, price: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700">Số nhà vệ sinh *</label>
                <input
                  type="number"
                  value={newRoom.bathrooms}
                  onChange={(e) => setNewRoom({ ...newRoom, bathrooms: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Số nhà tắm *</label>
                <input
                  type="number"
                  value={newRoom.showerRooms}
                  onChange={(e) => setNewRoom({ ...newRoom, showerRooms: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleAddRoom}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Thêm
              </button>
              <button
                onClick={() => setIsAddRoomModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isEditRoomModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-blue-50 p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Sửa thông tin phòng</h3>
              <button onClick={() => setIsEditRoomModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Số phòng *</label>
                <input
                  type="text"
                  value={editRoom.roomNumber}
                  onChange={(e) => setEditRoom({ ...editRoom, roomNumber: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Tầng *</label>
                <input
                  type="number"
                  value={editRoom.floor}
                  onChange={(e) => setEditRoom({ ...editRoom, floor: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Trạng thái</label>
                <select
                  value={editRoom.status}
                  onChange={(e) =>
                    setEditRoom({ ...editRoom, status: e.target.value as 'occupied' | 'vacant' })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  disabled
                >
                  <option value="vacant">Trống</option>
                  <option value="occupied">Đang thuê</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Giá phòng (VNĐ/tháng) *</label>
                <input
                  type="number"
                  value={editRoom.price}
                  onChange={(e) => setEditRoom({ ...editRoom, price: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700">Số nhà vệ sinh *</label>
                <input
                  type="number"
                  value={editRoom.bathrooms}
                  onChange={(e) => setEditRoom({ ...editRoom, bathrooms: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Số nhà tắm *</label>
                <input
                  type="number"
                  value={editRoom.showerRooms}
                  onChange={(e) => setEditRoom({ ...editRoom, showerRooms: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleEditRoom}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Cập nhật
              </button>
              <button
                onClick={() => setIsEditRoomModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isAddTenantModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-blue-50 p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm người thuê cho phòng {selectedRoom.roomNumber}</h3>
              <button onClick={() => setIsAddTenantModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Họ tên *</label>
                <input
                  type="text"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">CCCD *</label>
                <input
                  type="text"
                  value={newTenant.citizenId}
                  onChange={(e) => setNewTenant({ ...newTenant, citizenId: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">SĐT *</label>
                <input
                  type="text"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phòng</label>
                <input
                  type="text"
                  value={selectedRoom.roomNumber}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Ngày thuê *</label>
                <input
                  type="date"
                  value={newTenant.moveInDate}
                  onChange={(e) => setNewTenant({ ...newTenant, moveInDate: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleAddTenant}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Thêm
              </button>
              <button
                onClick={() => setIsAddTenantModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Rooms;