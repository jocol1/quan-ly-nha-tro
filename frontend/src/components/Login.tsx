import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// Định nghĩa kiểu cho response error từ API
interface ErrorResponse {
  message: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://nhatro-backend.onrender.com/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const errorMessage = error.response?.data?.message || 'Lỗi không xác định';
      alert('Đăng nhập thất bại: ' + errorMessage);
    }
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
            required
          />
        </div>
        <button type="submit" className="w-full bg-dark-blue text-white p-2 rounded hover:bg-green-success">
          Đăng nhập (admin : password)
        </button>
      </form>
    </div>
  );
};

export default Login;
