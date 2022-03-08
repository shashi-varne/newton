import React, { useMemo } from 'react';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import CategoryCard from '../../../designSystem/molecules/CategoryCard';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import Container from '../../../designSystem/organisms/Container';
import isArray from 'lodash/isArray';
import { getConfig } from '../../../utils/functions';
import PropTypes from 'prop-types';
import replace from 'lodash/replace';

import {
  setDiyTypeData,
  getDiyTypeData,
  getDiySubcategoryData,
  getDiyCartCount
} from "businesslogic/dataStore/reducers/diy";
import { useDispatch, useSelector } from "react-redux";
import { navigate as navigateFunc } from "../../../utils/functions";
import './SubCategoryList.scss';
import { DIY_PATHNAME_MAPPER } from '../common/constants';
import { hideDiyCartFooter } from "businesslogic/utils/diy/functions";
import { VIEW_TYPE_MAPPER } from 'businesslogic/constants/diy';
import { validateKycAndRedirect } from '../common/functions';
import useUserKycHook from '../../../kyc/common/hooks/userKycHook';
import { nativeCallback } from '../../../utils/native_callback';

const SubCategoryList = (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const diyTypeData = useSelector(getDiyTypeData);
  const cartCount = useSelector(getDiyCartCount);
  const subcategoryData = useSelector((state) => getDiySubcategoryData(state, diyTypeData.category, diyTypeData.subcategory));
  const { productName } = useMemo(getConfig, []);
  const hideFooter = useMemo(hideDiyCartFooter(productName, cartCount), [productName, cartCount]);
  const { kyc, isLoading, user } = useUserKycHook();
  const handleCardClick = (subcategoryOption, subcategoryOptionName) => () => {
    dispatch(
      setDiyTypeData({
        subcategoryOption,
      })
    );
    const formatedCategory = replace(diyTypeData.subcategory,/_/g,' ').toLowerCase();
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
    <Container
      headerProps={{
        headerTitle: subcategoryData.name,
        dataAid: subcategoryData?.design_id,
      }}
      className='diy-sub-category-cv-wrapper'
      footer={{
        confirmActionProps: {
          buttonTitle: 'View Cart',
          title: `${cartCount} item saved in your cart`,
          badgeContent: cartCount,
          onButtonClick: validateKycAndRedirect({ navigate, kyc }),
          imgSrc: require('assets/cart_icon.svg'),
          dataAid: 'viewCart',
        },
      }}
      fixedFooter
      noFooter={hideFooter}
      isPageLoading={isLoading}
      dataAid={subcategoryData?.design_id}
    >
      <div className="diy-sc-cv-lists">
        {isArray(subcategoryData.options) &&
          subcategoryData.options?.map((data, idx) => {
            return (
              <SubcategoryOptionCard
                key={idx}
                onClick={handleCardClick(data.key, data.name)}
                data={data}
                viewType={subcategoryData.viewType}
              />
            );
          })}
      </div>
    </Container>
  );
};

const SubcategoryOptionCard = ({ viewType, data, onClick }) => {
  return (
    <>
      {viewType === VIEW_TYPE_MAPPER.imageCaurosel ? (
        <div className="diy-sc-cv-item" onClick={onClick}>
          <CategoryCard
            variant="large"
            imgSrc={data?.image_url}
            title={data?.name}
            dataAid={data?.design_id}
          />
        </div>
      ) : (
        <WrapperBox
          elevation={1}
          className="diy-sc-cv-item"
          onClick={onClick}
        >
          <CardVertical
            imgSrc={data?.image_url}
            title={data?.name}
            subtitle={data?.trivia}
            dataAid={data?.design_id}
          />
        </WrapperBox>
      )}
    </>
  );
};

export default SubCategoryList;

SubCategoryList.defaultProps = {
  cartCount: 0,
};

SubCategoryList.propTypes = {
  headerTitle: PropTypes.string,
  categoryList: PropTypes.arrayOf(PropTypes.object),
  cartCount: PropTypes.number,
  onCartClick: PropTypes.func,
  onCardClick: PropTypes.func,
};
