import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.mangadex.org/manga?title=${query}&limit=50&includes[]=cover_art`
                );
                const data = await response.json();
                setSearchResults(data.data || []);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    return (
        <div className="p-4 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-500">
                Search Results for: <span className="text-white">{query}</span>
            </h2>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="spinner-border text-green-500" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {searchResults.map((manga) => {
                        const coverFileName = manga.relationships.find(
                            (rel) => rel.type === "cover_art"
                        )?.attributes?.fileName;

                        const coverUrl = coverFileName
                            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
                            : "https://via.placeholder.com/256x384.png?text=No+Image";

                        return (
                            <div
                                key={manga.id}
                                className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg group transform transition-transform duration-300 hover:scale-105"
                                onClick={() => navigate(`/manga/${encodeURIComponent(manga.attributes.title.en)}`)}
                            >
                                <img
                                    src={coverUrl}
                                    alt={manga.attributes.title.en || "Unknown Title"}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                    <h3 className="text-center text-green-500 text-lg font-semibold px-2 py-4 bg-opacity-75 w-full">
                                        {manga.attributes.title.en || "Unknown Title"}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-xl text-gray-300">No results found for <span className="text-green-500">{query}</span>.</p>
            )}
        </div>
    );
}

export default SearchPage;
