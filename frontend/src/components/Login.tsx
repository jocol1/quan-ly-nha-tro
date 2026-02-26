import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Lưu trạng thái đăng nhập để qua cửa ProtectedRoute
    localStorage.setItem('isLoggedIn', 'true');
    
    // Chuyển hướng thẳng vào Dashboard
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-80">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Hệ Thống Quản Lý</h2>
        <p className="text-gray-500 mb-8">Vui lòng nhấn nút bên dưới để bắt đầu làm việc</p>
        
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transform active:scale-95 transition-all"
        >
          ĐĂNG NHẬP NGAY
        </button>
      </div>
    </div>
  );
};

export default Login;
