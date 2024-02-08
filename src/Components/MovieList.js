
export default function MovieList({ movies, getId }) {

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