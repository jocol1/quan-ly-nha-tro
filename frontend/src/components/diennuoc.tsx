import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PencilIcon, EnvelopeIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import * as XLSX from 'xlsx';

// Khởi tạo EmailJS với User ID
emailjs.init('TLbN0IeyPcLfS1k7E');

interface Tenant {
  _id: string;
  name: string;
  citizenId: string;
  phone: string;
  email: string;
  moveInDate: string;
  oldMeterReading?: number;
  newMeterReading?: number;
  totalCost?: number;
  isPaid?: boolean;
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

interface ElectricityBill {
  roomNumber: string;
  newMeterReading: number;
  oldMeterReading: number;
}

const isAxiosError = (error: unknown): error is { response?: { data?: { message?: string } } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

const DienNuoc = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    roomId: '',
    tenantCitizenId: '',
    oldMeterReading: 0,
    newMeterReading: 0,
    totalCost: 0,
  });

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Room[]>('http://localhost:5000/api/rooms');
      const occupiedRooms = data
        .filter(room => room.status === 'occupied')
        .map(room => ({
          ...room,
          bathrooms: room.bathrooms || 1,
          showerRooms: room.showerRooms || 1,
          tenant: room.tenant ? {
            ...room.tenant,
            citizenId: room.tenant.citizenId || '',
            isPaid: room.tenant.isPaid ?? false
          } : undefined
        }));
      setRooms(occupiedRooms);
    } catch (err) {
      console.error('Lỗi tải dữ liệu phòng:', err);
      alert(isAxiosError(err) 
        ? err.response?.data?.message || 'Lỗi khi tải phòng' 
        : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchElectricityBills = useCallback(() => {
    const billsRef = collection(db, '123');
    return onSnapshot(billsRef, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const bills: ElectricityBill[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            roomNumber: data.roomNumber,
            newMeterReading: data.newMeterReading || 0,
            oldMeterReading: data.oldMeterReading || 0,
          };
        });
        setElectricityBills(bills);
      }, 
      (error: Error) => {
        console.error('Lỗi tải dữ liệu điện:', error);
        alert('Lỗi khi tải dữ liệu điện từ Firebase!');
      }
    );
  }, []);

  useEffect(() => {
    const unsubscribe = fetchElectricityBills();
    fetchRooms();
    return () => unsubscribe();
  }, [fetchElectricityBills, fetchRooms]);

  const calculateElectricityCost = useCallback((bill: ElectricityBill) => {
    const usage = (bill.newMeterReading || 0) - (bill.oldMeterReading || 0);
    return usage * 3000;
  }, []);

  const calculateWaterCost = useCallback((room: Room) => {
    return ((room.bathrooms || 0) * 50000) + ((room.showerRooms || 0) * 50000);
  }, []);

  const calculateTotalCost = useCallback((room: Room) => {
    const electricityBill = electricityBills.find(b => b.roomNumber === room.roomNumber);
    const electricityCost = electricityBill ? calculateElectricityCost(electricityBill) : 0;
    return electricityCost + calculateWaterCost(room) + (room.price || 0);
  }, [electricityBills, calculateElectricityCost, calculateWaterCost]);

  const handleEditModal = useCallback((room: Room) => {
    const electricityBill = electricityBills.find(b => b.roomNumber === room.roomNumber);
    setEditData({
      roomId: room._id,
      tenantCitizenId: room.tenant?.citizenId || '',
      oldMeterReading: electricityBill?.oldMeterReading || 0,
      newMeterReading: electricityBill?.newMeterReading || 0,
      totalCost: room.tenant?.totalCost || calculateTotalCost(room),
    });
    setIsEditModalOpen(true);
  }, [electricityBills, calculateTotalCost]);

  const handleUpdate = useCallback(async () => {
    try {
      if (editData.tenantCitizenId) {
        await axios.put(
          `http://localhost:5000/api/tenants/citizenId/${editData.tenantCitizenId}`,
          {
            oldMeterReading: editData.oldMeterReading,
            newMeterReading: editData.newMeterReading,
            totalCost: editData.totalCost,
          }
        );
        await fetchRooms();
      }
      setIsEditModalOpen(false);
      alert('Cập nhật thành công!');
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      alert(isAxiosError(err) 
        ? err.response?.data?.message || 'Cập nhật thất bại' 
        : 'Lỗi không xác định');
    }
  }, [editData, fetchRooms]);

  const handleConfirmPayment = useCallback(async (citizenId: string) => {
    if (!citizenId) {
      alert('Không tìm thấy CCCD người thuê!');
      return;
    }
    
    if (!window.confirm('Xác nhận đã thanh toán cho phòng này?')) return;
    
    try {
      setRooms(prevRooms => prevRooms.map(room => 
        room.tenant?.citizenId === citizenId 
          ? { ...room, tenant: { ...room.tenant, isPaid: true } } 
          : room
      ));
      
      await axios.put(`http://localhost:5000/api/tenants/citizenId/${citizenId}`, { isPaid: true });
      alert('Xác nhận thành công!');
    } catch (err) {
      console.error('Lỗi xác nhận thanh toán:', err);
      alert(isAxiosError(err) 
        ? err.response?.data?.message || 'Xác nhận thất bại!' 
        : 'Lỗi không xác định');
    }
  }, []);

  const renderActionCell = useCallback((room: Room) => {
    if (room.tenant?.isPaid) {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Đã thanh toán
        </span>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() =>
            room.tenant?.citizenId
              ? handleConfirmPayment(room.tenant.citizenId)
              : alert('Không tìm thấy CCCD!')
          }
          className="p-1.5 bg-red-500 rounded-md text-white hover:bg-red-600 transition-colors"
          title="Xác nhận thanh toán"
        >
          <CheckIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }, [handleConfirmPayment]);

  const sendBillEmails = useCallback(async () => {
    const validTenants = rooms.filter(
      room => room.tenant?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(room.tenant.email)
    );

    if (!validTenants.length) {
      alert('Không có email hợp lệ để gửi hóa đơn!');
      return;
    }

    if (!window.confirm(`Gửi hóa đơn cho ${validTenants.length} khách thuê?`)) return;

    setLoading(true);

    try {
      const monthYear = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
      
      await Promise.all(validTenants.map(async room => {
        const bill = electricityBills.find(b => b.roomNumber === room.roomNumber);
        const electricityCost = bill ? calculateElectricityCost(bill) : 0;
        const totalCost = room.tenant?.totalCost || (electricityCost + calculateWaterCost(room) + (room.price || 0));

        await emailjs.send(
          'service_pwyposb',
          'template_uherzex',
          {
            to_email: room.tenant!.email,
            tenant_name: room.tenant!.name,
            room_number: room.roomNumber,
            electricity_usage: bill ? (bill.newMeterReading - (bill.oldMeterReading || 0)) : 0,
            old_meter_reading: bill?.oldMeterReading || 0,
            new_meter_reading: bill?.newMeterReading || 0,
            electricity_cost: electricityCost.toLocaleString('vi-VN'),
            water_cost: calculateWaterCost(room).toLocaleString('vi-VN'),
            room_cost: (room.price || 0).toLocaleString('vi-VN'),
            total_cost: totalCost.toLocaleString('vi-VN'),
            date: monthYear,
            bank_name: "MB Bank",
            account_number: "6999912092003",
            account_name: "LY TAN LOC",
            bank_branch: "Chi nhánh Thủ Đức",
            reply_to: 'lytanloc10c1@gmail.com',
          },
          'TLbN0IeyPcLfS1k7E'
        );
      }));

      alert(`Đã gửi hóa đơn đến ${validTenants.length} khách thuê!`);
    } catch (error) {
      alert(`Gửi email thất bại: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  }, [rooms, electricityBills, calculateElectricityCost, calculateWaterCost]);

  const exportToExcel = useCallback(() => {
    const data = rooms.map(room => {
      const bill = electricityBills.find(b => b.roomNumber === room.roomNumber);
      const electricityCost = bill ? calculateElectricityCost(bill) : 0;
      const totalCost = room.tenant?.totalCost || (electricityCost + calculateWaterCost(room) + (room.price || 0));

      return {
        'Số phòng': room.roomNumber,
        'Tầng': room.floor,
        'Người thuê': room.tenant?.name || 'Chưa có',
        'Số điện cũ': bill?.oldMeterReading || 0,
        'Số điện mới': bill?.newMeterReading || 0,
        'Tiền điện (VNĐ)': electricityCost,
        'Tiền nước (VNĐ)': calculateWaterCost(room),
        'Tiền phòng (VNĐ)': room.price || 0,
        'Tổng cộng (VNĐ)': totalCost,
        'Trạng thái thanh toán': room.tenant?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
      };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, 
      XLSX.utils.json_to_sheet(data), 
      'Hóa đơn Điện Nước'
    );
    XLSX.writeFile(workbook, `HoaDonDienNuoc_${new Date().toISOString().split('T')[0]}.xlsx`);
  }, [rooms, electricityBills, calculateElectricityCost, calculateWaterCost]);

  useEffect(() => {
    // Sau khi rooms và electricityBills đã load xong
    if (!loading && rooms.length > 0) {
      const totalElectricity = rooms.reduce((sum, room) => {
        const bill = electricityBills.find(b => b.roomNumber === room.roomNumber);
        return sum + (bill ? (bill.newMeterReading - bill.oldMeterReading) * 3000 : 0);
      }, 0);
      const totalWater = rooms.reduce((sum, room) => {
        return sum + ((room.bathrooms || 0) * 50000) + ((room.showerRooms || 0) * 50000);
      }, 0);
      localStorage.setItem('totalElectricityRevenue', totalElectricity.toString());
      localStorage.setItem('totalWaterRevenue', totalWater.toString());
    }
  }, [rooms, electricityBills, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý điện nước</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={sendBillEmails}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <EnvelopeIcon className="h-5 w-5" />
            <span>Gửi Email Hóa Đơn</span>
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Xuất Excel
          </button>
        </div>
      </div>

      {rooms.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số phòng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tầng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Người thuê</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Số điện cũ</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Số điện mới</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Tiền điện</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Tiền nước</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Tiền phòng</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Tổng cộng</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map(room => {
                const bill = electricityBills.find(b => b.roomNumber === room.roomNumber);
                const electricityCost = bill ? calculateElectricityCost(bill) : 0;
                const totalCost = room.tenant?.totalCost || (electricityCost + calculateWaterCost(room) + (room.price || 0));

                return (
                  <tr key={room._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{room.roomNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{room.floor}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{room.tenant?.name || 'Chưa có'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">{bill?.oldMeterReading || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">{bill?.newMeterReading || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">{electricityCost.toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">{calculateWaterCost(room).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">{(room.price || 0).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                      {(electricityCost + calculateWaterCost(room) + (room.price || 0)).toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center">
                        {renderActionCell(room)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">Không có phòng nào để hiển thị</p>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cập nhật thông tin điện nước</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện cũ</label>
                  <input
                    type="number"
                    value={editData.oldMeterReading}
                    onChange={(e) => setEditData({...editData, oldMeterReading: Number(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện mới</label>
                  <input
                    type="number"
                    value={editData.newMeterReading}
                    onChange={(e) => setEditData({...editData, newMeterReading: Number(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tổng số tiền (VNĐ)</label>
                  <input
                    type="number"
                    value={editData.totalCost}
                    onChange={(e) => setEditData({...editData, totalCost: Number(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                  <p className="mt-1 text-xs text-gray-500">Có thể điều chỉnh tổng số tiền nếu cần</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DienNuoc;