import React, { Component } from "react";
import { getConfig } from "utils/functions";
import { initializeComponentFunctions } from "./MyAccountFunctions";
import Container from "../common/Container";
import Button from "material-ui/Button";
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
        data-aid='my-account-dialog'
      >
        <DialogContent className="content" data-aid='dialog-content'>
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
              data-aid='cancel-btn'
            >
              {this.state.buttonTitle2}
            </Button>
          )}
          <Button
            className="confirm"
            onClick={() => this.handleClick1(this.state.twoButton)}
            color="secondary"
            autoFocus
            data-aid='confirm-btn'
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
    if (result) {
      this.exportTransactions();
    } else {
      this.handleClick2();
    }
  };

  handleClick2 = () => {
    this.setState({
      openDialog: false,
    });
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
    } = this.state;
    let bank = userKyc.bank || {};
    return (
      <Container
        data-aid='my-account-screen'
        noFooter={true}
        skelton={this.state.showLoader}
        title="My Account"
      >
        <div className="my-account" data-aid='my-account'>
          <div className="my-account-content">
            <div className="account">
              <div className="account-head-title" data-aid='account-head-title'>Account options</div>
              {isReadyToInvestBase && (
                <div
                  data-aid='change-address'
                  className="account-options"
                  onClick={() =>
                    this.handleClick("/kyc/change-address-details1")
                  }
                >
                  <img src={require(`assets/address_icon.svg`)} alt="" />
                  <div>Change Address</div>
                </div>
              )}
              {(isReadyToInvestBase || bank.doc_status === "rejected") && (
                <div
                  data-aid='add-bank-mandate'
                  className="account-options"
                  onClick={() => this.handleClick("/kyc/add-bank")}
                >
                  <img src={require(`assets/add_bank_icn.svg`)} alt="" />
                  <div>Add Bank/Mandate</div>
                </div>
              )}
              {isReadyToInvestBase &&
                currentUser.active_investment &&
                Capitalgain && (
                  <div
                    data-aid='capital-gain-statement'
                    className="account-options"
                    onClick={() => this.handleClick("/capital-gain")}
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
                    data-aid='investment-proof'
                    className="account-options"
                    onClick={() => this.handleClick("/investment-proof")}
                  >
                    <img src={require(`assets/80c_icon.svg`)} alt="" />
                    <div>80C Investment Proof</div>
                  </div>
                )}
              {isReadyToInvestBase && currentUser.active_investment && (
                <div
                  data-aid='export-transaction-history'
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
                data-aid='upload-mandate'
                className="account-options"
                onClick={() => this.handleClick("/blank-mandate/upload")}
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
              <div className="account" data-aid='account'>
                <div className="account-head-title" data-aid='account-head-title'>Pending</div>
                {pendingMandate.show_status && (
                  <div
                    data-aid='pending-mandate'
                    className="account-options"
                    onClick={() => this.handleClick(pendingMandate.state)}
                  >
                    <img src={require(`assets/alert_icon.svg`)} alt="" />
                    <div className="pending">{pendingMandate.message}</div>
                  </div>
                )}
                {mandateRequired && (
                  <div
                    data-aid='mandate-required'
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
                    data-aid='nps-upload'
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
