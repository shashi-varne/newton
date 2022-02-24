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
import FilterReturnBottomSheet, {
  FilterType,
  ReturnsDataList,
  SortsDataList,
} from "../../../featureComponent/DIY/Filters/FilterReturnBottomSheet";
import Filter from "../../../featureComponent/DIY/Filters/Filter";
import Icon from "../../../designSystem/atoms/Icon";

import Api from "../../../utils/api";
import {
  fetchDiyCategories,
  fetchFundList,
  getDiySubcategoryOptions,
  setFilteredFundList,
  getFundsBySubcategory,
  getFundsList,
  getFilteredFundsByCategory,
  getFilterOptions,
} from "businesslogic/dataStore/reducers/diy";
import { getError } from "businesslogic/dataStore/reducers/error";
import { getPageLoading } from "businesslogic/dataStore/reducers/loader";
import { useDispatch, useSelector } from "react-redux";

const CART_LIMIT = 24;

const screen = "diyFundList";
const diyType = "Equity";
const subcategoryOption = "Large_Cap";
const SubCategoryLanding = ({ onCartClick }) => {
  const dispatch = useDispatch();
  const filteredFunds = useSelector((state) =>
    getFilteredFundsByCategory(state, diyType)
  );
  const fundsListData = useSelector(getFundsList);
  const filterOptions = useSelector(getFilterOptions);
  const funds = useSelector((state) =>
    getFundsBySubcategory(state, diyType, subcategoryOption)
  );
  const subcategoryOptions = useSelector((state) =>
    getDiySubcategoryOptions(state, diyType, "Market_Cap")
  );
  const errorData = useSelector((state) => getError(state, screen));
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));
  useEffect(() => {
    const payload = {
      isins: "INF109K01480",
      Api,
      screen,
      diyType,
      subcategoryOption,
    };
    dispatch(fetchDiyCategories(payload));
    dispatch(fetchFundList(payload));
  }, []);
  // useEffect(() => {
  //   dispatch(setFilteredFundList({diyType, subcategoryOption}))
  // }, [fundsLis])
  const [tabValue, setTabValue] = useState(0);
  const dataRef = useRef(0);
  const [selectedFilterValue, setSelectedFilterValue] = useState({
    [FilterType.returns]: ReturnsDataList[2],
    [FilterType.sort]: SortsDataList[1],
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState({
    [FilterType.returns]: false,
    [FilterType.sort]: false,
    filter: false,
  });
  console.log("count of render is", dataRef.current++);
  const [swiper, setSwiper] = useState(null);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [selectedFundHouses, setSelectedFundHouses] = useState([]);
  const [selectedFundOption, setSelectedFundOption] = useState("growth");
  const [selectedMinInvestment, setSelectedMinInvestment] = useState({});
  const { productName } = useMemo(getConfig, []);

  useEffect(() => {
    dispatch(
      setFilteredFundList({
        diyType,
        subcategoryOption,
        filterOptions: {
          sortFundsBy: selectedFilterValue[FilterType.sort]?.value,
          returnPeriod: selectedFilterValue[FilterType.returns]?.value,
          sortingOrder: selectedFilterValue[FilterType.sort]?.order,
          fundHouse: selectedFundHouses,
          fundOption: selectedFundOption,
          minInvestment: selectedMinInvestment,
        },
      })
    );
  }, [
    selectedFilterValue[FilterType.sort]?.value,
    selectedFilterValue[FilterType.sort]?.order,
    selectedFilterValue[FilterType.returns]?.value,
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

  return (
    <Container
      headerProps={{
        headerTitle: subcategoryOptions[tabValue]?.name,
        subtitle: subcategoryOptions[tabValue]?.subtitle,
        points: subcategoryOptions[tabValue]?.points,
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
          labelName: "name",
        },
        tabChilds: subcategoryOptions,
      }}
      fixedFooter
      renderComponentAboveFooter={
        <CustomFooter
          handleSortClick={handleFilterClick(FilterType.sort)}
          handleReturnClick={handleFilterClick(FilterType.returns)}
          handleFilterClick={handleFilterClick("filter")}
          productName={productName}
          cartCount={selectedFunds.length}
          onCartClick={onCartClick}
          returnLabel={selectedFilterValue[FilterType.returns]?.returnLabel}
          filterCount={selectedFundHouses.length}
        />
      }
      className="sub-category-landing-wrapper"
      isPageLoading={isPageLoading}
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
        {/* <Stack
          justifyContent="space-between"
          direction="row"
          className="sub-category-filter-info"
        >
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
          >
            {numberOfFunds} funds
          </Typography>
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
          >
            {selectedFilterValue[FilterType.returns]?.returnLabel} returns
          </Typography>
        </Stack> */}
        <Swiper
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
        >
          {subcategoryOptions?.map((el, idx) => {
            return (
              <SwiperSlide key={idx}>
                <TabPanel
                  returnPeriod={selectedFilterValue[FilterType.returns]?.value}
                  returnLabel={
                    selectedFilterValue[FilterType.returns]?.returnLabel
                  }
                  sortFundsBy={selectedFilterValue[FilterType.sort]?.value}
                  sortingOrder={selectedFilterValue[FilterType.sort]?.order}
                  key={idx}
                  selectedFilterValue={selectedFilterValue}
                  productName={productName}
                  data={filteredFunds[el.key]}
                  setSelectedFunds={setSelectedFunds}
                  selectedFunds={selectedFunds}
                  selectedFundHouses={selectedFundHouses}
                  selectedFundOption={selectedFundOption}
                  selectedMinInvestment={selectedMinInvestment}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <FilterReturnBottomSheet
        applyFilter={handleFilterSelect(FilterType.returns)}
        variant={FilterType.returns}
        selectedValue={selectedFilterValue[FilterType.returns]}
        handleClose={handleFiltterSheetClose(FilterType.returns)}
        isOpen={isFilterSheetOpen[FilterType.returns]}
      />
      <FilterReturnBottomSheet
        applyFilter={handleFilterSelect(FilterType.sort)}
        variant={FilterType.sort}
        selectedValue={selectedFilterValue[FilterType.sort]}
        handleClose={handleFiltterSheetClose(FilterType.sort)}
        isOpen={isFilterSheetOpen[FilterType.sort]}
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
    selectedFunds,
    setSelectedFunds,
  } = props;
  const [selectedFundsIsins] = useState(selectedFunds.map(({ isin }) => isin));
  const [NumOfItems, setNumOfItems] = useState(10);
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

  const handleAddToCart = (fund, isFundAddedToCart) => () => {
    if (isFundAddedToCart) {
      const filteredFunds = selectedFunds.filter(
        ({ isin }) => isin !== fund.isin
      );
      setSelectedFunds(filteredFunds);
    } else {
      if (selectedFunds.length < CART_LIMIT) {
        setSelectedFunds([...selectedFunds, fund]);
      }
    }
  };

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
            const isFundAddedToCart = selectedFundsIsins.includes(fund.isin);

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
                      onClick={handleAddToCart(fund, isFundAddedToCart)}
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
