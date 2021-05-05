import React from 'react'
import Button from '@material-ui/core/Button'
import { navigate as navigateFunc } from 'utils/functions'
import './mini-components.scss';

// Current Version of material ui does not have right alt icons
const RightAltIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      width="2em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path d="M36.01 11H4v2h12.01v3L20 12l-3.99-4v3z" />
    </svg>
  )
}

const tiles = [
  { title: 'Withdraw anytime', icon: 'withdraw_anytime_icn' },
  { title: 'Two tap withdraw', icon: 'two_tap_icn@4x' },
  { title: 'Tax efficient withdraw', icon: 'tax_icon@4x' },
  { title: 'Credit to your bank account', icon: 'bank_icon@4x' },
]

const Explore = (props) => {
  const navigate = navigateFunc.bind(props)
  const handleClick = () => {
    navigate('/invest', null, true)
  }
  return (
    <section className="withdraw-explore-investment-options">
      <main className="main">
        <img
          src={require(`assets/piggy_bank@4x.png`)}
          alt="Save Money"
          className="report-details-img"
        />
        <div className="top-text">You've not invested yet!</div>
        <Button className="cta-button" variant="raised" onClick={handleClick}>
          <span className="cta-button-text">explore investment options</span>
          <RightAltIcon className="cta-button-icon" />
        </Button>
      </main>
      <footer className="footer">
        <div className="tiles">
          {tiles.map(({ title, icon }) => (
            <div className="tile" key={icon}>
              <img src={require(`assets/${icon}.png`)} alt={title} width="60" />
              <div className="label">{title}</div>
            </div>
          ))}
        </div>
      </footer>
    </section>
  )
}

export default Explore
