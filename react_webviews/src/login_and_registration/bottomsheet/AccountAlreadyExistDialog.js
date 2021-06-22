import React, { Component } from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "utils/functions";
import { isEmpty } from "lodash";
import "./Style.scss";
import { generateOtp } from "../function";

const product = getConfig().productName;
export class AccountAlreadyExistDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
    this.generateOtp = generateOtp.bind(this);
  }

  handleClick = async () => {
    const { type, data } = this.props;
    let body = {};
    if (data?.from === "my-account") {
      this.props.parent.navigate("/kyc/communication-details")
      return;
    };
    if (type === "email") {
      body.email = data?.email;
    } else {
      body.mobile = data?.mobile;
      body.whatsapp_consent = true;
    } // by default should this be true or false in case of bottomsheet?
    const otpResponse = await this.generateOtp(body);
    if (otpResponse) {
      this.props.parent.navigate("verify-Secoundary", {
        state: {
          mobile_number: data?.contact_value,
          forgot: false, // flag to be checked
          otp_id: otpResponse.pfwresponse.result.otp_id,
        },
      });
    }
  };

  editDetails = () => {
    this.props.parent.navigate("/verify", {
      state: {
        page: "landing",
        edit: true,
      },
    });
  };

  render() {
    const { data, isOpen, onClose, type } = this.props; console.log(type)
    return (
      <WVBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={`Account already exists!`}
        image={require(`../../assets/${product}/bottomsheet_account_exist.svg`)}
        button1Props={{
          type: "secondary",
          title: `EDIT ${type === "email" ? "EMAIL" : "NUMBER"}`,
          onClick: this.editDetails,
        }}
        button2Props={{
          type: "primary",
          title: "CONTINUE",
          showLoader: this.state.loading,
          onClick: this.handleClick,
        }}
        classes={{
          container: "account-already-exists-container",
        }}
      >
        <p className="text">
          Your {type === "email" ? "email address" : "mobile number"} is already
          registered with {isEmpty(data) && <span>some other account</span>}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {(type === "email" ? data?.mobile : data?.email) && (
            <div className="details">
              <img
                src={require(`../../assets/bottom_sheet_icon_${type}.svg`)}
                alt=""
                style={{ paddingRight: "10px" }}
              />
              <span className="text">
                {type === "email" ? data?.mobile : data?.email}
              </span>
            </div>
          )}
          {(type === "email" ? data?.mobile : data?.email) && data?.pan_number && (
            <div style={{ flexBasis: "20%" }}>
              <p className="text" style={{ textAlign: "center" }}>
                |
              </p>
            </div>
          )}
          {data?.pan_number && (
            <div className="details">
              <img
                src={require(`../../assets/bottom_sheet_icon_pan.svg`)}
                alt=""
                style={{ paddingRight: "10px" }}
              />
              <span className="text">{data?.pan_number}</span>
            </div>
          )}
        </div>
      </WVBottomSheet>
    );
  }
}

export default AccountAlreadyExistDialog;
