import React from 'react';
import Styles from './Dashboard.module.css';

export default function Dashboard({studyMode, country, countries, score, previousScore, changeGameMode, setPreviousScore, setScore, setStudyMode, nextCountry, setCountry}) {
  const handleClick = () => changeGameMode(studyMode, score, setPreviousScore, setScore, setStudyMode, setCountry, countries);
  const handleNextClick = () => nextCountry(setCountry, countries);
  return (
    <div className={Styles.component}>
      <ul className={Styles.boxes}>
        <button className='box' onClick={handleClick}>{studyMode ? 'Start Quiz!' : 'Give up'}</button>
        <div className='box'>{studyMode ? country.name || 'Loading...' : `Score: ${score}`}</div>
        <div className='box'>Previous Score: {previousScore}</div>
      </ul>
      {studyMode ? <button className='box' onClick={handleNextClick}>Next Country</button> : null}
    </div>
  );
}
