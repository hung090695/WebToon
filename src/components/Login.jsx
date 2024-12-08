import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes for validation

function Login({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();


    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Gửi yêu cầu đăng nhập tới Flask API
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password
            });

            // Nếu đăng nhập thành công, lưu thông tin người dùng
            if (response.status === 200) {
                setUser(response.data); // Cập nhật user state
                navigate('/mypage'); // Chuyển hướng về trang chủ
            }
        } catch (error) {
            // Nếu có lỗi từ API, hiển thị thông báo lỗi
            if (error.response && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                </div>
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                    Login
                </button>
            </form>
            <p className="mt-4 text-sm">
                Don`t have an account?{' '}
                <span
                    className="text-green-400 cursor-pointer"
                    onClick={() => navigate('/signup')}
                >
                    Sign Up
                </span>
            </p>
        </div>
    );
}

// Định nghĩa prop types cho component
Login.propTypes = {
    setUser: PropTypes.func.isRequired, // Đảm bảo rằng setUser là một hàm và được truyền vào
};

export default Login;
