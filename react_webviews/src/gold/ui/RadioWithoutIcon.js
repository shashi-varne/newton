import React, { Component } from 'react';
import Grid from 'material-ui/Grid';

import './style.css';
import Icon from './Icon';
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

  toggleRadioBtn = (index) => {
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
          <Grid item xs={5} key={i} className="RadioGrpGrid" style={{ flexBasis: 'auto' }}>
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
          <Grid item xs={5} key={i}>
            <RadioBtn
              isChecked={(this.state.selectedIndex === i || option.value === this.props.value)}
              text={option.name}
              value={option.value}
              index={i}
              type={this.props.type}
              handler={this.toggleRadioBtn} />
          </Grid>
        );
      }
    });

    return (
      <div>
        <div className="RadioWithIcon">
          <span>{this.props.label} *</span>
          {/* <span className={(this.props.error) ? 'error' : ''}>{(this.props.error) ? 'Mandatory' : ''}</span> */}
        </div>
        <Grid container spacing={16}>
          {allOptions}
        </Grid>
        <span className='error-radiogrp'>{(this.props.error) ? 'Please select an option' : ''}</span>
      </div>
    );
  }
}

const RadioWithoutIcon = (props) => (
  <Grid container spacing={16} alignItems="flex-start">
    <Grid item xs={12}>
      <RadioGrp
        {...props} />
    </Grid>
  </Grid>
);

export default RadioWithoutIcon;
