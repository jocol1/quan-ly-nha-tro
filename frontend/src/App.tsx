import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, BellIcon, ArrowRightOnRectangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Rooms from './components/Rooms';
import Tenants from './components/Tenants';
import DienNuoc from './components/diennuoc';
import ProtectedRoute from './components/ProtectedRoute';
import AlertUnpaid from './components/AlertUnpaid';
import logo from './UTE.jpg';

// Component xử lý đăng xuất
const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">Bạn có chắc chắn muốn đăng xuất?</h3>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
        Xác nhận đăng xuất
      </button>
    </div>
  );
};

// Layout chính (Sidebar + Content)
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-dark-blue text-white flex flex-col">
        <div className="p-4">
          <div className="mb-8 flex items-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-8 w-8 mr-2 object-contain" 
            />
            <h2 className="text-xl font-bold uppercase tracking-wider">Nhà Trọ Thủ Đức</h2>
          </div>
          
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-2 rounded transition-colors ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
              }
            >
              <HomeIcon className="h-5 w-5 mr-2" /> Dashboard
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `flex items-center p-2 rounded transition-colors ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
              }
            >
              <UsersIcon className="h-5 w-5 mr-2" /> Quản lý phòng
            </NavLink>
            <NavLink
              to="/tenants"
              className={({ isActive }) =>
                `flex items-center p-2 rounded transition-colors ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
              }
            >
              <UsersIcon className="h-5 w-5 mr-2" /> Người thuê
            </NavLink>
            <NavLink
              to="/diennuoc"
              className={({ isActive }) =>
                `flex items-center p-2 rounded transition-colors ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
              }
            >
              <UsersIcon className="h-5 w-5 mr-2" /> Quản lý điện nước
            </NavLink>
            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                `flex items-center p-2 rounded transition-colors ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
              }
            >
              <BellIcon className="h-5 w-5 mr-2" /> Cảnh báo
            </NavLink>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `flex items-center p-2 rounded transition-colors ${isActive ? 'bg-red-500' : 'hover:bg-gray-700'}`
              }
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> Đăng xuất
            </NavLink>
          </nav>
        </div>

        {/* PHẦN HIỂN THỊ TÀI KHOẢN MẪU */}
        <div className="mt-auto p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-start space-x-2 text-sm text-gray-300">
            <InformationCircleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-white mb-1">Thông tin Demo:</p>
              <p>User: <span className="text-yellow-400 font-mono">admin</span></p>
              <p>Pass: <span className="text-yellow-400 font-mono">password</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang Login (Sẽ cần sửa file Login.tsx để hiển thị text tương tự nếu muốn đẹp hơn) */}
        <Route path="/login" element={<Login />} />

        {/* Các trang được bảo vệ */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <MainLayout><Rooms /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <ProtectedRoute>
              <MainLayout><Tenants /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diennuoc"
          element={
            <ProtectedRoute>
              <MainLayout><DienNuoc /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <MainLayout><AlertUnpaid /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <MainLayout><Logout /></MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
