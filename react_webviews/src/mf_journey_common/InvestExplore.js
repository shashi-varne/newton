import React from 'react'
import Container from '../fund_details/common/Container'

import diy_equity_icon from '../assets/diy_equity_icon.svg'
import diy_debt_icon from '../assets/diy_debt_icon.svg'
import diy_hybrid_icon from '../assets/diy_hybrid_icon.svg'
import diy_goal_icon from '../assets/diy_goal_icon.svg'

import InvestExploreCard from './components/InvestExploreCard'

export const exploreMFMappings = [
  {
    title: 'Equity',
    description: 'Invest in large, mid and small-sized companies',
    src: diy_equity_icon,
  },
  {
    title: 'Debt',
    description: 'Stable returns with bonds and securities',
    src: diy_debt_icon,
  },
  {
    title: 'Hybrid',
    description: 'Perfect balance of equity and debt',
    src: diy_hybrid_icon,
  },
  {
    title: 'Goal Oriented',
    description: 'Align investments with your life goals',
    src: diy_goal_icon,
  },
]

const InvestExplore = () => {
  return (
    <Container
      classOverRIde="pr-error-container"
      noFooter
      helpContact
      hideInPageTitle
      title="Explore All Mutual Funds"
      classOverRideContainer="pr-container"
    >
      <section className="invest-explore-cards" id="invest-explore">
        {exploreMFMappings.map(({ title, description, src }) => (
          <InvestExploreCard
            key={title}
            title={title}
            description={description}
            src={src}
          />
        ))}
        <article className="invest-explore-quote">
        "When you invest you are buying a day you don’t have to work"
        </article>
      </section>
    </Container>
  )
}

export default InvestExplore
