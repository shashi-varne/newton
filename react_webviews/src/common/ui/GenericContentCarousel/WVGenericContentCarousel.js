import React from "react";
import WVCustomCarousel from "../CustomCarousel/WVCustomCarousel";
import ReactHtmlParser from "react-html-parser";
import PropTypes from "prop-types";
import "./WVGenericContentCarousel.scss";

function WVGenericContentCarousel({
  callbackFromParent,
  showStatus,
  showArrows,
  showThumbs,
  infiniteLoop,
  indicatorStyles,
  customData,
  carouselPageStyle,
  classes,
  dataAidSuffix,
}) {
  return (
    <WVCustomCarousel
      showStatus={showStatus}
      showArrows={showArrows}
      showThumbs={showThumbs}
      infiniteLoop={infiniteLoop}
      indicatorStyles={indicatorStyles}
      callbackFromParent={callbackFromParent}
    >
      {customData &&
        customData.map((item, index) =>
          renderCarousel(item, index, carouselPageStyle, classes, dataAidSuffix)
        )}
    </WVCustomCarousel>
  );
}

const renderCarousel = (data, index, style, classes, dataAidSuffix) => {
  return (
    <div
      className={`wv-generic-content-carousel ${classes.carouselContainer}`}
      data-aid={`wv-generic-content-carousel-${dataAidSuffix}`}
      key={index}
      style={{ ...style }}
    >
      <p className={`title ${classes.title}`}>{data.title}</p>
      <p className={`content ${classes.content}`}>
        {ReactHtmlParser(data.content)}
      </p>
    </div>
  );
};

WVGenericContentCarousel.propTypes = {
  customData: PropTypes.array.isRequired,
  carouselPageStyle: PropTypes.object,
};

WVGenericContentCarousel.defaultProps = {
  carouselPageStyle: {},
  classes: {},
};

export default WVGenericContentCarousel;
