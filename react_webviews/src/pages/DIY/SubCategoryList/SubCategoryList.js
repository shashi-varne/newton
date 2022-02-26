import React, { useMemo } from 'react';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import CategoryCard from '../../../designSystem/molecules/CategoryCard';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import Container from '../../../designSystem/organisms/Container';
import isArray from 'lodash/isArray';
import { getConfig } from '../../../utils/functions';
import PropTypes from 'prop-types';

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

const SubCategoryList = (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const diyTypeData = useSelector(getDiyTypeData);
  const cartCount = useSelector(getDiyCartCount);
  const subcategoryData = useSelector((state) => getDiySubcategoryData(state, diyTypeData.category, diyTypeData.subcategory));
  const { productName } = useMemo(getConfig, []);
  const hideFooter = useMemo(hideDiyCartFooter(productName, cartCount), [productName, cartCount]);
  
  const onCartClick = () => {};

  const handleCardClick = (subcategoryOption) => () => {
    dispatch(
      setDiyTypeData({
        subcategoryOption,
      })
    );
    navigate(DIY_PATHNAME_MAPPER.subcategoryFundList);
  };

  return (
    <Container
      headerProps={{
        headerTitle: subcategoryData.name,
      }}
      className='diy-sub-category-cv-wrapper'
      footer={{
        confirmActionProps: {
          buttonTitle: 'View Cart',
          title: `${cartCount} item saved in your cart`,
          badgeContent: cartCount,
          onClick: onCartClick,
          imgSrc: require('assets/cart_icon.svg'),
        },
      }}
      fixedFooter
      noFooter={hideFooter}
    >
      <div className="diy-sc-cv-lists">
        {isArray(subcategoryData.options) &&
          subcategoryData.options?.map((data, idx) => {
            return (
              <SubcategoryOptionCard
                key={idx}
                onClick={handleCardClick(data.key)}
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
            imgSrc={require("assets/tech_fund.svg")}
            title={data?.name}
            dataAid={data?.key}
          />
        </div>
      ) : (
        <WrapperBox
          elevation={1}
          className="diy-sc-cv-item"
          onClick={onClick}
        >
          <CardVertical
            imgSrc={require("assets/large_cap.svg")}
            title={data?.name}
            subtitle={data?.trivia}
            dataAid={data?.key}
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
