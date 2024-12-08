import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import MangaList from './components/MangaList';
import SearchPage from './components/SearchPage';
import MangaDetail from './components/MangaDetail';
import SignUp from './components/SignUp';
import LoginPage from "./components/Login";
import MyPage from "./components/MyPage";
import SearchByEmotion from "./components/SearchByEmotion";

function App() {
  const [manga, setManga] = useState([]);
  const [topManga, setTopManga] = useState([]);
  const [newManga, setNewManga] = useState([]);

  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Save user info
    } else {
      localStorage.removeItem('user'); // Remove if logged out
    }
  }, [user]);

  useEffect(() => {
    const baseUrl = 'https://api.mangadex.org';
  
    const fetchManga = async () => {
      try {
        const response = await fetch(`${baseUrl}/manga?limit=100&includes[]=cover_art`);
        const data = await response.json();
        setManga(data.data);
  
        // Fetching top-rated manga
        const topResponse = await fetch(`${baseUrl}/manga?limit=100&order[rating]=desc&includes[]=cover_art`);
        const topData = await topResponse.json();
        setTopManga(topData.data);
  
        // Fetching newly released manga
        const newResponse = await fetch(`${baseUrl}/manga?limit=100&order[createdAt]=desc&includes[]=cover_art`);
        const newData = await newResponse.json();
        setNewManga(newData.data);
  
        // Send manga data to Flask backend for saving
        await fetch('http://localhost:5000/api/add-manga-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.data.map(manga => ({
            title: manga.attributes.title['en'],
            cover_image: manga.attributes.coverArt,
            content: manga.attributes.description['en'] || ''
          })))
        });
  
      } catch (error) {
        console.error("Error fetching manga data:", error);
      }
    };
  
    fetchManga();
  }, []);
  
  const handleLogout = () => {
    setUser(null); // Clear user state on logout
  };

  return (
    <Router>
      <div className="bg-black pb-10">
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Banner />
                <MangaList title={"Manga List"} manga={manga} />
                <MangaList title={"Top Manga"} manga={topManga} />
                <MangaList title={"New Manga"} manga={newManga} />
              </>
            } 
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search-by-emotion" element={<SearchByEmotion />} />
          <Route path="/manga/:title" element={<MangaDetail user={user} />} />
          
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/mypage" element={user ? <MyPage user={user} /> : <LoginPage setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
