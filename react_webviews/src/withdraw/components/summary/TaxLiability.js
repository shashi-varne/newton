import React from 'react'

const TaxLiability = (props) => {
  const { stcg, ltcg } = props
  return (
    <section className="withdraw-summary-liability Card">
      <div className="title">Tax liability</div>
      <main className="breakdown">
        <div className="item flex-between-center">
          <div className="name">STCG tax**</div>
          <div className="value">₹ {Math.ceil(stcg)}</div>
        </div>
        <div className="item flex-between-center">
          <div className="name">LTCG tax**</div>
          <div className="value">₹ {Math.ceil(ltcg)}</div>
        </div>
      </main>
      <hr className="ruler" />
      <footer className="total flex-between-center">
        <div className="name">Total tax</div>
        <div className="value">₹ {Math.ceil(stcg + ltcg)}</div>
      </footer>
    </section>
  )
}

export default TaxLiability
