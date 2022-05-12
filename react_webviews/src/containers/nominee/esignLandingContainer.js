import React, { useEffect, useMemo, useState } from "react";
import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";
import ESignLanding from "../../pages/Nominee/ESignLanding";
import {
  getBasePath,
  getConfig,
  navigate as navigateFunc,
} from "../../utils/functions";
import Api from "../../utils/api";
import { nativeCallback } from "../../utils/native_callback";
import { getUrlParams } from "../../utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash-es";
import {
  getEquityNominationData,
  getNominations,
} from "businesslogic/dataStore/reducers/nominee";
import useLoadingState from "../../common/customHooks/useLoadingState";

const screen = "ESIGN_LANDING";
const initializeData = () => {
  const { status } = getUrlParams();
  return {
    ...getConfig(),
    status,
    isFailed: status === "failed",
  };
};

/* eslint-disable */
const esignLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const { productName, code, isFailed, searchParams, isWebOrSdk, isSdk, iOS } =
    useMemo(initializeData, []);
  const [openAadharBottomsheet, setOpenAadhaarBottomsheet] = useState(false);
  const [openEsignFailure, setOpenEsignFailure] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const equityNominationData = useSelector((state) =>
    getEquityNominationData(state)
  );
  const { isPageLoading } = useLoadingState(screen);

  useEffect(() => {
    if (isEmpty(equityNominationData?.esign_link)) {
      dispatch(
        getNominations({
          Api,
          screen,
        })
      );
    }
  }, []);

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
      searchParams: `${searchParams}&status=""`,
    });
  };

  const redirectToManualSignature = () => {
    navigate(NOMINEE_PATHNAME_MAPPER.manualSignature);
  };

  const redirectToEsign = () => {
    setShowLoader(true);
    const basepath = getBasePath();
    const backUrl = window.location.href;
    const redirectUrl = encodeURIComponent(
      `${basepath}${NOMINEE_PATHNAME_MAPPER.esignStatus}${searchParams}`
    );
    let esignLink = equityNominationData.esign_link;
    esignLink = `${esignLink}${
      esignLink.match(/[\?]/g) ? "&" : "?"
    }digio_redirect_url=${redirectUrl}&partner_code=${code}`;
    if (!isWebOrSdk) {
      if (iOS) {
        nativeCallback({
          action: "show_top_bar",
          message: {
            title: "eSign",
          },
        });
      }
      nativeCallback({
        action: "take_back_button_control",
        message: {
          url: backUrl,
          message: "You are almost there, do you really want to go back?",
        },
      });
    } else if (isSdk) {
      const redirectData = {
        show_toolbar: false,
        icon: "back",
        dialog: {
          message: "You are almost there, do you really want to go back?",
          action: [
            {
              action_name: "positive",
              action_text: "Yes",
              action_type: "redirect",
              redirect_url: encodeURIComponent(backUrl),
            },
            {
              action_name: "negative",
              action_text: "No",
              action_type: "cancel",
              redirect_url: "",
            },
          ],
        },
        data: {
          type: "server",
        },
      };
      if (iOS) {
        redirectData.show_toolbar = true;
      }
      nativeCallback({ action: "third_party_redirect", message: redirectData });
    }
    window.location.href = esignLink;
  };

  return (
    <WrappedComponent
      productName={productName}
      showLoader={showLoader || isPageLoading}
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

export default esignLandingContainer(ESignLanding);
