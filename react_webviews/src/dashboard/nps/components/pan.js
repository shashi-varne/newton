import React, { useState } from "react";
import Container from "fund_details/common/Container";
import "../style.scss";

const PanDetails = (props) => {
  const [value, setValue] = useState(0);

  return (
    <Container
      classOverRIde="pr-error-container"
      buttonTitle="CONTINUE"
      title="Why NPS?"
      classOverRideContainer="pr-container"
    >
        <div className="pan-details">

        </div>
    </Container>
  );
};

export default PanDetails;
