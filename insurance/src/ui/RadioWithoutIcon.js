import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import './style.css';
import Icon from './Icon';

class RadioBtn extends Component {
  constructor(props) {
    super(props);
  }

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
      selectedIndex: null,
      selectedValue: null,
      options: this.props.options
    };
  }

  toggleRadioBtn(index){
    this.setState({
      selectedIndex: index,
      selectedValue: this.state.options[index],
      options: this.state.options
    });
  }

  render() {
    const { options } = this.state;

    const allOptions = options.map((option, i) => {
      return (
        <Grid item xs={6} key={i} style={{flexBasis: 'unset'}}>
          <RadioBtn type={this.props.type} isChecked={(this.state.selectedIndex == i)} text={option} value={option} index={i} handler={this.toggleRadioBtn.bind(this)} />
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
      <span style={{color: '#444', fontSize: 18,fontFamily: 'Roboto', fontWeight: 500}}>{props.label}</span>
    </Grid>
    <Grid item xs={6}>
      <RadioGrp options={props.options} type={props.type}/>
    </Grid>
  </Grid>
);

export default RadioWithoutIcon;
