import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

class ReactResponsiveCarousel extends Component {
  onSwipeMoveEvent = () => {
    this.swipeMargin();
  };

  swipeMargin = () => {
    let x = document.getElementsByClassName("offer-slide-img");
    for (const property in x) {
      if (!isNaN(property)) x[property].style.margin = "0px 20px 0px 20px";
    }
  };

  onChangeEvent = () => {
    let x = document.getElementsByClassName("offer-slide-img");
    this.swipeMargin();
    setTimeout(() => {
      for (const property in x) {
        if (!isNaN(property)) x[property].style.margin = "0px 0px 0px 0px";
      }
    }, 350);
  };

  eventChangeFunction = (index) => {
    this.onChangeEvent();
    this.props.callbackFromParent(index);
  };

  render() {
    const indicatorStyles = {
      background: "#00008B",
      width: "20px",
      height: "3px",
      display: "inline-block",
      margin: "1px 3px",
      borderRadius: "1.5px",
    };

    return (
      <Carousel
        showStatus={false}
        showThumbs={false}
        showArrows={true}
        infiniteLoop={false}
        // selectedItem={this.props.selectedIndexvalue}
        onSwipeMove={this.onSwipeMoveEvent}
        onChange={this.eventChangeFunction}
        renderIndicator={(onClickHandler, isSelected) => {
          if (isSelected) {
            return (
              <li
                style={{
                  ...indicatorStyles,
                  background: "#ADD8E6",
                  width: "10px",
                }}
              />
            );
          }
          return <li onClick={onClickHandler} style={indicatorStyles} />;
        }}
      >
        {this.props.CarouselImg}
      </Carousel>
    );
  }
}

export default ReactResponsiveCarousel;