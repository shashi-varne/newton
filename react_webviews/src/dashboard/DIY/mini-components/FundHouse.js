import React from 'react'
import CheckIcon from '@material-ui/icons/Done'
import { getFundHouses } from '../functions'
import "./mini-components.scss";

const FundHouse = ({ localFundHouse, setLocalFundHouse }) => {
  const fundHouses = getFundHouses()

  return (
    <section className="diy-fund-houses" data-aid='diy-fund-houses'>
      {fundHouses.map((house, idx) => (
        <div key={idx} className="house" onClick={() => setLocalFundHouse(house)} data-aid={`set-local-fund-house-${idx}`}>
          <CheckIcon
            className={house === localFundHouse ? 'checked' : ''}
          />
          <div className="house-name" data-aid={`set-house-name-${idx}`}>{house}</div>
        </div>
      ))}
    </section>
  )
}

export default FundHouse
