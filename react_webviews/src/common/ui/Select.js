import React, { Component } from "react";
import Grid from "material-ui/Grid";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";

import "./style.scss";
import Icon from "./Icon";

class SelectGrp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.value,
      options: this.props.options,
    };
  }

  componentDidUpdate(prevState) {
    if (prevState.value !== this.props.value) {
      this.setState({ selectedValue: this.props.value });
    }
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
    this.props.onChange(event.target.value);
  };

  render() {
    const { options } = this.state;

    const allOptions = options.map((option, i) => {
      return (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      );
    });

    return (
      <FormControl className="Dropdown" disabled={this.props.disabled}>
        <InputLabel htmlFor={this.props.id}>{this.props.label} *</InputLabel>
        <Select
          error={this.props.error}
          className="Select"
          value={this.state.selectedValue}
          onChange={(e) => this.handleChange(e)}
          inputProps={{
            name: this.props.id,
            id: this.props.id,
          }}
          autoWidth={true}
        >
          {allOptions}
        </Select>
        {this.props.error ? (
          <span className="error-radiogrp">
            {this.props.helperText || "Please select an option"}
          </span>
        ) : (
          this.props.helperText && (
            <span className="error-radiogrp">
              {this.props.helperText || ""}
            </span>
          )
        )}
      </FormControl>
    );
  }
}

const Dropdown = (props) => (
  <Grid container spacing={16} alignItems="flex-end">
    <Grid item xs={2}>
      {props.icon && <Icon src={props.icon} width={props.width} />}
    </Grid>
    <Grid item xs={10}>
      <SelectGrp {...props} />
    </Grid>
  </Grid>
);

export default Dropdown;
