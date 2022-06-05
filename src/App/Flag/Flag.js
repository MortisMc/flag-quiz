import React from 'react'
import Styles from './Flag.module.css'

export default function Flag({ country }) {
  return (
    <div className={Styles.component}>
      {/* inline height is made huge so it is bigger than max-height by default */}
      {country.flag && <img className={Styles.image} height='999999px' src={country.flag} alt={`Flag of ${country.name}`}/>}
    </div>
  );
}
