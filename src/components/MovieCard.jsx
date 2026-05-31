import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const { isFavourite, addToFavourites, removeFromFavourites } =
    useMovieContext();
  const favourite = isFavourite(movie.id);

  const onFavoriteClick = (e) => {
    e.preventDefault(); // stops link
    if (favourite) {
      removeFromFavourites(movie.id);
    } else {
      addToFavourites(movie);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-link">
      <div className="movie-card">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />

          <button
            className={`favorite-btn ${favourite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>

          <div className="rating">
            {movie.vote_average && movie.vote_average > 0
              ? `⭐ ${movie.vote_average.toFixed(1)}`
              : ""}
          </div>
        </div>

        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.release_date?.split("-")[0]}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
