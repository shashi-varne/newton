import React, { Component } from "react";
import "../Style.scss";
import { getConfig } from "utils/functions";
import { initialize } from "../functions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      showLoader: false,
      mandate: {},
      pendingMandate: {},
      userkyc: {},
      isReadyToInvestBase: false, // need to change after handling kyc
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.getMyAccount();
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
      userkyc,
      currentUser,
    } = this.state;
    let bank = userkyc.bank || {};
    return (
      <div className="my-account">
        <ToastContainer autoClose={3000} />
        <div className="my-account-content">
          <div className="account">
            <div className="account-head-title">Account options</div>
            {isReadyToInvestBase && (
              <div className="account-options">
                <img src={require(`assets/address_icon.svg`)} alt="" />
                <div>Change Adress</div>
              </div>
            )}
            {(isReadyToInvestBase || bank.doc_status === "rejected") && (
              <div className="account-options">
                <img src={require(`assets/add_bank_icn.svg`)} alt="" />
                <div>Add Bank/Mandate</div>
              </div>
            )}
            {isReadyToInvestBase &&
              currentUser.active_investment &&
              Capitalgain && (
                <div className="account-options">
                  <img src={require(`assets/capital_gains_icon.svg`)} alt="" />
                  <div>Capital Gain Statement</div>
                </div>
              )}
            {isReadyToInvestBase &&
              currentUser.active_investment &&
              investment80C && (
                <div className="account-options">
                  <img src={require(`assets/80c_icon.svg`)} alt="" />
                  <div>80C Investment Proof</div>
                </div>
              )}
            {isReadyToInvestBase && currentUser.active_investment && (
              <div className="account-options">
                <img
                  src={require(`assets/export_transaction_icon.svg`)}
                  alt=""
                />
                <div>Export Transaction History</div>
              </div>
            )}
            <div className="account-options">
              <img src={require(`assets/export_transaction_icon.svg`)} alt="" />
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
                <div className="account-options">
                  <img src={require(`assets/alert_icon.svg`)} alt="" />
                  <div className="pending">{pendingMandate.message}</div>
                </div>
              )}
              {mandateRequired && (
                <div className="account-options">
                  <img src={require(`assets/alert_icon.svg`)} alt="" />
                  <div className="pending">Authenticate E-Mandate for NPS</div>
                </div>
              )}
              {npsUpload && (
                <div className="account-options">
                  <img src={require(`assets/alert_icon.svg`)} alt="" />
                  <div className="pending">Upload NPS Details</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MyAccount;
