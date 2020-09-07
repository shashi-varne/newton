import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
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
      color: "var(--primary)",
    },
    width: "22px",
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

class SelectMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottom: false,
    };
  }

  toggleDrawer = (open) => () => {
    this.setState({
      bottom: open,
    });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Drawer
          anchor="bottom"
          open={this.props.open}
          onClose={this.toggleDrawer(false)}
        >
          <div className="wr-select-members">Select Member</div>
          {this.props.pans.map((member, index) => (
            <div className="wr-members" key={index} onClick={() => this.props.selectPan(member)}>
              <div className="wr-container">
                <div className="wr-head">{member}</div>
                <div className="wr-level">2nd level data</div>
              </div>
              <PrimaryRadio
                checked={this.props.selectedPan === member}
                disableRipple
                onChange={() => this.props.selectPan(member)}
              />
            </div>
          ))}
        </Drawer>
      </MuiThemeProvider>
    );
  }
}

export default SelectMembers;
