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
          <label>{this.props.text}</label>
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
        <Grid item xs={6} key={i}>
          <RadioBtn isChecked={(this.state.selectedIndex == i)} text={option} value={option} index={i} handler={this.toggleRadioBtn.bind(this)} />
        </Grid>
      );
    });

    return (
      <div>
        <div style={{color: '#444', fontSize: '0.9rem', marginBottom: 15}}>{this.props.label} *</div>
        <Grid container spacing={24}>
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
      <RadioGrp label={props.label} options={props.options}/>
    </Grid>
  </Grid>
);

export default RadioWithIcon;
