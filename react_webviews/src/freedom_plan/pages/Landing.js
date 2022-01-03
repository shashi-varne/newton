import React from "react";
import Container from "../common/Container";
import { navigate as navigateFunc } from "../../utils/functions";

const Landing = (props) => {
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {};

  return (
    <Container
      buttonTitle="Select Plan"
      handleClick={handleClick}
      data-aid="freedom-plan-landing"
    >

    </Container>
  );
};

export default Landing;
