import React, { Component } from "react";
import { getConfig } from "utils/functions";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import Toast from "../../common/ui/Toast";
import Api from "../../utils/api";
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
      this.props.parent.navigate("/verify", {
        // data like email/mobile goes here
      });
    } else {
      const response = await this.authCheckApi(type, data);
      if (response.user === false) {
        const otpResponse = await this.generateOtp(type, data);
        if(otpResponse.otp === "success")
        {
          this.props.parent.navigate("verify-Secoundary", {
          state: {
            mobile_number: data.contact_value,
            forgot: false, // flag to be checked
            otp_id: otpResponse.otp_id,
          },
        });
        }
        
      } else if (response.user === true) {
        this.props.showAccountAlreadyExist(true, response.data);
      }
    }
  };

  editDetails = () => {
    this.props.parent.navigate("/verify", {
      // data like email/mobile goes here
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
