import React, { useMemo, useState } from "react";
import Landing from "../../pages/Nominee/Landing";
import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import {
  getMfNomineeData,
  getDematNomineeData,
} from "businesslogic/constants/nominee";

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openResetNominee, setOpenResetNominee] = useState(false);
  const mfStatus = "complete";
  const dematStatus = "complete";
  const mfNomineeData = useMemo(getMfNomineeData(mfStatus), [mfStatus]);
  const dematNomineeData = useMemo(getDematNomineeData(dematStatus), [
    dematStatus,
  ]);
  const onClick = () => {};

  const onMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleResetNominee = (value) => () => {
    setOpenResetNominee(value);
  };

  const onMenuClose = () => {
    setAnchorEl(null);
  };

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",
      properties: {
        user_action: userAction || "",
        screen_name: "my_nominees",
        nominee_status: dematNomineeData.eventStatus,
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <WrappedComponent
      anchorEl={anchorEl}
      mfNomineeData={mfNomineeData}
      dematNomineeData={dematNomineeData}
      openResetNominee={openResetNominee}
      onClick={onClick}
      onMoreClick={onMoreClick}
      onMenuClose={onMenuClose}
      handleEdit={handleResetNominee(true)}
      closeResetNominee={handleResetNominee(false)}
      sendEvents={sendEvents}
    />
  );
};

export default landingContainer(Landing);
