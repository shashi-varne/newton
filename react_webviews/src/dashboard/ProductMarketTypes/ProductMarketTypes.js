import React from 'react';
import Container from '../common/Container';
import { Imgc } from '../../common/ui/Imgc';
import WVInPageHeader from '../../common/ui/InPageHeader/WVInPageHeader';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';
import { getConfig } from '../../utils/functions';

import './ProductMarketTypes.scss';


const ProductMarketTypes = () => {
  const productName = getConfig().productName;
  const categoryLists = [
    {
      name: 'IPO',
      info: 'Initial public offer',
      icon: require(`assets/${productName}/ipo.svg`),
    },
    {
      name: 'SGB',
      info: 'Sovereign gold bonds',
      icon: require(`assets/${productName}/sgb.svg`),
    },
    {
      name: 'NCD',
      info: 'Non convertible debentures',
      icon: require(`assets/${productName}/ncd.svg`),
    },
    {
      name: 'FPO',
      info: 'Follow-on public offer',
      icon: require(`assets/${productName}/fpo.svg`),
    },
    {
      name: 'Buyback',
      info: 'Participate in share re-purchases',
      icon: require(`assets/${productName}/buyback.svg`),
    },
  ];
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
