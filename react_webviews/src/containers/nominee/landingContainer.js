import React, { useMemo } from "react";
import Landing from "../../pages/Nominee/Landing";
import { navigate as navigateFunc } from "../../utils/functions";
import {
  getMfNomineeData,
  getDematNomineeData,
} from "businesslogic/constants/nominee";

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const mfStatus = "complete";
  const dematStatus = "complete";
  const mfNomineeData = useMemo(getMfNomineeData(mfStatus), [mfStatus]);
  const dematNomineeData = useMemo(getDematNomineeData(dematStatus), [
    dematStatus,
  ]);
  const onClick = () => {};

  return (
    <WrappedComponent
      onClick={onClick}
      mfNomineeData={mfNomineeData}
      dematNomineeData={dematNomineeData}
    />
  );
};

export default landingContainer(Landing);
