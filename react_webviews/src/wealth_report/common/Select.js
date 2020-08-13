import React, { Component } from 'react';
import { FormControl, Select, createMuiTheme, MuiThemeProvider, MenuItem } from 'material-ui';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const theme = createMuiTheme({
  overrides: {
    MuiSelect: {
      root: {
        backgroundColor: 'rgba(80, 45, 168, 0.1)',
        padding: '12px',
        minWidth: '110px',
        borderRadius: '4px',
      },
      select: {
        fontSize: '15px',
        fontWeight: '600',
        lineHeight: '1.2',
        letterSpacing: '0.76px',
        color: 'var(--primary)',
        textTransform: 'uppercase',
      },
      icon: {
        right: '12px',
        color: '#502da8',
        top: 'calc(50% - 16px)',
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: '28px',
      },
    },
    
    // MuiInput: {
    //   underline: {
    //     height: 0,
    //   }
    // }
  }
});

export default class WrSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: 10,
    };
  }

  render() {
    const classes = {};
    return (
      <MuiThemeProvider theme={theme}>
        <FormControl className={classes.formControl}>
          <Select
            value={this.state.age}
            onChange={() => this.setState({ age: 10 })}
            name="age"
            displayEmpty
            className={this.props.className}
            IconComponent={ExpandMoreIcon}
            style={this.props.style}
            classes={this.props.classes}
            disableUnderline= {true}
          >
            <MenuItem value="" disabled>
              {this.props.placeholder}
            </MenuItem>
            <MenuItem value={10}>FY 2019 - 20</MenuItem>
            <MenuItem value={20}>FY 2018 - 19</MenuItem>
            <MenuItem value={30}>FY 2017 - 18</MenuItem>
          </Select>
        </FormControl>
      </MuiThemeProvider>
    );
  }
}