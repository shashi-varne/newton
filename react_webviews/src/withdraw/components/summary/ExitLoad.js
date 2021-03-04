import React from 'react'

const ExitLoad = ({ exit_load }) => {
  return (
    <section className="withdraw-summary-exitload Card">
      <div className="title">Exit Load</div>
      <div className="total flex-between-center">
        <div className="name">Exit load</div>
        <div className="value">₹ {exit_load || 0}</div>
      </div>
    </section>
  )
}

export default ExitLoad