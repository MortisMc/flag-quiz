import React, { useEffect, useState} from 'react';
import Styles from './App.module.css';

// Components
import Interface from './Interface';
import Flag from './Flag';
import Dashboard from './Dashboard';

export default function App() {
  const [studyMode, setStudyMode] = useState(true);
  const [country, setCountry] = useState({});
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  
  // TEMPORARY ############ Just to get rid of warnings
  useEffect(()=>{
    const country = {name: 'Egypt'};
    setCountry( () => country);
    setScore( () => 0 );
    setPreviousScore( () => 0 );
  },[])

  function changeGameMode(){
    if (!studyMode && score) setPreviousScore( () => score ); // Only overrides previous score if score is non-zero
    setScore( () => 0 )
    setStudyMode( current => !current );
  }

  const controlsProps = {
    studyMode,
    country,
    score,
    previousScore,

    changeGameMode
  }
  
  return (
    <div className={Styles.component}>
      <Interface />
      <Flag />
      <Dashboard {...controlsProps} />
    </div>
  );
}
