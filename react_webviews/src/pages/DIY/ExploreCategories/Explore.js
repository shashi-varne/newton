import React, { useEffect, useMemo } from 'react';
// import Container from '../../../common/Container';
import IframeView from './IframeView';

import diy_equity_icon from 'assets/diy_equity_icon.svg';
import diy_debt_icon from 'assets/diy_debt_icon.svg';
import diy_hybrid_icon from 'assets/diy_hybrid_icon.svg';
// import diy_goal_icon from 'assets/diy_goal_icon.svg'
import equity_icon from 'assets/finity/equity_icon.svg';
import debt_icon from 'assets/finity/debt_icon.svg';
import hybrid_icon from 'assets/finity/hybrid_icon.svg';
// import goal_icon from 'assets/finity/goal_icon.svg';
import { navigate as navigateFunc } from 'utils/functions';
import { storageService } from 'utils/validators';
import InvestExploreCard from './InvestExploreCard';
import { getConfig } from 'utils/functions';

// import { getDiyTrendingFunds, getSubCategories } from '../../common/api'
import isEmpty from 'lodash/isEmpty';
import './Explore.scss';
import { nativeCallback } from 'utils/native_callback';
import { isNewIframeDesktopLayout } from 'utils/functions';
import Api from 'utils/api';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDiyCategoriesAndTrendingFunds,
  setFundsCart,
  setFilteredFundList,
  getAllCategories,
  getTrendingFunds,
} from 'businesslogic/dataStore/reducers/diy';
import { resetFundDetails } from 'businesslogic/dataStore/reducers/fundDetails';
import { DEFAULT_FILTER_DATA } from 'businesslogic/constants/diy';
import { resetMfOrders } from 'businesslogic/dataStore/reducers/mfOrders';
import { CART, CATEGORY, FUNDSLIST, SUBCATEGORY } from '../../../dashboard/DIY/constants';
import useLoadingState from '../../../common/customHooks/useLoadingState';
import ContainerWrapper from '../../../designSystem/organisms/ContainerWrapper';
import { flowName } from '../../../dashboard/Invest/constants';

const screen = 'diyCategoryLanding';
const InvestExplore = (props) => {
  const config = getConfig();
  const iframe = config.isIframe;
  const isMobileDevice = config.isMobileDevice;
  const partnerCode = config.code;
  const dispatch = useDispatch();
  const { isPageLoading } = useLoadingState(screen);
  const trendingFunds = useSelector(getTrendingFunds);
  const allCategories = useSelector(getAllCategories);

  const newIframeDesktopLayout =
    isNewIframeDesktopLayout() || (partnerCode === 'moneycontrol' && !isMobileDevice);

  const exploreMFMappings = {
    Equity: {
      src: newIframeDesktopLayout ? equity_icon : diy_equity_icon,
    },
    Debt: {
      src: newIframeDesktopLayout ? debt_icon : diy_debt_icon,
    },
    Hybrid: {
      src: newIframeDesktopLayout ? hybrid_icon : diy_hybrid_icon,
    },
  };

  const getDiyCategories = () => {
    return allCategories.map(data => {
      return {
        ...data,
        ...exploreMFMappings[data.category]
      }
    })
  }

  const diyCategories = useMemo(getDiyCategories, [allCategories]);

  console.log("diyCategories ", diyCategories)
  useEffect(() => {
    if (isEmpty(trendingFunds) || isEmpty(allCategories)) {
      dispatch(fetchDiyCategoriesAndTrendingFunds({ Api, screen }));
    }
    dispatch(setFundsCart([]));
    dispatch(setFilteredFundList({ filterOptions: DEFAULT_FILTER_DATA }));
    dispatch(resetMfOrders());
    dispatch(resetFundDetails());
  }, []);

  useEffect(() => {
    storageService().remove(FUNDSLIST);
    storageService().remove(CART);
    storageService().remove(CATEGORY);
    storageService().remove(SUBCATEGORY);
    if (iframe) {
      const message = JSON.stringify({
        type: 'iframe_landing_page',
      });
      window.callbackWeb.sendEvent(message);
    }
  }, []);

  const navigate = navigateFunc.bind(props);
  const goNext = (title) => () => {
    sendEvents('next', title);
    navigate(`/diy/${title}/landing`);
  };

  const handleSearchIconClick = () => {
    navigate('/diy/invest/search');
  };

  const sendEvents = (userAction, cardClicked) => {
    let eventObj = {
      event_name: 'mf_investment',
      properties: {
        screen_name: 'explore all mutual fund',
        user_action: userAction || '',
        card_clicked: cardClicked || '',
        flow: flowName['diy'],
        source: '',
      },
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const isMoneyControlSdkIframe = (iframe || config.isSdk) && partnerCode === 'moneycontrol';

  return (
    <ContainerWrapper
      eventData={sendEvents('just_set_events')}
      dataAid='explore-all-mutual-funds-screen'
      noFooter
      headerProps={{
        headerTitle: 'Explore All Mutual Funds',
        hideHeaderTitle: partnerCode === 'moneycontrol',
        hideBackButton: isMoneyControlSdkIframe,
        rightIconSrc: !isMoneyControlSdkIframe && require('assets/search_diy.svg'),
        onRightIconClick: handleSearchIconClick,
      }}
      isPageLoading={isPageLoading}
      className='diy-explore-wrapper'
    >
      {partnerCode === 'moneycontrol' ? (
        <IframeView
          exploreMFMappings={diyCategories}
          goNext={goNext}
          handleRightIconClick={handleSearchIconClick}
        />
      ) : (
        <section className='invest-explore-cards' id='invest-explore' data-aid='invest-explore'>
          <div className='title'>Where do you want to invest?</div>
          {diyCategories.map(({ category, trivia, src }) => (
            <div key={category} onClick={goNext(category)} data-aid={`explore-mf-${category}`}>
              <InvestExploreCard title={category} description={trivia} src={src} />
            </div>
          ))}
          <article className='invest-explore-quote' data-aid='invest-explore-quote'>
            "When you invest you are buying a day you don’t have to work"
          </article>
        </section>
      )}
      {/* </Container> */}
    </ContainerWrapper>
  );
};

export default InvestExplore;
