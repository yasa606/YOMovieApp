import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";

const MovieContext = createContext()

export const useMovieContext = () =>  useContext(MovieContext)

export const MovieProvider = ({children})=>{
  // Lazy initialization from localStorage
  const [favourite, setFavourite] = useState(() => {
    try {
      const storedFavs = localStorage.getItem("favourite")
      if (storedFavs) {
        return JSON.parse(storedFavs)
      }
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error)
    }
    return []
  })

  useEffect(()=>{
    localStorage.setItem('favourite', JSON.stringify(favourite))
  },[favourite])

  const addToFavourites = useCallback((movie) => {
    setFavourite(prev => {
      // Check if movie already exists to prevent duplicates
      if (prev.some(fav => fav.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    })
  }, [])

  const removeFromFavourites = useCallback((movieId) => {
    setFavourite(prev => prev.filter(movie => movie.id !== movieId))
  }, [])

  const isFavourite = useCallback((movieId) => {
    return favourite.some(movie => movie.id === movieId)
  }, [favourite])

  const value = useMemo(() => ({
    favourite,
    addToFavourites,
    removeFromFavourites,
    isFavourite
  }), [favourite, addToFavourites, removeFromFavourites, isFavourite])


  return <MovieContext.Provider value={value}>
    {children}
  </MovieContext.Provider>
}