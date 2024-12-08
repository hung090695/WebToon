import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchByEmotion = () => {
    const [emotion, setEmotion] = useState('');
    const [mangaResults, setMangaResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate(); // Dùng useNavigate để chuyển hướng

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emotionFromQuery = params.get('emotion') || '';
        setEmotion(emotionFromQuery);

        if (emotionFromQuery) {
            searchMangaByEmotion(emotionFromQuery);
        }
    }, [location]);

    const searchMangaByEmotion = async (emotion) => {
        setLoading(true);
        setError('');
        setMangaResults([]);

        try {
            const response = await axios.get(`http://localhost:5000/api/search-by-emotion`, {
                params: { emotion },
            });

            if (response.data.length > 0) {
                setMangaResults(response.data);
            } else {
                setError('No manga found matching this emotion.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching manga.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-500">
                Search Manga by Emotion: <span className="text-white">{emotion || 'None'}</span>
            </h2>

            {loading && (
                <div className="flex justify-center items-center">
                    <div className="spinner-border text-green-500" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && mangaResults.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {mangaResults.map((manga, index) => {
                        const coverFileName = manga.cover_image || 'https://via.placeholder.com/256x384.png?text=No+Image';

                        return (
                            <div
                                key={index}
                                className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg group transform transition-transform duration-300 hover:scale-105"
                                onClick={() => navigate(`/manga/${encodeURIComponent(manga.title)}`)} // Điều hướng đến chi tiết manga
                            >
                                <img
                                    src={coverFileName}
                                    alt={manga.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                    <h3 className="text-center text-green-500 text-lg font-semibold px-2 py-4 bg-opacity-75 w-full">
                                        {manga.title}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !mangaResults.length && !error && (
                <p className="text-center text-xl text-gray-300">No results found for this search.</p>
            )}
        </div>
    );
};

export default SearchByEmotion;
