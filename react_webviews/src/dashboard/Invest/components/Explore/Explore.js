import React,{useState,useEffect} from 'react'
import Container from '../../../common/Container'

import diy_equity_icon from 'assets/diy_equity_icon.svg'
import diy_debt_icon from 'assets/diy_debt_icon.svg'
import diy_hybrid_icon from 'assets/diy_hybrid_icon.svg'
import diy_goal_icon from 'assets/diy_goal_icon.svg'
import { storageService } from 'utils/validators'
import InvestExploreCard from './InvestExploreCard'
import { navigate as navigateFunc } from "utils/functions";

import { getTrendingFunds, getSubCategories } from '../../common/api'
import { CART, CATEGORY, FUNDSLIST, SUBCATEGORY } from '../../../DIY/constants'
import isEmpty from 'lodash/isEmpty';
import './Explore.scss';

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
    storageService().remove(CATEGORY)
    storageService().remove(SUBCATEGORY)
    fetchTrendingFunds()
  }, [])

  const fetchTrendingFunds = async () => {
    try {
      const categoryList = storageService().getObject('diystore_categoryList')
      if(isEmpty(categoryList)) {
        const data = await getTrendingFunds()
        const categories = await getSubCategories()
        storageService().setObject('diystore_trending', data.trends)
        storageService().setObject('diystore_categoryList', categories.result)
      }
      setLoader(false)        
    } catch (err) {
      setLoader(false)
      console.log('the error is', err)
    }
  }
  const navigate = navigateFunc.bind(props)
  const goNext = (title) => () => {
    navigate(`/invest/explore/${title}`)
  }

  const handleRightIconClick = () => {
    navigate("/diy/invest/search")
  }

  return (
    <Container
      data-aid='explore-all-mutual-funds-screen'
      classOverRIde="pr-error-container"
      noFooter
      title="Explore All Mutual Funds"
      classOverRideContainer="pr-container"
      handleClick={goNext}
      skelton={loader}
      rightIcon="search"
      handleTopIcon={handleRightIconClick}
    >
      <section className="invest-explore-cards" id="invest-explore" data-aid='invest-explore'>
        <div className='title'>Where do you want to invest?</div>
        {exploreMFMappings.map(({ title, description, src }) => (
          <div key={title} onClick={goNext(title)} data-aid={`explore-mf-${title}`}>
            <InvestExploreCard
              title={title}
              description={description}
              src={src}
            />
          </div>
        ))}
        <article className="invest-explore-quote" data-aid='invest-explore-quote'>
          "When you invest you are buying a day you don’t have to work"
        </article>
      </section>
    </Container>
  )
}

export default InvestExplore
