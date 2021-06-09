/*
Use:
- Provides the basic wrapper structure for the carousel
- Everything wrapped with the component would be rendered as it is
- Provides functionality to provide own indicator styles and arrow styles

Example: 

<WVCustomCarousel
  showStatus={boolean} // defaults: false
  showArrows={showArrows} // defaults: true
  showThumbs={showThumbs} // defaults: false
  infiniteLoop={infiniteLoop} // defaults: false
  indicatorStyles={indicatorStyles} 
  callbackFromParent={callbackFromParent}
>
  {content to be displayed}
</WVCustomCarousel>
*/

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getConfig } from "utils/functions";
import PropTypes from "prop-types";
import "./WVCustomCarousel.scss";
const productName = getConfig().productName;

function WVCustomCarousel({
  callbackFromParent, // any function to be called with each slide
  showStatus,
  showArrows,
  showThumbs,
  infiniteLoop,
  indicatorStyles, // object to define custom styles
  children, // content to be rendered
  customArrowStyle,
}) {
  const onChangeEvent = () => {
    let x = document.getElementsByClassName("offer-slide-img");
    setTimeout(() => {
      for (const property in x) {
        if (!isNaN(property)) x[property].style.margin = "0px 0px 0px 0px";
      }
    }, 350);
  };

  const eventChangeFunction = (index) => {
    onChangeEvent();
    callbackFromParent(index);
  };

  return (
    <Carousel
      showStatus={showStatus}
      showThumbs={showThumbs}
      showArrows={showArrows}
      infiniteLoop={infiniteLoop}
      onChange={eventChangeFunction}
      renderIndicator={(onClickHandler, isSelected) => {
        if (isSelected) {
          return (
            <li
              style={{
                ...indicatorStyles,
                background: getConfig().styles.primaryColor,
                width: "10px",
              }}
              className="wv-custom-carousel-indicator-styles"
            />
          );
        }
        return (
          <li
            onClick={onClickHandler}
            className="wv-custom-carousel-indicator-styles"
            style={indicatorStyles}
          />
        );
      }}
      {...customArrowStyle}
    >
      {children}
    </Carousel>
  );
}

WVCustomCarousel.propTypes = {
  children: PropTypes.node,
  callbackFromParent: PropTypes.func,
  showThumbs: PropTypes.bool,
  showArrows: PropTypes.bool,
  showStatus: PropTypes.bool,
  infiniteLoop: PropTypes.bool,
  indicatorStyles: PropTypes.object,
};

WVCustomCarousel.defaultProps = {
  callbackFromParent: () => {},
  showThumbs: false,
  showStatus: false,
  showArrows: true,
  infiniteLoop: false,
  indicatorStyles: {
    background: productName !== "fisdom" ? "#9CC0FF" : "#DFD8EF",
  },
  customArrowStyle: {},
};

export default WVCustomCarousel;
