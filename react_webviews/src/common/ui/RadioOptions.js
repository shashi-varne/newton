import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { getConfig } from 'utils/functions';

// import CircleCheckedFilled from 'assets/check_green_pg.svg';
// import CircleUnchecked from 'assets/not_done_yet_step.svg';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class RadioButtonsGroup extends Component {
  state = {
    value: 'female',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
      selectedValue: null,
      options: this.props.options
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { options } = this.props;
    console.log(options);
    const allOptions = options.map((option, i) => {
      return (
        <FormControlLabel disabled={this.props.disabled}
          key={i} index={i} value={option.value}
          onChange={this.props.onChange}
          control={<Radio
            icon={<CircleUnchecked />}
            checkedIcon={<CircleCheckedFilled style={{ color: getConfig().secondary }} />}
          />} label={option.name} />
      );
    });

    return (
      <FormControl component="fieldset" className={styles.formControl}>
        <FormLabel component="legend">{this.props.label}</FormLabel>
        <RadioGroup
          aria-label={this.props.label}
          name="gender1"
          className={styles.group}
          value={this.props.value.toString()}
          onChange={this.props.onChange}
        >
          {allOptions}
        </RadioGroup>
        <p style={{ color: 'red', marginTop: '-10px' }}>{this.props.helperText}</p>
        {/* <FormHelperText>{this.props.helperText}</FormHelperText> */}
      </FormControl>
    );

  }
}

const RadioOptions = (props) => (
  <RadioButtonsGroup label={props.label} disabled={props.disabled}
    options={props.options} type={props.type} value={props.value}
    onChange={props.onChange} helperText={props.helperText} />
);

export default RadioOptions;