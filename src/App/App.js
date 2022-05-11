import React, { useEffect, useState} from 'react';
import { deburr } from 'lodash';
import Styles from './App.module.css';

// Components
import Interface from './Interface';
import Flag from './Flag';
import Dashboard from './Dashboard';

function changeGameMode(studyMode, score, setPreviousScore, setScore, setStudyMode, setCountry, countries){
  if (!studyMode && score) setPreviousScore( () => score ); // Only overrides previous score if score is non-zero
  setScore( () => 0 );
  if (studyMode) nextCountry(setCountry, countries);
  setStudyMode( current => !current );
}

function getRandomCountryIndex(countries){
  const length = countries.length;
  const random = Math.random() * length;
  return Math.floor(random);
}

function nextCountry(setCountry, countries){
  setCountry(countries[getRandomCountryIndex(countries)]);
}

export default function App() {
  const [studyMode, setStudyMode] = useState(false);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState({ name: 'Loading...', flag: 'https://i.gifer.com/ZZ5H.gif'});
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  
  useEffect(() => {
    // Fetch all required data on page-load
    fetch(`https://restcountries.com/v3.1/all`)
    .then( res => res.json())
    .then( res => {
      const countriesRes = res.map( x => {
        // Only consider independent countries
        if (!x.independent) return null;
        const widthSpecifierString = /320/g
        return {
          // deburr removes accents from letters
          name : deburr(x.name.common),
          flag : x.flags.png.replace(widthSpecifierString,'1280' )
        }
      })
      // Filters out the empty elements leftover from non-independent countries
      .filter( x => x);
      setCountries( () => countriesRes );
      setCountry(countriesRes[getRandomCountryIndex(countriesRes)]);
    })
  },[])

  const interfaceProps = {
    country,
    countries,
    studyMode,
    setScore,
    setCountry,
    nextCountry
  }

  const dashboardProps = {
    studyMode,
    country,
    countries,
    score,
    previousScore,

    setPreviousScore,
    setScore,
    setStudyMode,
    changeGameMode,
    nextCountry,
    setCountry 
  }
  
  return (
    <div className={Styles.component}>
      <Interface {...interfaceProps} />
      <Flag country={country} />
      <Dashboard {...dashboardProps} />
    </div>
  );
}
