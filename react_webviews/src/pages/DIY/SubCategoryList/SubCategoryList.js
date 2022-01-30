import React, { useMemo } from 'react';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import Container from '../../../designSystem/organisms/Container';
import { CATEGORY_LISTS } from './constants';

import './SubCategoryList.scss';
import { getConfig } from '../../../utils/functions';

const SubCategoryList = () => {
  const { productName } = useMemo(getConfig, []);
  return (
    <Container
      headerProps={{
        headerTitle: 'Market cap',
      }}
      className='diy-sub-category-cv-wrapper'
      footer={{
        confirmActionProps: {
          buttonTitle: 'View Cart',
          title: '2 item saved in your cart',
          imgSrc: require('assets/amazon_pay.svg'),
        },
      }}
      noFooter={productName === 'finity'}
    >
      <div className='diy-sc-cv-lists'>
        {CATEGORY_LISTS?.map((category, idx) => {
          return (
            <WrapperBox elevation={1} className='diy-sc-cv-item' key={idx}>
              <CardVertical {...category} />
            </WrapperBox>
          );
        })}
      </div>
    </Container>
  );
};

export default SubCategoryList;
