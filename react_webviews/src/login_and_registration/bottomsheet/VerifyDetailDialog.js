import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { getConfig } from "utils/functions";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import Toast from "../../common/ui/Toast";
import Api from "../../utils/api";
import "./Style.scss";

const product = getConfig().productName;

function VerifyDetailDialog({ type, isOpen, data, onClose, history, showAccountAlreadyExist }) {
  const [loading, setLoading] = useState(false)
  const navigate = (pathname) => {
    history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  const handleClick = async () => {
    let error = "";
    try {
      setLoading(true)
      const response = await Api.get(
        `/api/iam/auth/check?contact_type=${type}&contact_value=${data}`
      );
      setLoading(false)
      if (response.pfwresponse.status_code === 200) {
        if (response.pfwresponse.result.message === "No user found") {
          // api call and redirect to the otp page for verification
          console.log("NO USER")
        } else {
          showAccountAlreadyExist(true, response.pfwresponse.result.user)
          console.log("USER FOUND")
        }
      } else {
        console.log("ERROR")
        error =
          response.pfwresponse.result.message ||
          response.pfwresponse.result.error ||
          "Something went wrong!";
        throw error;
      }
    } catch (err) {
      console.log(err)
      // Toast(err, "error");
    }
  };

  const editDetails = () => {
    navigate("/verify");
  };

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
        onClick: handleClick,
        showLoader: loading
      }}
      classes={{
        container: "verify-details-container",
      }}
    >
      <div className="details">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={require(`../../assets/bottom_sheet_icon_${type}.svg`)}
            alt=""
          />
          <span className="text">{data}</span>
        </div>
        <WVClickableTextElement onClick={editDetails}>
          EDIT
        </WVClickableTextElement>
      </div>
    </WVBottomSheet>
  );
}

export default withRouter(VerifyDetailDialog);
