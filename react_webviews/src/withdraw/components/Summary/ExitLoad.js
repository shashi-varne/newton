import React from 'react'
import './ExitLoad.scss';
const ExitLoad = ({ exit_load }) => {
  return (
    <section className="withdraw-summary-exitload Card">
      <div className="title">Exit Load</div>
      <div className="total flex-between-center">
        <div className="name">Exit load</div>
        <div className="value">₹ {Math.ceil(exit_load)}</div>
      </div>
    </section>
  )
}

export default ExitLoad