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
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash-es";
import {
  getEquityNominationData,
  getNominations,
  getNomineeStorage,
  updateNomineeStorage,
} from "businesslogic/dataStore/reducers/nominee";
import useLoadingState from "../../common/customHooks/useLoadingState";

const screen = "ESIGN_LANDING";

/* eslint-disable */
const esignLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();

  const [openAadharBottomsheet, setOpenAadhaarBottomsheet] = useState(false);
  const [openEsignFailure, setOpenEsignFailure] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const equityNominationData = useSelector((state) =>
    getEquityNominationData(state)
  );
  const nomineeStorage = useSelector((state) => getNomineeStorage(state));
  const { productName, code, searchParams, isWebOrSdk, isSdk, iOS } = useMemo(
    getConfig,
    []
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
    if (nomineeStorage.showEsignFailure) {
      setOpenEsignFailure(true);
    } else {
      setOpenEsignFailure(false);
    }
  }, [nomineeStorage]);

  const sendEvents = (userAction) => {
    const screenName = nomineeStorage.showEsignFailure
      ? "esign_failed"
      : "esign_landing";
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
    setOpenAadhaarBottomsheet(true);
  };

  const closeAadharBottomsheet = () => {
    setOpenAadhaarBottomsheet(false);
  };

  const retryEsign = (isBack) => () => {
    const action = isBack ? "back" : "next";
    sendEvents(action);
    dispatch(updateNomineeStorage({ showEsignFailure: false }));
  };

  const redirectToManualSignature = () => {
    sendEvents("next");
    navigate(NOMINEE_PATHNAME_MAPPER.manualSignature);
  };

  const redirectToEsign = () => {
    setShowLoader(true);
    sendEvents("next");
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

  const onBackClick = () => {
    sendEvents("back");
    navigate(NOMINEE_PATHNAME_MAPPER.landing);
  };

  return (
    <WrappedComponent
      productName={productName}
      showLoader={showLoader || isPageLoading}
      openAadharBottomsheet={openAadharBottomsheet}
      openEsignFailure={openEsignFailure}
      onBackClick={onBackClick}
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
