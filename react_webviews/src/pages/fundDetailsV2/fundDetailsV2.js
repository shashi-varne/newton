import React, { useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../designSystem/organisms/Container';
import HeaderTitle from '../../designSystem/molecules/HeaderTitle';
import Box from '@mui/material/Box';
import isEmpty from 'lodash/isEmpty';
import ReturnCalculator from './ReturnCalculator';
import AssetAllocation from './AssetAllocation';
import Returns from './Returns';
import RiskDetails from './RiskDetails';
import ReturnComparison from './ReturnComparison';
import FundStats from './FundStats';
import FundGraph from './FundGraph';
import Api from '../../utils/api';
import FundPerformance from './FundPerformance';
import NavigationPopup from '../../designSystem/molecules/NavigationPopup';
import NavigationPill from '../../designSystem/atoms/NavigationPill';
import { fetchFundDetails, getFundData } from 'businesslogic/dataStore/reducers/fundDetails';
import { useDispatch, useSelector } from 'react-redux';
import scrollIntoView from 'scroll-into-view-if-needed';

import './fundDetailsV2.scss';
import { Stack } from '@mui/material';
import { getConfig } from '../../utils/functions';
import { getUrlParams } from '../../utils/validators';
import { getPageLoading } from 'businesslogic/dataStore/reducers/loader';


const screen = 'fundDetailsV2';
const FundDetailsV2 = () => {
  const dispatch = useDispatch();
  const fundData = useSelector(getFundData);
  let { isins } = getUrlParams();
  const isPageLoading = useSelector(state => getPageLoading(state, screen));
  const fundStatRef = useRef();
  const returnCalcRef = useRef();
  const assetAllocRef = useRef();
  const returnsRef = useRef();
  const riskDetailsRef = useRef();
  const returnCompRef = useRef();
  const { productName } = useMemo(getConfig, []);
  const ctaText = productName === 'fisdom' ? 'ADD TO CART' : 'INVEST NOW';
  const cartCount = 0;
  useEffect(() => {
    console.log("fund data is",fundData);
    const payload = {
      isins,
      Api,
      screen,
    };
    if(isins !== fundData?.isin) {
      dispatch(fetchFundDetails(payload));
    }
  }, []);

  return (
    <Container
      headerProps={{ hideHeaderTitle: true }}
      footer={{
        button1Props: {
          title: ctaText,
        },
        hideButton1: cartCount > 0,
        hideConfirmAction: cartCount <= 0,
      }}
      isPageLoading={isPageLoading || isEmpty(fundData)}
      renderComponentAboveFooter={
        <CustomJumpTo
          fundStatRef={fundStatRef}
          returnCalcRef={returnCalcRef}
          assetAllocRef={assetAllocRef}
          returnsRef={returnsRef}
          riskDetailsRef={riskDetailsRef}
          returnCompRef={returnCompRef}
        />
      }
      className='fund-details-wrapper'
      fixedFooter
    >
      <Box sx={{ mt: 3, mb: 3 }}>
        <HeaderTitle
          title={fundData?.performance?.friendly_name}
          imgSrc={fundData?.performance?.amc_logo_big}
          subTitleLabels={[
            { name: fundData?.performance?.ms_risk },
            { name: fundData?.performance?.category },
            { name: 'large cap' },
          ]}
        />
      </Box>
      <FundPerformance />
      <FundGraph />
      <div ref={fundStatRef}>
        <FundStats />
      </div>
      <div ref={returnCalcRef}>
        <ReturnCalculator />
      </div>
      <div ref={assetAllocRef}>
        <AssetAllocation />
      </div>
      <div ref={returnsRef}>
        <Returns />
      </div>
      <div ref={riskDetailsRef}>
        <RiskDetails />
      </div>
      <div ref={returnCompRef}>
        <ReturnComparison />
      </div>
    </Container>
  );
};

const CustomJumpTo = ({
  fundStatRef,
  returnCalcRef,
  assetAllocRef,
  returnsRef,
  riskDetailsRef,
  returnCompRef,
}) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const [activeSection, setActiveSection] = useState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  const SectionRefs = [
    fundStatRef,
    returnCalcRef,
    assetAllocRef,
    returnsRef,
    riskDetailsRef,
    returnCompRef,
  ];

  const options = [
    'Fund stats',
    'Return calculator',
    'Asset allocation',
    'Returns',
    'Risk details',
    'Return comparison',
  ];

  const handleSectionNavigation = (index) => {
    setActiveSection(index);
    scrollIntoView(SectionRefs[index].current, {
      behavior: 'smooth',
    });
    onClose();
  };

  return (
    <Stack alignItems='center' justifyContent='center'>
      <NavigationPill
        backgroundColor='foundationColors.content.primary'
        label='Jump To'
        onClick={handleClick}
      />
      <NavigationPopup
        activeIndex={activeSection}
        options={options}
        anchorEl={anchorEl}
        onClose={onClose}
        handleClick={handleSectionNavigation}
      />
    </Stack>
  );
};

export default FundDetailsV2;
