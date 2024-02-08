

export default function WatchedMoviesList({ watched, handleDeleteWatched }) {
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