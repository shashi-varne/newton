import React from "react";
import Container from "../../common/Container";
import { isEmpty } from "utils/validators";
import { getPathname } from "../../constants";
import { navigate as navigateFunc } from "../../common/functions";
import { getConfig } from "utils/functions";
import { Imgc } from "common/ui/Imgc";
import "./commonStyles.scss";

const Action = (props) => {
  const goBack = () => {
    props.history.goBack();
  };
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.action) goBack();
  const action = params.action || "";
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    if (action === "cancel") {
      navigate(`${getPathname.pauseCancelDetail}${action}/0`);
      return;
    }
    if (action === "pause") {
      navigate(getPathname.pausePeriod);
      return;
    }
  };

  return (
    <Container
      hidePageTitle={true}
      twoButton={true}
      buttonOneTitle="YES"
      buttonTwoTitle="NO"
      handleClickOne={() => handleClick()}
      handleClickTwo={() => goBack()}
      dualbuttonwithouticon
    >
      <div className="reports-sip-action">
        <Imgc
          src={require(`assets/${productName}/sip_action_illustration.svg`)}
          className="top-img"
        />
        <p className="light-text">
          We highly recommend to stay invested for at least 3 years to get the
          best benefit of SIP.
        </p>
        {action === "cancel" && (
          <div className="cancel">
            <div className="light-text">
              Or, you can also Pause for few months and restart later.
            </div>
            <div
              className="link-container"
              onClick={() => navigate(getPathname.pausePeriod)}
            >
              <img src={require(`assets/link_icon.svg`)} alt="" />
              <div className="link">Pause SIP</div>
            </div>
          </div>
        )}
        <div>Do you still want to {action} SIP?</div>
      </div>
    </Container>
  );
};

export default Action;
