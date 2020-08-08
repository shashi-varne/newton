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
      color: "#502da8",
    },
    width: "22px",
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const members = [
  {
    pan: "BZRWR54332M",
    level: "2nd level data",
  },
  {
    pan: "BZRWR54332J",
    level: "2nd level data",
  },
];

class SelectMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottom: false,
      selectedMember: "BZRWR54332M",
    };
  }

  toggleDrawer = (open) => () => {
    this.setState({
      bottom: open,
      open: false,
    });
  };

  handleChange = (pan) => {
    this.setState({
      selectedMember: pan,
    });
  };

  render() {
    const {selectedMember} = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Drawer
          anchor="bottom"
          open={this.props.bottom}
          onClose={this.toggleDrawer(false)}
        >
          <div className="wr-select-members">Select Member</div>
          {members.map((member, index) => (
            <div className="wr-members" key={index}>
              <div className="wr-container">
                <div className="wr-head">{member.pan}</div>
                <div className="wr-level">{member.level}</div>
              </div>
              <PrimaryRadio
                checked={selectedMember === member.pan}
                disableRipple
                onChange={() => this.handleChange(member.pan)}
              />
            </div>
          ))}
        </Drawer>
      </MuiThemeProvider>
    );
  }
}

export default SelectMembers;
