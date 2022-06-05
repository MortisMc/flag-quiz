import React, { useState, useRef, useEffect } from 'react';
import Styles from './Interface.module.css';

// For country search =
function handleEnter(countries, inputRef, setCountry, setSuggestions){
  const input = inputRef.current;
  if (!input.value.length) return
  countries.forEach( (country) => {
    const name = country.name;
    if (simplifyString(name) === simplifyString(input.value)){
      input.value = '';
      setSuggestions([]);
      setCountry(country);
    }
  })
}

// For string comparison
function simplifyString(string){
  return string.replace(/\W/g, '').toLowerCase();
}

function handleInputChange(input, country, countries, studyMode, inputRef, setSuggestions, setScore, setCountry, nextCountry) {
  // For suggestion click events
  inputRef.current.value = input;
  inputRef.current.focus();

  // Clears suggestions if input is empty
  if (!input.length) {
    setSuggestions([]);
    return;
  }
  
  // Handles 'correct answer' scenario
  if (!studyMode && simplifyString(input) === simplifyString(country.name)) {
    setScore( current => current + 1 );
    inputRef.current.value = '';
    nextCountry(setCountry, countries);
    setSuggestions([]);
    return
  }

  // Displays relevent suggestions
  const names = [];
  countries.forEach( x => {
    const name = x.name
    if (simplifyString(name).includes(simplifyString(input))) names.push(name);
    setSuggestions(names);
  })

}

export default function Interface({ country, countries, studyMode, setScore, setCountry, nextCountry }) {
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.value = '';
    setSuggestions([]);
  }, [studyMode, setSuggestions]);
  
  return (
    <div className={Styles.component}>
      <input
        ref={inputRef}
        onKeyDown={(event) => { if (studyMode && event.key === 'Enter') handleEnter(countries, inputRef, setCountry, setSuggestions) } }
        onChange={(event) => handleInputChange(event.target.value, country, countries, studyMode, inputRef, setSuggestions, setScore, setCountry, nextCountry)}
        placeholder={studyMode ? 'Search country here' : 'Type answer here'}
        type='text'
        className='box'
      />
      {
      suggestions.length > 0 &&
        <ul className={`${Styles.suggestions} box`}>
          {suggestions.map( (x,i) => 
            <li 
              onClick={()=>handleInputChange(x, country, countries, studyMode, inputRef, setSuggestions, setScore, setCountry, nextCountry)}
              className={Styles.suggestion}
              key={i}
            >
              <button className={Styles.suggestionButton}>{x}</button>
            </li> )}
        </ul>
      }
    </div>
  );
}
