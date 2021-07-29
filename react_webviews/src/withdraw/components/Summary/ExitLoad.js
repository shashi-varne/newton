import React from 'react'
import './ExitLoad.scss';
import { formatAmountInr } from 'utils/validators'
const ExitLoad = ({ exit_load }) => {
  return (
    <section className="withdraw-summary-exitload Card" data-aid='withdraw-summary-exitload'>
      <div className="title">Exit Load implication</div>
      <div className="total flex-between-center">
        <div className="name">Exit load</div>
        <div className="value">{formatAmountInr(exit_load)}</div>
      </div>
    </section>
  )
}

export default ExitLoad