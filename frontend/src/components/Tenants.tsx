import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, XMarkIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Tenant {
  _id: string;
  name: string;
  citizenId: string;
  phone: string;
  email?: string;
  room?: {
    _id: string;
    roomNumber: string;
  };
  moveInDate: string;
}

const Tenants = () => {
  // DỮ LIỆU TĨNH MẪU - Danh sách người thuê demo
  const staticTenants: Tenant[] = [
    {
      _id: 't1',
      name: 'Nguyễn Văn A',
      citizenId: '079123456789',
      phone: '0901234567',
      email: 'vana@gmail.com',
      room: { _id: 'r1', roomNumber: '101' },
      moveInDate: '2026-01-10'
    },
    {
      _id: 't2',
      name: 'Trần Thị B',
      citizenId: '079987654321',
      phone: '0907654321',
      email: 'thib@gmail.com',
      room: { _id: 'r3', roomNumber: '201' },
      moveInDate: '2026-02-15'
    }
  ];

  const [tenants, setTenants] = useState<Tenant[]>(staticTenants);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>(staticTenants);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Xử lý tìm kiếm tĩnh
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredTenants(tenants);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.citizenId.includes(query) ||
        t.phone.includes(query) ||
        t.room?.roomNumber.includes(query)
    );
    setFilteredTenants(filtered);
  };

  if (loading) {
    return <div className="p-8 text-center text-xl font-bold">Đang tải danh sách người thuê...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản Lý Người Thuê (Demo)</h2>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center space-x-2">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, CCCD, SĐT hoặc số phòng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue outline-none"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người thuê</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày dời vào</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTenants.map((tenant) => (
              <tr key={tenant._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">{tenant.name}</div>
                      <div className="text-xs text-gray-500">CCCD: {tenant.citizenId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    Phòng {tenant.room?.roomNumber}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{tenant.phone}</div>
                  <div className="text-xs text-gray-500">{tenant.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tenant.moveInDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => { setSelectedTenant(tenant); setIsModalOpen(true); }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Chi tiết
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTenants.length === 0 && (
          <div className="p-8 text-center text-gray-500">Không tìm thấy người thuê nào.</div>
        )}
      </div>

      {/* Modal chi tiết */}
      {isModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Chi tiết người thuê</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase mb-1">Họ và tên</p>
                <p className="font-bold text-lg text-gray-900">{selectedTenant.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase mb-1">Số điện thoại</p>
                  <p className="font-bold text-gray-900">{selectedTenant.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase mb-1">Phòng đang thuê</p>
                  <p className="font-bold text-green-700">{selectedTenant.room?.roomNumber}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase mb-1">Căn cước công dân</p>
                <p className="font-bold text-gray-900">{selectedTenant.citizenId}</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-8 bg-dark-blue text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;
