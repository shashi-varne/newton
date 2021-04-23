import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import './style.scss';

class SelectGrp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.value,
      options: this.props.options
    };
  }

  componentDidUpdate(prevState) {
    if (prevState.value !== this.props.value) {
      this.setState({ selectedValue: this.props.value })
    }

    if (prevState.options !== this.props.options) {
      this.setState({ options: this.props.options })
    }
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
    console.log("evenet os", event);
    this.props.onChange(event.target.value);
  };

  render() {
    let dataType = this.props.dataType || '';

    const allOptions = this.state.options.map((option, i) => {
      return (
        <MenuItem key={i} value={dataType === 'AOB' || this.props.isAOB ? option.value : option}>
          {dataType === 'AOB' || this.props.isAOB ? option.name : option}
        </MenuItem>
      );
    });

    return (
      <FormControl className="Dropdown" disabled={this.props.disabled}>
        <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
        <Select
          error={this.props.error}
          className="Select"
          value={this.state.selectedValue}
          onChange={(e) => this.handleChange(e)}
          inputProps={{
            name: this.props.id,
            id: this.props.id,
          }}
          autoWidth={true} >
          {allOptions}
        </Select>
        {(this.props.error) ?
          <span className='error-radiogrp'>
            {this.props.helperText || 'Please select an option'}
          </span> :
          <span className='error-radiogrp'>
            {this.props.helperText || ''}
          </span>
        }
      </FormControl>
    );
  }
}

const DropdownWithoutIcon = (props) => (
  <Grid container spacing={16} alignItems="flex-end">
    <Grid item xs={12}>
      <SelectGrp
        {...props} />
    </Grid>
  </Grid>
);

export default DropdownWithoutIcon;
