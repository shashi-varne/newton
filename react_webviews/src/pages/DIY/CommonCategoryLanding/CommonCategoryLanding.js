import React, { useEffect } from 'react';
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderPoints,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import { getConfig } from '../../../utils/functions';
import Container from '../../../designSystem/organisms/Container';

import isEmpty from 'lodash/isEmpty';
import { fetchDiyCategoriesAndTrendingFunds } from 'businesslogic/dataStore/reducers/diy';
import { DescriptionMapper, DIY_TYPE } from 'businesslogic/strings/constants/diy';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../../utils/api';
import TrendingFunds from './TrendingFunds';
import TwoRowCarousel from './TwoRowCarousel';
import SingleCategory from './SingleCategory';
import CategoryCardCarousel from './CategoryCardCarousel';
import CardVerticalCarousel from './CardVerticalCarousel';
import Lottie from 'lottie-react';
import './CommonCategoryLanding.scss';

const screen = 'diyLanding';
const CommonCategoryLanding = (props) => {
  const config = getConfig();
  const dispatch = useDispatch();
  const productName = config.productName;
  let { diyType } = props.match.params;
  diyType = diyType.toLowerCase();

  const trendingFunds = useSelector((state) => state?.diy?.trendingFunds);
  const categoriesNew = useSelector((state) => state?.diy?.categories);

  useEffect(() => {
    if (isEmpty(trendingFunds) || isEmpty(categoriesNew)) {
      dispatch(fetchDiyCategoriesAndTrendingFunds({ Api, screen }));
    }
  }, []);
  return (
    <Container>
      <div className='diy-category-landing-wrapper'>
        <LandingHeader variant='center' dataAid='equity'>
          <Lottie
            animationData={require(`assets/${productName}/lottie/${diyType}.json`)}
            autoPlay
            loop
            className='diy-landing-lottie-anim'
          />
          <LandingHeaderTitle>{DIY_TYPE[diyType.toUpperCase()]}</LandingHeaderTitle>
          <LandingHeaderSubtitle dataIdx={1}>
            {DescriptionMapper[diyType.toUpperCase()].desc}
          </LandingHeaderSubtitle>
          {DescriptionMapper[diyType.toUpperCase()].points?.map((el, idx) => {
            return (
              <LandingHeaderPoints key={idx} dataIdx={idx + 1}>
                {el}
              </LandingHeaderPoints>
            );
          })}
        </LandingHeader>
        <TrendingFunds diyType={diyType} config={config} />
        <TwoRowCarousel diyType={diyType} config={config} />
        <SingleCategory diyType={diyType} config={config} />
        <CategoryCardCarousel diyType={diyType} config={config} />
        <CardVerticalCarousel diyType={diyType} config={config} />
      </div>
    </Container>
  );
};

export default CommonCategoryLanding;
