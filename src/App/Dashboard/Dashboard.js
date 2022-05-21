import React, { useRef, useEffect } from 'react';
import Styles from './Dashboard.module.css';

export default function Dashboard({
  studyMode,
  country,
  countries,
  score,
  highScore,

  setHighScore,
  setScore,
  setStudyMode,
  changeGameMode,
  nextCountry,
  setCountry,
  changeHighScore
}) {
  const handleClick = () => changeGameMode(studyMode, score, countries, highScore, setHighScore, setScore, setStudyMode, setCountry, changeHighScore);
  const handleNextClick = () => nextCountry(setCountry, countries);
  const highScoreRef = useRef();
  useEffect(() => { 
    highScoreRef.current.addEventListener('click', () => {
      if (window.confirm('Reset high score?')) changeHighScore(0, setHighScore);
    });
  },[changeHighScore, setHighScore])
  
  return (
    <div className={Styles.component}>
      <ul className={Styles.boxes}>
        <button className='box' onClick={handleClick}>{studyMode ? 'Start Quiz!' : 'Give up'}</button>
        <div className='box'>{studyMode ? country.name || 'Loading...' : `Score: ${score}`}</div>
        <button ref={highScoreRef} className='box'>High Score: {highScore}</button>
      </ul>
      {studyMode && <button className='box' onClick={handleNextClick}>Next Country</button>}
    </div>
  );
}
