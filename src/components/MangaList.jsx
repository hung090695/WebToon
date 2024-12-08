import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 2000, min: 1500 }, items: 5 },
  desktop: { breakpoint: { max: 1500, min: 1000 }, items: 3 },
  tablet: { breakpoint: { max: 1000, min: 500 }, items: 2 },
  mobile: { breakpoint: { max: 500, min: 0 }, items: 1 },
};

function MangaList({ title, manga }) {
  const getCoverImage = (item) => {
    const coverArt = item.relationships.find((rel) => rel.type === "cover_art");
    return coverArt
      ? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes?.fileName}.256.jpg`
      : "https://via.placeholder.com/256x384.png?text=No+Image";
  };

  return (
    <div className="text-white p-6 mb-6 bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-xl shadow-lg">
      <h2 className="uppercase text-3xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-300">

        {title}
      </h2>
      <Carousel
        responsive={responsive}
        className="flex items-center space-x-4"
        containerClass="carousel-container"
        itemClass="carousel-item"
      >
        {manga.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 p-4 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 relative group border border-transparent hover:border-gradient-to-r from-green-400 to-blue-500"
          >
            <img
              src={getCoverImage(item)}
              alt={item.attributes?.title?.en || "Unknown Title"}
              className="w-full h-64 object-cover rounded-lg mb-2"
            />
            <h3 className="text-center text-lg font-semibold text-white truncate mb-2">
              {item.attributes?.title?.en || "Unknown Title"}
            </h3>
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
              <Link
                to={`/manga/${item.attributes?.title?.en}`}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-200 text-white font-bold rounded-lg hover:from-blue-200 hover:to-green-500"
              >
                Read Manga
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

MangaList.propTypes = {
  title: PropTypes.string.isRequired,
  manga: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      relationships: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          attributes: PropTypes.shape({
            fileName: PropTypes.string,
          }),
        })
      ),
      attributes: PropTypes.shape({
        title: PropTypes.shape({
          en: PropTypes.string,
        }),
      }),
    })
  ).isRequired,
};

export default MangaList;
