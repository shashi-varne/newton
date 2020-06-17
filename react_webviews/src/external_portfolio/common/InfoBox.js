import React, { Component } from 'react';

class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      image,
      imgClass,
      header,
      subtext,
      btnText
    } = this.props;
    return (
      <div class="info-box">
        {
          image && <div class="info-box-img">
            <img
              src={image}
              className={imgClass}
              alt=""
            />
          </div>
        }
        <div class="info-box-body">
          
        </div>
        <div class="info-box-ctrl"></div>
      </div>
    );
  }
}