import { useState } from "react";
import useFetch from './CustomHooks/useFetch';
import useLocalStorage from './CustomHooks/useLocalStorage';


import Box from './Components/Box';
import ErrorMessage from './Components/ErrorMessage';
import Loader from './Components/Loader';
import Logo from './Components/Logo';
import MovieList from './Components/MovieList';
import Navbar from './Components/Navbar';
import NumResults from './Components/NumResults';
import Search from './Components/Search';
import SelectedMovie from './Components/SelectedMovie';
import WatchedMoviesList from './Components/WatchedMovieList';
import WatchedSummary from './Components/WatchedSummary';
import Main from "./Components/Main";




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






