import IconRating from "../assets/rating.png";
import IconRatingHalf from "../assets/rating-half.png";
import IconTemp from "../assets/banner1.jpg";
import IconPlay from "../assets/play-button.png";

const Banner = () => {
  return (
    <div className="w-full h-[500px] bg-banner bg-center bg-no-repeat bg-cover relative overflow-hidden animate-fadeIn">
      <div className="absolute w-full h-full top-0 left-0 bg-black opacity-30"></div>
      <div className="w-full h-full flex items-center justify-center space-x-[30px] p-4 relative z-20">
        <div className="flex flex-col space-y-5 items-baseline w-[50%] animate-slideInLeft">
          <p className="text-white bg-gradient-to-r from-red-600 to-red-300 text-md py-2 px-3">MangaDex.org</p>
          <div className="flex flex-col space-4">
            <h2 className="text-white text-3xl font-bold">OnePiece</h2>
            <div className="flex items-center space-x-3">
              <img src={IconRating} alt="Rating" className="h-[32px] w-[32px] animate-pulse" />
              <img src={IconRating} alt="Rating" className="h-[32px] w-[32px] animate-pulse" />
              <img src={IconRating} alt="Rating" className="h-[32px] w-[32px] animate-pulse" />
              <img src={IconRating} alt="Rating" className="h-[32px] w-[32px] animate-pulse" />
              <img src={IconRatingHalf} alt="Rating" className="h-[32px] w-[32px] animate-pulse" />
              <span className="text-white">4.5/5</span>
              <span className="text-white">12.3k viewers</span>
              <span className="text-white">10 episodes</span>
            </div>
            <p className="text-white opacity-90">Gol D. Roger, a man referred to as the "Pirate King," is set to be executed by the World Government. But just before his demise, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the Pirate King is executed and the Great Age of Pirates begins. Twenty-two years later, a young man by the name of Monkey D. Luffy is ready to embark on his own adventure, searching for One Piece and striving to become the new Pirate King.</p>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-white bg-black font-bold text-sm hover:bg-gray-800 transition-colors">Details</button>
              <button className="p-2 text-white bg-red-500 font-bold text-sm hover:bg-red-600 transition-colors">Read Manga</button>
            </div>
          </div>
        </div>
        <div className="w-[30%] flex items-center justify-center">
          <div className="w-[350px] h-[450px] relative group cursor-pointer animate-fadeInRight">
            <img src={IconTemp} alt="temp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" />
            <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
              <img src={IconPlay} alt="play" className="w-16 h-16 relative z-20 animate-bounce"></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
