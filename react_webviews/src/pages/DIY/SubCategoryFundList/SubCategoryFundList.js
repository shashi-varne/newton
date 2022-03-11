import { Grow, Stack } from '@mui/material';
import { DEFAULT_FILTER_DATA, FILTER_TYPES } from 'businesslogic/constants/diy';
import {
  fetchFundList,
  getDiyCartCount,
  getDiyStorage,
  getDiySubcategoryOptions,
  getDiyTypeData,
  getFilteredFundsByCategory,
  getFilterOptions,
  getFundsByCategory,
  setCartItem,
  setDiySeeMore,
  setDiyStorage,
  setDiyTypeData,
  setFilteredFundList,
} from 'businesslogic/dataStore/reducers/diy';
import {
  getMinimumInvestmentData,
  getReturnData,
  getSortData,
  hideDiyCartFooter,
} from 'businesslogic/utils/diy/functions';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import useErrorState from '../../../common/customHooks/useErrorState';
import ToastMessage from '../../../designSystem/atoms/ToastMessage';
import ConfirmAction from '../../../designSystem/molecules/ConfirmAction';
import Container from '../../../designSystem/organisms/ContainerWrapper';
import Filter from '../../../featureComponent/DIY/Filters/Filter';
import FilterNavigation from '../../../featureComponent/DIY/Filters/FilterNavigation';
import FilterReturnBottomSheet from '../../../featureComponent/DIY/Filters/FilterReturnBottomSheet';
import Api from '../../../utils/api';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import { DIY_PATHNAME_MAPPER } from '../common/constants';
import './SubCategoryFundList.scss';
import TabPanel from './TabPanel';
import { validateKycAndRedirect } from '../common/functions';
import useUserKycHook from '../../../kyc/common/hooks/userKycHook';
import useLoadingState from '../../../common/customHooks/useLoadingState';
import { nativeCallback } from '../../../utils/native_callback';

const screen = 'diyFundList';

const FundListEventMapper = {
  aum: 'fund size (aum)',
  expense_ratio: 'expense ratio',
  morning_star_rating: 'rating',
  one_month_return: '1 month',
  three_month_return: '3 months',
  six_month_return: '6 months',
  one_year_return: '1 year',
  three_year_return: '3 year',
  five_year_return: '5 year',
};

const getFilterCount = (fundHouses, fundOption, minInvestment) => {
  const fundHouseLength = fundHouses?.length || 0;
  const fundOptionLength = fundOption ? 1 : 0;
  const minInvestmentLength = !isEmpty(minInvestment) ? 1 : 0;
  const filterCount = fundHouseLength + fundOptionLength + minInvestmentLength;
  return filterCount;
};

const getfilterMapEventValue = (value) => {
  const eventValue = FundListEventMapper[value] || value || '';
  return eventValue;
};

