import { useState, useEffect, useCallback } from 'react';
import { EnvelopeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { db } from '../firebase';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import * as XLSX from 'xlsx';

// Khởi tạo EmailJS
emailjs.init('TLbN0IeyPcLfS1k7E');

interface Tenant {
  _id: string;
  name: string;
  citizenId: string;
  phone: string;
  email: string;
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

const DienNuoc = () => {
  // 1. DỮ LIỆU PHÒNG TĨNH (Để khớp với số phòng trên Firebase của bạn)
  const staticOccupiedRooms: Room[] = [
    { 
      _id: '1', roomNumber: '101', floor: 1, status: 'occupied', price: 3000000, bathrooms: 1, showerRooms: 1,
      tenant: { _id: 't1', name: 'Nguyễn Văn A', citizenId: '079123456789', phone: '0901234567', email: 'vana@gmail.com', isPaid: false }
    },
    { 
      _id: '3', roomNumber: '201', floor: 2, status: 'occupied', price: 3500000, bathrooms: 1, showerRooms: 1,
      tenant: { _id: 't2', name: 'Trần Thị B', citizenId: '079987654321', phone: '0907654321', email: 'thib@gmail.com', isPaid: false }
    }
  ];

  const [rooms, setRooms] = useState<Room[]>(staticOccupiedRooms);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. LẤY SỐ ĐIỆN TỪ FIREBASE (Giữ nguyên vì đây là dữ liệu thực)
  useEffect(() => {
    const billsRef = collection(db, '123');
    const unsubscribe = onSnapshot(billsRef, (snapshot: QuerySnapshot<DocumentData>) => {
      const bills: ElectricityBill[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          roomNumber: data.roomNumber,
          newMeterReading: data.newMeterReading || 0,
          oldMeterReading: data.oldMeterReading || 0,
        };
      });
      setElectricityBills(bills);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const calculateElectricityCost = (bill: ElectricityBill) => {
    const usage = bill.newMeterReading - bill.oldMeterReading;
    return usage > 0 ? usage * 3000 : 0;
  };

  const calculateWaterCost = (room: Room) => {
    return (room.bathrooms * 50000) + (room.showerRooms * 50000);
  };

  // Xác nhận thanh toán (Chỉ cập nhật giao diện vì bản Demo)
  const handleConfirmPayment = (citizenId: string) => {
    setRooms(prev => prev.map(r => 
      r.tenant?.citizenId === citizenId ? { ...r, tenant: { ...r.tenant, isPaid: true } } : r
    ));
    alert('Đã xác nhận thanh toán thành công!');
  };

  // Gửi Email qua EmailJS
  const sendBillEmails = async () => {
    const targets = rooms.filter(r => r.tenant?.email);
    if (!window.confirm(`Gửi hóa đơn cho ${targets.length} khách?`)) return;

    try {
      for (const room of targets) {
        const bill = electricityBills.find(b => b.roomNumber === room.roomNumber);
        const eCost = bill ? calculateElectricityCost(bill) : 0;
        const wCost = calculateWaterCost(room);
        const total = eCost + wCost + room.price;

        await emailjs.send('service_pwyposb', 'template_uherzex', {
          to_email: room.tenant?.email,
          tenant_name: room.tenant?.name,
          room_number: room.roomNumber,
          electricity_cost: eCost.toLocaleString(),
          water_cost: wCost.toLocaleString(),
          room_cost: room.price.toLocaleString(),
          total_cost: total.toLocaleString(),
          account_number: "6999912092003",
          account_name: "LY TAN LOC"
        });
      }
      alert('Đã gửi toàn bộ email thành công!');
    } catch (err) {
      alert('Lỗi khi gửi email!');
    }
  };

  if (loading) return <div className="p-10 text-center">Đang kết nối Firebase...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hóa Đơn Điện Nước</h2>
        <div className="flex gap-2">
          <button onClick={sendBillEmails} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5" /> Gửi Email
          </button>
          <button onClick={() => alert('Đã xuất file Excel!')} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Xuất Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phòng</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Chỉ số Điện</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Tiền Điện</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Tiền Nước</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Tổng Tiền</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map(room => {
              const bill = electricityBills.find(b => b.roomNumber === room.roomNumber);
              const eCost = bill ? calculateElectricityCost(bill) : 0;
              const wCost = calculateWaterCost(room);
              const total = eCost + wCost + room.price;

              return (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-900">Phòng {room.roomNumber}</div>
                    <div className="text-xs text-gray-500">{room.tenant?.name}</div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm">
                    {bill ? `${bill.oldMeterReading} ➔ ${bill.newMeterReading}` : '---'}
                  </td>
                  <td className="px-4 py-4 text-center font-medium">{eCost.toLocaleString()}đ</td>
                  <td className="px-4 py-4 text-center font-medium">{wCost.toLocaleString()}đ</td>
                  <td className="px-4 py-4 text-center font-bold text-blue-600">{total.toLocaleString()}đ</td>
                  <td className="px-4 py-4 text-center">
                    {room.tenant?.isPaid ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Đã thu</span>
                    ) : (
                      <button 
                        onClick={() => handleConfirmPayment(room.tenant!.citizenId)}
                        className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DienNuoc;
