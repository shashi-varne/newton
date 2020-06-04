import React, { Component } from 'react';
import './style.css';
import { getConfig } from 'utils/functions';

class BottomInfoClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseData: this.props.baseData,
      productName: getConfig().type
    };
  }

  render() {

    return (

      <div className="common-bottom-info">
        <div className="content">{this.state.baseData.content}</div>
      </div>

    );

  }
}

const BottomInfo = (props) => (
  <BottomInfoClass
    {...props} />
);

export default BottomInfo;
