import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { getConfig } from "utils/functions";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import Toast from "../../common/ui/Toast";
import Api from "../../utils/api";
import { isEmpty } from "lodash";
import "./Style.scss";

const product = getConfig().productName;

function VerifyDetailDialog({
  type,
  isOpen,
  data,
  onClose,
  history,
  showAccountAlreadyExist,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = (pathname, data = {}) => {
    history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      state: data,
    });
  };

  const handleClick = async () => {
    let error = "";
    if (isEmpty(data)) {
      navigate("/verify");
    } else {
      try {
        setLoading(true);
        // Checking if that id has some other account associated
        const response = await Api.get(
          `/api/iam/auth/check?contact_type=${type}&contact_value=${data.contact_value}`
        );
        setLoading(false);
        if (response.pfwresponse.status_code === 200) {
          if (response.pfwresponse.result.message === "No user found") {
            // If no user user found, generating the otp and redirecting to the otp screen
            let body = {};
            if(type === "email")
              body.email = data.contact_value
            else
              body.mobile = data.contact_value;
              body.whatsapp_consent = true // by default should this be true or false in case of bottomsheet?
            const response = await Api.post('/api/communication/send/otp', body)
            console.log(response)
          } else {
            // If User found then showing the other dialog box
            showAccountAlreadyExist(true, response.pfwresponse.result.user);
          }
        } else {
          error =
            response.pfwresponse.result.message ||
            response.pfwresponse.result.error ||
            "Something went wrong!";
          throw error;
        }
      } catch (err) {
        Toast(err, "error");
      }
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
        showLoader: loading,
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
          <WVClickableTextElement onClick={editDetails}>
            EDIT
          </WVClickableTextElement>
        </div>
      )}
    </WVBottomSheet>
  );
}

export default withRouter(VerifyDetailDialog);
