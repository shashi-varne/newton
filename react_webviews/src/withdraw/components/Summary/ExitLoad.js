import React from 'react'
import './ExitLoad.scss';
import { formatAmountInr } from 'utils/validators'
const ExitLoad = ({ exit_load }) => {
  return (
    <section className="withdraw-summary-exitload Card">
      <div className="title">Exit Load</div>
      <div className="total flex-between-center">
        <div className="name">Exit load</div>
        <div className="value">{formatAmountInr(exit_load)}</div>
      </div>
    </section>
  )
}

export default ExitLoad