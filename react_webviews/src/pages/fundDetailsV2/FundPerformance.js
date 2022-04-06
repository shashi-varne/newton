import React, { memo, useMemo } from 'react';
import format from 'date-fns/format';
import { Skeleton, Stack } from '@mui/material';
import { formatAmountInr } from '../../utils/validators';
import orderBy from 'lodash/orderBy';
import parse from 'date-fns/parse';
import isEqual from 'lodash/isEqual';
import Typography from '../../designSystem/atoms/Typography';
import Icon from '../../designSystem/atoms/Icon';
import { useSelector } from 'react-redux';
import { getFundData } from 'businesslogic/dataStore/reducers/fundDetails';
import { isValidValue } from './helperFunctions';
import { Box } from '@mui/system';
import isEmpty from 'lodash/isEmpty';

const fetchReturns = (fundData) => {
  if (isEmpty(fundData)) {
    return {};
  }
  const returns = {};
  // eslint-disable-next-line no-unused-expressions
  fundData?.performance?.returns?.forEach((el) => {
    let [value, timePeriod] = el?.name?.split(' ');
    if (timePeriod.match(/month/)) {
      timePeriod = 'M';
    } else if (timePeriod.match(/year/)) {
      timePeriod = 'Y';
    }
    timePeriod = `${value}${timePeriod}`;
    returns[timePeriod] = el?.value;
  });

  return returns;
};
const FundPerformance = ({ isDataLoading }) => {
  const fundData = useSelector(getFundData);
  const fundTimePeriod = useSelector((state) => state?.fundDetails?.fundTimePeriod);
  const fundReturns = useMemo(() => fetchReturns(fundData), [isDataLoading]);
  console.log('fundReturns', fundReturns);

  const minimumInvestment = orderBy(
    fundData?.additional_info?.minimum_investment,
    ['value'],
    ['asc']
  );

  const NavDate = useMemo(() => {
    if (isDataLoading) {
      return '--';
    } else {
      const updatedData = fundData?.performance?.nav_update_date;
      if (updatedData) {
        const navValue = format(
          parse(fundData?.performance?.nav_update_date || '', 'dd/MM/yyyy', new Date()),
          'MMM d'
        );
        return navValue;
      } else {
        return 'NA';
      }
    }
  }, [isDataLoading]);
  return (
    <Stack
      sx={{ bgcolor: 'foundationColors.supporting.white', px: 2, pt: 4 }}
      component='section'
      spacing={3}
    >
      <RowData
        leftTitle={`NAV as on ${NavDate}`}
        leftTitleColor='foundationColors.content.secondary'
        leftSubtitle={formatAmountInr(fundData?.performance?.current_nav)}
        rightTitle={`Returns (${
          isDataLoading ? '--' : fundReturns[fundTimePeriod] ? fundTimePeriod : 'NA'
        })`}
        rightTitleColor='foundationColors.content.secondary'
        rightSubtitle={isValidValue(fundReturns[fundTimePeriod], `${fundReturns[fundTimePeriod]}%`)}
        rightSubtitleColor={
          fundReturns[fundTimePeriod] &&
          `foundationColors.secondary.${
            fundReturns[fundTimePeriod] > 0 ? 'profitGreen' : 'lossRed'
          }.400`
        }
        imgSrc={
          fundReturns[fundTimePeriod] &&
          require(`assets/${
            fundReturns[fundTimePeriod] > 0 ? 'positive_return' : 'negative_return'
          }.svg`)
        }
        leftTitleDataAid='navKey'
        leftSubtitleDataAid='navValue'
        rightTitleDataAid='returnKey'
        rightSubtitleDataAid='returnValue'
        rightIconDataAid='growth'
        isDataLoading={isDataLoading}
      />
      <RowData
        leftTitle='Min. investment'
        leftTitleColor='foundationColors.content.secondary'
        leftSubtitle={formatAmountInr(minimumInvestment[0]?.value)}
        rightTitle='Morningstar'
        rightTitleColor='foundationColors.content.secondary'
        rightSubtitle={isValidValue(fundData?.performance?.ms_rating)}
        rightSubtitleColor={
          fundData?.performance?.ms_rating && 'foundationColors.secondary.mango.400'
        }
        imgSrc={fundData?.performance?.ms_rating && require('assets/star_large.svg')}
        leftTitleDataAid='minimunInvestmentKey'
        leftSubtitleDataAid='minimunInvestmentValue'
        rightTitleDataAid='morningStarKey'
        rightSubtitleDataAid='morningStarRating'
        rightIconDataAid='star'
        isDataLoading={isDataLoading}
      />
    </Stack>
  );
};

export default FundPerformance;

const RowData = memo(
  ({
    leftTitle,
    leftTitleColor,
    leftSubtitle,
    rightTitle,
    rightTitleColor,
    rightSubtitle,
    rightSubtitleColor,
    imgSrc,
    leftTitleDataAid,
    leftSubtitleDataAid,
    rightTitleDataAid,
    rightSubtitleDataAid,
    rightIconDataAid,
    isDataLoading,
  }) => {
    return (
      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='column' spacing='4px'>
          <Typography variant='body2' color={leftTitleColor} dataAid={leftTitleDataAid}>
            {leftTitle}
          </Typography>
          {isDataLoading ? (
            <Box sx={{ width: '100%' }}>
              <TextLineLoader />
            </Box>
          ) : (
            <Typography variant='heading3' dataAid={leftSubtitleDataAid}>
              {leftSubtitle}
            </Typography>
          )}
        </Stack>
        <Stack direction='column' spacing='4px'>
          <Typography
            variant='body2'
            align='right'
            color={rightTitleColor}
            dataAid={rightTitleDataAid}
          >
            {rightTitle}
          </Typography>
          {isDataLoading ? (
            <Box sx={{ width: '100%' }}>
              <TextLineLoader sx={{ ml: 'auto' }} />
            </Box>
          ) : (
            <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={1}>
              {imgSrc && <Icon size='16px' src={imgSrc} dataAid={rightIconDataAid} />}
              <Typography
                variant='heading3'
                align='right'
                color={rightSubtitleColor}
                dataAid={rightSubtitleDataAid}
              >
                {rightSubtitle}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    );
  },
  isEqual
);

const TextLineLoader = ({ width = '40px', ...props }) => {
  return <Skeleton type='text' width={width} {...props} />;
};
