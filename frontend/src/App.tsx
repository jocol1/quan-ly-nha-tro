import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, BellIcon, BoltIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import Tenants from './components/Tenants';
import DienNuoc from './components/diennuoc'; 
import AlertUnpaid from './components/AlertUnpaid';
import logo from './UTE.jpg';

// Component cho layout chính (Sidebar + Content)
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Luôn luôn hiển thị */}
      <div className="w-64 bg-slate-900 text-white p-4">
        <div className="mb-8 flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2 object-contain rounded-full" />
          <h2 className="text-xl font-bold">NHÀ TRỌ THỦ ĐỨC</h2>
        </div>
        <nav className="space-y-1">
          <MenuLink to="/" icon={<HomeIcon className="h-5 w-5" />} label="Dashboard" />
          <MenuLink to="/rooms" icon={<HomeModernIcon className="h-5 w-5" />} label="Quản lý phòng" />
          <MenuLink to="/tenants" icon={<UsersIcon className="h-5 w-5" />} label="Người thuê" />
          <MenuLink to="/diennuoc" icon={<BoltIcon className="h-5 w-5" />} label="Quản lý điện nước" />
          <MenuLink to="/alerts" icon={<BellIcon className="h-5 w-5" />} label="Cảnh báo" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

// Component con để rút gọn code Menu
const MenuLink = ({ to, icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-colors ${
        isActive ? 'bg-green-600 text-white' : 'hover:bg-gray-700 text-gray-300'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/diennuoc" element={<DienNuoc />} />
          <Route path="/alerts" element={<AlertUnpaid />} />
          {/* Xóa bỏ Route Login và Logout */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
