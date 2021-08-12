import React, { Component } from "react";
import { getConfig } from "utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { initializeComponentFunctions } from "./MyAccountFunctions";
import Container from "../common/Container";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import { isTradingEnabled } from "../../utils/functions";
import { getKycAppStatus } from "../../kyc/services";
import "./MyAccount.scss";

const MF_AND_STOCKS_STATUS_MAPPER = {
  init: {
    subtitle: "KYC not started",
    disable: true,
  },
  inprogress: {
    subtitle: "KYC In-progress",
    icon: "badge-warning.svg",
  },
  complete: {
    subtitle: "Ready to invest",
    icon: "badge-success.svg",
  },
  rejected: {
    subtitle: "KYC rejected",
    icon: "badge-error.svg",
  }
}
const FNO_STATUS_MAPPER = {
  init: {
    subtitle: "Not activated",
    disable: true,
  },
  activate: {
    subtitle: "Not activated",
    buttonText: "ACTIVATE NOW",
    disable: true,
  },
  inprogress: {
    subtitle: "Not activated",
    icon: "badge-warning.svg",
  },
  complete: {
    subtitle: "Activated",
    icon: "badge-success.svg",
  },
  rejected: {
    subtitle: "Document rejected",
    icon: "badge-error.svg",
  }
}
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
      kycStatusData: [],
    };
    this.initializeComponentFunctions = initializeComponentFunctions.bind(this);
  }

  componentDidMount() {
    this.initializeComponentFunctions();
  }

  onload = () => {
    this.getMyAccount();
    this.setKycStatusData();
  };

  setKycStatusData = () => {
    const tradingEnabled = isTradingEnabled();
    let { userKyc, kycStatusData } = this.state;
    const kycJourneyStatus = getKycAppStatus(userKyc) || {};
    const kycStatus = kycJourneyStatus.status;
    let mfStatus = "inprogress";
    let stocksStatus = "inprogress";
    let fnoStatus = "init";
    if (kycStatus === "ground") {
      mfStatus = "init";
      stocksStatus = "init";
    } else if (kycStatus === "rejected") {
      stocksStatus = "rejected";
      if(userKyc.application_status_v2 !== "complete") {
        mfStatus = "rejected";
      }
    }

    if (userKyc.application_status_v2 === "complete") {
      mfStatus = "complete";
    }

    kycStatusData.push({ ...MF_AND_STOCKS_STATUS_MAPPER[mfStatus], status: mfStatus, key: "mf", title: "Mutual fund" });

    if (tradingEnabled) {
      if (userKyc.equity_investment_ready) {
        stocksStatus = "complete";
      }
      if (userKyc.fno_active) {
        fnoStatus = "complete";
      } else if (userKyc.equity_income?.doc_status === "rejected") {
        fnoStatus = "rejected";
      } else if (
        userKyc.equity_income?.doc_status === "init" &&
        ["submitted", "complete"].includes(userKyc.equity_application_status)
      ) {
        fnoStatus = "activate";
      } else if (userKyc.equity_income?.doc_status === "submitted") {
        fnoStatus = "inprogress";
      }
      kycStatusData.push({ ...MF_AND_STOCKS_STATUS_MAPPER[stocksStatus], status: stocksStatus, key: "stocks", title: "Stocks & IPO" });
      kycStatusData.push({ ...FNO_STATUS_MAPPER[fnoStatus], status: fnoStatus, key: "fno", title: "Futures & Options" });
    }
    this.setState({ kycStatusData });
  }

  handleInvestmentCard = (data) => () => {
    if(data.key === "fno" && data.status === "activate") {
      this.navigate("/kyc/upload/fno-income-proof", {
        state: { goBack: "/my-account" },
      });
    }
  }

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
      kycStatusData
    } = this.state;
    let bank = userKyc.bank || {};
    return (
      <Container
        data-aid='my-account-screen'
        events={this.sendEvents("just_set_events")}
        noFooter={true}
        skelton={this.state.showLoader}
        title="My Account"
      >
        <div className="my-account" data-aid='my-account'>
          <div className="my-account-content">
            <div className="account">
              <div
                className="account-head-title ma-kir-title"
                data-aid="account-head-title"
              >
                INVESTMENT READY
              </div>
              {kycStatusData.map((data, index) => {
                return (
                  <InvestmentCard
                    {...data}
                    key={index}
                    onClick={this.handleInvestmentCard(data)}
                  />
                );
              })}
            </div>
          </div>
          <div className="my-account-content">
            <div className="account">
              <div className="account-head-title" data-aid='account-head-title'>Account options</div>
              {isReadyToInvestBase && (
                <div
                  data-aid='change-address'
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
                  data-aid='add-bank-mandate'
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
                    data-aid='capital-gain-statement'
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
                    data-aid='investment-proof'
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

const InvestmentCard = ({ title, subtitle, icon, disable, buttonText, onClick }) => {
  return (
    <div className="my-account-investment-card">
      <div className="maic-content">
        <div className={`maic-title ${disable && "maic-title-disable"}`}>{title}</div>
        <div className="maic-subtitle">{subtitle}</div>
      </div>
      <div className="maic-content">
        {icon && !disable && <img src={require(`assets/${icon}`)} alt="icon" />}
        {buttonText && (
          <WVClickableTextElement onClick={onClick}>{buttonText}</WVClickableTextElement>
        )}
      </div>
    </div>
  );
};
