import React from 'react';
import Container from '../common/Container';
import { Imgc } from '../../common/ui/Imgc';
import WVInPageHeader from '../../common/ui/InPageHeader/WVInPageHeader';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';

import './ProductMarketTypes.scss';

/// Assets
import ipo from 'assets/fisdom/ipo.svg';
import sgb from 'assets/fisdom/sgb.svg';
import ncd from 'assets/fisdom/ncd.svg';
import fpo from 'assets/fisdom/fpo.svg';
import buyback from 'assets/fisdom/buyback.svg';

const categoryLists = [
  {
    name: 'IPO',
    info: 'Initial public offer',
    icon: ipo,
  },
  {
    name: 'SGB',
    info: 'Sovereign gold bonds',
    icon: sgb,
  },
  {
    name: 'NCD',
    info: 'Non convertible debentures',
    icon: ncd,
  },
  {
    name: 'FPO',
    info: 'Follow-on public offer',
    icon: fpo,
  },
  {
    name: 'Buyback',
    info: 'Participate in share re-purchases',
    icon: buyback,
  },
];

const ProductMarketTypes = () => {
  const handleOnClick = (el) => () => {
    console.log('the val is', el.name);
  };
  return (
    <Container
      data-aid='my-categories-screen'
      noFooter={true}
      skelton={false}
      title='All categories'
      hidePageTitle
    >
      <WVInPageHeader style={{ marginBottom: '0px' }}>
        <WVInPageTitle>All categories</WVInPageTitle>
        <WVInPageSubtitle>Market’s latest enteries</WVInPageSubtitle>
      </WVInPageHeader>
      {categoryLists?.map((el, idx) => (
        <div key={idx} className='category-block' onClick={handleOnClick(el)}>
          <div className='image-wrapper'>
            <Imgc src={el.icon} alt={el.name} />
          </div>
          <div className='content-wrapper'>
            <div className='category-name'>{el.name}</div>
            <div className='category-fullform'>{el.info}</div>
            <div className='category-divider' />
          </div>
        </div>
      ))}
    </Container>
  );
};

export default ProductMarketTypes;
