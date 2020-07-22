import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button } from 'material-ui';

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '6px',
        boxShadow: 'none',
        padding: '16px',
        fontSize: '20px',
        textTransform: 'capitalize',
        letterSpacing: '0.4px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: 'var(--primary)',
      },
      raised: {
        color: 'white',
        boxShadow: 'none',
        backgroundColor: 'var(--primary)',
      }
    },
  },
});

export class WrButton extends Component {
  render() {
    const { root, raised } = this.props.classes || {};
    return (
      <MuiThemeProvider theme={theme}>
        <Button
          variant="raised"
          fullWidth={this.props.fullWidth}
          classes={{ root, raised }}
        >
          {this.props.children}
        </Button>
      </MuiThemeProvider>
    );
  }
}