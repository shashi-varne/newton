import React, { useEffect, useMemo, useState } from "react";
import Api from "../../utils/api";
import AddressDetails from "../../pages/Nominee/AddressDetails";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import {
  navigate as navigateFunc,
  combinedDocBlob,
} from "../../utils/functions";
import { validateName, validateNumber } from "../../utils/validators";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash-es/isEmpty";

import {
  ADDRESS_DETAILS_FORM_MAPPER,
  DEFAULT_NOMINEE_ADDRESS_DETAILS,
  ERROR_MESSAGES,
} from "businesslogic/constants/nominee";
import {
  validateFields,
  getNomineeAddressDetails,
  getPoiData,
  isDematNomineeStatusInit,
  hideAddAnotherNominee,
  getTotalShares,
  getNomineeDataById,
  getUpdatedData,
  isNomineeUpdateFlow,
  validateAddress,
} from "businesslogic/utils/nominee/functions";
import {
  getNomineeDetails,
  updateNomineeDetails,
  getEquityNominationData,
  createNomineeRequest,
  resetNomineeDetails,
  updateNomineeRequest,
} from "businesslogic/dataStore/reducers/nominee";
import { getPinCodeData } from "businesslogic/apis/common";

import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";

import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";

const screen = "ADDRESS_DETAILS";

const DEFAULT_DIALOG_STATES = {
  openNomineeSaved: false,
  openReviewNominee: false,
  openPercentageHoldingFull: false,
};

const initializeData = (list, nomineeDetails) => () => {
  const oldNomineeData = getNomineeDataById(list, nomineeDetails?.id);
  const hideAddNominee = hideAddAnotherNominee(list);
  const totalShares = getTotalShares(list);
  const isUpdateFlow = isNomineeUpdateFlow(nomineeDetails);
  return {
    oldNomineeData,
    totalShares,
    hideAddNominee,
    isUpdateFlow,
  };
};

const addressDetailsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const nomineeDetails = useSelector((state) => getNomineeDetails(state));
  const equityNominationData = useSelector((state) =>
    getEquityNominationData(state)
  );
  const { isButtonLoading } = useLoadingState(screen);
  const { isUpdateFailed, errorMessage } = useErrorState(screen);
  const [formData, setFormData] = useState(
    getNomineeAddressDetails(nomineeDetails)
  );
  const [errorData, setErrorData] = useState(DEFAULT_NOMINEE_ADDRESS_DETAILS);
  const [dialogStates, setDialogStates] = useState(DEFAULT_DIALOG_STATES);
  const [isDocumentUpdated, setIsDocumentUpdated] = useState(false);

  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [previewFiles, setPreviewFiles] = useState(null);

  const poiData = useMemo(() => getPoiData(formData.poi), [formData.poi]);
  const { oldNomineeData, totalShares, hideAddNominee, isUpdateFlow } = useMemo(
    initializeData(equityNominationData?.eq_nominee_list, nomineeDetails),
    [equityNominationData?.eq_nominee_list, nomineeDetails]
  );

  useEffect(() => {
    if (isUpdateFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isUpdateFailed]);

  const onClick = () => {
    const keysToCheck = [
      ADDRESS_DETAILS_FORM_MAPPER.pincode,
      ADDRESS_DETAILS_FORM_MAPPER.address,
      ADDRESS_DETAILS_FORM_MAPPER.city,
      ADDRESS_DETAILS_FORM_MAPPER.address,
      ADDRESS_DETAILS_FORM_MAPPER.state,
      ADDRESS_DETAILS_FORM_MAPPER.poi,
    ];
    if (!isUpdateFlow || isDocumentUpdated) {
      keysToCheck.push(ADDRESS_DETAILS_FORM_MAPPER.frontDoc);
      if (poiData?.numberOfDocs === 2) {
        keysToCheck.push(ADDRESS_DETAILS_FORM_MAPPER.backDoc);
      }
    }

    const result = validateFields(formData, keysToCheck);
    if (!result.canSubmit) {
      const data = { ...errorData, ...result.errorData };
      setErrorData(data);
      return;
    }
    dispatch(updateNomineeDetails(formData));
    sendEvents("next");
    const addressDoc = poiData?.numberOfDocs === 2 ? file : formData?.frontDoc;
    const sagaCallback = () => {
      if (isDocumentUpdated) {
        setIsDocumentUpdated(false);
      }
      openNomineeSaved();
    };
    let payload = {
      Api,
      screen,
      data: {
        ...nomineeDetails,
        ...formData,
      },
      file: addressDoc,
      sagaCallback,
      equityNominationData,
    };
    if (!isDematNomineeStatusInit(equityNominationData)) {
      payload.requestId = equityNominationData.equity_nomination_request_id;
    }
    if (isUpdateFlow) {
      payload.nomineeId = nomineeDetails.id;
      let data = getUpdatedData(
        oldNomineeData,
        payload.data,
        Object.keys(nomineeDetails)
      );
      if (isDocumentUpdated) {
        payload.file = poiData?.numberOfDocs === 2 ? file : formData?.frontDoc;
        data.poi = formData.poi;
        data.password = formData.password;
      } else {
        payload.file = null;
      }
      if (oldNomineeData.isMinor !== nomineeDetails.isMinor) {
        data = payload.data;
      }
      if (isEmpty(data)) {
        openNomineeSaved();
        return;
      }
      data.isMinor = nomineeDetails.isMinor;
      payload.data = data;
      dispatch(updateNomineeRequest(payload));
    } else {
      dispatch(createNomineeRequest(payload));
    }
  };

  const openNomineeSaved = () => {
    openDialog("openNomineeSaved");
  };

  const addAnotherNominee = () => {
    if (totalShares >= 100) {
      openDialog("openPercentageHoldingFull");
      return;
    }
    dispatch(resetNomineeDetails());
    navigate(NOMINEE_PATHNAME_MAPPER.personalDetails);
  };

  const editNominee = () => {
    navigate(NOMINEE_PATHNAME_MAPPER.personalDetails);
  };

  const handleConfirmNominees = () => {
    if (totalShares < 100) {
      openDialog("openReviewNominee");
      return;
    }
    dispatch(resetNomineeDetails());
    navigate(NOMINEE_PATHNAME_MAPPER.confirmNominees);
  };

  const handlePrimaryClick = () => {
    if (hideAddNominee) {
      handleConfirmNominees();
    } else {
      addAnotherNominee();
    }
  };

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",
      properties: {
        user_action: userAction || "",
        screen_name: "nominee_address_details",
        minor_nominee: nomineeDetails.isMinor ? "yes" : "no",
        nominee_percentage_share: nomineeDetails.share,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const fetchPincodeData = async () => {
    let data = { ...formData };
    let errorInfo = { ...errorData };
    try {
      const result = await getPinCodeData(Api, data.pincode);
      if (result && result.length === 0) {
        errorInfo.pincode = ERROR_MESSAGES.pincode;
        data.city = "";
        data.state = "";
      } else {
        data.city = result[0].district_name?.toUpperCase();
        data.state = result[0].state_name?.toUpperCase();
      }
    } catch (err) {
      console.error(err);
    }
    setFormData(data);
    setErrorData(errorInfo);
  };

  useEffect(() => {
    if (formData?.pincode?.length === 6) {
      fetchPincodeData();
    }
  }, [formData?.pincode]);

  const onChange = (name) => (event) => {
    const data = { ...formData };
    const errorInfo = { ...errorData };
    const numberFields = [ADDRESS_DETAILS_FORM_MAPPER.pincode];
    const nameFields = [
      ADDRESS_DETAILS_FORM_MAPPER.city,
      ADDRESS_DETAILS_FORM_MAPPER.state,
    ];
    const value = event.target.value || "";
    if (value && numberFields.includes(name) && !validateNumber(value)) return;
    if (value && nameFields.includes(name) && !validateName(value)) return;
    if (value && value.indexOf(" ") === 0) return;
    if (
      name === ADDRESS_DETAILS_FORM_MAPPER.address &&
      !validateAddress(value)
    ) {
      return;
    }
    data[name] = value;
    errorInfo[name] = "";
    setFormData(data);
    setErrorData(errorInfo);
  };

  const mergeDocuments = () => {
    if (previewFiles?.frontFile && previewFiles?.backFile) {
      const fr = new Image(1280, 720);
      const bc = new Image(1280, 720);
      fr.src = previewFiles.frontFile;
      bc.src = previewFiles.backFile;
      const blob = combinedDocBlob(fr, bc, "address");
      setFile(blob);
    }
  };

  useEffect(() => {
    mergeDocuments();
  }, [previewFiles]);

  const onFileSelectStart = () => {
    setFileLoading(true);
  };

  const onFileSelectComplete = (docSide) => (file, fileBase64) => {
    setFileLoading(false);
    const errorInfo = { ...errorData };
    if (docSide === "front") {
      errorInfo[ADDRESS_DETAILS_FORM_MAPPER.frontDoc] = "";
      setFormData({
        ...formData,
        [ADDRESS_DETAILS_FORM_MAPPER.frontDoc]: file,
      });
      setPreviewFiles({
        ...previewFiles,
        frontFile: fileBase64,
      });
    } else {
      errorInfo[ADDRESS_DETAILS_FORM_MAPPER.backDoc] = "";
      setFormData({
        ...formData,
        [ADDRESS_DETAILS_FORM_MAPPER.backDoc]: file,
      });
      setPreviewFiles({
        ...previewFiles,
        backFile: fileBase64,
      });
    }
    setErrorData(errorInfo);
    if (isUpdateFlow && !isDocumentUpdated) {
      setIsDocumentUpdated(true);
    }
  };

  const onFileSelectError = (err) => {
    setFileLoading(false);
    ToastMessage(err.message);
  };

  const closeDialogStates = (key) => () => {
    setDialogStates({
      ...dialogStates,
      [key]: false,
    });
  };

  const openDialog = (key) => {
    setDialogStates({
      ...DEFAULT_DIALOG_STATES,
      [key]: true,
    });
  };

  return (
    <WrappedComponent
      poiData={poiData}
      formData={formData}
      errorData={errorData}
      isMinor={nomineeDetails.isMinor}
      hideAddNominee={hideAddNominee}
      openNomineeSaved={dialogStates.openNomineeSaved}
      openReviewNominee={dialogStates.openReviewNominee}
      openPercentageHoldingFull={dialogStates.openPercentageHoldingFull}
      isButtonLoading={fileLoading || isButtonLoading}
      onClick={onClick}
      onChange={onChange}
      sendEvents={sendEvents}
      onFileSelectStart={onFileSelectStart}
      onFileSelectComplete={onFileSelectComplete}
      onFileSelectError={onFileSelectError}
      onPrimaryClick={handlePrimaryClick}
      handleConfirmNominees={handleConfirmNominees}
      addAnotherNominee={addAnotherNominee}
      editNominee={editNominee}
      closeDialogStates={closeDialogStates}
    />
  );
};

export default addressDetailsContainer(AddressDetails);
