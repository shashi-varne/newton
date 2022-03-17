import {
  getDiyCartCount,
  getDiySubcategoryData,
  getDiyTypeData,
  setDiyTypeData,
} from 'businesslogic/dataStore/reducers/diy';
import { hideDiyCartFooter } from 'businesslogic/utils/diy/functions';
import replace from 'lodash/replace';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import { getConfig, navigate as navigateFunc } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import SubCategoryList from '../../pages/DIY/SubCategoryList';
import { DIY_PATHNAME_MAPPER } from '../../pages/DIY/common/constants';

const subCategoryListContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const diyTypeData = useSelector(getDiyTypeData);
  const cartCount = useSelector(getDiyCartCount);
  const subcategoryData = useSelector((state) =>
    getDiySubcategoryData(state, diyTypeData.category, diyTypeData.subcategory)
  );
  const { productName } = useMemo(getConfig, []);
  const hideFooter = useMemo(hideDiyCartFooter(productName, cartCount), [productName, cartCount]);
  const { kyc, isLoading, user } = useUserKycHook();
  const handleCardClick = (subcategoryOption, subcategoryOptionName) => () => {
    dispatch(
      setDiyTypeData({
        subcategoryOption,
      })
    );
    const formatedCategory = replace(diyTypeData.subcategory, /_/g, ' ').toLowerCase();
    const categoryEvent = `${diyTypeData.category.toLowerCase()} ${formatedCategory}`;
    const subCategoryEvent = subcategoryOptionName.toLowerCase();
    sendEvents(categoryEvent, subCategoryEvent);
    navigate(DIY_PATHNAME_MAPPER.subcategoryFundList);
  };

  const sendEvents = (category, subCategory) => {
    const eventObj = {
      event_name: 'diy_sub_category_clicked',
      properties: {
        category: category || '',
        user_action: 'next',
        sub_category: subCategory || '',
        user_application_status: kyc?.application_status_v2 || 'init',
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
      },
    };
    nativeCallback({ events: eventObj });
  };
  return (
    <WrappedComponent
      subcategoryData={subcategoryData}
      cartCount={cartCount}
      navigate={navigate}
      kyc={kyc}
      hideFooter={hideFooter}
      isLoading={isLoading}
      handleCardClick={handleCardClick}
    />
  );
};

export default subCategoryListContainer(SubCategoryList);
