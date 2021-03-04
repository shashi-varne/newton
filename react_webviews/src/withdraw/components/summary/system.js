import React, { useState } from 'react'
import Container from '../../common/Container'
import TaxSummaryCard from '../../mini_components/TaxSummaryCard'

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

const SelfSummary = (props) => {
  return (
    <Container hideInPageTitle noFooter>
      <section id="withdraw-system-summary">
        <TaxLiability stcg={4} ltcg={5} />
        <ExitLoad exit_load={0} />
        <div className="tax-summary">
          Tax Summary
        </div>
        <main className="fund-list">
          <TaxSummaryCard />
        </main>
      </section>
    </Container>
  )
}

export default SelfSummary
