import React from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { isEmpty, storageService } from "../../utils/validators";
import Container from "../common/Container";
import "./AccountMerge.scss";

const AccountMerge = (props) => {
  const navigate = navigateFunc.bind(props);
  const auth_ids = storageService().getObject("auth_ids") || {};
  const pan_number = props.match?.params?.pan_number || "";
  if (!pan_number || isEmpty(auth_ids)) {
    props.history.goBack();
  }
  const auth_id = auth_ids[0];
  const productName = getConfig().productName;

  const handleClick = () => {
    navigate(`/account/merge/otp/${pan_number}`);
  };

  return (
    <Container
      data-aid='account-merge-screen'
      buttonTitle="SEND OTP"
      title="Link Account"
      handleClick={handleClick}
      iframeRightContent={require(`assets/${productName}/link_account.svg`)}
    >
      <div className="account-merge" data-aid='account-merge'>
        <p>We need to verify your account credentials to link account.</p>
        <div className="auth-info" data-aid='auth-info'>
          {auth_id.type === "mobile" ? (
            <img src={require(`assets/${productName}/ic_mobile.svg`)} alt="" />
          ) : (
            <img src={require(`assets/${productName}/ic_email.svg`)} alt="" />
          )}
          <div data-aid='auth-id'>
            <div>
              OTP will be sent to{" "}
              {auth_id.type === "mobile" ? "Mobile Number" : "Email ID"}
            </div>
            <div data-aid='account-merge-auth-id'>{auth_id.auth_id}</div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AccountMerge;
