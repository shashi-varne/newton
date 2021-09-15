import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {getConfig} from 'utils/functions';

import { Imgc} from './Imgc';

class ReactResponsiveCarousel extends Component {
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

  renderOfferImages = (props, index) => {
      return (
        <div key={index} className="generic-carousel" onClick={() => {
          if(this.props.handleClick) {
            this.props.handleClick(props, index);
          }
        }}>
          <Imgc className="offer-slide-img"
            src={this.props.directImgLink ? props :  require(`assets/${props.src}`)} alt="Gold Offer"
            style={{minHeight:170}}
            />
        </div>
      )
    }

  eventChangeFunction = (index) => {
    this.onChangeEvent();
    this.props.callbackFromParent(index);
  };

  render() {
    let productName = getConfig().productName;
    const indicatorStyles = {
      background: productName !== 'fisdom' ?  "#9CC0FF" : "#DFD8EF",
      width: "20px",
      height: "3px",
      display: "inline-block",
      margin: "1px 3px",
      borderRadius: "1.5px",
    };
    if(this.props.CarouselImg.length === 1) {
      indicatorStyles.display = 'none';
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
                  background:  getConfig().styles.primaryColor,
                  width: "10px",
                }}
              />
            );
          }
          return <li onClick={onClickHandler} style={indicatorStyles} />;
        }}
      >
        {this.props.CarouselImg.map(this.renderOfferImages)}
      </Carousel>
    );
  }
}

export default ReactResponsiveCarousel;