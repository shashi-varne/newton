import React, { useEffect, useState } from 'react';
import Container from '../../designSystem/organisms/Container';
import HeaderTitle from '../../designSystem/molecules/HeaderTitle';
import { Box, Stack } from '@mui/material';
import Typography from '../../designSystem/atoms/Typography';
import { formatAmountInr, inrFormatDecimal, nonRoundingToFixed } from '../../utils/validators';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import InputField from '../../designSystem/molecules/InputField';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import EstimationCard from '../../designSystem/molecules/EstimationCard';
import Separator from '../../designSystem/atoms/Separator';
import BarMeter from '../../designSystem/atoms/BarMeter';
import { Timelines, TimeLine } from '../../designSystem/atoms/TimelineList';
import Icon from '../../designSystem/atoms/Icon';
import CustomSwiper from '../../designSystem/molecules/CustomSwiper';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';

import './fundDetailsV2.scss';
import Button from '../../designSystem/atoms/Button';
import { SwiperSlide } from 'swiper/react';
import { fetch_fund_details } from '../../fund_details/common/ApiCalls';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import parse from 'date-fns/parse';
import meanBy from 'lodash/meanBy';

function calculateFullAge(dob) {
  const birthDate = parse(dob, 'dd/MM/yyyy', new Date());
  const { years, months, days } = intervalToDuration({ start: birthDate, end: new Date() });
  return { years, months, days };
}

const calculateFundAge = (fundAge) => {
  const fundDay = fundAge?.days || 0;
  const fundMonth = fundAge?.months || 0;
  const fundYear = fundAge?.years || 0;
  if (fundYear > 0) {
    const hasMonthOrDay = fundMonth > 0 || fundDay > 0;
    if (hasMonthOrDay) {
      return `${fundYear}+ yrs`;
    } else {
      return `${fundYear} yrs`;
    }
  } else if (fundMonth > 0) {
    const hasDay = fundDay > 0;
    if (hasDay) {
      return `${fundMonth}+ mnths`;
    } else {
      return `${fundMonth} mnths`;
    }
  } else {
    if (fundDay > 0) {
      return `${fundDay}+ days`;
    } else {
      return `${fundDay} days`;
    }
  }
};

const barMeterData = [
  {
    name: 'low',
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    name: 'above avg',
    value: 4,
  },
  {
    name: 'high',
    value: 5,
  },
];

const AssetColors = {
  Equity: 'foundationColors.secondary.profitGreen.400',
  Debt: 'foundationColors.secondary.mango.400',
  Others: 'foundationColors.secondary.coralOrange.400',
};

