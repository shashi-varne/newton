import React, { useEffect } from 'react';
import {
  LandingHeader,
  LandingHeaderPoints,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import { getConfig } from '../../../utils/functions';
import Container from '../../../designSystem/organisms/Container';

import isEmpty from 'lodash/isEmpty';
import { DescriptionMapper, DIY_TYPE, VIEW_TYPE_MAPPER } from 'businesslogic/constants/diy';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../../utils/api';
import TrendingFunds from './TrendingFunds';
import TwoRowCarousel from './TwoRowCarousel';
import SingleCategory from './SingleCategory';
import CategoryCardCarousel from './CategoryCardCarousel';
import CardVerticalCarousel from './CardVerticalCarousel';
import Lottie from 'lottie-react';
import './CommonCategoryLanding.scss';
import { navigate as navigateFunc } from '../../../utils/functions';

import {
  getDiyCategoryData,
  fetchDiyCategoriesAndTrendingFunds,
  setDiyTypeData,
  getDiyTypeData,
  getTrendingFundsByCategory,
  getDiySubcategoryDataByViewType
} from "businesslogic/dataStore/reducers/diy";
import { DIY_PATHNAME_MAPPER } from '../constants';
import useLoadingState from '../../../common/customHooks/useLoadingState';

const screen = 'diyLanding';
const CommonCategoryLanding = (props) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  const dispatch = useDispatch();
  const productName = config.productName;
  let { diyType = "" } = props.match.params;

  const diyTypeData = useSelector(getDiyTypeData);
  const categoryData = useSelector((state) => getDiyCategoryData(state, diyType));
  const trendingFunds = useSelector((state) => getTrendingFundsByCategory(state, diyType));
  const twoRowsImageCarouselData = useSelector((state) => getDiySubcategoryDataByViewType(state, diyTypeData.category, VIEW_TYPE_MAPPER.twoRowsImageCaurosel));
  const singleCategoryData = useSelector((state) => getDiySubcategoryDataByViewType(state, diyTypeData.category, VIEW_TYPE_MAPPER.singleCard));
  const horizontalCauroselData = useSelector((state) => getDiySubcategoryDataByViewType(state, diyTypeData.category, VIEW_TYPE_MAPPER.cardHorizontalImageCaurosel));
  const imageCarouselData = useSelector((state) => getDiySubcategoryDataByViewType(state, diyTypeData.category, VIEW_TYPE_MAPPER.imageCaurosel));
  const { isPageLoading } = useLoadingState(screen);
  
  useEffect(() => {
    if (isEmpty(trendingFunds) || isEmpty(categoryData)) {
      dispatch(fetchDiyCategoriesAndTrendingFunds({ Api, screen }));
      dispatch(
        setDiyTypeData({
          category: diyType,
        })
      );
    }
  }, []);

  const handleCardClick = (subcategory, subcategoryOption) => () => {
    dispatch(
      setDiyTypeData({
        subcategory,
        subcategoryOption,
      })
    );
    navigate(DIY_PATHNAME_MAPPER.subcategoryFundList);
  };

  const seeAllCategories = (subcategory) => () => {
    dispatch(
      setDiyTypeData({
        subcategory,
      })
    );
    navigate(DIY_PATHNAME_MAPPER.subcategoryList);
  };

  const handleFundDetails = (fundData) => () => {
    navigate(DIY_PATHNAME_MAPPER.fundDetails, {
      searchParams: `${config?.searchParams}&isins=${fundData?.isin}`,
    });
  };

  return (
    <Container>
      <div className='diy-category-landing-wrapper'>
        <LandingHeader variant='center' dataAid='equity'>
          <Lottie
            animationData={require(`assets/${productName}/lottie/${diyType.toLowerCase()}.json`)}
            autoPlay
            loop
            className='diy-landing-lottie-anim'
          />
          <LandingHeaderTitle>{DIY_TYPE[diyType.toUpperCase()]}</LandingHeaderTitle>
          <LandingHeaderSubtitle dataIdx={1}>
            {DescriptionMapper[diyType.toUpperCase()]?.desc}
          </LandingHeaderSubtitle>
          {DescriptionMapper[diyType.toUpperCase()]?.points?.map((el, idx) => {
            return (
              <LandingHeaderPoints key={idx} dataIdx={idx + 1}>
                {el}
              </LandingHeaderPoints>
            );
          })}
        </LandingHeader>
        <TrendingFunds
          trendingFunds={trendingFunds}
          handleFundDetails={handleFundDetails}
          isPageLoading={isPageLoading}
          config={config}
        />
        <TwoRowCarousel
          data={twoRowsImageCarouselData}
          seeAllCategories={seeAllCategories}
          isPageLoading={isPageLoading}
          handleCardClick={handleCardClick}
          config={config}
        />
        <SingleCategory
          data={singleCategoryData}
          isPageLoading={isPageLoading}
          handleCardClick={handleCardClick}
          config={config}
        />
        <CategoryCardCarousel
          data={imageCarouselData}
          isPageLoading={isPageLoading}
          seeAllCategories={seeAllCategories}
          handleCardClick={handleCardClick}
          config={config}
        />
        <CardVerticalCarousel
          data={horizontalCauroselData}
          isPageLoading={isPageLoading}
          handleCardClick={handleCardClick}
          config={config}
        />
      </div>
    </Container>
  );
};

export default CommonCategoryLanding;
