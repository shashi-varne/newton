import React,{useState,useEffect} from 'react'
import Container from '../../../common/Container'
import IframeView from './IframeView'

import diy_equity_icon from 'assets/diy_equity_icon.svg'
import diy_debt_icon from 'assets/diy_debt_icon.svg'
import diy_hybrid_icon from 'assets/diy_hybrid_icon.svg'
import diy_goal_icon from 'assets/diy_goal_icon.svg'
import equity_icon from 'assets/finity/equity_icon.svg';
import debt_icon from 'assets/finity/debt_icon.svg';
import hybrid_icon from 'assets/finity/hybrid_icon.svg';
import goal_icon from 'assets/finity/goal_icon.svg';
import { navigate as navigateFunc } from "utils/functions";
import { storageService } from 'utils/validators'
import InvestExploreCard from './InvestExploreCard'
import { getConfig } from "utils/functions";

import { getTrendingFunds, getSubCategories } from '../../common/api'
import { CART, CATEGORY, FUNDSLIST, SUBCATEGORY } from '../../../DIY/constants'
import isEmpty from 'lodash/isEmpty';
import './Explore.scss';
import { nativeCallback } from '../../../../utils/native_callback'
import { flowName } from '../../constants'
import { isNewIframeDesktopLayout } from '../../../../utils/functions'

const InvestExplore = (props) => {
  const [loader, setLoader] = useState(true)
  const config = getConfig();
  const iframe = config.isIframe;
  const isMobileDevice = config.isMobileDevice;
  const partnerCode = config.code;
  const newIframeDesktopLayout = isNewIframeDesktopLayout();

  const exploreMFMappings = [
    {
      title: 'Equity',
      description: 'Invest in large, mid and small-sized companies',
      src: newIframeDesktopLayout ? equity_icon : diy_equity_icon,
    },
    {
      title: 'Debt',
      description: 'Stable returns with bonds and securities',
      src: newIframeDesktopLayout ? debt_icon : diy_debt_icon,
    },
    {
      title: 'Hybrid',
      description: 'Perfect balance of equity and debt',
      src: newIframeDesktopLayout ? hybrid_icon : diy_hybrid_icon,
    },
    {
      title: 'Goal Oriented',
      description: 'Align investments with your life goals',
      src: newIframeDesktopLayout ? goal_icon : diy_goal_icon,
    },
  ]

  useEffect(() => {
    storageService().remove(FUNDSLIST)
    storageService().remove(CART)
    storageService().remove(CATEGORY)
    storageService().remove(SUBCATEGORY)
    fetchTrendingFunds()
    if(iframe) {
      const message = JSON.stringify({
        type: "iframe_landing_page"
      });
      window.callbackWeb.sendEvent(message)
    }
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
    }
  }
  const navigate = navigateFunc.bind(props)
  const goNext = (title) => () => {
    sendEvents('next', title)
    navigate(`/invest/explore/${title}`)
  }

  const handleRightIconClick = () => {
    navigate("/diy/invest/search")
  }

  const sendEvents = (userAction, cardClicked) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "screen_name": "explore all mutual fund",
        "user_action": userAction || "",
        "card_clicked": cardClicked || "",
        "flow": flowName['diy'],
        "source": ""
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      data-aid='explore-all-mutual-funds-screen'
      classOverRIde="pr-error-container"
      noFooter
      title={newIframeDesktopLayout ? "" : "Explore All Mutual Funds"}
      classOverRideContainer="pr-container"
      hidePageTitle={iframe && isMobileDevice}
      handleClick={goNext}
      skelton={loader}
      rightIcon="search"
      handleTopIcon={handleRightIconClick}
      disableBack={iframe && partnerCode === 'moneycontrol'}
      showIframePartnerLogo
    >
      {
        iframe && partnerCode === 'moneycontrol' ? <IframeView exploreMFMappings={exploreMFMappings} goNext={goNext} handleRightIconClick={handleRightIconClick}/> :
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
  }
    </Container>
  )
}

export default InvestExplore
