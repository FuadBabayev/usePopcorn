import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt0068646",
    Title: "The Godfather",
    Year: "1972",
    Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0468569",
    Title: "The Dark Knight",
    Year: "2008",
    Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0167260",
    Title: "The Lord of the Rings: The Return of the King",
    Year: "2003",
    Poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0120689",
    Title: "The Green Mile",
    Year: "1999",
    Poster: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_SX300.jpg",
  },  
  {
    imdbID: "tt0816692",
    Title: "Interstellar",
    Year: "2014",
    Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },  
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
];
const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = 'a37aafc2';

export default function App() {
  // ! Sabit deyiskenleri Componentden kenarda yazmaq lazimdir. Eger componentn icinde yazsaq her state update olanda Componentin icindeki butun datalar render olur
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState([]);
  const tempQuery = 'interstellar';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');      // ! Lift up from Search Component
  const [selectedId, setSelectedId] = useState(null);
  // const [infinity, setInfinity] = useState(777); setInfinity(777);  // ! Sonsuz donguye girir cunki state update edilir eyni olsalar bele (her defe tekrar olunur)

  // useEffect(function(){
  //   fetch(` http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=interstellar`)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       setMovies([...movies, ...data.Search])
  //     })
  // }, [])
  // Todo: console.log(data) yazsaq hec bir prablem yoxdur 1 defe isleyib dayacanaq cunki state update olunmur saytda hec bir deyisiklik olmur
  // Todo: setMovies(data) yazsaq ise her defe state update olur deye yeniden render olunacaq ve bu proses sonsuz davam edecek
  // ! Problemin qarsisini almaq ucun hemin funksiya useEffect()-de yazilir. By default effect run after every render. Prevented by Dependency Array
  // ? useEffect() geriye deyer donmeyen RETURN etmeyen ve Asynchronously isleyene React Hooks-dur
  // ! useEffect Hook: give us a place where we can safely write side effects (side effects: Data Fetching, Timers, DOM ). 
  // ! Effect runs ASynchronously (executed after browser render) because may contain long-running process (like fetching API)
  // ! Dependecy Array []: empty means effect will only run on mount. When App component render first time (initial Render) 
  // useEffect(()=> console.log('Second'), []);    //  II   (1ce defe initial render olur)
  // useEffect(()=> console.log('Third'));         //  III  (Lyboy Dependecy (props, state) deyisende re-render olur)
  // console.log("First");                         //  I    (Lyboy Dependecy (props, state) deyisende re-render olur)
  // Todo: Ve YUxaridakilardan First ve Third her onChange olanda cixir


  function handleSelectMovie(id) {
    setSelectedId((selectedId) => selectedId === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');       // ! Bunu burada mutleq yazmaq lazimdir cunki throw new Error(Movie not found) olur evvelce bosluq olanda sonra hemiselik qalmamasi ucun 
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Something went wrong with Fetching movies');
        const data = await response.json();
        if (data.Response === 'False') throw new Error(`Movie ${query} not found!`);
        setMovies(data.Search);
        setError('');                                           // ! AbortController()-e gore yeniden Erroru sifirlayiriq
      } catch (error) {
        if (error.name !== "AbortError") setError(error.message);
      } finally {
        setIsLoading(false);
      }

      if (query.length < 3) {
        setError('');
        // setMovies([]);
        // handleAddWatched();
        return;
      }
    };
    fetchMovies();

    return () => {
      controller.abort();
    };
    // return () => document.title = 'usePopcorn';                 // ! Component WillUnMount (Cleaning Up)
  }, [query]);                                                     // ! Component DidMount/Update

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {/* {isLoading ? <Loader /> : error ? <ErrorMessage message={error}/> : <MovieList movies={movies} error={error} />} */}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
        </Box>

        <Box>
          {selectedId
            ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} />
            : (<>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>)}
        </Box>
      </Main>
    </>
  );
}



function Loader() {
  return (
    <>
      <p className="loader">Loading...</p>
    </>
  )
}
function ErrorMessage({ message }) {
  return (
    <>
      <p className="error"><span>⛔</span> {message}</p>
    </>
  )
}

function NavBar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  )
}

function Logo() { return <div className="logo"><span role="img">🍿</span><h1>usePopcorn</h1></div> }
function NumResults({ movies }) { return <p className="num-results">Found <strong>{movies.length}</strong> results</p> }

function Search({ query, setQuery }) {
  return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />
}

function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  )
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="box">
        <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>{isOpen ? "–" : "+"}</button>
        {isOpen && children}
      </div>
    </>
  )
}



function MovieList({ movies, onSelectMovie }) {
  return (
    <>
      <ul className="list list-movies">
        {movies && movies.map((movie) => <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />)}
      </ul>
    </>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <>
      <li onClick={() => onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div><p><span>🗓</span><span>{movie.Year}</span></p></div>
      </li>
    </>
  )
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await response.json();
      setMovie(data);
      setIsLoading(false);
    };
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `${title}`;
    return () => document.title = 'usePopcorn';                 // ! Component WillUnMount (Cleaning Up)
    // setTimeout(() => {
    //   document.title = 'usePopcorn';
    // }, 3000);
  }, [title]);

  useEffect(() => {
    function callback(e){
      if (e.code === "Escape") {
        onCloseMovie();
        // console.log(`${e.code} is pressed`);
      }
    }

    document.addEventListener('keydown', callback);                               // ! Her defe Esc basanda saylari artirdi
    return () =>  document.removeEventListener('keydown', callback);              // ! Component WilUnMount-da remove ederek qarsisini aldiq
  }, [onCloseMovie]);

  return (
    <>
      <div className="details">
        {isLoading ? <Loader /> : (<>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>⬅</button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p><span>⭐️</span>{imdbRating} IMDb Rating</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched
                ? <p>You rated with movie {watchedUserRating} ⭐</p>
                : (<>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating}
                    messages={['Bad', 'Poor', 'Unsatisfactory', 'Not Bad', 'Average', 'Satisfactory', 'Good', 'Solid', 'Excellent', 'Superb']} />
                  {userRating > 0 && <button className="btn-add" onClick={() => handleAdd()}>+ Add to List</button>}
                </>)
              }
            </div>
            <p><em>{plot}</em></p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>)}
      </div>
    </>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p><span>#️⃣</span><span>{watched.length} movies</span></p>
          <p><span>⭐️</span><span>{avgImdbRating.toFixed(2)}</span></p>
          <p><span>🌟</span><span>{avgUserRating.toFixed(2)}</span></p>
          <p><span>⏳</span><span>{avgRuntime} min</span></p>
        </div>
      </div>
    </>
  )
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />)}
      </ul>
    </>
  )
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <>
      <li>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h4>{movie.title}</h4>
        <div>
          <p><span>⭐️</span><span>{movie.imdbRating}</span></p>
          <p><span>🌟</span><span>{movie.userRating}</span></p>
          <p><span>⏳</span><span>{movie.runtime} min</span></p>
          <button onClick={() => onDeleteWatched(movie.imdbID)} className="btn-delete">X</button>
        </div>
      </li>
    </>
  )
}
