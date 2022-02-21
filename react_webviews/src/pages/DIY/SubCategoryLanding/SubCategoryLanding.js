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
import { largeCap, midCap, multiCap, smallCap } from "./constants";
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
import orderBy from "lodash/orderBy";
import FilterReturnBottomSheet, {
  FilterType,
  ReturnsDataList,
  SortsDataList,
} from "../../../featureComponent/DIY/Filters/FilterReturnBottomSheet";
import Filter from "../../../featureComponent/DIY/Filters/Filter";
import Icon from "../../../designSystem/atoms/Icon";

const CART_LIMIT = 24;

const tabChilds = [
  {
    label: "Large cap",
    data: largeCap,
    headerTitle: "Large cap",
    subtitle:
      "These funds invest 80% of their assets in top 100 blue-chip companies of India with a market cap of over ₹30,000 cr",
    points: [
      "Offers stability & multi-sector diversification",
      "Ideal for long-term investors seeking stability",
    ],
  },
  {
    label: "Multi cap",
    data: multiCap,
    headerTitle: "Multi cap",
    subtitle:
      "These funds invest 65% of their total assets in equity shares of large, mid & small-cap companies ",
    points: [
      "Offers better returns than large-cap funds",
      "Ideal for investors with a long-term goal",
    ],
  },
  {
    label: "Mid cap",
    data: midCap,
    headerTitle: "Mid cap",
    subtitle:
      "These funds invest 65% to 90% of their total assets in equity shares of mid-cap companies with a market cap of ₹10,000 cr",
    points: [
      "Offers potential to earn market-beating returns",
      "Ideal for investors willing to take higher risks",
    ],
  },
  {
    label: "Small cap",
    data: smallCap,
    headerTitle: "Small cap",
    subtitle:
      "These funds invest 65% of their assets in equity shares of small-cap companies with a market cap of less than ₹5,000 cr",
    points: [
      "Higher risk compared to mid or large-cap funds",
      "Ideal for investors with a high-risk tolerance",
    ],
  },
];

const SubCategoryLanding = ({ onCartClick }) => {
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
  const [activeFundList, setActiveFundList] = useState([]);
  const [selectedFundHouses, setSelectedFundHouses] = useState([]);
  const [selectedFundOption, setSelectedFundOption] = useState("growth");
  const [selectedMinInvestment, setSelectedMinInvestment] = useState({});
  const { productName } = useMemo(getConfig, []);

  useEffect(() => {
    setActiveFundList(tabChilds[tabValue].data);
  }, [tabValue]);
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
        headerTitle: tabChilds[tabValue]?.headerTitle,
        subtitle: tabChilds[tabValue]?.subtitle,
        points: tabChilds[tabValue]?.points,
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
          handleFilterClick={handleFilterClick("filter")}
          productName={productName}
          cartCount={selectedFunds.length}
          onCartClick={onCartClick}
          returnLabel={selectedFilterValue[FilterType.returns]?.returnLabel}
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
          {tabChilds?.map((el, idx) => {
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
                  // value={tabValue}
                  // index={idx}
                  data={el?.data}
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
    sortFundsBy,
    sortingOrder,
    selectedFunds,
    setSelectedFunds,
    selectedFundHouses,
    selectedFundOption,
    selectedMinInvestment,
  } = props;

  const [funds, setFunds] = useState(data);
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
  const sortFundsOrder = (fundList) => {
    if (sortFundsBy === "returns") {
      return fundList[returnPeriod] || "";
    } else {
      return fundList[sortFundsBy] || "";
    }
  };

  useEffect(() => {
    let filteredFunds = data;
    if (!isEmpty(selectedFundHouses)) {
      filteredFunds = filteredFunds.filter((el) =>
        selectedFundHouses.includes(el.fund_house)
      );
    }
    if (selectedFundOption) {
      filteredFunds = filteredFunds.filter(
        (el) => el.growth_or_dividend === selectedFundOption
      );
    }
    if (!isEmpty(selectedMinInvestment)) {
      filteredFunds = filteredFunds.filter((el) => {
        const fundMinValue = get(el, "investment_data.min", "");
        const lowerLimit = get(selectedMinInvestment, "value.lowerLimit", "");
        const upperLimit = get(selectedMinInvestment, "value.upperLimit", "");
        if (lowerLimit && !upperLimit && lowerLimit < fundMinValue) {
          return true;
        }
        if (!lowerLimit && upperLimit && upperLimit >= fundMinValue) {
          return true;
        }
        if (
          lowerLimit &&
          upperLimit &&
          upperLimit >= fundMinValue &&
          lowerLimit < fundMinValue
        ) {
          return true;
        }
        return false;
      });
    }
    const sortedFunds = orderBy(filteredFunds, sortFundsOrder, [sortingOrder]);
    setFunds(sortedFunds);
  }, [
    sortFundsBy,
    returnPeriod,
    selectedFundHouses,
    selectedFundOption,
    selectedMinInvestment,
  ]);

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
            {funds.length} funds
          </Typography>
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
          >
            {returnLabel} returns
          </Typography>
        </Stack>
        <Typography component="div" sx={{ p: "0px 16px" }}>
          {funds?.slice(0, NumOfItems)?.map((fund, idx) => {
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
