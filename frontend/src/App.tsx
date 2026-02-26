import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  BellIcon, 
  ArrowRightOnRectangleIcon, 
  HomeModernIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Rooms from './components/Rooms';
import Tenants from './components/Tenants';
import DienNuoc from './components/diennuoc';
import ProtectedRoute from './components/ProtectedRoute';
import AlertUnpaid from './components/AlertUnpaid';
import logo from './UTE.jpg';

// Component xử lý đăng xuất nhanh
const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
      <h3 className="text-xl mb-4 text-gray-800">Bạn có chắc chắn muốn đăng xuất?</h3>
      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Xác nhận đăng xuất
      </button>
    </div>
  );
};

// Layout chính bao gồm Sidebar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-4 flex flex-col">
        <div className="mb-10 flex items-center px-2">
          <img src={logo} alt="Logo" className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-white" />
          <h2 className="text-lg font-bold leading-tight">NHÀ TRỌ THỦ ĐỨC</h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          <MenuLink to="/" icon={<HomeIcon className="h-5 w-5" />} label="Dashboard" />
          <MenuLink to="/rooms" icon={<HomeModernIcon className="h-5 w-5" />} label="Quản lý phòng" />
          <MenuLink to="/tenants" icon={<UsersIcon className="h-5 w-5" />} label="Người thuê" />
          <MenuLink to="/diennuoc" icon={<BoltIcon className="h-5 w-5" />} label="Điện nước" />
          <MenuLink to="/alerts" icon={<BellIcon className="h-5 w-5" />} label="Cảnh báo" />
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <MenuLink to="/logout" icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />} label="Đăng xuất" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// Component con để tái sử dụng style cho Menu
const MenuLink = ({ to, icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Bọc toàn bộ các route cần bảo vệ bằng 1 block để code gọn hơn */}
        <Route path="*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/diennuoc" element={<DienNuoc />} />
                <Route path="/alerts" element={<AlertUnpaid />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
