import React from 'react';
import Container from '../common/Container';
import WVInPageHeader from '../../common/ui/InPageHeader/WVInPageHeader';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';
import MarketProductCard from '../mini-components/MarketProductCard';
import { getConfig } from '../../utils/functions';

const ProductMarketTypes = () => {
  const config = getConfig();
  const productName = config.productName;
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
    let type = (el.name).toLowerCase();
    window.location.href = `${config.base_url}/page/equity/tpp/${type}`;
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
        <MarketProductCard key={idx} {...el} onClick={handleOnClick(el)} />
      ))}
    </Container>
  );
};

export default ProductMarketTypes;
