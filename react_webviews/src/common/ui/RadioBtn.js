import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import './style.scss';
import check_selected_blue from 'assets/check_selected_blue.svg';
import SVG from 'react-inlinesvg';


export default class RadioBtn extends Component {
  handleClick() {
    this.props.handler(this.props.index);
  }

  render() {
    return (
      <div
        className="radio-btn-group"
        onClick={() => this.handleClick()} 
        >
        <div
          style={{ color: getConfig().primary }}
          className={`ContainerWrapper ${this.props.isChecked ? "RadioButton checked" : "RadioButton unchecked"}`}
          data-value={this.props.value} >
          <label 
            style={{height: '36px'}}
            className={`${this.props.type} ${this.props.isChecked ? getConfig().configPrimaryColorClass + ' RadioLabelChecked' :
              ''} ${this.props.disabledWithValue ? " radioDisabledWithValue" : ""}`}
          >
            <div className="inside-text" style={{fontWeight: `${this.props.isChecked ? '700' : '400'}`}}>{this.props.text}</div>
            {this.props.isChecked && 
             <SVG className="tickmark-img"
             preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
             src={check_selected_blue}
            />
            }
          </label>
        </div>
      </div>
    );
  }
}