const FundDetailsV2 = () => {
  const [pillValue, setPillValue] = useState(0);
  const [isReturnCalcOpen, setIsReturnCalcOpen] = useState(false);
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const [investmentYear, setInvestmentYear] = useState(0);
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isRetunCompOpen, setIsRetunCompOpen] = useState(false);
  const [swiper, setSwiper] = useState('');
  const [fundData, setFundData] = useState({});
  const [viewMoreHolding, setViewMoreHolding] = useState(3);
  const [viewMoreSector, setViewMoreSector] = useState(3);

  const date = new Date();
  const dateFormat = format(date, 'MMM d, yyyy ');
  const fetchFundData = async () => {
    const fund = await fetch_fund_details('INF109K01480');
    const data = fund?.text_report[0];
    console.log(data);
    setFundData(data);
  };
  useEffect(() => {
    fetchFundData();
  }, []);

  const handleInvestmentYear = (e, value) => {
    setInvestmentYear(value);
  };

  const onPillChange = (e, value) => {
    setPillValue(value);
  };

  const handleReturnCalcSection = () => {
    setIsReturnCalcOpen(!isReturnCalcOpen);
  };

  const handleReturnSection = () => {
    setIsReturn(!isReturn);
  };

  const handleRiskAction = () => {
    setIsRiskOpen(!isRiskOpen);
  };

  const handleAssetSection = () => {
    setIsAssetOpen(!isAssetOpen);
  };

  const handleReturnCompSection = () => {
    setIsRetunCompOpen(!isRetunCompOpen);
  };

  const handleReturnValue = (e, value) => {
    setPillReturnValue(value);
    if (swiper) {
      swiper.slideTo(value);
    }
  };

  const handleSlideChange = (swiperRef) => {
    setPillReturnValue(swiperRef?.activeIndex);
  };

  const handleMoreHolding = () => {
    setViewMoreHolding(prevProp => prevProp + 10);
  };

  const handleMoreSector = () => {
    setViewMoreSector(prevProp => prevProp + 10);
  };

  if (isEmpty(fundData)) return <h1>Loading...!!</h1>;
  const minimumInvestment = orderBy(
    fundData?.additional_info?.minimum_investment,
    ['value'],
    ['asc']
  );

  const fullAgeData = calculateFullAge(fundData?.additional_info?.launch_date);
  const fundAge = calculateFundAge(fullAgeData);

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
      <Stack component='section' spacing={3}>
        <RowData
          leftTitle={`NAV as on ${format(
            new Date(fundData?.performance?.nav_update_date),
            'MMM d'
          )}`}
          leftTitleColor='foundationColors.content.secondary'
          leftSubtitle={formatAmountInr(fundData?.performance?.current_nav)}
          rightTitle='Returns (5Y)'
          rightTitleColor='foundationColors.content.secondary'
          rightSubtitle={`${fundData?.performance?.primary_return}%`}
          rightSubtitleColor='foundationColors.secondary.profitGreen.400'
          imgSrc={require('assets/amazon_pay.svg')}
        />
        <RowData
          leftTitle='Min. investment'
          leftTitleColor='foundationColors.content.secondary'
          leftSubtitle={formatAmountInr(minimumInvestment[0]?.value)}
          rightTitle='Morning Star'
          rightTitleColor='foundationColors.content.secondary'
          rightSubtitle={fundData?.performance?.ms_rating}
          rightSubtitleColor='foundationColors.secondary.mango.400'
          imgSrc={require('assets/amazon_pay.svg')}
        />
      </Stack>
      <Box
        sx={{
          height: '347px',
          width: '100%',
          backgroundColor: 'foundationColors.secondary.profitGreen.200',
        }}
      ></Box>
      <Stack sx={{ mt: 4, mb: 3 }} spacing={3}>
        <Typography variant='heading3'>Fund stats</Typography>
        <Stack direction='row' justifyContent='space-between'>
          <Stack spacing='4px' direction='column'>
            <Typography allCaps variant='body9' color='foundationColors.content.secondary'>
              Fund Age
            </Typography>
            <Stack direction='column'>
              <Typography variant='heading4'>{fundAge}</Typography>
              <Typography variant='body5' color='foundationColors.content.secondary'>
                {`since ${format(new Date(fundData?.additional_info?.launch_date), 'MMM d, yyyy')}`}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing='4px' direction='column'>
            <Typography
              allCaps
              variant='body9'
              align='right'
              color='foundationColors.content.secondary'
            >
              Total Aum
            </Typography>
            <Typography variant='heading4' align='right'>
              {`₹ ${fundData?.performance?.aum}`}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction='row' justifyContent='space-between'>
          <Stack spacing='4px' direction='column'>
            <Typography allCaps variant='body9' color='foundationColors.content.secondary'>
              Expense ratio
            </Typography>
            <Typography variant='heading4'>{`${fundData?.portfolio?.expense_ratio}%`}</Typography>
          </Stack>
          <Stack spacing='4px' direction='column'>
            <Typography
              align='right'
              allCaps
              variant='body9'
              color='foundationColors.content.secondary'
            >
              Lock-in
            </Typography>
            <Typography align='right' variant='heading4'>
              NA
            </Typography>
          </Stack>
        </Stack>

        <Stack direction='column' spacing='4px'>
          <Typography variant='body9' allCaps color='foundationColors.content.secondary'>
            Exit load
          </Typography>
          {fundData?.additional_info?.exit_load?.map((exitLoadData, idx) => {
            return (
              <div key={idx}>
                <Typography variant='heading4' allCaps>
                  {`${nonRoundingToFixed(exitLoadData?.value, 2)}${exitLoadData?.unit}`}
                </Typography>
                <Typography
                  component='span'
                  variant='body5'
                  color='foundationColors.content.secondary'
                >
                  {` (${exitLoadData?.period})`}
                </Typography>
              </div>
            );
          })}
        </Stack>
      </Stack>

      <section>
        <CollapsibleSection
          isOpen={isReturnCalcOpen}
          onClick={handleReturnCalcSection}
          label='Return calculator'
        >
          <Stack direction='column' spacing={3} sx={{ pb: 3 }}>
            <Box sx={{ maxWidth: 'fit-content' }}>
              <Pills value={pillValue} onChange={onPillChange}>
                <Pill label='SIP' />
                <Pill label='Lumpsum' />
              </Pills>
            </Box>

            <InputField label='Amount' prefix='₹' />
            <Stack direction='column' spacing={2}>
              <Typography variant='heading4' color='foundationColorContentSecondary'>
                Investment period
              </Typography>
              <Box sx={{ mt: 4, maxWidth: 'fit-content' }}>
                <Timelines value={investmentYear} onChange={handleInvestmentYear}>
                  <TimeLine label='1Y' />
                  <TimeLine label='3Y' />
                  <TimeLine label='5Y' />
                  <TimeLine label='10Y' />
                  <TimeLine label='15Y' />
                  <TimeLine label='20Y' />
                </Timelines>
              </Box>
            </Stack>
            <Separator />

            <Stack direction='row' justifyContent='space-between'>
              <Stack direction='column'>
                <Typography variant='heading2'>₹6L</Typography>
                <Typography variant='body1' color='foundationColors.content.secondary'>
                  You invested
                </Typography>
              </Stack>
              <Stack direction='column'>
                <Typography variant='heading2' color='primary' align='right'>
                  ₹9.2L
                </Typography>
                <Typography
                  variant='body1'
                  color='foundationColors.content.secondary'
                  align='right'
                >
                  Estimated return (+16.7%)
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CollapsibleSection>
      </section>

      <Box sx={{ mt: 4 }} component='section' className='fund-details-asset-section'>
        <CollapsibleSection
          isOpen={isAssetOpen}
          onClick={handleAssetSection}
          label='Asset allocation'
        >
          <Stack>
            <Stack direction='row' justifyContent='space-between'>
              {fundData?.portfolio?.asset_allocation?.map((assetData, idx) => {
                return (
                  <Stack key={idx} direction='column' spacing='4px'>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      {assetData?.name} • {assetData?.value || 0}%
                    </Typography>
                    <Box
                      sx={{
                        width: `${assetData?.value}%`,
                        backgroundColor: AssetColors[assetData?.name],
                      }}
                      className='fund-asset-perc'
                    />
                  </Stack>
                );
              })}
            </Stack>
            <Separator marginTop='16px' />

            <Stack sx={{ pt: 3 }} spacing={2}>
              <Typography variant='heading4'>Top Holdings</Typography>
              {fundData?.portfolio?.top_ten_holdings
                ?.slice(0, viewMoreHolding)
                .map((holding, idx) => {
                  return (
                    <Stack key={idx} direction='row' justifyContent='space-between'>
                      <Typography variant='body8' color='foundationColors.content.secondary'>
                        {holding?.name}
                      </Typography>
                      <Typography variant='heading4' color='foundationColors.content.secondary'>
                        {holding?.weighting}%
                      </Typography>
                    </Stack>
                  );
                })}
              {fundData?.portfolio?.top_ten_holdings?.length > viewMoreHolding && (
                <Button title='View all holdings' variant='link' onClick={handleMoreHolding} />
              )}
            </Stack>
            <Separator marginTop='16px' />

            <Stack sx={{ pt: 3, pb: 2 }} spacing={2}>
              <Typography variant='heading4'>Top sectors</Typography>
              {fundData?.portfolio?.sector_allocation?.slice(0, viewMoreSector).map((sector, idx) => {
                return (
                  <Stack key={idx} direction='row' justifyContent='space-between'>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      {sector?.name}
                    </Typography>
                    <Typography variant='heading4' color='foundationColors.content.secondary'>
                      {sector?.value}%
                    </Typography>
                  </Stack>
                );
              })}
              {fundData?.portfolio?.sector_allocation.length > viewMoreSector && (
                <Button title='View all sectors' variant='link' onClick={handleMoreSector} />
              )}
            </Stack>
          </Stack>
        </CollapsibleSection>
      </Box>

      <Box sx={{ mt: 4 }} component='section'>
        <CollapsibleSection isOpen={isReturn} onClick={handleReturnSection} label='Returns'>
          <Stack direction='column'>
            <Box>
              <Pills value={pillReturnValue} onChange={handleReturnValue}>
                <Pill label='Return' />
                <Pill label='Rolling return' />
              </Pills>
            </Box>
            <CustomSwiper
              slidesPerView={1}
              slidesPerColumn={1}
              onSlideChange={handleSlideChange}
              onSwiper={setSwiper}
              autoHeight
              hidePagination
            >
              <SwiperSlide>
                <ReturnView returns={fundData?.performance?.returns}/>
              </SwiperSlide>
              <SwiperSlide>
                <RollingReturn returns={fundData?.performance?.returns}/>
              </SwiperSlide>
            </CustomSwiper>
          </Stack>
        </CollapsibleSection>
      </Box>

      <Box sx={{ mt: 4 }}>
        <CollapsibleSection label='Risk details' isOpen={isRiskOpen} onClick={handleRiskAction}>
          <Box>
            <Stack direction='column' spacing={3}>
              <Stack direction='column' spacing={3}>
                <Typography>Risk vs Category</Typography>
                <BarMeter barMeterData={barMeterData} activeIndex={3} />
              </Stack>
              <Stack direction='column' spacing={3}>
                <Typography>Risk vs Category</Typography>
                <BarMeter barMeterData={barMeterData} activeIndex={3} />
              </Stack>
            </Stack>

            <Stack sx={{ mt: 4, mb: 2 }} direction='column' spacing={3}>
              <Typography variant='heading4'>Risk measures</Typography>
              {[1, 1, 1].map((el, idx) => {
                return (
                  <Stack key={idx} direction='column' spacing={2}>
                    <Stack direction='row' justifyContent='space-between'>
                      <Typography variant='body8' color='foundationColors.content.secondary'>
                        Alpha 3Y
                      </Typography>
                      <Typography variant='heading4' color='foundationColors.content.secondary'>
                        + 28.54%
                      </Typography>
                    </Stack>
                    <Separator />
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </CollapsibleSection>
      </Box>

      <Box sx={{ mt: 4 }}>
        <CollapsibleSection
          isOpen={isRetunCompOpen}
          onClick={handleReturnCompSection}
          label='Return comparison'
        >
          <Box>
            <Stack direction='column' spacing={3}>
              <Stack direction='row' spacing={1}>
                <Typography variant='body2' color='foundationColors.content.secondary'>
                  Investment amount:
                </Typography>
                <Typography variant='heading4'>₹10,51,220</Typography>
              </Stack>
              <Box
                sx={{
                  width: '100%',
                  height: '153px',
                  backgroundColor: 'foundationColors.primary.200',
                }}
              />
              <Stack direction='row' spacing={2}>
                <Typography variant='body5' color='foundationColors.content.secondary'>
                  Principal invested
                </Typography>
                <Typography variant='body5' color='foundationColors.content.secondary'>
                  Returns gained
                </Typography>
              </Stack>
              <Stack direction='column' spacing={2} sx={{ pb: 3 }}>
                <WrapperBox elevation={1}>
                  <EstimationCard
                    leftTitle='Estimated return'
                    leftSubtitle='Return %'
                    rightTitle='₹11,60,600.00'
                    rightSubtitle='+116.06%'
                    rightSubtitleColor='foundationColors.secondary.profitGreen.400'
                  />
                </WrapperBox>
                <Typography variant='body5' color='foundationColors.content.secondary'>
                  Note: Savings account & fixed deposit can at max give an average return of 6%
                  annually
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </CollapsibleSection>
      </Box>
    </Container>
  );
};

const RowData = ({
  leftTitle,
  leftTitleColor,
  leftSubtitle,
  rightTitle,
  rightTitleColor,
  rightSubtitle,
  rightSubtitleColor,
  imgSrc,
}) => {
  return (
    <Stack direction='row' justifyContent='space-between'>
      <Stack direction='column' spacing='4px'>
        <Typography variant='body2' color={leftTitleColor}>
          {leftTitle}
        </Typography>
        <Typography variant='heading3'>{leftSubtitle}</Typography>
      </Stack>
      <Stack direction='column' spacing='4px'>
        <Typography variant='body2' align='right' color={rightTitleColor}>
          {rightTitle}
        </Typography>
        <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={1}>
          {imgSrc && <Icon size='16px' src={imgSrc} />}
          <Typography variant='heading3' align='right' color={rightSubtitleColor}>
            {rightSubtitle}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

const RollingReturn = ({returns=[]}) => {
  const [investmentYear, setInvestmentYear] = useState(0);

  const minimun = returns[0]?.value;
  const maximum = returns[returns?.length - 1]?.value;

  const average = meanBy(returns, 'value');
  console.log("av",average);
  const NET_ASSET_VALUE = [
    {
      name: 'Minimum',
      value: minimun
    },
    {
      name: 'Maximum',
      value: maximum
    },
    {
      name: 'Average',
      value: inrFormatDecimal(average,2)
    },
  ]
  const handleInvestmentYear = (e, value) => {
    setInvestmentYear(value);
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack>
        <Typography>Investment period</Typography>
        <Box sx={{ mt: 4, maxWidth: 'fit-content' }}>
          <Timelines value={investmentYear} onChange={handleInvestmentYear}>
            <TimeLine label='1Y' />
            <TimeLine label='3Y' />
            <TimeLine label='5Y' />
            <TimeLine label='10Y' />
            <TimeLine label='15Y' />
            <TimeLine label='20Y' />
          </Timelines>
        </Box>
        <Stack sx={{ mt: 4, mb: 2 }} direction='column' spacing={3}>
          <Typography variant='heading4' color='foundationColors.content.secondary'>
            Net asset value
          </Typography>
          {NET_ASSET_VALUE?.map((net_asset, idx) => {
            return (
              <Stack key={idx} direction='column' spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body8' color='foundationColors.content.secondary'>
                    {net_asset?.name}
                  </Typography>
                  <Typography variant='heading4' color='foundationColors.content.secondary'>
                    + {net_asset?.value}%
                  </Typography>
                </Stack>
                <Separator />
              </Stack>
            );
          })}
        </Stack>
        <Box
          sx={{
            height: '300px',
            width: '100%',
            backgroundColor: 'foundationColors.secondary.profitGreen.200',
          }}
        />
      </Stack>
    </Box>
  );
};

const ReturnView = ({returns=[]}) => {
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack direction='column' spacing={3}>
        {returns?.map((returnData, idx) => {
          return (
            <Stack key={idx} direction='row' justifyContent='space-between'>
              <Typography variant='body8' color='foundationColors.content.secondary'>
                Last {returnData?.name}
              </Typography>
              <Typography variant='heading4' color='foundationColors.content.secondary'>
                {returnData?.value}%
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default FundDetailsV2;
