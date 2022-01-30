import React from 'react';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import Container from '../../../designSystem/organisms/Container';
import { CATEGORY_LISTS } from './constants';

import './SubCategoryList.scss';

const SubCategoryList = () => {
  return (
    <Container
      headerProps={{
        headerTitle: 'Market cap',
      }}
      className='diy-sub-category-cv-wrapper'
      footer={{
          button1Props: {
              title: 'Continue'
          },
      }}
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
