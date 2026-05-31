import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMovieContext } from "../context/MovieContext";
import "../css/MovieDetails.css";

const API_KEY = "aab6da218d839d548c200c53fb600d9c";

const MovieDetails = () => {
  const { id } = useParams(); // movie id from URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const { isFavourite, addToFavourites, removeFromFavourites } =
    useMovieContext();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch movie details
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);

        // fetch trailer
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );
        const videoData = await videoRes.json();

        const trailer = videoData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleFavoriteClick = () => {
    if (movie) {
      if (isFavourite(movie.id)) {
        removeFromFavourites(movie.id);
      } else {
        addToFavourites(movie);
      }
    }
  };

  const favourite = movie ? isFavourite(movie.id) : false;

  if (loading) {
    return (
      <div className="movie-details">
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details">
        <p>{error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details">
        <p>Movie not found</p>
      </div>
    );
  }

  return (
    <div className="movie-details">
      {/* Movie Banner */}
      {movie.poster_path && (
        <div
          className={`movie-banner ${
            movie.backdrop_path ? "has-backdrop" : ""
          }`}
          style={
            movie.backdrop_path
              ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.75)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }
              : {}
          }
        >
          <div className="banner-overlay">
            <button className="back-button" onClick={() => navigate(-1)}>
              Back to Movies
            </button>
            <div className="banner-content">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="brand-pic"
              />
              <div className="banner-text">
                <h1>{movie.title}</h1>
                <div className="banner-meta">
                  {movie.vote_average && movie.vote_average > 0 && (
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  )}
                  <span>{movie.release_date?.split("-")[0] || ""}</span>
                  {movie.runtime && <span>{movie.runtime} min</span>}
                </div>
                <div className="banner-info-grid">
                  {movie.vote_average && movie.vote_average > 0 && (
                    <div className="banner-info-card">
                      <strong>Rating</strong>
                      <p>⭐ {movie.vote_average.toFixed(1)} / 10</p>
                    </div>
                  )}

                  <div className="banner-info-card">
                    <strong>Release Date</strong>
                    <p>{movie.release_date || "N/A"}</p>
                  </div>

                  {movie.runtime && (
                    <div className="banner-info-card">
                      <strong>Runtime</strong>
                      <p>{movie.runtime} minutes</p>
                    </div>
                  )}

                  {movie.genres && movie.genres.length > 0 && (
                    <div className="banner-info-card">
                      <strong>Genres</strong>
                      <p>{movie.genres.map((g) => g.name).join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!movie.poster_path && (
        <button className="back-button" onClick={() => navigate(-1)}>
          Back to Movies
        </button>
      )}

      <div className="movie-details-content">
        <div className="movie-details-info">
          <button
            className={`details-favorite-btn ${favourite ? "active" : ""}`}
            onClick={handleFavoriteClick}
          >
            {favourite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
          </button>
        </div>
      </div>

      {trailerKey && (
        <div className="movie-trailer">
          <strong>Trailer</strong>
          <div
            className={`trailer-wrapper ${
              movie.backdrop_path || movie.poster_path ? "has-thumb" : ""
            } ${isTrailerPlaying ? "playing" : ""}`}
            style={
              movie.backdrop_path || movie.poster_path
                ? {
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.6)), url(https://image.tmdb.org/t/p/original${
                      movie.backdrop_path || movie.poster_path
                    })`,
                  }
                : {}
            }
            onClick={() => {
              if (!isTrailerPlaying) {
                setIsTrailerPlaying(true);
                setTrailerLoading(true);
              }
            }}
          >
            {!isTrailerPlaying && (
              <button
                className="trailer-play"
                aria-label="Play trailer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTrailerPlaying(true);
                  setTrailerLoading(true);
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7L8 5z" fill="white" />
                </svg>
              </button>
            )}

            {isTrailerPlaying && (
              <>
                {trailerLoading && <div className="trailer-spinner" />}
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setTrailerLoading(false)}
                ></iframe>
              </>
            )}
          </div>
        </div>
      )}

      {movie.overview && (
        <div className="movie-overview">
          <strong>Overview</strong>
          <p>{movie.overview}</p>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
