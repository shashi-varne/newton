import React, { useMemo } from 'react';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import Container from '../../../designSystem/organisms/Container';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import { getConfig } from '../../../utils/functions';
import PropTypes from 'prop-types';

import './SubCategoryList.scss';

const SubCategoryList = ({headerTitle, categoryList, cartCount, onCartClick, onCardClick}) => {
  const { productName } = useMemo(getConfig, []);
  const hideFooter = productName === 'finity' || cartCount <= 0;

  const handleCardClick = (item) => () => {
    if(isFunction(onCardClick)) {
      onCardClick(item);
    }
  }
  return (
    <Container
      headerProps={{
        headerTitle,
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
      noFooter={hideFooter}
    >
      <div className='diy-sc-cv-lists'>
        {isArray(categoryList) && categoryList?.map((category, idx) => {
          return (
            <WrapperBox elevation={1} className='diy-sc-cv-item' key={idx} onClick={handleCardClick(category)}>
              <CardVertical {...category} />
            </WrapperBox>
          );
        })}
      </div>
    </Container>
  );
};

export default SubCategoryList;

SubCategoryList.defaultProps = {
  cartCount: 0
}

SubCategoryList.propTypes = {
  headerTitle: PropTypes.string,
  categoryList: PropTypes.arrayOf(PropTypes.object),
  cartCount: PropTypes.number,
  onCartClick: PropTypes.func,
  onCardClick: PropTypes.func
}
