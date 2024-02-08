import { useEffect, useRef, useState } from "react";
import StarRatings from './StarRatings';
import useFetch from './CustomHooks/useFetch';
import useLocalStorage from './CustomHooks/useLocalStorage';
import useKey from './CustomHooks/useKey';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = '891dc1f0'

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)
  // const [watched, setWatched] = useState([]);

  // custom hooks for fetching data and handling error with isLoading state
  const { movies, isLoading, error } = useFetch(query, handleCloseMovie)
  const [watched, setWatched] = useLocalStorage([], 'watched')

  // const [watched, setWatched] = useState(function () {
  //   const storedVal = localStorage.getItem('watched')
  //   return JSON.parse(storedVal)
  // }); // we are passing this as a callback function so state will execute it on initial render and the return value will be
  // // the value stored inside of it

  // useEffect(() => {
  //   localStorage.setItem('watched', JSON.stringify(watched))
  // }, [watched])


  function getId(id) {
    setSelectedId(id === selectedId ? null : id)
  }

  function onAddWatched(movie) {
    setWatched((movies) => [...movies, movie])
    // localStorage.setItem('watched', JSON.stringify([...watched, movie])) a simple way to store previous data into localstorage 
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
  const inputRef = useRef(null)


  useKey('Enter', function () {
    if (document.activeElement === inputRef.current) return
    inputRef.current.focus()
    setQuery('')
  })

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inputRef.current) return // this will check if input is already focused then it won't execute the effect code below

      if (e.code === 'Enter') {
        inputRef.current.focus()
        setQuery('')
      }
    }
    document.addEventListener('keydown', callback)

    inputRef.current.focus()

    return () => document.removeEventListener('keydown', callback)

    // const el = document.querySelector('.search')
    // el.focus()

  }, [setQuery])


  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputRef}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}


function SelectedMovie({ selectedId, handleCloseMovie, onAddWatched, watched }) {
  const [selectedData, setSelectedData] = useState({})
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState('')

  const cookies = useRef([])
  useKey('Escape', handleCloseMovie)

  useEffect(() => {
    if (ratings) cookies.current.push(ratings)
  })

  const { Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,

  } = selectedData

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.ratings

  useEffect(function () {

    async function getMovieDetails() {
      setLoading(true)
      let res = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`)
      let data = await res.json()
      // console.log(data);
      setSelectedData(data)
      setLoading(false)
    }
    getMovieDetails()
  }, [selectedId]) // why we used selectedId here as dependency :- because it is the unique value that changes every time component mounts
  // not the selectedData.




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
      cookies,
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
                  <StarRatings maxRating={10} size={23} ref={cookies} onSetRating={setRatings} />
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