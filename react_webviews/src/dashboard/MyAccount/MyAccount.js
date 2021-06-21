import React, { Component } from "react";
import { getConfig } from "utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { initializeComponentFunctions } from "./MyAccountFunctions";
import Container from "../common/Container";
import Button from "material-ui/Button";
import UserDetails from "./UserDetails";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import "./MyAccount.scss";

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      showLoader: false,
      mandate: {},
      pendingMandate: {},
      userKyc: {},
      openDialog: false,
    };
    this.initializeComponentFunctions = initializeComponentFunctions.bind(this);
  }

  componentDidMount() {
    this.initializeComponentFunctions();
  }

  onload = () => {
    this.getMyAccount();
  };

  handleClick = (route) => {
    this.navigate(route);
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
        className="my-account-dialog"
      >
        <DialogContent className="content">
          <DialogContentText className="subtitle">
            {this.state.subtitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="action">
          {this.state.twoButton && (
            <Button
              className="cancel"
              onClick={() => this.handleClick2()}
              color="secondary"
              autoFocus
            >
              {this.state.buttonTitle2}
            </Button>
          )}
          <Button
            className="confirm"
            onClick={() => this.handleClick1(this.state.twoButton)}
            color="secondary"
            autoFocus
          >
            {this.state.buttonTitle1}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  confirmTransactions = () => {
    this.setState({
      openDialog: true,
      buttonTitle1: "OK",
      buttonTitle2: "CANCEL",
      subtitle: "You will receive an email with transaction list",
      twoButton: true,
    });
  };

  handleClick1 = (result) => {
    this.sendEvents("ok", "export transaction history");
    if (result) {
      this.exportTransactions();
    } else {
      this.handleClick2();
    }
  };

  handleClick2 = () => {
    this.sendEvents("cancel", "export transaction history");
    this.setState({
      openDialog: false,
    });
  };

  sendEvents = (userAction, screenName) => {
    let eventObj = {
      event_name: "my_account",
      properties: {
        account_options:
          (userAction === "just_set_events" ? "back" : userAction) || "",
        screen_name: screenName || "my_account",
      },
    };
    if (screenName === "export transaction history") {
      delete eventObj.properties.account_options;
      eventObj.properties.user_action = userAction;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  render() {
    let {
      pendingMandate,
      mandate,
      mandateRequired,
      npsUpload,
      investment80C,
      Capitalgain,
      isReadyToInvestBase,
      userKyc,
      currentUser,
      contacts,
    } = this.state;
    let bank = userKyc.bank || {};
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        noFooter={true}
        skelton={this.state.showLoader}
        title="My Account"
      >
        <div className="my-account">
          <div className="my-account-content">
            <UserDetails
              pan_no={userKyc?.pan?.meta_data?.pan_number}
              contacts={contacts}
              name={currentUser?.name}
            />
            <div className="account">
              <div className="account-head-title">Account options</div>
              {isReadyToInvestBase && (
                <div
                  className="account-options"
                  onClick={() => {
                    this.sendEvents("change address");
                    this.handleClick("/kyc/change-address-details1");
                  }}
                >
                  <img src={require(`assets/address_icon.svg`)} alt="" />
                  <div>Change Address</div>
                </div>
              )}
              {(isReadyToInvestBase || bank.doc_status === "rejected") && (
                <div
                  className="account-options"
                  onClick={() => {
                    this.sendEvents("add bank/mandate");
                    this.handleClick("/kyc/add-bank");
                  }}
                >
                  <img src={require(`assets/add_bank_icn.svg`)} alt="" />
                  <div>Add Bank/Mandate</div>
                </div>
              )}
              {isReadyToInvestBase &&
                currentUser.active_investment &&
                Capitalgain && (
                  <div
                    className="account-options"
                    onClick={() => {
                      this.sendEvents("capital gain statement");
                      this.handleClick("/capital-gain");
                    }}
                  >
                    <img
                      src={require(`assets/capital_gains_icon.svg`)}
                      alt=""
                    />
                    <div>Capital Gain Statement</div>
                  </div>
                )}
              {isReadyToInvestBase &&
                currentUser.active_investment &&
                investment80C && (
                  <div
                    className="account-options"
                    onClick={() => {
                      this.sendEvents("elss statement");
                      this.handleClick("/investment-proof");
                    }}
                  >
                    <img src={require(`assets/80c_icon.svg`)} alt="" />
                    <div>80C Investment Proof</div>
                  </div>
                )}
              {isReadyToInvestBase && currentUser.active_investment && (
                <div
                  className="account-options"
                  onClick={() => this.confirmTransactions()}
                >
                  <img
                    src={require(`assets/export_transaction_icon.svg`)}
                    alt=""
                  />
                  <div>Export Transaction History</div>
                </div>
              )}
              <div
                className="account-options"
                onClick={() => {
                  this.sendEvents("upload mandate");
                  this.handleClick("/blank-mandate/upload");
                }}
              >
                <img
                  src={require(`assets/export_transaction_icon.svg`)}
                  alt=""
                />
                <div>Upload Mandate</div>
              </div>
            </div>
            {(mandate.prompt ||
              pendingMandate.show_status ||
              mandateRequired ||
              npsUpload) && (
              <div className="account">
                <div className="account-head-title">Pending</div>
                {pendingMandate.show_status && (
                  <div
                    className="account-options"
                    onClick={() => this.handleClick(pendingMandate.state)}
                  >
                    <img src={require(`assets/alert_icon.svg`)} alt="" />
                    <div className="pending">{pendingMandate.message}</div>
                  </div>
                )}
                {mandateRequired && (
                  <div
                    className="account-options"
                    onClick={() => this.authenticate()}
                  >
                    <img src={require(`assets/alert_icon.svg`)} alt="" />
                    <div className="pending">
                      Authenticate E-Mandate for NPS
                    </div>
                  </div>
                )}
                {npsUpload && (
                  <div
                    className="account-options"
                    onClick={() => this.handleClick("/nps/identity")}
                  >
                    <img src={require(`assets/alert_icon.svg`)} alt="" />
                    <div className="pending">Upload NPS Details</div>
                  </div>
                )}
              </div>
            )}
            {this.renderDialog()}
          </div>
        </div>
      </Container>
    );
  }
}

export default MyAccount;
