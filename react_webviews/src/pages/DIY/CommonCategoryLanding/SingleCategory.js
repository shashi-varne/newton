import { Skeleton, Stack } from '@mui/material';
import { getPageLoading } from 'businesslogic/dataStore/reducers/loader';
import React from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../designSystem/atoms/Icon';
import Typography from '../../../designSystem/atoms/Typography';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import CardHorizontal from '../../../designSystem/molecules/CardHorizontal';
import SectionHeader from './SectionHeader';

const screen = 'diyLanding';
const SingleCategory = ({ diyType }) => {
  const categoriesNew = useSelector((state) => state?.diy?.categories);
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));

  const categoryOptions = categoriesNew?.find((el) => {
    return el.category.toLowerCase() === diyType;
  });
  const singleCard = categoryOptions?.sub_categories?.find((el) => el.viewType === 'singleCard');
  return (
    <Stack direction='column' spacing={2} className='diy-c-tax-saving-wrapper'>
      <SectionHeader isPageLoading={isPageLoading} title={singleCard?.name} />
      {isPageLoading ? (
        <SingleCategorySkeleton />
      ) : (
        <div className='diy-c-card-horz-wrapper'>
          {singleCard?.options?.map((el, idx) => {
            return (
              <CardHorizontal key={idx} title={el?.name} subtitle={el?.trivia} dataAid={el?.key} />
            );
          })}
        </div>
      )}
    </Stack>
  );
};

export default SingleCategory;

const SingleCategorySkeleton = () => {
  return (
    <WrapperBox elevation={1}>
      <Stack sx={{ p: 2 }} justifyContent='space-between' alignItems='center' direction='row'>
        <Stack direction='column' spacing={1}>
          <Typography variant='heading3'>
            <Skeleton width='40px' />
          </Typography>
          <Typography variant='body1'>
            <Skeleton width='140px' />
          </Typography>
        </Stack>
        <Icon size='110px' />
      </Stack>
    </WrapperBox>
  );
};
