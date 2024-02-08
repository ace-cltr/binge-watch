import { useEffect, useRef, } from "react";
import useKey from '../CustomHooks/useKey';

export default function Search({ query, setQuery }) {
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