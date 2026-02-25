
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserIcon, XMarkIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

const Rooms = () => {
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
-      const token = localStorage.getItem('token');
-      const response = await axios.get('https://nhatro-backend.onrender.com/api/rooms', {
-        headers: { Authorization: `Bearer ${token}` },
-      });
+      const response = await axios.get('https://nhatro-backend.onrender.com/api/rooms');
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
@@ -111,198 +108,182 @@ const Rooms = () => {
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
-      const token = localStorage.getItem('token');
-      const response = await axios.post(
+      await axios.post(
         'https://nhatro-backend.onrender.com/api/rooms',
-        newRoom,
-        { headers: { Authorization: `Bearer ${token}` } }
+        newRoom
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
-      const token = localStorage.getItem('token');
       await axios.put(
         `https://nhatro-backend.onrender.com/api/rooms/${editRoom._id}`,
         {
           roomNumber: editRoom.roomNumber,
           floor: editRoom.floor,
           status: editRoom.status,
           price: editRoom.price,
           bathrooms: editRoom.bathrooms,
           showerRooms: editRoom.showerRooms,
-        },
-        { headers: { Authorization: `Bearer ${token}` } }
+        }
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
-      const token = localStorage.getItem('token');
-      await axios.delete(`https://nhatro-backend.onrender.com/api/rooms/${room._id}`, {
-        headers: { Authorization: `Bearer ${token}` },
-      });
+      await axios.delete(`https://nhatro-backend.onrender.com/api/rooms/${room._id}`);
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
-      const token = localStorage.getItem('token');
-      if (!token) {
-        alert('Không tìm thấy token! Vui lòng đăng nhập lại.');
-        return;
-      }
-
       console.log('Selected Room ID:', selectedRoom._id);
-      const roomResponse = await axios.get(`https://nhatro-backend.onrender.com/api/rooms/${selectedRoom._id}`, {
-        headers: { Authorization: `Bearer ${token}` },
-      });
+      const roomResponse = await axios.get(`https://nhatro-backend.onrender.com/api/rooms/${selectedRoom._id}`);
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
-        },
-        { headers: { Authorization: `Bearer ${token}` } }
+        }
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
