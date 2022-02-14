import React, { useEffect, useState } from 'react';
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
import {fetch_fund_details} from 'businesslogic/apis/fundDetails';

import './fundDetailsV2.scss';

const FundDetailsV2 = () => {
  const [fundData, setFundData] = useState({});

  const fetchFundData = async () => {
    const fund = await fetch_fund_details(Api, 'INF109K01480');
    const data = fund?.text_report[0];
    console.log(data);
    setFundData(data);
  };
  useEffect(() => {
    fetchFundData();
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
      <FundPerformance fundData={fundData} />
      <FundGraph />
      <FundStats fundData={fundData} />
      <ReturnCalculator fundData={fundData} />
      <AssetAllocation fundData={fundData} />
      <Returns fundData={fundData} />
      <RiskDetails fundData={fundData} />
      <ReturnComparison />
    </Container>
  );
};

export default FundDetailsV2;
