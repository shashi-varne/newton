import { Box, Stack } from '@mui/material';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import Typography from '../../../designSystem/atoms/Typography';
import Container from '../../../designSystem/organisms/Container';
import ProductItem from '../../../designSystem/molecules/ProductItem';
import SwipeableViews from 'react-swipeable-views';
import { largeCap, midCap, multiCap, smallCap } from './constants';
import Button from '../../../designSystem/atoms/Button';
import isEqual from 'lodash/isEqual';

import './SubCategoryLanding.scss';
import ConfirmAction from '../../../designSystem/molecules/ConfirmAction';
import FilterNavigation from '../../../featureComponent/DIY/Filters/FilterNavigation';
import Footer from '../../../designSystem/molecules/Footer';
import { getConfig } from '../../../utils/functions';

const tabChilds = [
  {
    label: 'Large cap',
    data: largeCap,
  },
  {
    label: 'Multi cap',
    data: multiCap,
  },
  {
    label: 'Mid cap',
    data: midCap,
  },
  {
    label: 'Small cap',
    data: smallCap,
  },
];

const returnField = [
  'one_month_return',
  'three_month_return',
  'six_month_return',
  'one_year_return',
  'three_year_return',
  'five_year_return',
];

const SubCategoryLanding = ({ cartCount = 1, onCartClick }) => {
  const [tabValue, setTabValue] = useState(0);
  const { productName } = useMemo(getConfig, []);
  const swipeableViewsRef = useRef();
  const handleTabChange = (e, value) => {
    setTabValue(value);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  return (
    <Container
      headerProps={{
        headerTitle: 'Large cap',
        subtitle:
          'These funds invest 80% of their assets in top 100 blue-chip companies of India with a market cap of over ₹30,000 cr',
        points: [
          'Offers stability & multi-sector diversification',
          'Ideal for long-term investors seeking stability See less',
        ],
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
        },
        tabChilds,
      }}
      fixedFooter
      renderComponentAboveFooter={
        <CustomFooter productName={productName} cartCount={cartCount} onCartClick={onCartClick} />
      }
      className='sub-category-landing-wrapper'
    >
      <div className='sub-category-swipper-wrapper'>
        <SwipeableViews
          // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabValue}
          onChangeIndex={handleChangeIndex}
          animateHeight
          ref={swipeableViewsRef}
        >
          {tabChilds?.map((el, idx) => {
            return (
              <TabPanel
                key={idx}
                value={tabValue}
                index={idx}
                data={el?.data}
                swipeableViewsRef={swipeableViewsRef}
              />
            );
          })}
        </SwipeableViews>
      </div>
    </Container>
  );
};

const TabPanel = (props) => {
  const { data, swipeableViewsRef } = props;
  const [maxContent, setMaxContent] = useState(10);
  const handleMoreContent = () => {
    setMaxContent((prev) => prev + 10);
  };

  useEffect(() => {
    if (swipeableViewsRef.current) {
      swipeableViewsRef.current.updateHeight();
    }
  }, [swipeableViewsRef.current, maxContent,data.length]);
  console.log(`data is ${maxContent} ${data.length}`);
  return (
    <div
    // role='tabpanel'
    // hidden={value !== index}
    // id={`full-width-tabpanel-${index}`}
    // aria-labelledby={`full-width-tab-${index}`}
    >
      {/* {value === index && ( */}
      <Box sx={{ pt: '16px' }}>
        <Typography component='div'>
          {data?.slice(0, maxContent)?.map((fund, idx) => {
            return (
              <ProductItem
                sx={{ mb: '16px' }}
                key={idx}
                leftImgSrc={fund?.amc_logo_big}
                headerTitle={fund?.legal_name}
                showSeparator
                bottomSectionData={{
                  tagOne: {
                    label: fund?.is_fisdom_recommended ? 'Recommended' : '',
                    labelBackgroundColor: 'foundationColors.supporting.grey',
                    labelColor: 'foundationColors.content.secondary',
                  },
                  tagTwo: {
                    morningStarVariant: 'large',
                    label: fund?.morning_star_rating,
                    labelColor: 'foundationColors.content.secondary',
                  },
                }}
                rightSectionData={{
                  // description: {
                  //   title:
                  //     fund?.three_year_return > 0
                  //       ? `+${fund?.three_year_return}%`
                  //       : `-${fund?.three_year_return}%`,
                  //   titleColor:
                  //     fund?.three_year_return > 0
                  //       ? 'foundationColors.secondary.profitGreen.400'
                  //       : 'foundationColors.secondary.lossRed.400',
                  // },
                  btnProps: {
                    title: 'Remove',
                    size: 'small',
                    onClick: () => {
                      console.log('cart added');
                    },
                  },
                }}
              />
            );
          })}
        </Typography>
        {maxContent !== data.length && (
          <Box sx={{ mt: '12px', textAlign: 'center' }}>
            <Button title='See all results' variant='link' onClick={handleMoreContent} />
          </Box>
        )}
      </Box>
      {/* )} */}
    </div>
  );
};

const CustomFooter = ({ productName, cartCount, onCartClick }) => {
  return (
    <Stack spacing={2} className='sub-category-custom-footer'>
      {cartCount > 0 && productName === 'fisdom' && (
        <div className='sc-confirmation-btn-wrapper'>
          <ConfirmAction
            title={`${cartCount} items in the cart`}
            buttonTitle='View Cart'
            badgeContent={cartCount}
            onClick={onCartClick}
          />
        </div>
      )}
      <FilterNavigation />
    </Stack>
  );
};

export default SubCategoryLanding;
