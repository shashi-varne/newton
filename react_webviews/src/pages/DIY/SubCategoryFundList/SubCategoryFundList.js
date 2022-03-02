import { Grow, Stack } from '@mui/material';
import { FILTER_TYPES } from 'businesslogic/constants/diy';
import {
  fetchFundList,
  getDiyCartCount,
  getDiySubcategoryOptions,
  getDiyTypeData,
  getFilteredFundsByCategory,
  getFilterOptions,
  getFundsByCategory,
  setCartItem,
  setDiyTypeData,
  setFilteredFundList
} from 'businesslogic/dataStore/reducers/diy';
import {
  getMinimumInvestmentData,
  getReturnData,
  getSortData,
  hideDiyCartFooter
} from 'businesslogic/utils/diy/functions';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import useErrorState from '../../../common/customHooks/useErrorState';
import ToastMessage from '../../../designSystem/atoms/ToastMessage';
import ConfirmAction from '../../../designSystem/molecules/ConfirmAction';
import Container from '../../../designSystem/organisms/Container';
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

const screen = 'diyFundList';
const SubCategoryLanding = (props) => {
  const dispatch = useDispatch();
  const navigate = navigateFunc.bind(props);
  const { category, subcategory, subcategoryOption } = useSelector(getDiyTypeData);
  const diyCartCount = useSelector(getDiyCartCount);
  const filteredFunds = useSelector((state) => getFilteredFundsByCategory(state, category));
  const categoryFunds = useSelector((state) => getFundsByCategory(state, category));
  const filterOptions = useSelector(getFilterOptions);
  const subcategoryOptionsData = useSelector((state) =>
    getDiySubcategoryOptions(state, category, subcategory)
  );
  const { productName } = useMemo(getConfig, []);
  const hideCartFooter = useMemo(hideDiyCartFooter(productName, diyCartCount), [
    productName,
    diyCartCount,
  ]);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const { kyc, isLoading } = useUserKycHook();
  const [selectedFilterValue, setSelectedFilterValue] = useState({
    [FILTER_TYPES.returns]: getReturnData(filterOptions.returnPeriod),
    [FILTER_TYPES.sort]: getSortData(filterOptions.sortFundsBy),
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState({
    [FILTER_TYPES.returns]: false,
    [FILTER_TYPES.sort]: false,
    filter: false,
  });
  const [swiper, setSwiper] = useState(null);
  const [selectedFundHouses, setSelectedFundHouses] = useState([]);
  const [selectedFundOption, setSelectedFundOption] = useState(filterOptions.fundOption);
  const [selectedMinInvestment, setSelectedMinInvestment] = useState(
    getMinimumInvestmentData(filterOptions.minInvestment)
  );

  useEffect(() => {
    if (isEmpty(subcategoryOptionsData)) {
      navigate(DIY_PATHNAME_MAPPER.diyInvestLanding);
    }
  }, []);

  const getSubcategoryOptionIndex = () => {
    const index = subcategoryOptionsData.findIndex((el) => el.key === subcategoryOption);
    return index === -1 ? 0 : index;
  };
  const [tabValue, setTabValue] = useState(getSubcategoryOptionIndex());
  const { isPageLoading } = useLoadingState(screen);

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
    setIsFilterSheetOpen({ ...isFilterSheetOpen, [filterType]: true });
  };

  const handleAddToCart = (e, fund) => {
    e.stopPropagation();
    dispatch(setCartItem(fund));
  };

  return (
    <Container
      headerProps={{
        headerTitle: subcategoryOptionsData[tabValue]?.name,
        subtitle: subcategoryOptionsData[tabValue]?.subtitle,
        points: subcategoryOptionsData[tabValue]?.points,
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
          labelName: 'name',
        },
        tabChilds: subcategoryOptionsData?.length > 1 ? subcategoryOptionsData : [],
      }}
      fixedFooter
      renderComponentAboveFooter={
        <CustomFooter
          handleSortClick={handleFilterClick(FILTER_TYPES.sort)}
          handleReturnClick={handleFilterClick(FILTER_TYPES.returns)}
          handleFilterClick={handleFilterClick('filter')}
          cartCount={diyCartCount}
          onCartClick={validateKycAndRedirect({ navigate, kyc })}
          returnLabel={selectedFilterValue[FILTER_TYPES.returns]?.returnLabel}
          filterCount={selectedFundHouses.length}
          hideCartFooter={hideCartFooter}
          isPageLoading={isPageLoading}
        />
      }
      className='sub-category-landing-wrapper'
      isPageLoading={isLoading}
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
  isPageLoading
}) => {
  return (
    <Stack spacing={1} sx={{mx:'-16px'}} className='sub-category-custom-footer'>
      <Grow in={!hideCartFooter} timeout={500} mountOnEnter unmountOnExit>
        <div className='sc-confirmation-btn-wrapper'>
          <ConfirmAction
            title={`${cartCount} items in the cart`}
            buttonTitle='View Cart'
            badgeContent={cartCount}
            onButtonClick={onCartClick}
            dataAid='_'
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
