import React, { Component } from 'react';
import Grid from 'material-ui/Grid';

import './style.css';

class RadioBtn extends Component {
  handleClick(){
    this.props.handler(this.props.index);
  }

  render() {
    return (
      <div className="radio-btn-group" onClick={() => this.handleClick()}>
        <div className={this.props.isChecked ? "RadioButton checked" : "RadioButton unchecked"} data-value={this.props.value}>
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
      selectedIndex: (this.props.value === 'Y') ? 0 : 1,
      selectedValue: this.props.value,
      options: this.props.options
    };
  }

  toggleRadioBtn = (index) => {
    this.props.onChange(index);
    this.setState({
      selectedIndex: index,
      selectedValue: this.state.options[index]['value'],
      options: this.state.options
    });
  }

  render() {
    const { options } = this.state;

    const allOptions = options.map((option, i) => {
      return (
        <Grid item xs={6} key={i} style={{flexBasis: 'unset'}}>
          <RadioBtn type={this.props.type} isChecked={(this.state.selectedIndex === i)} text={option.name} value={option.value} index={i} handler={this.toggleRadioBtn} />
        </Grid>
      );
    });

    return (
      <Grid container spacing={24} alignItems="center" justify="flex-end">
        {allOptions}
      </Grid>
    );
  }
}

const RadioWithoutIcon = (props) => (
  <Grid container spacing={16} alignItems="center" className={props.class}>
    <Grid item xs={6}>
      <span style={{color: '#444', fontSize: 14,fontFamily: 'Roboto', fontWeight: 500}}>{props.label}</span>
    </Grid>
    <Grid item xs={6}>
      <RadioGrp options={props.options} type={props.type} value={props.value} onChange={props.onChange} />
    </Grid>
  </Grid>
);

export default RadioWithoutIcon;
