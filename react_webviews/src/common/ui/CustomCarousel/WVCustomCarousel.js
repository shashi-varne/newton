import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getConfig } from "utils/functions";
import PropTypes from "prop-types";

const productName = getConfig().productName;

function WVCustomCarousel({
  callbackFromParent,
  showStatus,
  showArrows,
  showThumbs,
  infiniteLoop,
  indicatorStyles,
  children,
  customArrowStyle
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
            />
          );
        }
        return <li onClick={onClickHandler} style={indicatorStyles} />;
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
    width: "20px",
    height: "3px",
    display: "inline-block",
    margin: "1px 3px",
    borderRadius: "1.5px",
  },
  customArrowStyle: {}
};

export default WVCustomCarousel;
