import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, UsersIcon, ChartPieIcon, CurrencyDollarIcon, BellIcon } from '@heroicons/react/24/outline';
import BarChart from './BarChart';
import PieChart from './PieChart';

interface Room {
  _id: string;
  roomNumber: string;
  status: 'occupied' | 'vacant';
  price: number;
  tenant?: {
    name: string;
    isPaid?: boolean;
    totalElectricity?: number;
    totalWater?: number;
  };
}

const Dashboard: React.FC = () => {
  // 1. THIẾT LẬP DỮ LIỆU TĨNH ĐỂ HIỂN THỊ NGAY
  const staticRooms: Room[] = [
    { _id: '1', roomNumber: '101', status: 'occupied', price: 3000000, tenant: { name: 'Nguyễn Văn A', isPaid: true } },
    { _id: '2', roomNumber: '102', status: 'vacant', price: 3200000 },
    { _id: '3', roomNumber: '201', status: 'occupied', price: 3500000, tenant: { name: 'Trần Thị B', isPaid: false } },
    { _id: '4', roomNumber: '202', status: 'occupied', price: 3500000, tenant: { name: 'Lê Văn C', isPaid: true } },
    { _id: '5', roomNumber: '301', status: 'vacant', price: 4000000 },
  ];

  const [rooms, setRooms] = useState<Room[]>(staticRooms);
  const [loading, setLoading] = useState(false); // Tắt loading mặc định

  // Giả lập load dữ liệu (có thể xóa nếu muốn hiện ngay lập tức)
  useEffect(() => {
    setLoading(false);
    setRooms(staticRooms);
  }, []);

  // 2. LOGIC TÍNH TOÁN DỰA TRÊN DỮ LIỆU TĨNH
  const totalRooms = rooms.length;
  const rentedRooms = rooms.filter(r => r.status === 'occupied').length;
  const totalTenants = rooms.filter(r => r.status === 'occupied' && r.tenant).length;
  
  const totalRoomRevenue = rooms
    .filter(r => r.status === 'occupied' && r.tenant?.isPaid)
    .reduce((sum, r) => sum + (r.price || 0), 0);

  // Số liệu điện nước giả lập (vì không có DB)
  const totalElectricityRevenue = 1250000;
  const totalWaterRevenue = 450000;
  const totalRevenue = totalRoomRevenue + totalElectricityRevenue + totalWaterRevenue;

  const unpaidRooms = rooms.filter(r => r.status === 'occupied' && r.tenant && !r.tenant.isPaid);

  const chartData = [
    { name: 'Đã thanh toán', value: rooms.filter(r => r.status === 'occupied' && r.tenant?.isPaid).length },
    { name: 'Chưa thanh toán', value: unpaidRooms.length },
  ];

  const now = new Date();
  const months = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  });

  const revenueData = months.map((month, idx) => ({
    month,
    revenue: idx === 4 ? totalRevenue : Math.floor(Math.random() * 10000000) + 15000000
  }));

  if (loading) {
    return <div className="p-8 text-center text-xl font-bold text-dark-blue">Đang khởi tạo Dashboard...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống (Chế độ Demo)</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card icon={<HomeIcon className="h-8 w-8 text-blue-600" />} label="Tổng số phòng" value={totalRooms} delay={0.1} />
        <Card icon={<UsersIcon className="h-8 w-8 text-green-600" />} label="Phòng đã thuê" value={rentedRooms} delay={0.2} />
        <Card icon={<ChartPieIcon className="h-8 w-8 text-purple-600" />} label="Người thuê" value={totalTenants} delay={0.3} />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col"
        >
          <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mb-2" />
          <p className="text-gray-500 text-sm">Doanh thu tạm tính</p>
          <p className="text-lg font-bold text-green-600">{totalRevenue.toLocaleString('vi-VN')} đ</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center"
        >
          <BellIcon className={`h-8 w-8 mr-2 ${unpaidRooms.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
          <div>
            <p className="text-gray-500 text-sm">Cảnh báo</p>
            <p className="text-sm font-semibold">{unpaidRooms.length} phòng nợ tiền</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Trạng thái thanh toán</h3>
          <div className="h-64 flex items-center justify-center">
             <PieChart data={chartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Doanh thu 5 tháng gần nhất</h3>
          <div className="h-64">
            <BarChart data={revenueData} xKey="month" yKey="revenue" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Component con để tái sử dụng cho các thẻ Card
const Card = ({ icon, label, value, delay }: any) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center"
  >
    <div className="mr-4">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;
