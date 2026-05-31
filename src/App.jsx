import "../src/css/App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Favourite from "./pages/Favourites";
import Navbar from "./components/NavBar";
import { MovieProvider } from "./context/MovieContext";
import MovieDetails from "./pages/MovieDetails";

const App = () => {
  
  return (
    <MovieProvider>
      <Navbar />
      <main> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Favourites" element={<Favourite />} />
        <Route path="/movie/:id" element= {<MovieDetails/>}/>
      </Routes>   
      </main>
    </MovieProvider>
  )
};

export default App;
