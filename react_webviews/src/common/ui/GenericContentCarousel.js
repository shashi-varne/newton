import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactHtmlParser from "react-html-parser";
import { getConfig } from "utils/functions";

class GenericContentCarousel extends Component {
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
      <div className="generic-content-carousel" key={index}>
        <p className="title">{data.title}</p>
        <p className="content">{ReactHtmlParser(data.content)}</p>
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
      >
        {this.props.customData &&
          this.props.customData.map((item, index) =>
            this.renderCarousel(item, index)
          )}
      </Carousel>
    );
  }
}

export default GenericContentCarousel;
