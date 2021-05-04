import React, { useState } from "react";
import Container from "../../common/Container";
import "./commonStyles.scss";

const AccountInfo = (props) => {
  return (
    <Container
      buttonTitle="CONTINUE"
      title={"Trading & demat account"}
      noPadding
      hideInPageTitle
    >
      <div className="account-info">
        <div>
          <div>Trading & demat account</div>
          <img />
        </div>
      </div>
    </Container>
  );
};

export default AccountInfo;
