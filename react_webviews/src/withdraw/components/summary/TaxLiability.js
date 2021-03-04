import React from 'react'

const TaxLiability = (props) => {
  const { stcg, ltcg } = props
  return (
    <section className="withdraw-summary-liability Card">
      <div className="title">Tax liability</div>
      <main className="breakdown">
        <div className="item flex-between-center">
          <div className="name">STCG tax**</div>
          <div className="value">₹ {stcg || 4}</div>
        </div>
        <div className="item flex-between-center">
          <div className="name">LTCG tax**</div>
          <div className="value">₹ {ltcg || 0}</div>
        </div>
      </main>
      <hr className="ruler" />
      <footer className="total flex-between-center">
        <div className="name">Total tax</div>
        <div className="value">₹ {stcg + ltcg || 4}</div>
      </footer>
    </section>
  )
}

export default TaxLiability