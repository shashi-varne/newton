import React, { Component } from "react";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiCard: {
      root: {},
    },
    MuiPaper: {
      elevation1: {
        boxShadow:
          "0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.0483186) !important",
      },
      rounded: {
        borderRadius: "6px !important",
      },
    },
    MuiCardContent: {
      root: {
        padding: "20px !important",
      },
    },
  },
});

class CardInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { root, paper, container } = this.props.classes || {};
    return (
      <MuiThemeProvider theme={theme}>
        <Card classes={{ root, paper, container }} {...this.props}>
          <CardContent>
            {this.props.children}
          </CardContent>
        </Card>
      </MuiThemeProvider>
    );
  }
}

export default CardInput;
