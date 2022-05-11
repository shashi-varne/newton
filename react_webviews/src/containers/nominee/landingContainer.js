import React, { useEffect, useMemo, useState } from "react";
import Landing from "../../pages/Nominee/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import {
  NOMINEE_MENU_OPTIONS,
  getMfNomineeData,
  getDematNomineeData,
  DEMAT_NOMINEE_STATUS_MAPPER,
} from "businesslogic/constants/nominee";
import {
  getNominations,
  getEquityNominationData,
  getMfNominationData,
  resetNomineeDetails,
} from "businesslogic/dataStore/reducers/nominee";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash-es";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import Api from "../../utils/api";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";
import {
  getMfNomineeStatus,
  getDematNomineeStatus,
} from "businesslogic/utils/nominee/functions";
const screen = "NOMINEE_LANDING";

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openResetNominee, setOpenResetNominee] = useState(false);
  const { isWebOrSdk } = useMemo(getConfig, []);
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
    if (dematStatus === DEMAT_NOMINEE_STATUS_MAPPER.inProgress) {
      return;
    } else if (
      [
        DEMAT_NOMINEE_STATUS_MAPPER.init,
        DEMAT_NOMINEE_STATUS_MAPPER.rejected,
      ].includes(dematStatus)
    ) {
      dispatch(resetNomineeDetails());
      navigate(NOMINEE_PATHNAME_MAPPER.personalDetails);
    } else if (dematStatus === DEMAT_NOMINEE_STATUS_MAPPER.esignReady) {
      navigate(NOMINEE_PATHNAME_MAPPER.esignLanding);
    } else {
      navigate(NOMINEE_PATHNAME_MAPPER.confirmNominees);
    }
    sendEvents("next");
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
    navigate(NOMINEE_PATHNAME_MAPPER.confirmNominees);
  };

  useEffect(() => {
    if ((isFetchFailed || isUpdateFailed) && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed, isUpdateFailed]);

  const onBackClick = () => {
    sendEvents("back");
    if (isWebOrSdk) {
      navigate(NOMINEE_PATHNAME_MAPPER.myAccount);
    } else {
      nativeCallback({ action: "exit_web" });
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
