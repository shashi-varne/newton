import { Box, Stack } from '@mui/material';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Typography from '../../../designSystem/atoms/Typography';
import Container from '../../../designSystem/organisms/Container';
import ProductItem from '../../../designSystem/molecules/ProductItem';
import SwipeableViews from 'react-swipeable-views';
import { largeCap, midCap, multiCap, smallCap } from './constants';
import Button from '../../../designSystem/atoms/Button';
import isEqual from 'lodash/isEqual';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import './SubCategoryLanding.scss';
import ConfirmAction from '../../../designSystem/molecules/ConfirmAction';
import FilterNavigation from '../../../featureComponent/DIY/Filters/FilterNavigation';
import Footer from '../../../designSystem/molecules/Footer';
import { getConfig } from '../../../utils/functions';
import Tag from '../../../designSystem/molecules/Tag';
import orderBy from 'lodash/orderBy';
import FilterReturnBottomSheet, {
  FilterType,
  ReturnsDataList,
  SortsDataList,
} from '../../../featureComponent/DIY/Filters/FilterReturnBottomSheet';
import Filter from '../../../featureComponent/DIY/Filters/Filter';

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

const SubCategoryLanding = ({ cartCount = 1, onCartClick }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedFilterValue, setSelectedFilterValue] = useState({
    [FilterType.returns]: ReturnsDataList[2],
    [FilterType.sort]: SortsDataList[1],
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState({
    [FilterType.returns]: false,
    [FilterType.sort]: false,
    filter: false
  });
  const { productName } = useMemo(getConfig, []);
  const swipeableViewsRef = useRef();
  const handleTabChange = (e, value) => {
    setTabValue(value);
  };

  const handleFiltterSheetClose = (filterType) => () => {
    setIsFilterSheetOpen({
      ...isFilterSheetOpen,
      [filterType]: false,
    });
  };

  // const handleChangeIndex = (index) => {
  //   setTabValue(index);
  // };

  const handleFilterSelect = (filterType, selectedItem) => {
    setSelectedFilterValue({ ...selectedFilterValue, [filterType]: selectedItem });
  };

  const handleFilterClick = (filterType) => () => {
    setIsFilterSheetOpen({ ...isFilterSheetOpen, [filterType]: true });
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
        <CustomFooter
          handleSortClick={handleFilterClick(FilterType.sort)}
          handleReturnClick={handleFilterClick(FilterType.returns)}
          handleFilterClick={handleFilterClick('filter')}
          productName={productName}
          cartCount={cartCount}
          onCartClick={onCartClick}
          returnLabel={selectedFilterValue[FilterType.returns]?.returnLabel}
        />
      }
      className='sub-category-landing-wrapper'
    >
      {/* <div className='sub-category-swipper-wrapper'>
        <SwipeableViews
          // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabValue}
          // onChangeIndex={handleChangeIndex}
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
      </div> */}
      <div className='sub-category-swipper-wrapper'>
        <Swiper slidesPerView={1} autoHeight>
          {tabChilds?.map((el, idx) => {
            return (
              <SwiperSlide key={idx}>
                <TabPanel
                  returnPeriod={selectedFilterValue[FilterType.returns]?.value}
                  sortFundsBy={selectedFilterValue[FilterType.sort]?.value}
                  sortingOrder={selectedFilterValue[FilterType.sort]?.order}
                  key={idx}
                  selectedFilterValue={selectedFilterValue}
                  // value={tabValue}
                  // index={idx}
                  data={el?.data}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <FilterReturnBottomSheet
        applyFilter={(selectedItem) => handleFilterSelect(FilterType.returns, selectedItem)}
        variant={FilterType.returns}
        selectedValue={selectedFilterValue[FilterType.returns]}
        handleClose={handleFiltterSheetClose(FilterType.returns)}
        isOpen={isFilterSheetOpen[FilterType.returns]}
      />
      <FilterReturnBottomSheet
        applyFilter={(selectedItem) => handleFilterSelect(FilterType.sort, selectedItem)}
        variant={FilterType.sort}
        selectedValue={selectedFilterValue[FilterType.sort]}
        handleClose={handleFiltterSheetClose(FilterType.sort)}
        isOpen={isFilterSheetOpen[FilterType.sort]}
      />
      <Filter isOpen={isFilterSheetOpen.filter} handleFilterClose={handleFiltterSheetClose('filter')}/>
    </Container>
  );
};

const TabPanel = memo((props) => {
  const { data = [], returnPeriod, sortFundsBy, sortingOrder } = props;


  const [funds, setFunds] = useState(data);

  const sortFundsOrder = (fundList) => {
    if (sortFundsBy === 'returns') {
      return fundList[returnPeriod] || '';
    } else {
      return fundList[sortFundsBy] || '';
    }
  };

  useEffect(() => {
    const filteredFunds = orderBy(data, sortFundsOrder, [sortingOrder]);
    setFunds(filteredFunds);
  }, [sortFundsBy]);

  return (
    <div
    // role='tabpanel'
    // hidden={value !== index}
    // id={`full-width-tabpanel-${index}`}
    // aria-labelledby={`full-width-tab-${index}`}
    // {...other}
    >
      {/* {value === index && ( */}
      <Box sx={{ pt: '16px', pl: '16px', pr: '16px' }}>
        <Typography component='div'>
          {funds?.slice(0, 10)?.map((fund, idx) => {
            const returnValue = fund[returnPeriod];
            const returnData = !returnValue
              ? 'N/A'
              : fund[returnPeriod] > 0
              ? `+${fund[returnPeriod]}%`
              : `${fund[returnPeriod]}%`;
            const returnColor = !returnValue
              ? 'foundationColors.content.secondary'
              : fund[returnPeriod] > 0
              ? 'foundationColors.secondary.profitGreen.300'
              : 'foundationColors.secondary.lossRed.300';
            return (
              <>
                <Typography>{fund[sortFundsBy]}</Typography>
                <ProductItem
                  // sx={{ mb: '16px' }}
                  key={idx}
                  imgSrc={fund?.amc_logo_big}
                  showSeparator
                  // onClick={handleClick}
                >
                  <ProductItem.LeftSection>
                    <ProductItem.Title>{fund?.legal_name}</ProductItem.Title>
                    <ProductItem.LeftBottomSection>
                      {fund?.is_fisdom_recommended && (
                        <Tag
                          label='Recommendation'
                          labelColor='foundationColors.content.secondary'
                          labelBackgroundColor='foundationColors.secondary.profitGreen.200'
                        />
                      )}
                      {fund?.morning_star_rating && (
                        <Tag
                          morningStarVariant='small'
                          label={fund?.morning_star_rating}
                          labelColor='foundationColors.content.secondary'
                        />
                      )}
                    </ProductItem.LeftBottomSection>
                  </ProductItem.LeftSection>
                  <ProductItem.RightSection spacing={2}>
                    <ProductItem.Description title={returnData} titleColor={returnColor} />
                    <Button
                      title='+ADD'
                      variant='link'
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('hello');
                      }}
                    />
                  </ProductItem.RightSection>
                </ProductItem>
              </>
            );
          })}
        </Typography>
      </Box>
      {/* )} */}
    </div>
  );
}, isEqual);

const CustomFooter = ({
  productName,
  cartCount,
  onCartClick,
  handleSortClick,
  handleFilterClick,
  handleReturnClick,
  returnLabel,
}) => {
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
      <FilterNavigation
        returnLabel={returnLabel}
        handleSortClick={handleSortClick}
        handleReturnClick={handleReturnClick}
        handleFilterClick={handleFilterClick}
      />
    </Stack>
  );
};

export default SubCategoryLanding;
