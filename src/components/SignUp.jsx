import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có trùng khớp không
        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match");
            return;
        }

        const response = await axios.post('http://localhost:5000/api/register', {
            username,
            password
        });
        
        // Kiểm tra phản hồi từ API và thực hiện hành động nếu đăng ký thành công
        if (response.status === 201) {
            setErrorMessage('');
            navigate('/login');  // Chuyển đến trang đăng nhập
        } else {
            setErrorMessage('Something went wrong');
        }
        
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>
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
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                </div>
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-sm">
                Already have an account?{' '}
                <span
                    className="text-green-400 cursor-pointer"
                    onClick={() => navigate('/login')}
                >
                    Login
                </span>
            </p>
        </div>
    );
}

export default Signup;
