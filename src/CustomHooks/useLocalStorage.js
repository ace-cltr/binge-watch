import { useState, useEffect } from 'react';

export default function useLocalStorage(initialState, key) {

    const [value, setValue] = useState(function () {
        const storedVal = localStorage.getItem(key)
        return storedVal ? JSON.parse(storedVal) : initialState
      }); // we are passing this as a callback function so state will execute it on initial render and the return value will be
      // the value stored inside of it
    
      useEffect(() => {
        localStorage.setItem('value', JSON.stringify(value))
      }, [value])

  return [value, setValue]
}
