import { useState, useEffect } from 'react'

const key = '891dc1f0'

// reder logic can't have data which have to be fetched from outside the component or else it will create a loop of re rendering the component
// that's why we use useEffect hook

// promises are good but don't have await so we wrap our fetch inside async function instead

export default function useFetch(query, callback) {  // don't pass parameters like props ({props}) it will throw error instead do (...args) like normal functions 

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')

    useEffect(function () {
        callback?.()
        async function fetchMovies() {
            const controller = new AbortController() // abort controller is for cancelling out the small request and get the last request (decreases loadtime)
            try {
                setIsLoading(true);
                setError('')
                const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&s=${query}`,
                    { signal: controller.signal })
                if (!res.ok)
                    throw new Error('oops something went wrong!')
                const data = await res.json()
                if (data.Response === 'False')
                    throw new Error('Movie not found')
                setMovies(data.Search)
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
        // handleCloseMovie()
        fetchMovies()
    }, [query])


    return { movies, isLoading, error }
}
