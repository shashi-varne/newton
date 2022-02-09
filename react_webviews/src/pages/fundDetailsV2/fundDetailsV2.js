import React, { useState } from 'react';
import Container from '../../designSystem/organisms/Container';
import HeaderTitle from '../../designSystem/molecules/HeaderTitle';
import { Box, Stack } from '@mui/material';
import Typography from '../../designSystem/atoms/Typography';
import { formatAmountInr } from '../../utils/validators';
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

  return (
    <Container headerProps={{ hideHeaderTitle: true }} className='fund-details-wrapper'>
      <HeaderTitle
        title='ICICI Prudential Technology Direct Plan Growth'
        imgSrc={require('assets/amazon_pay.svg')}
        subTitleLabels={[{ name: 'low risk' }, { name: 'equity' }, { name: 'large cap' }]}
      />
      <Stack component='section' spacing={3}>
        <RowData
          leftTitle='NAV as on Aug 04'
          leftTitleColor='foundationColors.content.secondary'
          leftSubtitle={formatAmountInr(3000)}
          rightTitle='Returns (3Y)'
          rightTitleColor='foundationColors.content.secondary'
          rightSubtitle='10.91%'
          rightSubtitleColor='foundationColors.secondary.profitGreen.400'
          imgSrc={require('assets/amazon_pay.svg')}
        />
        <RowData
          leftTitle='Min. investment'
          leftTitleColor='foundationColors.content.secondary'
          leftSubtitle={formatAmountInr(1000)}
          rightTitle='Morning Star'
          rightTitleColor='foundationColors.content.secondary'
          rightSubtitle='10.91%'
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
              <Typography variant='heading4'>9+ yrs</Typography>
              <Typography variant='body5' color='foundationColors.content.secondary'>
                (since Jan 01,2003)
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
              2665 Cr
            </Typography>
          </Stack>
        </Stack>

        <Stack direction='row' justifyContent='space-between'>
          <Stack spacing='4px' direction='column'>
            <Typography allCaps variant='body9' color='foundationColors.content.secondary'>
              Expense ratio
            </Typography>
            <Typography variant='heading4'>0.45%</Typography>
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
          <div>
            <Typography variant='heading4' allCaps>
              1.00%
            </Typography>
            <Typography component='span' variant='body5' color='foundationColors.content.secondary'>
              (if redeemed within 1 year)
            </Typography>
          </div>

          <div>
            <Typography variant='heading4' allCaps>
              1.00%
            </Typography>
            <Typography component='span' variant='body5' color='foundationColors.content.secondary'>
              (if redeemed within 1 year)
            </Typography>
          </div>

          <div>
            <Typography variant='heading4' allCaps>
              1.00%
            </Typography>
            <Typography component='span' variant='body5' color='foundationColors.content.secondary'>
              (if redeemed within 1 year)
            </Typography>
          </div>
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

      <Box sx={{ mt: 4 }} component='section'>
        <CollapsibleSection
          isOpen={isAssetOpen}
          onClick={handleAssetSection}
          label='Asset allocation'
        >
          <Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Stack direction='column' spacing='4px'>
                <Typography variant='body8'>Equity • 95%</Typography>
                <Box
                  sx={{
                    height: '4px',
                    width: '100%',
                    backgroundColor: 'foundationColors.secondary.profitGreen.400',
                  }}
                />
              </Stack>
              <Stack direction='column' spacing='4px'>
                <Typography variant='body8'>Debt • 3%</Typography>
                <Box
                  sx={{
                    height: '4px',
                    width: '100%',
                    backgroundColor: 'foundationColors.secondary.mango.400',
                  }}
                />
              </Stack>
              <Stack direction='column' spacing='4px'>
                <Typography variant='body8'>Others • 2%</Typography>
                <Box
                  sx={{
                    height: '4px',
                    width: '100%',
                    backgroundColor: 'foundationColors.secondary.coralOrange.400',
                  }}
                />
              </Stack>
            </Stack>
            <Separator marginTop='16px' />

            <Stack sx={{ pt: 3 }} spacing={2}>
              <Typography variant='heading4'>Top Holdings</Typography>
              {[1, 2, 3, 4].map((el, idx) => {
                return (
                  <Stack key={idx} direction='row' justifyContent='space-between'>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      Facebook Co.
                    </Typography>
                    <Typography variant='heading4' color='foundationColors.content.secondary'>
                      16.15%
                    </Typography>
                  </Stack>
                );
              })}
              <Button title='View all holdings' variant='link' />
            </Stack>
            <Separator marginTop='16px' />

            <Stack sx={{ pt: 3, pb: 2 }} spacing={2}>
              <Typography variant='heading4'>Top sectors</Typography>
              {[1, 2, 3, 4].map((el, idx) => {
                return (
                  <Stack key={idx} direction='row' justifyContent='space-between'>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      Finance
                    </Typography>
                    <Typography variant='heading4' color='foundationColors.content.secondary'>
                      25.15%
                    </Typography>
                  </Stack>
                );
              })}
              <Button title='View all sectors' variant='link' />
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
                <ReturnView />
              </SwiperSlide>
              <SwiperSlide>
                <RollingReturn />
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
        <Typography variant='body2' color={rightTitleColor}>
          {rightTitle}
        </Typography>
        <Stack direction='row' alignItems='center' spacing={1}>
          {imgSrc && <Icon size='16px' src={imgSrc} />}
          <Typography variant='heading3' color={rightSubtitleColor}>
            {rightSubtitle}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

const RollingReturn = () => {
  const [investmentYear, setInvestmentYear] = useState(0);

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
          {[1, 1, 1].map((el, idx) => {
            return (
              <Stack key={idx} direction='column' spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body8' color='foundationColors.content.secondary'>
                    Minimum
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

const ReturnView = () => {
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack direction='column' spacing={3}>
        {[1, 2, 3, 4].map((el, idx) => {
          return (
            <Stack key={idx} direction='row' justifyContent='space-between'>
              <Typography variant='body8' color='foundationColors.content.secondary'>
                Facebook Co.
              </Typography>
              <Typography variant='heading4' color='foundationColors.content.secondary'>
                16.15%
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default FundDetailsV2;
