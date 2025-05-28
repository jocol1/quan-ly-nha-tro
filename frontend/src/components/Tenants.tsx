import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserIcon, XMarkIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Tenant {
  _id: string;
  name: string;
  citizenId: string;
  phone: string;
  email: string; // Thêm email
  room: {
    _id: string;
    roomNumber: string;
    floor: number;
    status: 'occupied' | 'vacant';
    price: number;
  };
  moveInDate: string;
}

const isAxiosError = (error: unknown): error is { response?: { data?: { message?: string } } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

const Tenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTenantModalOpen, setIsEditTenantModalOpen] = useState(false);
  const [editTenant, setEditTenant] = useState({
    _id: '',
    name: '',
    citizenId: '',
    phone: '',
    email: '', // Thêm email
    room: '',
    moveInDate: new Date().toISOString().split('T')[0],
  });
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tenants', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tenantsData: Tenant[] = response.data;
      setTenants(tenantsData);
      setFilteredTenants(tenantsData);

      const roomsResponse = await axios.get('http://localhost:5000/api/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const roomsData = roomsResponse.data;
      setAvailableRooms(roomsData.filter((room: any) => room.status === 'vacant'));
    } catch (err) {
      console.error('Error fetching tenants or rooms:', err);
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || 'Lỗi khi lấy dữ liệu!');
      } else {
        alert('Lỗi không xác định khi lấy dữ liệu!');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredTenants(tenants);
      return;
    }
    const filtered = tenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(query.toLowerCase()) ||
        tenant.citizenId.toLowerCase().includes(query.toLowerCase()) ||
        tenant.phone.toLowerCase().includes(query.toLowerCase()) ||
        tenant.email?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTenants(filtered);
  };

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleEditTenantModal = (tenant: Tenant) => {
    setEditTenant({
      _id: tenant._id,
      name: tenant.name,
      citizenId: tenant.citizenId,
      phone: tenant.phone,
      email: tenant.email || '', // Thêm email
      room: tenant.room?._id || '',
      moveInDate: tenant.moveInDate,
    });
    setIsEditTenantModalOpen(true);
  };

  const handleEditTenant = async () => {
    if (!editTenant.name || !editTenant.citizenId || !editTenant.phone || !editTenant.room || !editTenant.moveInDate) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tenants/${editTenant._id}`,
        {
          name: editTenant.name,
          citizenId: editTenant.citizenId,
          phone: editTenant.phone,
          email: editTenant.email, // Thêm email
          room: editTenant.room,
          moveInDate: editTenant.moveInDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchTenants();
      setIsEditTenantModalOpen(false);
      alert('Cập nhật người thuê thành công!');
    } catch (err) {
      console.error('Error updating tenant:', err);
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || 'Cập nhật người thuê thất bại!');
      } else {
        alert('Lỗi không xác định khi cập nhật người thuê!');
      }
    }
  };

  const handleDeleteTenant = async (tenant: Tenant) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người thuê ${tenant.name} với CCCD ${tenant.citizenId}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/tenants/citizen/${tenant.citizenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Response:', response.data);
      await fetchTenants();
      alert('Xóa người thuê thành công!');
    } catch (err) {
      console.error('Error deleting tenant:', err);
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || 'Xóa người thuê thất bại! Vui lòng kiểm tra console để biết chi tiết.');
      } else {
        alert('Lỗi không xác định khi xóa người thuê! Vui lòng kiểm tra console.');
      }
    }
  };

  if (loading) {
    return <div className="p-4">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý người thuê</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, CCCD, hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {filteredTenants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map((tenant) => (
            <motion.div
              key={tenant._id}
              className="bg-white p-4 rounded-lg shadow relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold">{tenant.name}</h3>
              <p className="text-gray-600 mt-1"><strong>CCCD:</strong> {tenant.citizenId}</p>
              <p className="text-gray-600"><strong>SĐT:</strong> {tenant.phone}</p>
              <p className="text-gray-600"><strong>Email:</strong> {tenant.email || 'Chưa có'}</p>
              <p className="text-gray-600">
                <strong>Phòng:</strong> {tenant.room?.roomNumber || 'Không xác định'} (Giá: {(tenant.room?.price || 0).toLocaleString('vi-VN')} VNĐ/tháng)
              </p>
              <p className="text-gray-600"><strong>Ngày thuê:</strong> {new Date(tenant.moveInDate).toLocaleDateString('vi-VN')}</p>
              <div className="mt-4 flex space-x-2 flex-wrap">
                <button
                  onClick={() => handleViewDetails(tenant)}
                  className="bg-dark-blue text-white px-3 py-1 rounded hover:bg-green-success"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => handleEditTenantModal(tenant)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteTenant(tenant)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p>Không có người thuê nào khớp với tìm kiếm.</p>
      )}

      {isModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chi tiết người thuê: {selectedTenant.name}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <p><strong>Tên:</strong> {selectedTenant.name}</p>
            <p><strong>CCCD:</strong> {selectedTenant.citizenId}</p>
            <p><strong>SĐT:</strong> {selectedTenant.phone}</p>
            <p><strong>Email:</strong> {selectedTenant.email || 'Chưa có'}</p>
            <p>
              <strong>Phòng:</strong> {selectedTenant.room?.roomNumber || 'Không xác định'} (Giá: {(selectedTenant.room?.price || 0).toLocaleString('vi-VN')} VNĐ/tháng)
            </p>
            <p><strong>Ngày thuê:</strong> {new Date(selectedTenant.moveInDate).toLocaleDateString('vi-VN')}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-dark-blue text-white px-4 py-2 rounded hover:bg-green-success"
            >
              Đóng
            </button>
          </motion.div>
        </div>
      )}

      {isEditTenantModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Sửa thông tin người thuê</h3>
              <button onClick={() => setIsEditTenantModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Họ tên *</label>
                <input
                  type="text"
                  value={editTenant.name}
                  onChange={(e) => setEditTenant({ ...editTenant, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">CCCD *</label>
                <input
                  type="text"
                  value={editTenant.citizenId}
                  onChange={(e) => setEditTenant({ ...editTenant, citizenId: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">SĐT *</label>
                <input
                  type="text"
                  value={editTenant.phone}
                  onChange={(e) => setEditTenant({ ...editTenant, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={editTenant.email}
                  onChange={(e) => setEditTenant({ ...editTenant, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phòng *</label>
                <select
                  value={editTenant.room}
                  onChange={(e) => setEditTenant({ ...editTenant, room: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Chọn phòng</option>
                  {availableRooms.map((room: any) => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber} (Giá: {room.price.toLocaleString('vi-VN')} VNĐ/tháng)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Ngày thuê *</label>
                <input
                  type="date"
                  value={editTenant.moveInDate}
                  onChange={(e) => setEditTenant({ ...editTenant, moveInDate: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleEditTenant}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Cập nhật
              </button>
              <button
                onClick={() => setIsEditTenantModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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

export default Tenants;