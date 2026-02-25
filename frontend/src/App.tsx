import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, BellIcon } from '@heroicons/react/24/outline';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import Tenants from './components/Tenants';
import DienNuoc from './components/diennuoc';
import AlertUnpaid from './components/AlertUnpaid';
import logo from './UTE.jpg';

// Layout chính (Sidebar + Content)
const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-dark-blue text-white p-4">
        <div className="mb-8 flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2 object-contain" />
          <h2 className="text-xl font-bold">NHÀ TRỌ THỦ ĐỨC</h2>
        </div>
        <nav className="space-y-1">
          <NavLink to="/" className={({ isActive }) => `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`}>
            <HomeIcon className="h-5 w-5 mr-2" /> Dashboard
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`}>
            <UsersIcon className="h-5 w-5 mr-2" /> Quản lý phòng
          </NavLink>
          <NavLink to="/tenants" className={({ isActive }) => `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`}>
            <UsersIcon className="h-5 w-5 mr-2" /> Người thuê
          </NavLink>
          <NavLink to="/diennuoc" className={({ isActive }) => `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`}>
            <UsersIcon className="h-5 w-5 mr-2" /> Quản lý điện nước
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`}>
            <BellIcon className="h-5 w-5 mr-2" /> Cảnh báo
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

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
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
