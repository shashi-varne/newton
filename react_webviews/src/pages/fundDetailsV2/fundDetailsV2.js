import React, { useEffect } from 'react';
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
import {fetchFundDetails, getFundData} from 'businesslogic/dataStore/reducers/fundDetailsReducer';
import {useDispatch, useSelector} from 'react-redux';

import './fundDetailsV2.scss';

const FundDetailsV2 = () => {
  const dispatch = useDispatch();
  const fundData = useSelector(getFundData);
  useEffect(() => {
    const payload = {
      isins: 'INF109K01480',
      Api
    }
    dispatch(fetchFundDetails(payload))
  }, []);

  if (isEmpty(fundData)) return <h1>Loading...!!</h1>;

  return (
    <Container headerProps={{ hideHeaderTitle: true }} className='fund-details-wrapper'>
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
      <FundStats />
      <ReturnCalculator />
      <AssetAllocation />
      <Returns />
      <RiskDetails />
      <ReturnComparison />
    </Container>
  );
};

export default FundDetailsV2;
