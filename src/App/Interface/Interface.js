import React, { useState, useRef, useEffect } from 'react';
import Styles from './Interface.module.css';

// Simplify for string comparison
function simplifyString(string){
  return string.replace(/\W/g, '').toLowerCase();
}

function handleCorrect(countries, inputRef, setScore, setCountry, nextCountry){
  setScore( current => current + 1 );
  inputRef.current.value = '';
  nextCountry(setCountry, countries);
}

function handleInputChange(event, country, countries, inputRef, setSuggestions, setScore, setCountry, nextCountry) {
  const names = [];
  const input = event.target.value;
  // Clears suggestions if input is empty
  if (!input.length) {
    setSuggestions(names);
    return;
  }
  // Handles 'correct answer' scenario
  if (simplifyString(input) === simplifyString(country.name)) {
    handleCorrect(countries, inputRef, setScore, setCountry, nextCountry);
  }
  // Displays relevent suggestions
  else {
    countries.forEach( x => {
      const name = x.name
      if (simplifyString(name).includes(simplifyString(input))) names.push(name);
    })
  }
  setSuggestions(names);
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
      <input ref={inputRef} onChange={(event) => handleInputChange(event, country, countries, inputRef, setSuggestions, setScore, setCountry, nextCountry)} type='text' placeholder='Type answer here' className='box'/>
      {
      suggestions.length ?
        <ul className={`${Styles.suggestions} box`}>
          {suggestions.map( (x,i) => <li className={Styles.suggestion} key={i}>{x}</li> )}
        </ul>
      :
        null
      }
    </div>
  );
}
