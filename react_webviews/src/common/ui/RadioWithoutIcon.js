import React, { Component } from 'react';
import Grid from 'material-ui/Grid';

import './style.scss';
import RadioBtn from './RadioBtn';

class RadioGrp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
      selectedValue: null,
      options: this.props.options
    };
  }

  componentDidUpdate(prevState) {

    if (prevState.options !== this.props.options) {
      this.setState({
        options: this.props.options
      })
    }

  }

  toggleRadioBtn = (index) => {

    if(this.props.canUnSelect && this.state.selectedIndex === index) {
      index = '';
    }
              
    if(this.props.disabled) {
      return;
    }
    this.props.onChange(index);
    this.setState({
      selectedIndex: index,
      selectedValue: this.state.options[index],
      options: this.state.options
    });
  }

  render() {
    const { options } = this.state;

    const allOptions = options.map((option, i) => {
      if (this.props.type === 'professional') {
        return (
          <Grid item xs={5} key={i} className="RadioGrpGrid"  data-aid={`radiogrp-grid-${i+1}`} style={{ flexBasis: 'auto' }}>
            <RadioBtn
              isChecked={(this.state.selectedIndex === i || option.value === this.props.value)}
              text={option.name}
              value={option.value}
              index={i}
              type={this.props.type}
              handler={this.toggleRadioBtn} />
          </Grid>
        );
      } else {
        return (
          <Grid item xs={this.props.isVertical ? 7 : 5} key={i} data-aid={`radiogrp-grid-${i+1}`}>
            <RadioBtn
              isChecked={(this.state.selectedIndex === i || option.value === this.props.value)}
              text={option.name}
              value={option.value}
              index={i}
              disabledWithValue={this.props.disabledWithValue}
              type={this.props.type}
              handler={this.toggleRadioBtn} />
          </Grid>
        );
      }
    });

    return (
      <div>
        <div className="RadioWithIcon">
              {this.props.label}
          {/* <span className={(this.props.error) ? 'error' : ''}>{(this.props.error) ? 'Mandatory' : ''}</span> */}
        </div>
        <Grid container spacing={16}>
          {allOptions}
        </Grid>
        <span className='error-radiogrp'>{this.props.helperText}</span>
      </div>
    );
  }
}

const RadioWithoutIcon = (props) => { 
  let xsSize = props.id === "account_type" ? 12 : 9
  let smSize = props.id === "account_type" ? null : 7
  return (
  <Grid container spacing={16} alignItems="flex-start" direction={props.isVertical ? 'column' : 'row'}>
    <Grid item xs={xsSize} sm={smSize}>
      <RadioGrp 
        {...props} />
    </Grid>
  </Grid> 
  )};

export default RadioWithoutIcon;
