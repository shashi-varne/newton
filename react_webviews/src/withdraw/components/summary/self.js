import React, { useState } from 'react'
import Container from '../../common/Container'
import TaxSummaryCard from '../../mini_components/TaxSummaryCard'
import ExitLoad from './ExitLoad'
import TaxLiability from './TaxLiability'

const SelfSummary = (props) => {
  return (
    <Container hideInPageTitle noFooter>
      <section id="withdraw-manual-summary">
        <TaxLiability stcg={4} ltcg={5} />
        <ExitLoad exit_load={0} />
        <div className="tax-summary">
          Tax Summary
        </div>
        <main className="fund-list">
          <TaxSummaryCard />
          <TaxSummaryCard />
          <TaxSummaryCard />
        </main>
      </section>
    </Container>
  )
}

export default SelfSummary
