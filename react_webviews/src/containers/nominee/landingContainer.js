import React, { useEffect, useMemo, useState } from "react";
import Landing from "../../pages/Nominee/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import {
  NOMINEE_MENU_OPTIONS,
  getMfNomineeData,
  getDematNomineeData,
} from "businesslogic/constants/nominee";
import {
  getNominations,
  getEquityNominationData,
  getMfNominationData,
} from "businesslogic/dataStore/reducers/nominee";
import { useDispatch, useSelector } from "react-redux";
import { get, isEmpty } from "lodash-es";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import Api from "../../utils/api";
import ToastMessage from "../../designSystem/atoms/ToastMessage";

const screen = "NOMINEE_LANDING";

const getDematNomineeStatus = (equityNominationData) => {
  const status = get(equityNominationData, "friendly_status", "init");
  return status;
};

const getMfNomineeStatus = (mfNominations) => {
  const status = get(mfNominations, "meta_data_status", "init");
  return status;
};

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openResetNominee, setOpenResetNominee] = useState(false);
  const { isSdk } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isUpdateFailed, isFetchFailed, errorMessage } = useErrorState(screen);
  const equityNominations = useSelector((state) =>
    getEquityNominationData(state)
  );
  const mfNominations = useSelector((state) => getMfNominationData(state));
  const dispatch = useDispatch();

  const mfStatus = getMfNomineeStatus(mfNominations);
  const dematStatus = getDematNomineeStatus(equityNominations);

  const mfNomineeData = useMemo(getMfNomineeData(mfStatus, mfNominations), [
    mfStatus,
  ]);
  const dematNomineeData = useMemo(
    getDematNomineeData(dematStatus, equityNominations),
    [dematStatus]
  );

  const initialize = () => {
    dispatch(
      getNominations({
        Api: Api,
        screen: screen,
      })
    );
  };

  const onClick = () => {
    const { eventStatus } = dematNomineeData;
    if (eventStatus === "no_nominee_added") {
      navigate("/nominee/personal-details");
    } else if (eventStatus === "nominee_incomplete") {
      navigate("/nominee/confirm-nominees");
    } else if (eventStatus === "nomiee_rejected") {
      navigate("/nominee/personal-details");
    } else if (eventStatus === "nominee_esign_pending") {
      navigate("/nominee/esign-landing");
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const onClickMenuItem = (index) => {
    const item = NOMINEE_MENU_OPTIONS[index].value;
    if (item === "edit") {
      setOpenResetNominee(true);
    }
    onMenuClose();
  };

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

  const handleConfirmEditNominees = () => {
    navigate("/nominee/confirm-nominees");
  };

  useEffect(() => {
    if ((isFetchFailed || isUpdateFailed) && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed, isUpdateFailed]);

  const onBackClick = () => {
    sendEvents("back");
    if (isSdk) {
      navigate("/my-account");
    } else {
      props.history.goBack();
    }
  };

  return (
    <WrappedComponent
      anchorEl={anchorEl}
      mfNomineeData={mfNomineeData}
      dematNomineeData={dematNomineeData}
      openResetNominees={openResetNominee}
      onClick={onClick}
      menuOptions={NOMINEE_MENU_OPTIONS}
      onMoreClick={onMoreClick}
      onMenuClose={onMenuClose}
      onClickMenuItem={onClickMenuItem}
      closeResetNominee={handleResetNominee(false)}
      confirmEditNominees={handleConfirmEditNominees}
      isPageLoading={isPageLoading}
      sendEvents={sendEvents}
      onBackClick={onBackClick}
    />
  );
};

export default landingContainer(Landing);
