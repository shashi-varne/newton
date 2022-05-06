import React, { useMemo, useState } from "react";
import ConfirmNominee from "../../pages/Nominee/ConfirmNominees";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";

import {
  ADDRESS_DETAILS_FORM_MAPPER,
  PERSONAL_DETAILS_FORM_MAPPER,
} from "businesslogic/constants/nominee";
import { nativeCallback } from "../../utils/native_callback";

const DEFAULT_FORM_DATA = {
  [PERSONAL_DETAILS_FORM_MAPPER.share]: "10%",
  [PERSONAL_DETAILS_FORM_MAPPER.name]: "Alekhya",
  [PERSONAL_DETAILS_FORM_MAPPER.dob]: "11/11/1111",
  [PERSONAL_DETAILS_FORM_MAPPER.relationship]: "Son",
  [PERSONAL_DETAILS_FORM_MAPPER.mobile]: "11111111111111",
  [PERSONAL_DETAILS_FORM_MAPPER.email]: "alekhya@gmail.com",
  [ADDRESS_DETAILS_FORM_MAPPER.poi]: "aadhaar.pdf",
  [ADDRESS_DETAILS_FORM_MAPPER.address]: "18-8-iusdbv, wufev",
};

const confirmNomineesContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const nominees = [DEFAULT_FORM_DATA];
  const [openNomineeTab, setOpenNomineeTabs] = useState([true]);
  const isMinor = false;

  const [selectedIndex, setSelectedIndex] = React.useState("");
  const [isRemoveSheetOpen, setRemoveSheetOpen] = React.useState(false);

  const closeRemoveSheet = () => {
    setSelectedIndex("");
    setRemoveSheetOpen(false);
  };

  const openRemoveSheet = (index) => {
    setSelectedIndex(index);
    setRemoveSheetOpen(true);
  };

  const onClick = () => {
    sendEvents("next");
  };

  const handleEditNominee = () => {};

  const handleRemoveNominee = () => {
    //remove selectedIndex
    console.log("remove ", selectedIndex);
    closeRemoveSheet();
  };

  const handleNominees = (index) => () => {
    let data = [...openNomineeTab];
    data[index] = !openNomineeTab[index];
    setOpenNomineeTabs(data);
  };

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",
      properties: {
        user_action: userAction || "",
        screen_name: "confirm_nominee",
        no_of_nominee_added: nominees.length,
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
      isMinor={isMinor}
      productName={productName}
      nominees={nominees}
      openNomineeTab={openNomineeTab}
      onClick={onClick}
      sendEvents={sendEvents}
      handleEditNominee={handleEditNominee}
      handleRemoveNominee={handleRemoveNominee}
      handleNominees={handleNominees}
      isRemoveSheetOpen={isRemoveSheetOpen}
      closeRemoveSheet={closeRemoveSheet}
      openRemoveSheet={openRemoveSheet}
    />
  );
};

export default confirmNomineesContainer(ConfirmNominee);
