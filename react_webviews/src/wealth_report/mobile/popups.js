import React, { Component } from "react";
import Container from "./container";
import "./Style.scss";
import Button from "material-ui/Button";

class Popups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: ['Abishmathew21@yahoo.co.in', 'Abishmathew21@yahoo.co.in'],
      openPopup: false,
    };
  }

  render() {
    const dialog = (
      <div className="wr-accounts">
        <Button fullWidth={true} className="wr-button">
          <img
            src={require(`assets/fisdom/ic-mob-add-email.svg`)}
            alt=""
            style={{ marginRight: "9px" }}
          />
          Add new email
        </Button>
        <div style={{ margin: "28px 10px 0 10px" }}>
          <div className="wr-all-mails">All emails</div>
          {this.state.accounts.map((account) => (
            <div className="wr-mails">
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

    const dialog2 = (
      <div className="wr-email-added">
        <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="" />
        <div className="wr-content">Email has been added successfully!</div>
        <div className="wr-continue">Continue</div>
      </div>
    );

    const dialog3 = (
      <React.Fragment>
        <div className="wr-welcome">
          <img src={require(`assets/fisdom/ic-profile-avatar.svg`)} alt="" />
          <img src={require(`assets/fisdom/ic-mob-add-pic.svg`)} alt="" style={{marginLeft:'-27px'}} />
          <div className="wr-head">Welcome</div>
          <div className="wr-number">+91 92374 82739</div>
        </div>

        <Button
          fullWidth={true}
          style={{
            background: "#f3cece",
            height: "47px",
            color: "#e02020",
            marginTop: "15px",
          }}
          className="wr-logout"
        >
          <img src={require(`assets/fisdom/ic-mob-logout.svg`)} alt="" />
          Logout
        </Button>
      </React.Fragment>
    );

    const dialog4 = (
      <div className="wr-estd-tax">
        <div className="head">Estimated Tax</div>
        <div className="content">
          Disclaimer: Calculation is solely based on the statement provided by
          you.
        </div>
      </div>
    );

    return (
      <Container
        dialogContent={dialog3}
        openPopup={true}
      >
        <Button onClick={this.handlePopup}>Logout</Button>
      </Container>
    );
  }
}

export default Popups;
