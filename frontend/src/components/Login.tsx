import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorResponse {
  message: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Cố gắng gọi API thực tế
      const response = await axios.post('https://nhatro-backend.onrender.com/api/auth/login', {
        username,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      console.error("Lỗi đăng nhập:", error);

      // 2. CƠ CHẾ BYPASS (VƯỢT RÀO): 
      // Nếu nhập đúng admin/password mà server lỗi 500 hoặc timeout, vẫn cho vào demo
      if (username === 'admin' && password === 'password') {
        console.warn("Backend lỗi nhưng đang cho phép vào bằng tài khoản demo.");
        localStorage.setItem('token', 'demo-token-bypass');
        navigate('/');
      } else {
        const errorMessage = error.response?.data?.message || 'Lỗi kết nối server (500/Timeout)';
        alert('Đăng nhập thất bại: ' + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-dark-blue">Đăng nhập</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập admin"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập password"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-dark-blue hover:bg-opacity-90'} text-white font-bold py-3 rounded-lg transition-all shadow-md`}
          >
            {isLoading ? 'Đang kiểm tra...' : 'Đăng nhập hệ thống'}
          </button>

          {/* KHỐI HIỂN THỊ THÔNG TIN TÀI KHOẢN ĐỂ NGƯỜI DÙNG BIẾT */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Thông tin truy cập thử nghiệm:</p>
              <p>• Tài khoản: <span className="font-mono bg-blue-100 px-1 rounded text-blue-900">admin</span></p>
              <p>• Mật khẩu: <span className="font-mono bg-blue-100 px-1 rounded text-blue-900">password</span></p>
              <p className="mt-2 text-xs italic opacity-80">* Hệ thống sẽ tự động đăng nhập demo nếu server đang bảo trì.</p>
            </div>
          </div>
        </form>
        
        <p className="text-center mt-6 text-gray-500 text-xs">
          © 2026 Quản Lý Nhà Trọ Thủ Đức - Hệ Thống Nội Bộ
        </p>
      </div>
    </div>
  );
};

export default Login;
