import React, { useState, useEffect } from 'react'
import Container from '../../../../fund_details/common/Container'

import diy_equity_icon from 'assets/diy_equity_icon.svg'
import diy_debt_icon from 'assets/diy_debt_icon.svg'
import diy_hybrid_icon from 'assets/diy_hybrid_icon.svg'
import diy_goal_icon from 'assets/diy_goal_icon.svg'
import { navigate as navigateFunc } from '../../common/commonFunction'
import { storageService } from 'utils/validators'
import InvestExploreCard from './InvestExploreCard'

import { getTrendingFunds, getSubCategories } from '../../common/api'
import { CART, FUNDSLIST } from '../../../diy/constants'
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

const InvestExplore = (props) => {
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    storageService().remove(FUNDSLIST)
    storageService().remove(CART)
    fetchTrendingFunds()
  }, [])

  const fetchTrendingFunds = async () => {
    try {
      const data = await getTrendingFunds()
      const categories = await getSubCategories()
      storageService().setObject('diystore_trending', data.trends)
      storageService().setObject('diystore_categoryList', categories.result)
      setLoader(false)
      console.log('data is', data.trends)
      
    } catch (err) {
      setLoader(false)
      console.log('the error is', err)
    }
  }
  const navigate = navigateFunc.bind(props)
  const goNext = (title) => () => {
    navigate(`explore/${title}`, null, false, props.location.search)
  }
  return (
    <Container
      classOverRIde="pr-error-container"
      noFooter
      helpContact
      hideInPageTitle
      title="Explore All Mutual Funds"
      classOverRideContainer="pr-container"
      handleClick={goNext}
      showLoader={loader}
    >
      <section className="invest-explore-cards" id="invest-explore">
        {exploreMFMappings.map(({ title, description, src }) => (
          <div key={title} onClick={goNext(title)}>
            <InvestExploreCard
              title={title}
              description={description}
              src={src}
            />
          </div>
        ))}
        <article className="invest-explore-quote">
          "When you invest you are buying a day you don’t have to work"
        </article>
      </section>
    </Container>
  )
}

export default InvestExplore
