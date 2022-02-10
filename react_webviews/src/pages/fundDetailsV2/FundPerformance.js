import React, { memo } from 'react';
import format from 'date-fns/format';
import { Stack } from '@mui/material';
import { formatAmountInr } from '../../utils/validators';
import orderBy from 'lodash/orderBy';
import parse from 'date-fns/parse';
import isEqual from 'lodash/isEqual';
import Typography from '../../designSystem/atoms/Typography';
import Icon from '../../designSystem/atoms/Icon';

const FundPerformance = ({ fundData }) => {
  const minimumInvestment = orderBy(
    fundData?.additional_info?.minimum_investment,
    ['value'],
    ['asc']
  );

  const NavDate = format(parse(fundData?.performance?.nav_update_date,'dd/MM/yyyy', new Date()), 'MMM d');
  return (
    <Stack component='section' spacing={3}>
      <RowData
        leftTitle={`NAV as on ${NavDate}`}
        leftTitleColor='foundationColors.content.secondary'
        leftSubtitle={formatAmountInr(fundData?.performance?.current_nav)}
        rightTitle={`Returns (${fundData?.performance?.primary_return_duration})`}
        rightTitleColor='foundationColors.content.secondary'
        rightSubtitle={`${fundData?.performance?.primary_return}%`}
        rightSubtitleColor='foundationColors.secondary.profitGreen.400'
        imgSrc={require(`assets/${
          fundData?.performance?.primary_return > 0 ? 'positive_return' : 'negative_return'
        }.svg`)}
      />
      <RowData
        leftTitle='Min. investment'
        leftTitleColor='foundationColors.content.secondary'
        leftSubtitle={formatAmountInr(minimumInvestment[0]?.value)}
        rightTitle='Morning Star'
        rightTitleColor='foundationColors.content.secondary'
        rightSubtitle={fundData?.performance?.ms_rating}
        rightSubtitleColor='foundationColors.secondary.mango.400'
        imgSrc={require('assets/star_large.svg')}
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
  },
  isEqual
);
