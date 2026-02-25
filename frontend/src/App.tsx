import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import Tenants from './components/Tenants';
import DienNuoc from './components/diennuoc';
import AlertUnpaid from './components/AlertUnpaid';
import logo from './UTE.jpg';

/* ========================= */
/* Component Logout */
/* ========================= */
const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Xác nhận đăng xuất
      </button>
    </div>
  );
};

/* ========================= */
/* Layout chính */
/* ========================= */
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-dark-blue text-white p-4">
        <div className="mb-8 flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-8 mr-2 object-contain"
          />
          <h2 className="text-xl font-bold">NHÀ TRỌ THỦ ĐỨC</h2>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
            }
          >
            <HomeIcon className="h-5 w-5 mr-2" /> Dashboard
          </NavLink>

          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
            }
          >
            <UsersIcon className="h-5 w-5 mr-2" /> Quản lý phòng
          </NavLink>

          <NavLink
            to="/tenants"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
            }
          >
            <UsersIcon className="h-5 w-5 mr-2" /> Người thuê
          </NavLink>

          <NavLink
            to="/diennuoc"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
            }
          >
            <UsersIcon className="h-5 w-5 mr-2" /> Quản lý điện nước
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${isActive ? 'bg-green-success' : 'hover:bg-gray-700'}`
            }
          >
            <BellIcon className="h-5 w-5 mr-2" /> Cảnh báo
          </NavLink>

          <NavLink
            to="/logout"
            className="flex items-center p-2 rounded hover:bg-gray-700"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> Đăng xuất
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
};

/* ========================= */
/* App */
/* ========================= */
function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/rooms"
          element={
            <MainLayout>
              <Rooms />
            </MainLayout>
          }
        />

        <Route
          path="/tenants"
          element={
            <MainLayout>
              <Tenants />
            </MainLayout>
          }
        />

        <Route
          path="/diennuoc"
          element={
            <MainLayout>
              <DienNuoc />
            </MainLayout>
          }
        />

        <Route
          path="/alerts"
          element={
            <MainLayout>
              <AlertUnpaid />
            </MainLayout>
          }
        />

        <Route
          path="/logout"
          element={
            <MainLayout>
              <Logout />
            </MainLayout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