const getDefaultFilterOptions = (filterOptions, fromDiyLanding) => {
  let defaultReturnPeriod = filterOptions.returnPeriod;
  let defaultSort = filterOptions.sortFundsBy;
  let defaultFundOptions = filterOptions?.fundOption;
  let defaultFundHouses = filterOptions?.fundHouse;
  let defaultMinimumInvestment = filterOptions?.minInvestment?.id;

  if (fromDiyLanding) {
    defaultReturnPeriod = DEFAULT_FILTER_DATA.returnPeriod;
    defaultSort = DEFAULT_FILTER_DATA.sortFundsBy;
    defaultFundOptions = DEFAULT_FILTER_DATA.fundOption;
    defaultFundHouses = [];
    defaultMinimumInvestment = '';
  }
  return {
    defaultReturnPeriod,
    defaultSort,
    defaultFundOptions,
    defaultFundHouses,
    defaultMinimumInvestment,
  };
};
const SubCategoryLanding = (props) => {
  const dispatch = useDispatch();
  const navigate = navigateFunc.bind(props);
  const { category, subcategory, subcategoryOption } = useSelector(getDiyTypeData);
  const diyCartCount = useSelector(getDiyCartCount);
  const filteredFunds = useSelector((state) => getFilteredFundsByCategory(state, category));
  const categoryFunds = useSelector((state) => getFundsByCategory(state, category));
  const filterOptions = useSelector(getFilterOptions);
  const filteredData = useSelector((state) => state?.diy?.filteredData);
  const subcategoryOptionsData = useSelector((state) =>
    getDiySubcategoryOptions(state, category, subcategory)
  );
  const diyStorage = useSelector(getDiyStorage);
  const isSeeMoreClicked = useSelector((state) => state.diy.isSeeMoreClicked);
  const { productName } = useMemo(getConfig, []);
  const hideCartFooter = useMemo(hideDiyCartFooter(productName, diyCartCount), [
    productName,
    diyCartCount,
  ]);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const { kyc, isLoading, user } = useUserKycHook();
  const fromDiyLanding = diyStorage?.fromScreen === 'diyLanding';
  const defaultFilterValues = getDefaultFilterOptions(filterOptions, fromDiyLanding);
  const {
    defaultReturnPeriod,
    defaultSort,
    defaultFundOptions,
    defaultFundHouses,
    defaultMinimumInvestment,
  } = defaultFilterValues;
  let minimumInvestment = getMinimumInvestmentData(defaultMinimumInvestment);
  const [selectedFilterValue, setSelectedFilterValue] = useState({
    [FILTER_TYPES.returns]: getReturnData(defaultReturnPeriod),
    [FILTER_TYPES.sort]: getSortData(defaultSort),
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState({
    [FILTER_TYPES.returns]: false,
    [FILTER_TYPES.sort]: false,
    filter: false,
  });
  const [swiper, setSwiper] = useState(null);
  const [selectedFundHouses, setSelectedFundHouses] = useState(defaultFundHouses);
  const [selectedFundOption, setSelectedFundOption] = useState(defaultFundOptions);
  const [selectedMinInvestment, setSelectedMinInvestment] = useState(minimumInvestment);

  const filterCount = getFilterCount(selectedFundHouses, selectedFundOption, selectedMinInvestment);

  const firstRender = useRef(false);
  const filterEventRef = useRef({});
  const diyFundListRef = useRef({});

  useEffect(() => {
    if (isEmpty(subcategoryOptionsData)) {
      navigate(DIY_PATHNAME_MAPPER.diyInvestLanding);
    }
    return () => {
      dispatch(setDiySeeMore(false));
    };
  }, []);

  // this hook takes care of diy filter event
  useEffect(() => {
    if (filterEventRef.current?.category && !isFilterSheetOpen[filterEventRef.current?.category]) {
      sendEvents('diy_filter');
      filterEventRef.current.reset_applied = false;
    }
  }, [filteredData, filterEventRef.current?.category]);

  const getSubcategoryOptionIndex = () => {
    const index = subcategoryOptionsData.findIndex((el) => el.key === subcategoryOption);
    return index === -1 ? 0 : index;
  };
  const [tabValue, setTabValue] = useState(getSubcategoryOptionIndex());
  const { isPageLoading } = useLoadingState(screen);

  // this hook is triggering the event for diy fund list.
  useEffect(() => {
    if (!isPageLoading && firstRender.current) {
      sendEvents('diy_fund_list');
    }
    firstRender.current = true;
  }, [subcategoryOption, isPageLoading]);

  const fetchDiyFundList = () => {
    if (!isEmpty(subcategoryOptionsData)) {
      const option = subcategoryOptionsData[tabValue].key;
      if (option !== subcategoryOption) {
        dispatch(setDiyTypeData({ subcategoryOption: option }));
      }
      if (isEmpty(categoryFunds[option])) {
        const payload = {
          Api,
          screen,
          category,
          subcategory,
          subcategoryOption: option,
        };
        dispatch(fetchFundList(payload));
      }
    }
  };

  useEffect(() => {
    fetchDiyFundList();
    const containerWrapper = document.getElementsByClassName('container-wrapper')[0];
    containerWrapper.scrollTop=0;
  }, [tabValue]);

  useEffect(() => {
    if (isFetchFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed]);

  useEffect(() => {
    dispatch(
      setFilteredFundList({
        category,
        subcategory,
        subcategoryOption,
        filterOptions: {
          sortFundsBy: selectedFilterValue[FILTER_TYPES.sort]?.value,
          returnPeriod: selectedFilterValue[FILTER_TYPES.returns]?.value,
          sortingOrder: selectedFilterValue[FILTER_TYPES.sort]?.order,
          fundHouse: selectedFundHouses,
          fundOption: selectedFundOption,
          minInvestment: selectedMinInvestment,
        },
      })
    );
    sendEvents('diy_fund_list');
  }, [
    selectedFilterValue[FILTER_TYPES.sort]?.value,
    selectedFilterValue[FILTER_TYPES.sort]?.order,
    selectedFilterValue[FILTER_TYPES.returns]?.value,
    selectedFundHouses,
    selectedFundOption,
    selectedMinInvestment,
  ]);
  const handleTabChange = (e, value) => {
    setTabValue(value);
    diyFundListRef.current = {
      ...diyFundListRef.current,
      tab_swiched: true,
    };
    if (swiper) {
      swiper.slideTo(value);
    }
  };

  const handleSlideChange = (swiper) => {
    setTabValue(swiper?.activeIndex);
  };

  const handleFiltterSheetClose = (filterType) => () => {
    setIsFilterSheetOpen({
      ...isFilterSheetOpen,
      [filterType]: false,
    });
  };

  const handleFilterSelect = (filterType) => (selectedItem) => {
    setSelectedFilterValue({
      ...selectedFilterValue,
      [filterType]: selectedItem,
    });
  };

  const handleFilterClick = (filterType) => () => {
    filterEventRef.current = {
      ...filterEventRef.current,
      category: filterType,
    };
    setIsFilterSheetOpen({ ...isFilterSheetOpen, [filterType]: true });
  };

  const handleAddToCart = (e, fund) => {
    e.stopPropagation();
    dispatch(setCartItem(fund));
  };

  const handleGoNext = () => {
    sendEvents('diy_fund_list', 'next');
    validateKycAndRedirect({ navigate, kyc })();
  };

  const sendEvents = (eventName, userAction = 'back', cardClicked = false) => {
    if (eventName === 'diy_fund_list') {
      if (userAction === 'next') {
        fundListEvent.properties.user_action = 'next';
      }
      if (cardClicked) {
        fundListEvent.properties.card_clicked = 'yes';
      }
      nativeCallback({ events: fundListEvent });
    } else if (eventName === 'diy_filter') {
      const filtersApplied = [...new Set(filterEventRef.current?.filter)] || [];
      if (filterEventRef.current?.category === 'filter') {
        // eslint-disable-next-line no-unused-expressions
        filtersApplied?.forEach((filterType) => {
          const newEvent = {
            ...diyFilterEvent,
            properties: { ...diyFilterEvent.properties, filter: filterType },
          };
          // diyFilterEvent.properties.filter = filterType;
          nativeCallback({ events: newEvent });
        });
      } else {
        nativeCallback({ events: diyFilterEvent });
      }
    }
  };
  const sub_category_option = subcategoryOption?.toLowerCase().replace(/_/g, ' ');
  const fundListEvent = {
    event_name: 'diy_fund_list',
    properties: {
      sub_category: sub_category_option,
      list_length: filteredData?.fundList?.[category]?.[subcategoryOption]?.length || 0,
      tab_swiched: diyFundListRef.current?.tab_swiched ? 'yes' : 'no',
      card_clicked: 'no',
      user_action: 'back',
      see_all: isSeeMoreClicked ? 'yes' : 'no',
      user_application_status: kyc?.application_status_v2 || 'init',
      user_investment_status: user?.active_investment,
      user_kyc_status: kyc?.mf_kyc_processed || false,
    },
  };

  const diyFilterEvent = {
    event_name: 'diy_filter',
    properties: {
      category: filterEventRef.current?.category,
      sort: getfilterMapEventValue(filteredData?.filterOptions?.sortFundsBy),
      filter: '',
      fund_houses: filteredData?.filterOptions?.fundHouse || [],
      fund_options: filteredData?.filterOptions?.fundOption || '',
      minimum_investment: filteredData?.filterOptions?.minInvestment?.label?.toLowerCase() || '',
      returns: getfilterMapEventValue(filteredData?.filterOptions?.returnPeriod),
      reset_applied: filterEventRef.current?.reset_applied ? 'yes' : 'no',
      user_application_status: kyc?.application_status_v2 || 'init',
      user_investment_status: user?.active_investment,
      user_kyc_status: kyc?.mf_kyc_processed || false,
    },
  };

  const handleSearchIconClick = () => {
    dispatch(setDiyStorage({fromScreen: screen}));
    navigate("/diy/invest/search")
  }

  return (
    <Container
      eventData={fundListEvent}
      headerProps={{
        headerTitle: subcategoryOptionsData[tabValue]?.name,
        subtitle: subcategoryOptionsData[tabValue]?.subtitle,
        points: subcategoryOptionsData[tabValue]?.points,
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
          labelName: 'name',
        },
        rightIconSrc:require('assets/search_diy.svg'),
        onRightIconClick: handleSearchIconClick,
        tabChilds: subcategoryOptionsData?.length > 1 ? subcategoryOptionsData : [],
        dataAid: subcategoryOptionsData[tabValue]?.design_id,
      }}
      fixedFooter
      renderComponentAboveFooter={
        <CustomFooter
          handleSortClick={handleFilterClick(FILTER_TYPES.sort)}
          handleReturnClick={handleFilterClick(FILTER_TYPES.returns)}
          handleFilterClick={handleFilterClick('filter')}
          cartCount={diyCartCount}
          onCartClick={handleGoNext}
          returnLabel={selectedFilterValue[FILTER_TYPES.returns]?.returnLabel}
          filterCount={filterCount}
          hideCartFooter={hideCartFooter}
          isPageLoading={isPageLoading}
        />
      }
      className='sub-category-landing-wrapper'
      isPageLoading={isLoading}
      dataAid={subcategoryOptionsData[tabValue]?.design_id}
    >
      <div className='sub-category-swipper-wrapper'>
        <Swiper
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
          initialSlide={tabValue}
        >
          {subcategoryOptionsData?.map((el, idx) => {
            return (
              <SwiperSlide key={idx}>
                <TabPanel
                  returnPeriod={selectedFilterValue[FILTER_TYPES.returns]?.value}
                  returnLabel={selectedFilterValue[FILTER_TYPES.returns]?.returnLabel}
                  key={idx}
                  value={idx}
                  data={filteredFunds[el.key]}
                  activeTab={tabValue}
                  handleAddToCart={handleAddToCart}
                  subcategoryOption={subcategoryOption}
                  swiper={swiper}
                  sendEvents={sendEvents}
                  diyFundListRef={diyFundListRef}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <FilterReturnBottomSheet
        applyFilter={handleFilterSelect(FILTER_TYPES.returns)}
        variant={FILTER_TYPES.returns}
        selectedValue={selectedFilterValue[FILTER_TYPES.returns]}
        handleClose={handleFiltterSheetClose(FILTER_TYPES.returns)}
        isOpen={isFilterSheetOpen[FILTER_TYPES.returns]}
      />
      <FilterReturnBottomSheet
        applyFilter={handleFilterSelect(FILTER_TYPES.sort)}
        variant={FILTER_TYPES.sort}
        selectedValue={selectedFilterValue[FILTER_TYPES.sort]}
        handleClose={handleFiltterSheetClose(FILTER_TYPES.sort)}
        isOpen={isFilterSheetOpen[FILTER_TYPES.sort]}
      />
      <Filter
        isOpen={isFilterSheetOpen.filter}
        selectedFundHouses={selectedFundHouses}
        selectedFundOption={selectedFundOption}
        selectedMinInvestment={selectedMinInvestment}
        handleFilterClose={handleFiltterSheetClose('filter')}
        setSelectedFundHouses={setSelectedFundHouses}
        setSelectedFundOption={setSelectedFundOption}
        setSelectedMinInvestment={setSelectedMinInvestment}
        filterEventRef={filterEventRef}
      />
    </Container>
  );
};

const CustomFooter = ({
  cartCount,
  onCartClick,
  handleSortClick,
  handleFilterClick,
  handleReturnClick,
  returnLabel,
  filterCount,
  hideCartFooter,
  isPageLoading,
}) => {
  return (
    <Stack spacing={1} sx={{ mx: '-16px' }} className='sub-category-custom-footer'>
      <Grow in={!hideCartFooter} timeout={500} mountOnEnter unmountOnExit>
        <div className='sc-confirmation-btn-wrapper'>
          <ConfirmAction
            title={`${cartCount} items in the cart`}
            buttonTitle='View Cart'
            badgeContent={cartCount}
            onButtonClick={onCartClick}
            dataAid='viewCart'
          />
        </div>
      </Grow>
      <FilterNavigation
        returnLabel={returnLabel}
        handleSortClick={handleSortClick}
        handleReturnClick={handleReturnClick}
        handleFilterClick={handleFilterClick}
        filterCount={filterCount}
        disabled={isPageLoading}
      />
    </Stack>
  );
};

export default SubCategoryLanding;
