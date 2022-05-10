import React, { useEffect, useMemo } from "react";
import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";
import ESignLanding from "../../pages/Nominee/ESignLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { getUrlParams } from "../../utils/validators";
import { useSelector } from "react-redux";
import { getEquityNominationData } from "businesslogic/dataStore/reducers/nominee";

const initializeData = () => {
  const { status } = getUrlParams();
  return {
    ...getConfig(),
    status,
    isFailed: status === "failed",
  };
};
const ESignLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName, isFailed } = useMemo(initializeData, []);
  const [openAadharBottomsheet, setOpenAadhaarBottomsheet] = useState(false);
  const [openEsignFailure, setOpenEsignFailure] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const equityNominationData = useSelector((state) =>
    getEquityNominationData(state)
  );
  useEffect(() => {
    if (isFailed) {
      setOpenEsignFailure(true);
    }
  }, [isFailed]);

  const sendEvents = (userAction) => {
    const screenName = isFailed ? "esign_failed" : "esign_landing";
    const eventObj = {
      event_name: "nominee",

      properties: {
        user_action: userAction || "",
        screen_name: screenName,
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleProceed = () => {
    const userAction = "next";
    sendEvents(userAction);
    setOpenAadhaarBottomsheet(true);
  };

  const closeAadharBottomsheet = () => {
    setOpenAadhaarBottomsheet(false);
  };

  const retryEsign = (isBack) => () => {
    const action = isBack ? "back" : "next";
    sendEvents(action);
    setOpenEsignFailure(false);
    navigate(`${NOMINEE_PATHNAME_MAPPER.esignLanding}`, {
      searchParams: `${config.searchParams}&status=""`,
    });
  };

  const redirectToManualSignature = () => {
    navigate(NOMINEE_PATHNAME_MAPPER.manualSignature);
  };

  const redirectToEsign = () => {
    setShowLoader(true);
    window.location.href = equityNominationData.esign_link;
  };

  return (
    <WrappedComponent
      productName={productName}
      showLoader={showLoader}
      openAadharBottomsheet={openAadharBottomsheet}
      openEsignFailure={openEsignFailure}
      sendEvents={sendEvents}
      retryEsign={retryEsign}
      onClickProceed={handleProceed}
      redirectToEsign={redirectToEsign}
      closeAadharBottomsheet={closeAadharBottomsheet}
      redirectToManualSignature={redirectToManualSignature}
    />
  );
};

export default ESignLandingContainer(ESignLanding);
