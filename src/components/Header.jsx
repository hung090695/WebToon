import { FaSearch, FaUserAlt, FaSmile, FaSadTear, FaAngry, FaSurprise, FaLaugh } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Handle Search
    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/search?query=${searchQuery.trim()}`);
        }
    };

    // Handle Emotion Click
    const handleEmotionClick = (emotion) => {
        navigate(`/search-by-emotion?emotion=${emotion}`); // Chuyển hướng đến route đúng
    };

    // Handle login navigation
    const handleLoginClick = () => {
        navigate('/login');
    };

    // Handle my page navigation
    const handleMyPageClick = () => {
        navigate('/mypage');
    };

    return (
        <div className="p-4 bg-gradient-to-r from-black to-gray-900 flex flex-col md:flex-row md:items-center justify-between shadow-lg">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-4">
                <h1 className="text-[40px] uppercase font-bold text-green-500">WebTOON</h1>
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="/" className="text-white hover:text-green-400">Home</a>
                    <a href="/about" className="text-white hover:text-green-400">About</a>
                    <a href="/contact" className="text-white hover:text-green-400">Contact</a>
                    <a onClick={handleMyPageClick} className="text-white hover:text-green-400 cursor-pointer">My Page</a>
                </nav>
            </div>

            {/* Search and Emotion Section */}
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
                {/* Text Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="p-2 pl-8 rounded-full bg-gray-100"
                    />
                    <FaSearch className="absolute left-2 top-2 text-gray-500" />
                </div>

                {/* Emotion Icons */}
                <div className="flex space-x-2">
                    <FaSmile
                        title="Happy"
                        className="text-yellow-400 cursor-pointer hover:scale-110"
                        size={24}
                        onClick={() => handleEmotionClick('happy')}
                    />
                    <FaSadTear
                        title="Sad"
                        className="text-blue-400 cursor-pointer hover:scale-110"
                        size={24}
                        onClick={() => handleEmotionClick('sad')}
                    />
                    <FaAngry
                        title="Angry"
                        className="text-red-400 cursor-pointer hover:scale-110"
                        size={24}
                        onClick={() => handleEmotionClick('angry')}
                    />
                    <FaSurprise
                        title="Suprised"
                        className="text-purple-400 cursor-pointer hover:scale-110"
                        size={24}
                        onClick={() => handleEmotionClick('suprised')}
                    />
                    <FaLaugh
                        title="Funny"
                        className="text-green-400 cursor-pointer hover:scale-110"
                        size={24}
                        onClick={() => handleEmotionClick('funny')}
                    />
                </div>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {user ? (
                    <div className="flex items-center space-x-2">
                        <FaUserAlt size={24} />
                        <span className="text-white">{user.username}</span>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 text-white px-2 rounded-md"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <FaUserAlt
                        onClick={handleLoginClick}
                        className="text-white cursor-pointer hover:text-green-400"
                        size={24}
                    />
                )}
            </div>
        </div>
    );
}

Header.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }),
    onLogout: PropTypes.func.isRequired,
};

export default Header;
