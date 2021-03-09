import React from 'react'

const Disclaimer = ({ disclaimers }) => {
  return (
    <section className="withdraw-summary-disclaimers">
      <div className="title">
        Disclaimer
      </div>
      {disclaimers.map((disclaimer, idx) => (
        <div className="disclaimer" key={idx}>
          {disclaimer}
        </div>
      ))}
    </section>
  )
}

export default Disclaimer