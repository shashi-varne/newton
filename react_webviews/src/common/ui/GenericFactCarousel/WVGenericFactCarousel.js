/*

Use:
- Carousels in which dynamic content is there with heading, an image, content
- Pass along the data and carousel styles such as background color or image 

Example:
<WVGenericFactCarousel
  customData={} ***Required***
  callbackFromParent={function} 
  carouselPageStyle={styles}
/>

*/

import React from "react";
import WVCustomCarousel from "../CustomCarousel/WVCustomCarousel";
import PropTypes from "prop-types";
import { Imgc } from "../Imgc";
import "./WVGenericFactCarousel.scss";

function WVGenericFactCarousel({
  callbackFromParent,
  showStatus, // [default: false]
  showArrows, // [default: true]
  showThumbs, // [default: false]
  infiniteLoop, // to have infinite scroll or the carousel [defaults: false]
  indicatorStyles, // styles object if custom indicator style to be added
  customData, //data for the carousel
  carouselPageStyle,
  classes, // for styling things other than what is provided
  dataAidSuffix,
}) {
  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    top: "40%",
    width: 32,
    height: 32,
    cursor: "pointer",
  };
  let arrowProps = {};
  arrowProps["renderArrowPrev"] = (onClickHandler, hasPrev, label) =>
    hasPrev && (
      <div
        onClick={onClickHandler}
        title={label}
        style={{ ...arrowStyles, left: 0 }}
      >
        <img src={require("assets/carousel-prev.svg")} alt="prev-btn" />
      </div>
    );
  arrowProps["renderArrowNext"] = (onClickHandler, hasNext, label) =>
    hasNext && (
      <div
        onClick={onClickHandler}
        title={label}
        style={{ ...arrowStyles, right: 0 }}
      >
        <img src={require("assets/carousel-next.svg")} alt="next-btn" />
      </div>
    );

  return (
    <WVCustomCarousel
      showStatus={showStatus}
      showArrows={showArrows}
      showThumbs={showThumbs}
      infiniteLoop={infiniteLoop}
      indicatorStyles={indicatorStyles}
      callbackFromParent={callbackFromParent}
      customArrowStyle={arrowProps}
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
      className={`wv-generic-fact-carousel ${classes.carouselContainer}`}
      data-aid={`wv-generic-fact-carousel-${dataAidSuffix}`}
      key={index}
      style={{ ...style }}
    >
      <div className={`image ${classes.image}`}>
        <Imgc
          style={{ width: "38px", height: "40px" }}
          src={require(`assets/${data.src}`)}
          alt=""
        />
      </div>
      <p className={`header ${classes.header}`}>{data.header}</p>
      <div className={`body ${classes.body}`}>
        <div className="left">
          <p className="left-title">{(data.left.title || "").toUpperCase()}</p>
          <p className="content">{data.left.content}</p>
        </div>
        <div className="right">
          <p className="right-title">
            {(data.right.title || "").toUpperCase()}
          </p>
          <p className="content">{data.right.content}</p>
        </div>
      </div>
    </div>
  );
};

WVGenericFactCarousel.propTypes = {
  customData: PropTypes.array.isRequired,
  carouselPageStyle: PropTypes.object,
};

WVGenericFactCarousel.defaultProps = {
  carouselPageStyle: {},
  classes: {},
};

export default WVGenericFactCarousel;
