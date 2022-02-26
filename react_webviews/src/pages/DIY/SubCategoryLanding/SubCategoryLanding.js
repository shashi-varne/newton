import { Box, Stack } from "@mui/material";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/Container";
import ProductItem from "../../../designSystem/molecules/ProductItem";
import SwipeableViews from "react-swipeable-views";
import Button from "../../../designSystem/atoms/Button";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

import "./SubCategoryLanding.scss";
import ConfirmAction from "../../../designSystem/molecules/ConfirmAction";
import FilterNavigation from "../../../featureComponent/DIY/Filters/FilterNavigation";
import Footer from "../../../designSystem/molecules/Footer";
import { getConfig } from "../../../utils/functions";
import Tag from "../../../designSystem/molecules/Tag";
import FilterReturnBottomSheet from "../../../featureComponent/DIY/Filters/FilterReturnBottomSheet";
import Filter from "../../../featureComponent/DIY/Filters/Filter";
import Icon from "../../../designSystem/atoms/Icon";
import useErrorState from "../../../common/customHooks/useErrorState";
import useLoadingState from "../../../common/customHooks/useLoadingState";

import Api from "../../../utils/api";
import {
  fetchFundList,
  getDiySubcategoryOptions,
  setFilteredFundList,
  getFilteredFundsByCategory,
  getFilterOptions,
  getFundsByCategory,
  getDiyTypeData,
  setDiyTypeData,
  setCartItem,
  getDiyCartCount,
  getDiyCart,
} from "businesslogic/dataStore/reducers/diy";
import { useDispatch, useSelector } from "react-redux";
import { CART_LIMIT, FILTER_TYPES } from "businesslogic/constants/diy";
import {
  getMinimumInvestmentData,
  getReturnData,
  getSortData,
  checkFundPresentInCart,
} from "businesslogic/utils/diy/functions";
import { SkeltonRect } from "../../../common/ui/Skelton";
import ToastMessage from "../../../designSystem/atoms/ToastMessage";

