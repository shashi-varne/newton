import React, { Component } from "react";
import Button from "material-ui/Button";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import TextField from "material-ui/TextField";
import Drawer from "@material-ui/core/Drawer";
import Dialog from "common/ui/Dialog";

import WrButton from "../common/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

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

class EmailListMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: ["Abishmathew21@yahoo.co.in", "Abishmathew21@yahoo.co.in"],
      bottom : false,
      open: true,
      emailAdded: false
    };
  }

  toggleDrawer = (open) => () => {
    this.setState({
      bottom: open,
      open: false
    });
  };

  renderEmailList = () => (
    <div className="wr-accounts">
      <WrButton
        fullWidth={true}
        classes={{ root: "wr-add-email-btn" }}
        onClick={this.toggleDrawer(true)}
      >
        <AddCircleOutlineIcon
          style={{ fontSize: "18px", marginRight: "10px" }}
        />
        Add new Email
      </WrButton>
      <div style={{ margin: "28px 10px 0 10px" }}>
        <div className="wr-all-mails">All emails</div>
        {this.state.accounts.map((account, index) => (
          <div className="wr-mails" key={index}>
            <div>
              <div className="wr-account">Abishmathew21@yahoo.co.in</div>
              <div className="wr-sync">Synced on Jun 23, 09:45am</div>
            </div>
            <img src={require(`assets/fisdom/ic-email-sync.svg`)} alt="" />
          </div>
        ))}
      </div>
    </div>
  );

  renderAddEmail = () => (
    <MuiThemeProvider theme={theme}>
      <Drawer
        anchor="bottom"
        open={this.state.bottom}
        onClose={this.props.close}
      >
        <div className="wr-new-email">
          <img src={require(`assets/fisdom/ic-mob-add-mail.svg`)} alt="" />
          <div>Add new email</div>
        </div>
        <div className="wr-mail-content">
          Add the email address and get insights on your portfolio from fisdom
        </div>
        <TextField
          variant="outlined"
          placeholder="Enter new email..."
          InputProps={{
            disableUnderline: true,
            className: "wr-input-addmail",
          }}
        />

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            className="wr-cancel-btn"
            color="primary"
            style={{
              backgroundColor: "#fff",
              border: "solid 2px #421f88",
              height: "47px",
              width: "35%",
              borderRadius: "6px",
            }}
          >
            Cancel
          </Button>

          <Button
            style={{
              background: "#421f88",
              color: "#fff",
              width: "60%",
              height: "47px",
              borderRadius: "6px",
            }}
          >
            Add email
          </Button>
        </div>
      </Drawer>
    </MuiThemeProvider>
  );

  renderEmailAdded = () => (
    <div className="wr-email-added">
      <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="" />
      <div className="wr-content">Email has been added successfully!</div>
      <div className="wr-continue">Continue</div>
    </div>
  )

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open && this.state.open}
          onClose={this.props.onClose}
        >{this.renderEmailList()}</Dialog>

        {this.state.bottom && this.renderAddEmail()}

        {this.state.emailAdded && (
          <Dialog
            open={this.props.open && this.state.open}
            onClose={this.props.onClose}
          >{this.renderEmailAdded()}</Dialog>
        )}
      </React.Fragment>
    );
  }
}

export default EmailListMobile;
