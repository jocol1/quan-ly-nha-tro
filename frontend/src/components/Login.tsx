import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bỏ qua gọi API, set thẳng trạng thái và chuyển trang
    localStorage.setItem('isLoggedIn', 'true');
    
    // Bạn có thể đổi '/' thành '/dashboard' nếu route của bạn là dashboard
    navigate('/'); 
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập bất kỳ..."
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập bất kỳ..."
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Đăng nhập (Vào thẳng Dashboard)
        </button>
      </form>
    </div>
  );
};

export default Login;
