import React from 'react'
import Container from '../../common/Container'
import TaxSummaryCard from '../../mini_components/TaxSummaryCard'

const Insta = (props) => {
  return (
    <Container hideInPageTitle noFooter>
      <section id="withdraw-insta-summary">
        <div className="title">Tax Summary</div>
        <TaxSummaryCard hideIcon={true} />
      </section>
    </Container>
  )
}

export default Insta
