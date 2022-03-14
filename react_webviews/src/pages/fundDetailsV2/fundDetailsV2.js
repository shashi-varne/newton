import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import NavigationPill from '../../designSystem/atoms/NavigationPill';
import HeaderTitle from '../../designSystem/molecules/HeaderTitle';
import NavigationPopup from '../../designSystem/molecules/NavigationPopup';
import Container from '../../designSystem/organisms/ContainerWrapper';
import { validateKycAndRedirect } from '../DIY/common/functions';
import AssetAllocation from './AssetAllocation';
import './fundDetailsV2.scss';
import FundGraph from './FundGraph';
import FundPerformance from './FundPerformance';
import FundStats from './FundStats';
import ReturnCalculator from './ReturnCalculator';
import ReturnComparison from './ReturnComparison';
import Returns from './Returns';
import RiskDetails from './RiskDetails';

const FundDetailsV2 = (props) => {
  const {
    handleBack,
    ctaText,
    addFundToCart,
    cartCount,
    navigate,
    kyc,
    isFisdom,
    isfundAdded,
    isPageLoading,
    isLoading,
    fundData,
    fundStatRef,
    returnCalcRef,
    riskDetailsRef,
    assetAllocRef,
    returnsRef,
    returnCompRef,
    fundDetailsRef,
    sendEvents,
  } = props;

  return (
    <Container
      headerProps={{
        dataAid: 1,
        hideHeaderTitle: true,
        onBackClick: handleBack,
      }}
      footer={{
        button1Props: {
          title: ctaText,
          onClick: addFundToCart,
        },
        confirmActionProps: {
          title: `${cartCount} ${cartCount > 1 ? 'items' : 'item'} saved in your cart`,
          buttonTitle: 'View Cart',
          badgeContent: cartCount,
          onButtonClick: validateKycAndRedirect({ navigate, kyc }),
          dataAid: 'viewCart',
        },
        hideButton1: isFisdom && isfundAdded,
        hideConfirmAction: !isFisdom || !isfundAdded,
      }}
      isPageLoading={isPageLoading || isLoading || isEmpty(fundData)}
      renderComponentAboveFooter={
        <CustomJumpTo
          fundStatRef={fundStatRef}
          returnCalcRef={returnCalcRef}
          assetAllocRef={assetAllocRef}
          returnsRef={returnsRef}
          riskDetailsRef={riskDetailsRef}
          returnCompRef={returnCompRef}
          fundDetailsRef={fundDetailsRef}
          sendEvents={sendEvents}
        />
      }
      className='fund-details-wrapper'
      fixedFooter
      noPadding
      dataAid='fundDetails'
    >
      <Box sx={{ pb: 2 }}>
        <Box sx={{ bgcolor: 'foundationColors.supporting.white', p: '3px 16px' }}>
          <HeaderTitle
            title={fundData?.performance?.friendly_name}
            imgSrc={fundData?.performance?.amc_logo_small}
            subTitleLabels={[
              { name: fundData?.performance?.ms_risk },
              { name: fundData?.performance?.category },
              { name: fundData?.performance?.subcat },
            ]}
            dataAid='1'
          />
        </Box>
        <FundPerformance />
        <FundGraph />
        <div ref={fundStatRef}>
          <FundStats />
        </div>
        <div className='fund-details-section' ref={returnCalcRef}>
          <ReturnCalculator fundDetailsRef={fundDetailsRef} sendEvents={sendEvents}/>
        </div>
        <div className='fund-details-section' ref={assetAllocRef}>
          <AssetAllocation fundDetailsRef={fundDetailsRef} sendEvents={sendEvents} />
        </div>
        <div className='fund-details-section' ref={returnsRef}>
          <Returns fundDetailsRef={fundDetailsRef} sendEvents={sendEvents} />
        </div>
        <div className='fund-details-section' ref={riskDetailsRef}>
          <RiskDetails fundDetailsRef={fundDetailsRef} sendEvents={sendEvents} />
        </div>
        <div className='fund-details-section' ref={returnCompRef}>
          <ReturnComparison />
        </div>
      </Box>
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
  fundDetailsRef,
  sendEvents,
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
    fundDetailsRef.current = {
      ...fundDetailsRef.current,
      jumpTo: options[index],
    };
    sendEvents('back');
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
        dataAid='jumpTo'
      />
      <NavigationPopup
        activeIndex={activeSection}
        options={options}
        anchorEl={anchorEl}
        onClose={onClose}
        handleClick={handleSectionNavigation}
        dataAid='1'
      />
    </Stack>
  );
};

export default FundDetailsV2;