const screen = "diyFundList";
// const category = "Equity";
// const subcategory = "Market_Cap";
// const subcategoryOption = "Large_Cap";
const SubCategoryLanding = ({ onCartClick }) => {
  const dispatch = useDispatch();
  const diyTypeData = useSelector(getDiyTypeData);
  const diyCartData = useSelector(getDiyCart);
  const diyCartCount = useSelector(getDiyCartCount);
  const { category, subcategory, subcategoryOption } = useMemo(
    () => diyTypeData,
    [diyTypeData]
  );
  const filteredFunds = useSelector((state) =>
    getFilteredFundsByCategory(state, category)
  );
  const categoryFunds = useSelector((state) =>
    getFundsByCategory(state, category)
  );
  const filterOptions = useSelector(getFilterOptions);
  const subcategoryOptionsData = useSelector((state) =>
    getDiySubcategoryOptions(state, category, subcategory)
  );

  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const { isPageLoading } = useLoadingState(screen);

  const [tabValue, setTabValue] = useState(0);
  const dataRef = useRef(0);
  const [selectedFilterValue, setSelectedFilterValue] = useState({
    [FILTER_TYPES.returns]: getReturnData(filterOptions.returnPeriod),
    [FILTER_TYPES.sort]: getSortData(filterOptions.sortFundsBy),
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState({
    [FILTER_TYPES.returns]: false,
    [FILTER_TYPES.sort]: false,
    filter: false,
  });
  console.log("count of render is", dataRef.current++);
  const [swiper, setSwiper] = useState(null);
  const [selectedFundHouses, setSelectedFundHouses] = useState([]);
  const [selectedFundOption, setSelectedFundOption] = useState(
    filterOptions.fundOption
  );
  const [selectedMinInvestment, setSelectedMinInvestment] = useState(
    getMinimumInvestmentData(filterOptions.minInvestment)
  );
  const { productName } = useMemo(getConfig, []);
  useEffect(() => {
    if (!isEmpty(subcategoryOptionsData)) {
      const option = subcategoryOptionsData[tabValue].key;
      dispatch(setDiyTypeData({ subcategoryOption: option }));
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

  const swipeableViewsRef = useRef();
  const handleTabChange = (e, value) => {
    setTabValue(value);
    if (swiper) {
      swiper.slideTo(value);
    }
  };

  const handleSlideChange = (swiper) => {
    console.log("swiper is", swiper["$wrapperEl"][0].height);
    // swiper.updateSize()
    setTabValue(swiper?.activeIndex);
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

  const handleFilterSelect = (filterType) => (selectedItem) => {
    setSelectedFilterValue({
      ...selectedFilterValue,
      [filterType]: selectedItem,
    });
  };

  const handleFilterClick = (filterType) => () => {
    setIsFilterSheetOpen({ ...isFilterSheetOpen, [filterType]: true });
  };

  const handleAddToCart = (fund) => () => {
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
          labelName: "name",
        },
        tabChilds: subcategoryOptionsData,
      }}
      fixedFooter
      renderComponentAboveFooter={
        <CustomFooter
          handleSortClick={handleFilterClick(FILTER_TYPES.sort)}
          handleReturnClick={handleFilterClick(FILTER_TYPES.returns)}
          handleFilterClick={handleFilterClick("filter")}
          productName={productName}
          cartCount={diyCartCount}
          onCartClick={onCartClick}
          returnLabel={selectedFilterValue[FILTER_TYPES.returns]?.returnLabel}
          filterCount={selectedFundHouses.length}
        />
      }
      className="sub-category-landing-wrapper"
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
      <div className="sub-category-swipper-wrapper">
        <Swiper
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
        >
          {subcategoryOptionsData?.map((el, idx) => {
            return (
              <SwiperSlide key={idx}>
                <TabPanel
                  returnPeriod={
                    selectedFilterValue[FILTER_TYPES.returns]?.value
                  }
                  returnLabel={
                    selectedFilterValue[FILTER_TYPES.returns]?.returnLabel
                  }
                  sortFundsBy={selectedFilterValue[FILTER_TYPES.sort]?.value}
                  sortingOrder={selectedFilterValue[FILTER_TYPES.sort]?.order}
                  key={idx}
                  value={idx}
                  selectedFilterValue={selectedFilterValue}
                  productName={productName}
                  data={filteredFunds[el.key]}
                  selectedFundHouses={selectedFundHouses}
                  selectedFundOption={selectedFundOption}
                  selectedMinInvestment={selectedMinInvestment}
                  activeTab={tabValue}
                  isPageLoading={isPageLoading}
                  handleAddToCart={handleAddToCart}
                  diyCartData={diyCartData}
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
        handleFilterClose={handleFiltterSheetClose("filter")}
        setSelectedFundHouses={setSelectedFundHouses}
        setSelectedFundOption={setSelectedFundOption}
        setSelectedMinInvestment={setSelectedMinInvestment}
      />
    </Container>
  );
};

const TabPanel = memo((props) => {
  const {
    data = [],
    returnPeriod,
    returnLabel,
    value,
    activeTab,
    isPageLoading,
    handleAddToCart,
    diyCartData,
  } = props;
  const [NumOfItems, setNumOfItems] = useState(10);
  const [showLoader, setShowLoader] = useState(false);
  const observer = useRef();
  const lastProductItem = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((enteries) => {
      if (enteries[0].isIntersecting) {
        setNumOfItems((NumOfItems) => NumOfItems + 10);
      }
    });

    if (node) observer.current.observe(node);
  });

  useEffect(() => {
    const loader = value === activeTab && isPageLoading;
    setShowLoader(loader);
  }, [activeTab, isPageLoading])

  if (showLoader) {
    return (
      <>
        <SkeltonRect className="scl-skelton" />
        <SkeltonRect className="scl-skelton" />
        <SkeltonRect className="scl-skelton" />
        <SkeltonRect className="scl-skelton" />
        <SkeltonRect className="scl-skelton" />
        <SkeltonRect className="scl-skelton" />
      </>
    );
  }

  return (
    <div
    // role='tabpanel'
    // hidden={value !== index}
    // id={`full-width-tabpanel-${index}`}
    // aria-labelledby={`full-width-tab-${index}`}
    // {...other}
    >
      {/* {value === index && ( */}
      <Box sx={{ backgroundColor: "foundationColors.supporting.white" }}>
        <Stack
          justifyContent="space-between"
          direction="row"
          className="sub-category-filter-info"
          backgroundColor="foundationColors.supporting.grey"
          sx={{ mb: "16px", padding: "8px 16px" }}
        >
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
          >
            {data.length} funds
          </Typography>
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
          >
            {returnLabel} returns
          </Typography>
        </Stack>
        <Typography component="div" sx={{ p: "0px 16px" }}>
          {data?.slice(0, NumOfItems)?.map((fund, idx) => {
            const returnValue = fund[returnPeriod];
            const returnData = !returnValue
              ? "N/A"
              : fund[returnPeriod] > 0
              ? `+${fund[returnPeriod]}%`
              : `${fund[returnPeriod]}%`;
            const returnColor = !returnValue
              ? "foundationColors.content.secondary"
              : fund[returnPeriod] > 0
              ? "foundationColors.secondary.profitGreen.300"
              : "foundationColors.secondary.lossRed.300";
            const setRef = NumOfItems - 4 === idx + 1;
            let refData = {};
            if (setRef) {
              refData.ref = lastProductItem;
            }
            const isFundAddedToCart = checkFundPresentInCart(diyCartData, fund);
            return (
              <div key={idx} {...refData}>
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
                          label="Recommendation"
                          labelColor="foundationColors.content.secondary"
                          labelBackgroundColor="foundationColors.secondary.blue.200"
                        />
                      )}
                      {fund?.morning_star_rating && (
                        <Tag
                          morningStarVariant="small"
                          label={fund?.morning_star_rating}
                          labelColor="foundationColors.content.secondary"
                        />
                      )}
                    </ProductItem.LeftBottomSection>
                  </ProductItem.LeftSection>
                  <ProductItem.RightSection spacing={2}>
                    <ProductItem.Description
                      title={returnData}
                      titleColor={returnColor}
                    />
                    <Icon
                      size="32px"
                      src={require(`assets/${
                        isFundAddedToCart ? `minus` : `add_icon`
                      }.svg`)}
                      onClick={handleAddToCart(fund)}
                    />
                  </ProductItem.RightSection>
                </ProductItem>
              </div>
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
  filterCount,
}) => {
  return (
    <Stack spacing={2} className="sub-category-custom-footer">
      {cartCount > 0 && productName === "fisdom" && (
        <div className="sc-confirmation-btn-wrapper">
          <ConfirmAction
            title={`${cartCount} items in the cart`}
            buttonTitle="View Cart"
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
        count={filterCount}
      />
    </Stack>
  );
};

export default SubCategoryLanding;
