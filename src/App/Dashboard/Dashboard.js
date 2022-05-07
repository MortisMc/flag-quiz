import React from 'react';
import Styles from './Dashboard.module.css';

export default function Dashboard({studyMode, country, score, previousScore, changeGameMode}) {
  return (
    <div className={Styles.component}>
      <ul className={Styles.boxes}>
        <button className='box' onClick={changeGameMode}>Change game mode ({studyMode ? 'Start Quiz' : 'Give up'})</button>
        <div className='box'>{studyMode ? country.name : `Score: ${score}`}</div>
        <div className='box'>Previous Score: {previousScore}</div>
      </ul>
    </div>
  );
}
