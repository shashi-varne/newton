import Lottie from 'lottie-react';
import React from 'react';
import {
  LandingHeader,
  LandingHeaderPoints,
  LandingHeaderSeeMoreWrapper,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import Container from '../../../designSystem/organisms/ContainerWrapper';
import { validateKycAndRedirect } from '../common/functions';
import CardVerticalCarousel from './CardVerticalCarousel';
import CategoryCardCarousel from './CategoryCardCarousel';
import SingleCategory from './SingleCategory';
import TrendingFunds from './TrendingFunds';
import TwoRowCarousel from './TwoRowCarousel';
import './DiyLanding.scss';

const DiyLanding = (props) => {
  const {
    sendEvents,
    cartCount,
    navigate,
    kyc,
    hideFooter,
    isLoading,
    categoryData,
    productName,
    diyType,
    config,
    showSeeMore,
    handleFundDetails,
    twoRowsImageCarouselData,
    seeAllCategories,
    isPageLoading,
    handleCardClick,
    singleCategoryData,
    imageCarouselData,
    horizontalCauroselData,
    handleSearchIconClick
  } = props;
  return (
    <Container
      eventData={sendEvents()}
      footer={{
        confirmActionProps: {
          buttonTitle: 'View Cart',
          title: `${cartCount} item saved in your cart`,
          badgeContent: cartCount,
          onButtonClick: validateKycAndRedirect({ navigate, kyc }),
          imgSrc: require('assets/cart_icon.svg'),
          dataAid: 'viewCart',
        },
      }}
      fixedFooter
      noFooter={hideFooter}
      isPageLoading={isLoading}
      noPadding={true}
      dataAid={categoryData?.design_id}
      headerProps={{
        dataAid: 1,
        rightIconSrc:require('assets/search_diy.svg'),
        onRightIconClick: handleSearchIconClick
      }}
      className='diy-main-wrapper'
    >
      <div className='diy-category-landing-wrapper'>
        <LandingHeader variant='center' dataAid={categoryData?.design_id}>
          <Lottie
            animationData={require(`assets/${productName}/lottie/${diyType.toLowerCase()}.json`)}
            autoPlay
            loop
            className='diy-landing-lottie-anim'
            data-aid='iv_top'
          />
          <LandingHeaderTitle>{categoryData.category?.toUpperCase()}</LandingHeaderTitle>
          {config.isMobileDevice && showSeeMore ? (
            <LandingHeaderSeeMoreWrapper
              subtitle={categoryData.subtitle}
              points={categoryData?.points}
              subtitleDataIdx={1}
            />
          ) : (
            <>
              <LandingHeaderSubtitle dataIdx={1}>{categoryData.subtitle}</LandingHeaderSubtitle>
              {categoryData?.points?.map((el, idx) => {
                return (
                  <LandingHeaderPoints key={idx} dataIdx={idx + 1}>
                    {el}
                  </LandingHeaderPoints>
                );
              })}
            </>
          )}
        </LandingHeader>
        <TrendingFunds
          handleFundDetails={handleFundDetails}
          config={config}
          diyType={diyType?.toLowerCase()}
        />
        <TwoRowCarousel
          data={twoRowsImageCarouselData}
          seeAllCategories={seeAllCategories}
          isPageLoading={isPageLoading}
          handleCardClick={handleCardClick}
          config={config}
        />
        <SingleCategory
          data={singleCategoryData}
          isPageLoading={isPageLoading}
          handleCardClick={handleCardClick}
          config={config}
        />
        <CategoryCardCarousel
          data={imageCarouselData}
          isPageLoading={isPageLoading}
          seeAllCategories={seeAllCategories}
          handleCardClick={handleCardClick}
          config={config}
        />
        <CardVerticalCarousel
          data={horizontalCauroselData}
          isPageLoading={isPageLoading}
          handleCardClick={handleCardClick}
          config={config}
          diyType={diyType}
        />
      </div>
    </Container>
  );
};

export default DiyLanding;
