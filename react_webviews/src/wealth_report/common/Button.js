import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button, withTheme } from 'material-ui';

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '6px',
        padding: '12px 19px',
      },
      raised: {
        boxShadow: 'none',
        backgroundColor: 'var(--primary)',
        '&$hover': {
          backgroundColor: 'green',
        },
      },
      label: {
        color: 'white',
        fontSize: '17px',
        letterSpacing: 'normal',
        textTransform: 'none',
        fontWeight: 'normal',
      }
    },
  },
});

export default class WrButton extends Component {
  render() {
    const { root, raised, label, contained, outlined } = this.props.classes || {};
    return (
      <MuiThemeProvider theme={theme}>
        <Button
          variant={this.props.variant || 'raised'}
          fullWidth={this.props.fullWidth}
          classes={{ root, raised, label, contained, outlined }}
          {...this.props}
        >
          {this.props.children}
        </Button>
      </MuiThemeProvider>
    );
  }
}