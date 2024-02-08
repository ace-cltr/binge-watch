import { useEffect, useRef, useState } from "react";
import useKey from '../CustomHooks/useKey';
import Loader from './Loader';
import StarRatings from "../StarRatings";

const key = '891dc1f0'

export default function SelectedMovie({ selectedId, handleCloseMovie, onAddWatched, watched }) {
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