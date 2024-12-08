import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function MangaDetail({ user }) {
  const { title } = useParams();  // Get manga title from URL params
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);  // State to track manga adding process

  useEffect(() => {
    const fetchMangaDetails = async () => {
      setLoading(true);
      try {
        // Fetch manga details by title (assuming API allows searching by title)
        const mangaResponse = await fetch(
          `https://api.mangadex.org/manga?title=${title}&includes[]=cover_art`
        );
        const mangaData = await mangaResponse.json();
        if (mangaData.data && mangaData.data.length > 0) {
          setManga(mangaData.data[0]);  // Assuming the title matches exactly to one manga
        }

        const chaptersResponse = await fetch(
          `https://api.mangadex.org/chapter?manga=${mangaData.data[0].id}&limit=20`
        );
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData.data || []);
      } catch (error) {
        console.error("Error fetching manga details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchMangaDetails();
    }
  }, [title]);

  const handleAddToRead = async () => {
    if (!user) {
      alert("Please log in to track manga.");
      return;
    }

    setIsAdding(true); // Start the adding process
    try {
      const response = await fetch("http://127.0.0.1:5000/api/add-manga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          manga_title: manga.attributes?.title?.en || "Unknown Title",
          cover_image: getCoverImage(),
          content: manga.attributes?.description?.en || "No description available.",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Manga added successfully!");
      } else {
        alert(data.error || "Failed to add manga.");
      }
    } catch (error) {
      console.error("Error adding manga:", error);
      alert("An error occurred while adding manga to your history.");
    } finally {
      setIsAdding(false); // End the adding process
    }
  };

  // Function to display cover image or default image
  const getCoverImage = () => {
    const coverArt = manga?.relationships?.find(
      (rel) => rel.type === "cover_art"
    );
    return coverArt
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt?.attributes?.fileName}`
      : "https://via.placeholder.com/150"; // Default image if no cover available
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border text-green-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : manga ? (
        <>
          <div className="flex flex-col md:flex-row items-center mb-8">
            <img
              src={getCoverImage()}
              alt={manga.attributes?.title?.en || "Unknown Title"}
              className="w-64 h-96 object-cover rounded-lg mb-4 md:mb-0 md:mr-8"
            />
            <div>
              <h1 className="text-4xl font-bold text-green-400">
                {manga.attributes?.title?.en || "Unknown Title"}
              </h1>
              <p className="mt-4">
                {manga.attributes?.description?.en || "No description available."}
              </p>
              <button
                onClick={handleAddToRead}
                className="bg-green-500 text-white p-2 mt-4 rounded"
                disabled={isAdding} // Disable button during the add process
              >
                {isAdding ? "Adding..." : "Add to Read"}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Chapters</h2>
            <ul className="space-y-2">
              {chapters.length > 0 ? (
                chapters.map((chapter) => (
                  <li key={chapter.id} className="bg-gray-800 p-2 rounded-lg">
                    <a
                      href={`https://mangadex.org/chapter/${chapter.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline"
                    >
                      {chapter.attributes?.title ||
                        `Chapter ${chapter.attributes?.chapter}`}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No chapters available</li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <p className="text-red-500">Manga not found.</p>
      )}
    </div>
  );
}

// Define PropTypes for MangaDetail
MangaDetail.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }),
};

export default MangaDetail;
