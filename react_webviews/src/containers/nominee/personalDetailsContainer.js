import React, { useState } from "react";
import PersonalDetails from "../../pages/Nominee/PersonalDetails";
import { navigate as navigateFunc } from "../../utils/functions";

const personalDetailsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [isMinor, setIsMinor] = useState(false);
  const availableShare = 20;

  const onClick = () => {};
  const onChange = (name) => () => {};

  return (
    <WrappedComponent
      onClick={onClick}
      isMinor={isMinor}
      availableShare={availableShare}
      onChange={onChange}
    />
  );
};

export default personalDetailsContainer(PersonalDetails);
