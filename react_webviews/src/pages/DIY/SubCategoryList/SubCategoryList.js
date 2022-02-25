import React, { useMemo } from 'react';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import Container from '../../../designSystem/organisms/Container';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import { getConfig } from '../../../utils/functions';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import './SubCategoryList.scss';

const SubCategoryList = () => {
  let location = useLocation();
  const { headerTitle, categoryList } = location.state;
  const cartCount = 1;
  const onCartClick = () => {};
  const onCardClick = () => {};
  const { productName } = useMemo(getConfig, []);
  const hideFooter = productName === 'finity' || cartCount <= 0;

  const handleCardClick = (item) => () => {
    console.log("item is", item);
    if (isFunction(onCardClick)) {
      onCardClick(item);
    }
  };
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
      fixedFooter
      noFooter={hideFooter}
    >
      <div className='diy-sc-cv-lists'>
        {isArray(categoryList) &&
          categoryList?.map((category, idx) => {
            return (
              <WrapperBox
                elevation={1}
                className='diy-sc-cv-item'
                key={idx}
                onClick={handleCardClick(category)}
              >
                <CardVertical
                  imgSrc={require('assets/large_cap.svg')}
                  title={category?.name}
                  subtitle={category?.trivia}
                  dataAid={category?.key}
                />
              </WrapperBox>
            );
          })}
      </div>
    </Container>
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
