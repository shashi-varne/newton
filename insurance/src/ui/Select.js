import React, { Component } from 'react';
import Grid from 'material-ui/Grid';

import './style.css';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

class SelectGrp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: '',
      options: this.props.options
    };
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
  };

  render() {
    const { options } = this.state;

    const allOptions = options.map((option, i) => {
      return (
        <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
      );
    });

    return (
      <FormControl className="Dropdown">
        <InputLabel htmlFor={this.props.id}>{this.props.label} *</InputLabel>
        <Select
          value={this.state.selectedValue}
          onChange={(e) => this.handleChange(e)}
          inputProps={{
            name: this.props.id,
            id: this.props.id,
          }}
          autoWidth >
          {allOptions}
        </Select>
      </FormControl>
    );
  }
}

const Dropdown = (props) => (
  <Grid container spacing={16} alignItems="flex-end">
    <Grid item xs={2}></Grid>
    <Grid item xs={10}>
      <SelectGrp
        options={props.options}
        id={props.id}
        label={props.label}
        onChange={props.handleChange} />
    </Grid>
  </Grid>
);

export default Dropdown;
