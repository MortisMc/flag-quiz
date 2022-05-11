import React, { useState, useRef, useEffect } from 'react';
import Styles from './Interface.module.css';

function simplifyString(string){
  return string.replace(/\W/g, '').toLowerCase();
}

function handleCorrect(countries, inputRef, setScore, setCountry, nextCountry){
  setScore( current => current + 1 );
  inputRef.current.value = '';
  nextCountry(setCountry, countries);
}

function handleChange(event, country, countries, inputRef, setSuggestions, setScore, setCountry, nextCountry) {
  const names = [];
  const input = event.target.value;
  if (simplifyString(input) === simplifyString(country.name)) {
    handleCorrect(countries, inputRef, setScore, setCountry, nextCountry);
  }
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
  }, [studyMode])
  
  return (
    <div className={Styles.component}>
      <input ref={inputRef} onChange={(event) => handleChange(event, country, countries, inputRef, setSuggestions, setScore, setCountry, nextCountry)} type='text' placeholder='Type answer here' className='box'/>
      <ul className={`${Styles.suggestions} box`}>
        {suggestions.map( (x,i) => <li className={Styles.suggestion} key={i}>{x}</li> )}
      </ul>
    </div>
  );
}
