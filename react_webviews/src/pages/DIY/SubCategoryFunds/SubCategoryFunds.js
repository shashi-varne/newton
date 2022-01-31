import React, { useMemo } from 'react';
import CategoryCard from '../../../designSystem/molecules/CategoryCard';
import Container from '../../../designSystem/organisms/Container';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import { getConfig } from '../../../utils/functions';
import PropTypes from 'prop-types';
import './SubCategoryFunds.scss';

const SubCategoryFunds = ({
  CCvariant,
  headerTitle,
  fundCategoryList,
  cartCount,
  onCartClick,
  onCardClick,
}) => {
  const { productName } = useMemo(getConfig, []);
  const hideFooter = productName === 'finity' || cartCount <= 0;
  const handleCardClick = (item) => () => {
    if (isFunction(onCardClick)) {
      onCardClick(item);
    }
  };

  console.log('fundCategoryList', fundCategoryList);

  return (
    <Container
      headerProps={{
        headerTitle,
      }}
      className='diy-sub-category-fund-cc-wrapper'
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
      <div className='diy-scf-cc-lists'>
        {isArray(fundCategoryList) &&
          fundCategoryList?.map((fundCategory, idx) => {
            return (
              <div className='diy-sc-cv-item' key={idx} onClick={handleCardClick(fundCategory)}>
                <CategoryCard variant={CCvariant} {...fundCategory} />
              </div>
            );
          })}
      </div>
    </Container>
  );
};

export default SubCategoryFunds;

SubCategoryFunds.defaultProps = {
  CCvariant: 'large',
  cartCount: 0
};

SubCategoryFunds.propTypes = {
  headerTitle: PropTypes.string,
  fundCategoryList: PropTypes.arrayOf(PropTypes.object),
  cartCount: PropTypes.number,
  onCartClick: PropTypes.func,
  onCardClick: PropTypes.func,
};
