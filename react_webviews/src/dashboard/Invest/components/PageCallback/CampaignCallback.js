import React from "react";
import { getUrlParams } from "../../../../utils/validators";
import Container from "../../../common/Container";
import { navigate as navigateFunc } from "../../../../utils/functions";
import "../../commonStyles.scss";

const CampaignCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const { code, message } = getUrlParams();

  const goNext = () => {
    navigate("/reports");
  };

  if (code === 200) {
    goNext();
  }

  return (
    <Container handleClick={goNext} buttonTitle="CONTINUE" hidePageTitle>
      <div className="page-campaign-callback">
        <div className="page-campaign-callback-titile">Error</div>
        <div>{message}</div>
      </div>
    </Container>
  );
};

export default CampaignCallback;
