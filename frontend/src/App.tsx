import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
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
    <div className="p-4">
      <div className="bg-white p-6 rounded shadow-md inline-block">
        <h3 className="text-lg font-medium mb-4">Bạn có chắc chắn muốn đăng xuất?</h3>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Xác nhận đăng xuất
        </button>
      </div>
    </div>
  );
};

// Component layout chính (Sidebar + Content)
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-dark-blue text-white p-4 flex flex-col">
        <div className="mb-8 flex items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-8 w-8 mr-2 object-contain" 
          />
          <h2 className="text-xl font-bold uppercase">Nhà Trọ Thủ Đức</h2>
        </div>
        
        <nav className="flex-1 space-y-1">
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
        </nav>

        {/* Nút đăng xuất nằm dưới cùng sidebar */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition-colors ${isActive ? 'bg-red-500' : 'hover:bg-gray-700'}`
            }
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> Đăng xuất
          </NavLink>
        </div>
      </div>

      {/* Content chính */}
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
        {/* Trang Login tách biệt hoàn toàn */}
        <Route path="/login" element={<Login />} />

        {/* Các Route cần bảo vệ bởi ProtectedRoute */}
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

        {/* Tự động chuyển hướng về trang chủ nếu gõ sai đường dẫn */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
