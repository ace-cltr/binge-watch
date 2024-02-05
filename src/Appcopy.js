import { useEffect, useState } from "react";
import StarRatings from './StarRatings';

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = '891dc1f0'

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)


  function getId(id) {
    setSelectedId(id === selectedId ? null : id)
  }

  // reder logic can't have data which have to be fetched from outside the component or else it will create a loop of re rendering the component
  // that's why we use useEffect hook

  // promises are good but don't have await so we wrap our fetch inside async function instead
  useEffect(function () {
    async function fetchMovies() {
      const controller = new AbortController()
      try {
        setIsLoading(true);
        setError('')
        const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal })
        if (!res.ok)
          throw new Error('oops something went wrong!')
        const data = await res.json()
        if (data.Response === 'False')
          throw new Error('Movie not found')
        setMovies(data.Search)
        console.log(data.Search)
      }
      catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      }
      finally {
        setIsLoading(false);
      }
    }

    if (query.length < 1) {
      setMovies([])
      setError('')
      return;
    }
    handleCloseMovie()
    fetchMovies()
  }, [query])

  function onAddWatched(movie) {
    setWatched((movies) => [...movies, movie])
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((el) => el.imdbID !== id))
  }


  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        {/* <Box tags={<MovieList movies={movies} />} />  another way to pass props */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} getId={getId} />}
          {error && <ErrorMessage message={error} />}
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
        </Box>
        <Box>{selectedId ?
          <SelectedMovie selectedId={selectedId} handleCloseMovie={handleCloseMovie} onAddWatched={onAddWatched}
            watched={watched} /> :
          <>
            <WatchedSummary watched={watched} />
            <WatchedMoviesList watched={watched} handleDeleteWatched={handleDeleteWatched} />
          </>}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔</span>{message}
    </p>
  )
}

function Loader() {
  return (
    // <p className="loader">Loading...</p>
    <div className="loader">
      <div className="loading-spinner">
      </div>
    </div>
  )
}

function Navbar({ children }) {

  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>bingeWatch</h1>
    </div>
  )
}


function Search({ query, setQuery }) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}


function SelectedMovie({ selectedId, handleCloseMovie, onAddWatched, watched }) {
  const [selectedData, setSelectedData] = useState({})
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState('')


  const { Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,

  } = selectedData

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.ratings

  useEffect(function () {

    async function getMovieDetails() {
      setLoading(true)
      let res = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`)
      if (!res.ok) {
        throw new Error('Failed to get movie details')
      }
      let data = await res.json()
      // console.log(data);
      setSelectedData(data)
      setLoading(false)
    }
    getMovieDetails()
  }, [selectedId]) // why we used selectedId here as dependency :- because it is the unique value that changes every time component mounts
  // not the selectedData.

  
  useEffect(() => {
    function callback (e){
      if (e.code === 'Escape')
        handleCloseMovie()
      console.log('hola');
    }
    document.addEventListener('keydown', callback)
    return ()=>{document.removeEventListener('keydown', callback)}
  }, [handleCloseMovie])

  useEffect(() => {
    if (!title) return
    document.title = `binge | ${title}`
    return () => document.title = 'bingeWatch'
  }, [title])

  function handleAdd() {
    const selectedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      ratings,
    }
    onAddWatched(selectedMovie)
    handleCloseMovie()
  }


  return (
    <div className='details'>
      {loading ? <Loader /> :
        <>
          <header>
            <button className='btn-back' onClick={handleCloseMovie}>&larr;</button> {/* &larr is backtick symbol */}
            <img src={poster} alt={`poster of ${selectedData} movie`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>
                <span>⭐</span>
                {selectedData.imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {isWatched ? <p>You have already rated this movie {watchedUserRating}<span>⭐</span></p> :
                <>
                  <StarRatings maxRating={10} size={23} onSetRating={setRatings} />
                  {ratings > 0 && <button className='btn-add' onClick={handleAdd} >Add to list</button>}
                </>
              }
            </div>
            <p><em>{plot}</em></p>
            <p>Starring : {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>}
    </div>
  )
}


function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}


function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  )
}



function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 &&
        children
      }
    </div>
  )
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  )
}
*/


function MovieList({ movies, getId }) {

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} getId={getId} />
      ))}
    </ul>
  )
}

function Movie({ movie, getId }) {
  return (
    <li onClick={() => getId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}



function WatchedSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.ratings));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span> {/* toFixed(2) is used for no of decimals to be shown */}
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}


function WatchedMoviesList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} handleDeleteWatched={handleDeleteWatched} />
      ))}
    </ul>
  )
}


function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.ratings}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className='btn-delete' onClick={() => handleDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li>
  )
}