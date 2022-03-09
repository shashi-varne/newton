import { Fade, Stack } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import TrusIcon from '../../designSystem/atoms/TrustIcon';
import Typography from '../../designSystem/atoms/Typography';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import EstimationCard from '../../designSystem/molecules/EstimationCard';
import Container from '../../designSystem/organisms/ContainerWrapper';
import { formatAmountInr } from '../../utils/validators';
import FundOrderItem from './FundOrderItem';
import './MfOrder.scss';
import MFSkeletonLoader from './MFSkeletonLoader';
import NoMfOrders from './NoMfOrders';

const MfOrder = (props) => {
  const {
    sendEvents,
    handlePlaceOrders,
    fundOrderDetails,
    isButtonLoading,
    isPageLoading,
    showLoader,
    isLoading,
    noMfOrdersAvailable,
    isProductFisdom,
    parentInvestmentType,
    handleInvestmentType,
    cartCount,
    setIsInvestmentValid,
    isInvestmentValid,
    setInvestedValue,
    setParentInvestmentType,
    investedValue,
    expectedAmount,
    expectedReturnData,
    handleTermsAndConditions,
  } = props;
  return (
    <Container
      eventData={sendEvents()}
      headerProps={{
        headerTitle: 'Mutual funds order',
        hideInPageTitle: true,
        dataAid: 'mutualFundOrder',
      }}
      footer={{
        button1Props: {
          title: 'Continue',
          onClick: handlePlaceOrders,
          disabled: isEmpty(fundOrderDetails),
          isLoading: isButtonLoading,
        },
      }}
      noFooter={isPageLoading}
      isPageLoading={showLoader || isLoading}
      className='mf-order-wrapper'
      dataAid='invest'
    >
      {noMfOrdersAvailable ? (
        <NoMfOrders />
      ) : (
        <>
          <Stack className='mf-order-section' direction='column' spacing={2} component='section'>
            {isProductFisdom && (
              <ParentInvestTypeSection
                parentInvestmentType={parentInvestmentType}
                isPageLoading={isPageLoading}
                handleInvestmentType={handleInvestmentType}
              />
            )}
            {isPageLoading ? (
              <Stack direction='column' spacing={3} sx={{ mt: 2 }}>
                {[...Array(cartCount).keys()]?.map((el, idx) => {
                  return <MFSkeletonLoader key={idx} isProductFisdom={isProductFisdom} />;
                })}
              </Stack>
            ) : (
              <Stack spacing='25px' className='mf-order-list'>
                {fundOrderDetails?.map((fundDetails, idx) => {
                  return (
                    <FundOrderItem
                      key={idx}
                      fundDetails={fundDetails}
                      parentInvestmentType={parentInvestmentType}
                      isProductFisdom={isProductFisdom}
                      setIsInvestmentValid={setIsInvestmentValid}
                      isInvestmentValid={isInvestmentValid}
                      setInvestedValue={setInvestedValue}
                      setParentInvestmentType={setParentInvestmentType}
                      dataAid={idx + 1}
                    />
                  );
                })}
              </Stack>
            )}

            <Fade in={!isProductFisdom && investedValue > 0} unmountOnExit mountOnEnter>
              <div>
                <WrapperBox elevation={1}>
                  <EstimationCard
                    leftTitle='Value after 10 years'
                    leftSubtitle='Return %'
                    rightTitle={`${formatAmountInr(expectedAmount)}`}
                    rightSubtitle={
                      expectedReturnData?.return > 0
                        ? `+${expectedReturnData?.return}%`
                        : expectedReturnData?.return
                    }
                    toolTipText={`Estimation based on last ${expectedReturnData?.name} of the fund.`}
                    dataAid='1'
                    toolTipDataAid='aftertenYears'
                  />
                </WrapperBox>
              </div>
            </Fade>

            {isProductFisdom ? (
              <Typography
                variant='body5'
                color='foundationColors.content.tertiary'
                dataAid='termsCondition'
              >
                By continue, I agree that I have read the{' '}
                <span className='pointer' onClick={handleTermsAndConditions}>
                  terms & conditions
                </span>
              </Typography>
            ) : (
              <TrusIcon variant='secure' opacity='0.6' dataAid='1' />
            )}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default MfOrder;

const ParentInvestTypeSection = ({ parentInvestmentType, isPageLoading, handleInvestmentType }) => {
  return (
    <Stack
      sx={{ mb: 1 }}
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      data-aid='grp_investmentType'
    >
      <Typography variant='heading4' dataAid='title'>
        Investment type
      </Typography>
      <Pills
        value={parentInvestmentType}
        disabled={isPageLoading}
        sx={{ pointerEvents: isPageLoading ? 'none' : 'default' }}
        onChange={handleInvestmentType}
      >
        <Pill label='SIP' value='sip' />
        <Pill label='Lumpsum' value='lumpsum' />
      </Pills>
    </Stack>
  );
};
