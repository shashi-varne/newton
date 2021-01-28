import React, { useState } from 'react'
import CheckIcon from '@material-ui/icons/Done'
import { getFundHouses } from '../functions'

const FundHouse = () => {
  const fundHouses = getFundHouses()
  const [selected, setSelected] = useState('')
  return (
    <section className="diy-fund-houses">
      {fundHouses.map((house) => (
        <div className="house" onClick={() => setSelected(house)}>
          <CheckIcon
            className={selected === house ? 'checked' : ''}
          />
          <div className="house-name">{house}</div>
        </div>
      ))}
    </section>
  )
}

export default FundHouse
