import React, { Component } from "react";
import { getConfig } from "utils/functions";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import { isEmpty } from "lodash";
import { authCheckApi, generateOtp } from "../function";
import "./Style.scss";

const product = getConfig().productName;
class VerifyDetailDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
    this.authCheckApi = authCheckApi.bind(this);
    this.generateOtp = generateOtp.bind(this);
  }

  handleClick = async () => {
    const { data, type } = this.props;
    if (isEmpty(data)) {
      this.props.parent.navigate("/secondary-verification", {
        state: {
          communicationType: type
        }
      });
    } else {
      const result = await this.authCheckApi(type, data);
      if (result.is_user === false) {
        let body = {};
        if (type === "email") {
          body.email = data.contact_value;
        } else {
          body.mobile = data.contact_value;
          body.whatsapp_consent = true;  // by default should this be true or false in case of bottomsheet?
        }
        const otpResponse = await this.generateOtp(body);
        if (otpResponse) {
          this.props.parent.navigate("secondary-otp-verification", {
            state: {
              mobile_number: data.contact_value,
              otp_id: otpResponse.otp_id,
            },
          });
        }
      } else if (result.is_user === true) {
        this.props.showAccountAlreadyExist(true, result.user);
      }
    }
  };

  editDetails = () => {
    this.props.parent.navigate("/secondary-verification", {
      state: {
        communicationType: this.props?.type,
        contactValue: this.props?.data?.contact_value,
      },
    });
  };

  render() {
    const { isOpen, onClose, type, data } = this.props;
    return (
      <WVBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={`Verify your ${type} address`}
        image={require(`../../assets/${product}/bottomsheet_verify_${type}.svg`)}
        subtitle={`${
          type === "email" ? "Email" : "Mobile"
        } verification is mandatory for investment as per SEBI`}
        button1Props={{
          type: "primary",
          title: "CONTINUE",
          onClick: this.handleClick,
          showLoader: this.state.loading,
        }}
        classes={{
          container: "verify-details-container",
        }}
      >
        {!isEmpty(data) && (
          <div className="details">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={require(`../../assets/bottom_sheet_icon_${type}.svg`)}
                alt=""
              />
              <span className="text">{data?.contact_value}</span>
            </div>
            <WVClickableTextElement onClick={this.editDetails}>
              EDIT
            </WVClickableTextElement>
          </div>
        )}
      </WVBottomSheet>
    );
  }
}

export default VerifyDetailDialog;
