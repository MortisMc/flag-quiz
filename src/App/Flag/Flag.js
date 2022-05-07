import React from 'react'
import Styles from './Flag.module.css'

export default function Flag({ country }) {
  return (
    <div className={`${Styles.component} box`}>
      <img className={Styles.image} src={country.flag} alt={`Flag of ${country.name || 'flag not found'}`} />
    </div>
  );
}
