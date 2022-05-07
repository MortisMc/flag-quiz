import React from 'react';
import Styles from './Interface.module.css';

const suggestions = new Array(5).fill(0);

export default function Interface() {
  return (
    <div className={Styles.component}>
      <input type='text' placeholder='Type answer here' className='box'/>
      <ul className={`${Styles.suggestions} box`}>
        {suggestions.map( (x,i) => <li key={i}>Suggestion {i+1}</li> )}
      </ul>
    </div>
  );
}
