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
          <p className="text-white bg-gradient-to-r from-red-600 to-red-300 text-md py-2 px-3">Chap.vn</p>
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
            <p className="text-white opacity-90">hfgk dshgjsd adsfjasdfjsd fdsgjsdg sdgsd sfdgsdf fdsg sgre ege dsfg sfdh égs fsdgs ẻg adgs sẻg sdfgs ẻh agaer sdfg ỵttyj trye</p>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-white bg-black font-bold text-sm hover:bg-gray-800 transition-colors">Chi Tiết</button>
              <button className="p-2 text-white bg-red-500 font-bold text-sm hover:bg-red-600 transition-colors">Đọc Truyện</button>
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
