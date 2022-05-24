import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";

const EsignRedirecionStatus = ({ onBackClick }) => {
  return (
    <Container
      headerProps={{
        headerSx: { display: "none" },
        onBackClick,
      }}
      isPageLoading={true}
    ></Container>
  );
};

export default EsignRedirecionStatus;
