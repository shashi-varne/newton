import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Imgc } from "./Imgc";
import { getConfig } from "utils/functions";

class ActivePassiveCarousel extends Component {
  onSwipeMoveEvent = () => {
    this.swipeMargin();
  };

  swipeMargin = () => {
    // let x = document.getElementsByClassName("offer-slide-img");
    // for (const property in x) {
    //   if (!isNaN(property)) x[property].style.margin = "0px 20px 0px 20px";
    // }
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

  renderCarousel = (data, index) => {
    return (
      <div className="active-passive-carousel">
        <div className="image">
          <Imgc
            style={{ width: "38px", height: "40px" }}
            src={require(`assets/${data.src}`)}
            alt=""
          />
        </div>
        <p className="header">{data.header}</p>
        <div className="body">
          <div className="left">
            <p className="left-title">{data.left.title.toUpperCase()}</p>
            <p className="content">{data.left.content}</p>
          </div>
          <div className="right">
            <p className="right-title">{data.right.title.toUpperCase()}</p>
            <p className="content">{data.right.content}</p>
          </div>
        </div>
      </div>
    );
  };

  eventChangeFunction = (index) => {
    this.onChangeEvent();
    this.props.callbackFromParent(index);
  };

  render() {
    let productName = getConfig().productName;

    const indicatorStyles = {
      background: productName !== "fisdom" ? "#9CC0FF" : "#DFD8EF",
      width: "20px",
      height: "3px",
      display: "inline-block",
      margin: "1px 3px",
      borderRadius: "1.5px",
    };

    const arrowStyles = {
      position: "absolute",
      zIndex: 2,
      top: "40px",
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

    if (this.props?.customData?.length === 1) {
      indicatorStyles.display = "none";
    }

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
                  background: getConfig().styles.primaryColor,
                  width: "10px",
                }}
              />
            );
          }
          return <li onClick={onClickHandler} style={indicatorStyles} />;
        }}
        {...arrowProps}
      >
        {this.props.customData &&
          this.props.customData.map((item, index) =>
            this.renderCarousel(item, index)
          )}
      </Carousel>
    );
  }
}

export default ActivePassiveCarousel;
