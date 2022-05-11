import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";

const EsignStatus = ({ onBackClick }) => {
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

export default EsignStatus;
