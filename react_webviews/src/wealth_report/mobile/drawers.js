import React, { Component } from "react";
import Container from "./container";
import "./Style.scss";
import Button from "material-ui/Button";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import TextField from "./Input";

import Drawer from "@material-ui/core/Drawer";
import Radio from "@material-ui/core/Radio";

const theme = createMuiTheme({
  overrides: {
    MuiDrawer: {
      paper: {
        padding: "24px 24px 24px 24px",
        borderRadius: "6px 6px 0 0",
      },
    },
  },
});

const PrimaryRadio = withStyles({
  root: {
    color: "#d1d1d1",
    "&$checked": {
      color: "#502da8",
    },
    width: "22px",
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

class Drawers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottom: false,
      members: ['BZRWR54332M', 'BZRWR54332M'],
    };
  }

  toggleDrawer = (open) => () => {
    this.setState({
      bottom: open,
    });
  };

  renderdialog = () => (
    <MuiThemeProvider theme={theme}>
      <Drawer
        anchor="bottom"
        open={this.state.bottom}
        onClose={this.toggleDrawer(false)}
      >
        <div className="wr-select-members">Select Member</div>
        {this.state.members.map((member) => (
          <div className="wr-members">
            <div className="wr-container">
              <div className="wr-head">BZRWR54332M</div>
              <div className="wr-level">2nd level data</div>
            </div>
            <PrimaryRadio checked={true} disableRipple />
          </div>
        ))}
      </Drawer>
    </MuiThemeProvider>
  );

  renderdialog2 = () => (
    <MuiThemeProvider theme={theme}>
      <Drawer
        anchor="bottom"
        open={this.state.bottom}
        onClose={this.toggleDrawer(false)}
      >
        <div className="wr-new-email">
          <img src={require(`assets/fisdom/ic-mob-add-mail.svg`)} alt="" />
          <div>Add new email</div>
        </div>
        <div className="wr-mail-content">
          Add the email address and get insights on your portfolio from fisdom
        </div>
        <TextField />
        <div className="btn">
          <Button
            variant="outlined"
            className="wr-outlined-btn"
            color="primary"
          >
            Cancel
          </Button>

          <Button
            style={{
              background: "#421f88",
              color: "#fff",
              width: "60%",
              height: "40px",
              borderRadius: "6px",
            }}
          >
            Add email
          </Button>
        </div>
      </Drawer>
    </MuiThemeProvider>
  );

  render() {
    return (
      <Container openPopup={false}>
        <Button onClick={this.toggleDrawer(true)}>sopen drawer</Button>
        {this.renderdialog()}
      </Container>
    );
  }
}

export default Drawers;
