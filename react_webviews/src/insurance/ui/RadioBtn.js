import React, { Component } from 'react';

import './style.css';

export default class RadioBtn extends Component {
  handleClick(){
    this.props.handler(this.props.index);
  }

  render() {
    return (
      <div
        className="radio-btn-group"
        onClick={() => this.handleClick()} >
        <div
          className={this.props.isChecked ? "RadioButton checked" : "RadioButton unchecked"} data-value={this.props.value} >
          <label className={this.props.type}>{this.props.text}</label>
        </div>
      </div>
    );
  }
}
