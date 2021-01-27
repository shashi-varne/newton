import React, { useState } from "react";
import Container from "fund_details/common/Container";
import "../style.scss";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import name from "../../../assets/name_present_employer_dark_icn.png";

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
        <div className="InputField">
          <InputWithIcon
            icon={name}
            width="40"
            id="input-with-icon-grid"
            label="With a grid"
          />
        </div>
      </div>
    </Container>
  );
};

export default PanDetails;
