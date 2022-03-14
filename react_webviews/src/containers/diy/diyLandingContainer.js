import { VIEW_TYPE_MAPPER } from 'businesslogic/constants/diy';
import {
    fetchDiyCategories, getDiyCartCount, getDiyCategoryData, getDiySubcategoryDataByViewType, getDiyTypeData, setDiyStorage, setDiyTypeData
} from 'businesslogic/dataStore/reducers/diy';
import { hideDiyCartFooter } from 'businesslogic/utils/diy/functions';
import isEmpty from 'lodash/isEmpty';
import replace from 'lodash/replace';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'utils/api';
import { getConfig, navigate as navigateFunc } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import useLoadingState from '../../common/customHooks/useLoadingState';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import { DIY_PATHNAME_MAPPER } from '../../pages/DIY/common/constants';
import CommonCategoryLanding from '../../pages/DIY/DiyLanding/DiyLanding';

const screen = 'diyLanding';

const diyLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  const dispatch = useDispatch();
  const productName = config.productName;
  let { diyType = '' } = props.match.params;
  const diyTypeData = useSelector(getDiyTypeData);
  const cartCount = useSelector(getDiyCartCount);
  const categoryData = useSelector((state) => getDiyCategoryData(state, diyType));
  const twoRowsImageCarouselData = useSelector((state) =>
    getDiySubcategoryDataByViewType(
      state,
      diyTypeData.category,
      VIEW_TYPE_MAPPER.twoRowsImageCaurosel
    )
  );
  const singleCategoryData = useSelector((state) =>
    getDiySubcategoryDataByViewType(state, diyTypeData.category, VIEW_TYPE_MAPPER.singleCard)
  );
  const horizontalCauroselData = useSelector((state) =>
    getDiySubcategoryDataByViewType(
      state,
      diyTypeData.category,
      VIEW_TYPE_MAPPER.cardHorizontalImageCaurosel
    )
  );
  const imageCarouselData = useSelector((state) =>
    getDiySubcategoryDataByViewType(state, diyTypeData.category, VIEW_TYPE_MAPPER.imageCaurosel)
  );
  const { isPageLoading } = useLoadingState(screen);
  const hideFooter = useMemo(hideDiyCartFooter(productName, cartCount), [productName, cartCount]);
  const { kyc, isLoading, user } = useUserKycHook();
  const subtitleLength = categoryData?.subtitle?.length || 0;
  const pointsLength = categoryData?.points?.length || 0;
  const showSeeMore = subtitleLength > 89 || (pointsLength >= 2 && subtitleLength > 40);

  useEffect(() => {
    if (isEmpty(categoryData)) {
      dispatch(fetchDiyCategories({ Api, screen }));
    }
    dispatch(
      setDiyTypeData({
        category: diyType,
      })
    );
  }, []);

  const handleCardClick =
    (subcategory, subcategoryOption, subcategoryOptionName = '') =>
    () => {
      dispatch(
        setDiyTypeData({
          subcategory,
          subcategoryOption,
        })
      );
      const formatedCategory = replace(diyTypeData.subcategory, /_/g, ' ').toLowerCase();
      const categoryEvent = `${diyType.toLowerCase()} ${formatedCategory}`;
      const subCategoryEvent = subcategoryOptionName.toLowerCase();
      sendEvents(categoryEvent, subCategoryEvent, 'next');
      dispatch(setDiyStorage({ fromScreen: screen }));
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

  const handleSearchIconClick = () => {
    navigate(DIY_PATHNAME_MAPPER.search)
  }

  const sendEvents = (category, subCategory, userAction) => {
    const eventObj = {
      event_name: 'diy_sub_category_clicked',
      properties: {
        category: category || '',
        user_action: userAction || 'back',
        sub_category: subCategory || '',
        user_application_status: kyc?.application_status_v2 || 'init',
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
      },
    };
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };
  return (
    <WrappedComponent
      sendEvents={sendEvents}
      cartCount={cartCount}
      navigate={navigate}
      kyc={kyc}
      hideFooter={hideFooter}
      isLoading={isLoading}
      categoryData={categoryData}
      productName={productName}
      diyType={diyType}
      config={config}
      showSeeMore={showSeeMore}
      handleFundDetails={handleFundDetails}
      twoRowsImageCarouselData={twoRowsImageCarouselData}
      seeAllCategories={seeAllCategories}
      isPageLoading={isPageLoading}
      handleCardClick={handleCardClick}
      singleCategoryData={singleCategoryData}
      imageCarouselData={imageCarouselData}
      horizontalCauroselData={horizontalCauroselData}
      handleSearchIconClick={handleSearchIconClick}
    />
  );
};

export default diyLandingContainer(CommonCategoryLanding);
