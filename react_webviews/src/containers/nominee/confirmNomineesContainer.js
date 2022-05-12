import React, { useEffect, useMemo, useState } from "react";
import Api from "../../utils/api";
import ConfirmNominee from "../../pages/Nominee/ConfirmNominees";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { nativeCallback } from "../../utils/native_callback";

import {
  getAllNominees,
  getTotalShares,
  hideAddAnotherNominee,
} from "businesslogic/utils/nominee/functions";
import {
  getEquityNominationData,
  updateNomineeRequest,
  updateNomineeDetails,
  resetNomineeDetails,
  updateNomineeStatus,
} from "businesslogic/dataStore/reducers/nominee";
import { PERSONAL_DETAILS_FORM_MAPPER } from "businesslogic/constants/nominee";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import isEmpty from "lodash-es/isEmpty";
import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";
import { handleNomineeExit } from "../../pages/Nominee/common/functions";

const screen = "CONFIRM_NOMINEE";

const initializeData = (list) => () => {
  const nominees = getAllNominees(list);
  const totalShares = getTotalShares(list);
  const hideAddNominee = hideAddAnotherNominee(list);
  return {
    nominees,
    totalShares,
    hideAddNominee,
  };
};

const confirmNomineesContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const { productName } = useMemo(getConfig, []);
  const { isButtonLoading } = useLoadingState(screen);
  const { isUpdateFailed, errorMessage } = useErrorState(screen);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [isRemoveSheetOpen, setRemoveSheetOpen] = useState(false);
  const [dialogStates, setDialogStates] = useState({
    openReviewNominee: false,
    openPercentageHoldingFull: false,
  });
  const equityNominationData = useSelector((state) =>
    getEquityNominationData(state)
  );
  const { nominees, totalShares, hideAddNominee } = useMemo(
    initializeData(equityNominationData?.eq_nominee_list),
    [equityNominationData?.eq_nominee_list]
  );

  const [openNomineeTab, setOpenNomineeTabs] = useState([true, true, true]);

  const closeRemoveSheet = () => {
    if (isButtonLoading) return;
    setSelectedIndex("");
    setRemoveSheetOpen(false);
  };

  const openRemoveSheet = (index) => () => {
    setSelectedIndex(index);
    setRemoveSheetOpen(true);
  };

  const addNominee = () => {
    const isPercentageFull = checkPercentageFull(true);
    if (isPercentageFull) {
      return;
    }
    sendEvents("next");
    dispatch(resetNomineeDetails());
    navigate(NOMINEE_PATHNAME_MAPPER.personalDetails);
  };

  const checkPercentageFull = (isPercentageFull = false) => {
    if (totalShares > 100 || (isPercentageFull && totalShares === 100)) {
      openDialog("openPercentageHoldingFull");
      return true;
    }
  };

  const checkReviewNomination = () => {
    if (totalShares < 100) {
      openDialog("openReviewNominee");
      return true;
    }
  };

  const canSubmitNominees = () => {
    let canSubmit = true;
    if (checkPercentageFull()) {
      canSubmit = false;
    } else if (checkReviewNomination()) {
      canSubmit = false;
    }
    return canSubmit;
  };

  const onClick = () => {
    if (!nominees.length) {
      addNominee();
      return;
    }

    const canSubmit = canSubmitNominees();
    if (!canSubmit) {
      return;
    }

    sendEvents("next");
    const data = {
      data_status: "submitted",
    };
    const sagaCallback = () => {
      navigate(NOMINEE_PATHNAME_MAPPER.nomineeSubmitted);
    };
    const payload = {
      screen,
      Api,
      data,
      requestId: equityNominationData.equity_nomination_request_id,
      sagaCallback,
    };
    dispatch(updateNomineeStatus(payload));
  };

  useEffect(() => {
    if (isUpdateFailed && !isEmpty(errorMessage)) {
      if (isRemoveSheetOpen) {
        closeRemoveSheet();
      }
      ToastMessage(errorMessage);
    }
  }, [isUpdateFailed]);

  const handleEditNominee = (index) => () => {
    sendEvents("next");
    const nominee = nominees[index];
    dispatch(updateNomineeDetails(nominee));
    navigate(NOMINEE_PATHNAME_MAPPER.personalDetails);
  };

  const handleRemoveNominee = () => {
    const nominee = nominees[selectedIndex];
    const data = {
      isDiscarded: true,
      share: nominee[PERSONAL_DETAILS_FORM_MAPPER.share],
    };
    const payload = {
      screen,
      Api,
      data,
      requestId: equityNominationData.equity_nomination_request_id,
      nomineeId: nominee.id,
      equityNominationData,
    };
    dispatch(updateNomineeRequest(payload));
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

  const onBackClick = () => {
    sendEvents("back");
    handleNomineeExit(navigate);
  };

  const closeDialogStates = (key) => () => {
    setDialogStates({
      ...dialogStates,
      [key]: false,
    });
  };

  const openDialog = (key) => {
    setDialogStates({
      ...dialogStates,
      [key]: true,
    });
  };

  return (
    <WrappedComponent
      productName={productName}
      nominees={nominees}
      hideAddNominee={hideAddNominee}
      openNomineeTab={openNomineeTab}
      addNominee={addNominee}
      onClick={onClick}
      sendEvents={sendEvents}
      handleEditNominee={handleEditNominee}
      handleRemoveNominee={handleRemoveNominee}
      handleNominees={handleNominees}
      isRemoveSheetOpen={isRemoveSheetOpen}
      closeRemoveSheet={closeRemoveSheet}
      openRemoveSheet={openRemoveSheet}
      isButtonLoading={isButtonLoading}
      onBackClick={onBackClick}
      openReviewNominee={dialogStates.openReviewNominee}
      openPercentageHoldingFull={dialogStates.openPercentageHoldingFull}
      closeDialogStates={closeDialogStates}
    />
  );
};

export default confirmNomineesContainer(ConfirmNominee);
