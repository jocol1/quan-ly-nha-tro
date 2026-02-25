diff --git a/frontend/src/components/Tenants.tsx b/frontend/src/components/Tenants.tsx
index 8b9c4388583898d0c89628a5e44b80008637d29d..997a1f008bc28224cfd6d840a4c100301a74ed71 100644
--- a/frontend/src/components/Tenants.tsx
+++ b/frontend/src/components/Tenants.tsx
@@ -22,61 +22,56 @@ interface Tenant {
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
-      const token = localStorage.getItem('token');
-      const response = await axios.get('https://nhatro-backend.onrender.com/api/tenants', {
-        headers: { Authorization: `Bearer ${token}` },
-      });
+      const response = await axios.get('https://nhatro-backend.onrender.com/api/tenants');
       const tenantsData: Tenant[] = response.data;
       setTenants(tenantsData);
       setFilteredTenants(tenantsData);
 
-      const roomsResponse = await axios.get('https://nhatro-backend.onrender.com/api/rooms', {
-        headers: { Authorization: `Bearer ${token}` },
-      });
+      const roomsResponse = await axios.get('https://nhatro-backend.onrender.com/api/rooms');
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
@@ -91,83 +86,78 @@ const Tenants = () => {
 
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
-      const token = localStorage.getItem('token');
       await axios.put(
         `https://nhatro-backend.onrender.com/api/tenants/${editTenant._id}`,
         {
           name: editTenant.name,
           citizenId: editTenant.citizenId,
           phone: editTenant.phone,
           email: editTenant.email, // Thêm email
           room: editTenant.room,
           moveInDate: editTenant.moveInDate,
-        },
-        { headers: { Authorization: `Bearer ${token}` } }
+        }
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
-      const token = localStorage.getItem('token');
-      const response = await axios.delete(`https://nhatro-backend.onrender.com/api/tenants/citizen/${tenant.citizenId}`, {
-        headers: { Authorization: `Bearer ${token}` },
-      });
+      const response = await axios.delete(`https://nhatro-backend.onrender.com/api/tenants/citizen/${tenant.citizenId}`);
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
