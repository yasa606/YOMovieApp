import "../css/Favorites.css"
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";


const Favourite = () => {
  const {favourite} = useMovieContext()
  
  if (favourite){
    return(
      <div className="favourites">
        <h1>YOUR FAVOURITES</h1>
      <div className='movies-grid'>
        {favourite.map(
          (movie) =>
           (<MovieCard key={movie.id} movie={movie} />))}
      </div></div>
    )
  }
  
  
  
  return  (


  <div className="favourites-empty">
      <h2> No favourites yet</h2>
      <p>Start adding your favourite movies to your list!</p>
    </div>
  )
}

export default Favourite;