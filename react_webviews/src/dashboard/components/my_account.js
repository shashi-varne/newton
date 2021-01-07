import React, { Component } from "react";
import "../Style.scss";
import { getConfig } from "utils/functions";

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
    };
  }

  componentWillMount() {}

  render() {
    return (
      <div className="my-account">
        <div className="my-account-content">
          <div className="account">
            <div className="account-head-title">Account options</div>
            <div className="account-options">
              <img src={require(`assets/address_icon.svg`)} alt="" />
              <div>Change Adress</div>
            </div>
            <div className="account-options">
              <img src={require(`assets/add_bank_icn.svg`)} alt="" />
              <div>Add Bank/Mandate</div>
            </div>
            <div className="account-options">
              <img src={require(`assets/capital_gains_icon.svg`)} alt="" />
              <div>Capital Gain Statement</div>
            </div>
            <div className="account-options">
              <img src={require(`assets/80c_icon.svg`)} alt="" />
              <div>80C Investment Proof</div>
            </div>
            <div className="account-options">
              <img src={require(`assets/export_transaction_icon.svg`)} alt="" />
              <div>Export Transaction History</div>
            </div>
            <div className="account-options">
              <img src={require(`assets/export_transaction_icon.svg`)} alt="" />
              <div>Upload Mandate</div>
            </div>
          </div>
          <div className="account">
            <div className="account-head-title">Pending</div>
            <div className="account-options">
              <img src={require(`assets/alert_icon.svg`)} alt="" />
              <div className="pending">Pending Mandate message</div>
            </div>
            <div className="account-options">
              <img src={require(`assets/alert_icon.svg`)} alt="" />
              <div className="pending">Authenticate E-Mandate for NPS</div>
            </div>
            <div className="account-options">
              <img src={require(`assets/alert_icon.svg`)} alt="" />
              <div className="pending">Upload NPS Details</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyAccount;
