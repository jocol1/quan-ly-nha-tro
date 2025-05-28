import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Rooms from './components/Rooms';
import Tenants from './components/Tenants';
import DienNuoc from './components/diennuoc'; // Cập nhật import với tên mới
import ProtectedRoute from './components/ProtectedRoute';
import AlertUnpaid from './components/AlertUnpaid';

// Component nhỏ để xử lý đăng xuất
const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="p-4">
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Xác nhận đăng xuất
      </button>
    </div>
  );
};

// Component cho layout chính (Sidebar + Content)
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-dark-blue text-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Logo</h2>
        </div>
        <nav>
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
            to="/diennuoc" // Cập nhật đường dẫn
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
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang Login không có Sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Các trang khác dùng layout chính với Sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Rooms />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Tenants />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diennuoc" // Cập nhật đường dẫn
          element={
            <ProtectedRoute>
              <MainLayout>
                <DienNuoc /> {/* Sử dụng component mới */}
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AlertUnpaid />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Logout />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;