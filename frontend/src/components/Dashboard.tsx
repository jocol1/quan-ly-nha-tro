import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { HomeIcon, UsersIcon, ChartPieIcon, CurrencyDollarIcon, BellIcon } from '@heroicons/react/24/outline';
// Giả sử bạn đã có BarChart component
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get<Room[]>('http://localhost:5000/api/rooms');
        setRooms(data);
      } catch (err) {
        alert('Lỗi khi tải dữ liệu phòng!');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Tổng số phòng
  const totalRooms = rooms.length;
  // Số phòng đã cho thuê
  const rentedRooms = rooms.filter(r => r.status === 'occupied').length;
  // Số người thuê (mỗi phòng 1 người)
  const totalTenants = rooms.filter(r => r.status === 'occupied' && r.tenant).length;
  // Doanh thu: chỉ tính phòng đã thanh toán
  const totalRoomRevenue = rooms
    .filter(r => r.status === 'occupied' && r.tenant?.isPaid)
    .reduce((sum, r) => sum + (r.price || 0), 0);
  const totalElectricityRevenue = Number(localStorage.getItem('totalElectricityRevenue') || 0);
  const totalWaterRevenue = Number(localStorage.getItem('totalWaterRevenue') || 0);
  const totalRevenue = totalRoomRevenue + totalElectricityRevenue + totalWaterRevenue;
  // Cảnh báo: phòng chưa thanh toán
  const unpaidRooms = rooms.filter(r => r.status === 'occupied' && r.tenant && !r.tenant.isPaid);

  // Dữ liệu cho biểu đồ (ví dụ: số phòng đã thanh toán và chưa thanh toán)
  const chartData = [
    { name: 'Đã thanh toán', value: rooms.filter(r => r.status === 'occupied' && r.tenant?.isPaid).length },
    { name: 'Chưa thanh toán', value: unpaidRooms.length },
  ];

  // Dữ liệu cho biểu đồ doanh thu từng tháng (giả lập, tháng này là thật)
  const now = new Date();
  const months = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  });

  const revenueData = months.map((month, idx) => ({
    month,
    revenue: idx === 4 ? totalRevenue : Math.floor(Math.random() * 20000000) + 10000000
  }));

  if (loading) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div className="bg-white p-4 rounded-lg shadow flex items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <HomeIcon className="h-8 w-8 text-dark-blue mr-2" />
          <div>
            <p className="text-gray-600">Tổng số phòng</p>
            <p className="text-xl font-bold">{totalRooms}</p>
          </div>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-lg shadow flex items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <UsersIcon className="h-8 w-8 text-dark-blue mr-2" />
          <div>
            <p className="text-gray-600">Phòng đã cho thuê</p>
            <p className="text-xl font-bold">{rentedRooms}</p>
          </div>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-lg shadow flex items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ChartPieIcon className="h-8 w-8 text-dark-blue mr-2" />
          <div>
            <p className="text-gray-600">Người thuê</p>
            <p className="text-xl font-bold">{totalTenants}</p>
          </div>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-lg shadow flex flex-col items-start"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <CurrencyDollarIcon className="h-8 w-8 text-dark-blue mb-2" />
          <div>
            <p className="text-gray-600 font-semibold mb-1">Doanh thu đã thu</p>
            <div className="text-sm">
              <div>Tiền phòng: <span className="font-bold text-green-700">{totalRoomRevenue.toLocaleString('vi-VN')} VNĐ</span></div>
              <div>Tiền điện: <span className="font-bold text-blue-700">{totalElectricityRevenue.toLocaleString('vi-VN')} VNĐ</span></div>
              <div>Tiền nước: <span className="font-bold text-cyan-700">{totalWaterRevenue.toLocaleString('vi-VN')} VNĐ</span></div>
              <div className="mt-1">Tổng: <span className="font-bold text-green-600">{totalRevenue.toLocaleString('vi-VN')} VNĐ</span></div>
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-lg shadow flex items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <BellIcon className="h-8 w-8 text-red-500 mr-2" />
          <div>
            <p className="text-gray-600">Cảnh báo</p>
            {unpaidRooms.length === 0 ? (
              <p className="text-sm text-green-600">Tất cả đã thanh toán</p>
            ) : (
              <ul className="text-sm text-red-500">
                {unpaidRooms.slice(0, 3).map(r => (
                  <li key={r._id}>Phòng {r.roomNumber} chưa thanh toán</li>
                ))}
                {unpaidRooms.length > 3 && <li>...</li>}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      {/* Biểu đồ trạng thái thanh toán */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">Biểu đồ trạng thái thanh toán</h3>
        <PieChart data={chartData} />
      </div>

      {/* Biểu đồ doanh thu từng tháng */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">Biểu đồ doanh thu 6 tháng gần nhất</h3>
        <BarChart
          data={revenueData}
          xKey="month"
          yKey="revenue"
        />
      </div>
    </motion.div>
  );
};

export default Dashboard;