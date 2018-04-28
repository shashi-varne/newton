import React, { Component } from 'react';
import Grid from 'material-ui/Grid';

import './style.css';
import Icon from './Icon';

class RadioBtn extends Component {
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
          <Grid item xs={6} key={i} style={{flexBasis: 'unset', maxWidth: '100%'}}>
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
          <Grid item xs={6} key={i}>
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
        <div style={{color: '#444', fontSize: '0.8rem', marginBottom: 15, position: 'relative'}}>
          <span>{this.props.label} *</span>
          <span style={{position: 'absolute', right: 0, color: '#d0021b', fontSize: 14, fontStyle: 'italic'}} className={(this.props.error) ? 'error' : ''}>{(this.props.error) ? 'Mandatory' : ''}</span>
        </div>
        <Grid container spacing={16}>
          {allOptions}
        </Grid>
      </div>
    );
  }
}

const RadioWithIcon = (props) => (
  <Grid container spacing={16} alignItems="flex-start">
    <Grid item xs={2}>
      <Icon
        src={props.icon}
        width={props.width} />
    </Grid>
    <Grid item xs={10}>
      <RadioGrp
        {...props} />
    </Grid>
  </Grid>
);

export default RadioWithIcon;
