import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService, validatePan } from "utils/validators";
import Input from "../../common/ui/Input";
import { checkMerge, getPan, kycSubmit } from "../common/api";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import toast from "../../common/ui/Toast";
import AccountMerge from "../mini-components/AccountMerge";
import { getConfig, isNewIframeDesktopLayout, navigate as navigateFunc } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { ConfirmPan } from "../Equity/mini-components/ConfirmPan";
import CheckCompliant from "../Equity/mini-components/CheckCompliant";
import { isDigilockerFlow } from "../common/functions";
import internalStorage from '../common/InternalStorage';
import isEmpty from 'lodash/isEmpty';

const residentialStatusOptions = [
  {
    value: true,
    name: "Yes",
  },
  {
    value: false,
    name: "No",
  },
];

const config = getConfig();
const showPageDialog = isNewIframeDesktopLayout();
const Home = (props) => {
  const navigate = navigateFunc.bind(props);
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [isStartKyc, setIsStartKyc] = useState(false);
  const [isUserCompliant, setIsUserCompliant] = useState();
  const [pan, setPan] = useState("");
  const [panError, setPanError] = useState("");
  const [openAccountMerge, setOpenAccountMerge] = useState(false);
  const [homeData, setHomeData] = useState({});
  const [accountMergeData, setAccountMergeData] = useState({});
  const [authIds, setAuthIds] = useState({});
  const stateParams = props.match.state || {};
  const isPremiumFlow = stateParams.isPremiumFlow || false;
  const { kyc, user, isLoading } = useUserKycHook();
  const [openConfirmPan, setOpenConfirmPan] = useState(false);
  const [openCheckCompliant, setOpenCheckCompliant] = useState(false);
  const [residentialStatus, setResidentialStatus] = useState(true);
  const [userName, setUserName] = useState("");
  const [tradingEnabled, setTradingEnabled] = useState();
  const [disableResidentialStatus, setDisableResidentialStatus] = useState();

  const isTradingEnabled = (isIndian) => {
    return !config.isSdk && isIndian
  }
  // const [navigateTo, setNavigateTo] = useState('');
  // const [x,setX] = useState(false);

  const savedPan = storageService().get('pan');
  useEffect(() => {
    if(savedPan){
      setPan(savedPan);
    }
  },[])

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = () => {
    setPan(kyc.pan?.meta_data?.pan_number || "");
    setResidentialStatus(!kyc.address?.meta_data?.is_nri);
    setTradingEnabled(isTradingEnabled(!kyc.address?.meta_data?.is_nri));
    setDisableResidentialStatus(!!kyc.identification.meta_data.tax_status)
    let data = {
      investType: "mutual fund",
      npsDetailsRequired: false,
      title: "Verify PAN",
      subtitle:
        "As per SEBI, valid PAN is mandatory to open a trading & demat account",
      kycConfirmPanScreen: false,
    };
    if(isEmpty(savedPan)){
      setPan(kyc.pan?.meta_data?.pan_number || "");
    } else{
      storageService().remove('pan');
    }
    if (
      user.nps_investment &&
      storageService().get("nps_additional_details_required")
    ) {
      data.npsDetailsRequired = true;
    }
    if (stateParams.isEdit) {
      if (data.npsDetailsRequired) {
        data.title = "Change PAN";
        data.subtitle = "Enter PAN to complete your NPS investment";
      } else if (isPremiumFlow) {
        data.title = "Edit PAN";
        data.subtitle = "PAN is required for premium onboarding";
      } else {
        data.title = "Change PAN";
        data.subtitle = "Change your PAN and check if you’re investment ready";
      }
    } else if (data.npsDetailsRequired) {
      data.title = "NPS investment pending!";
      data.subtitle = "Enter PAN to complete your NPS investment";
    }
    if (data.npsDetailsRequired) data.investType = "nps";
    setHomeData({ ...data });
  };

  const handleClick = async () => {
    try {
      if (pan.length !== 10) {
        setPanError("Minimum length is 10");
        return;
      }

      if (pan.length > 10) {
        setPanError("Maximum length is 10");
        return;
      }

      if (!validatePan(pan)) {
        setPanError("Invalid PAN number");
        return;
      }
      const skipApiCall = pan === kyc?.pan?.meta_data?.pan_number;
      sendEvents("next");
      if (skipApiCall || isStartKyc) {
        setIsStartKyc(true);
        setUserName(kyc?.pan?.meta_data?.name);
        if (kyc?.kyc_status === "compliant") {
          setIsUserCompliant(true);
        } else {
          setIsUserCompliant(false);
        }
        setOpenConfirmPan(true);
        return;
      }
      setShowLoader("button");
      await checkPanValidity(true);
    } catch (err) {
      toast(err.message || genericErrorMessage);
    }
  };

  const checkPanValidity = async (showConfirmPan = false) => {
    let body = {
      kyc: {
        pan_number: pan.toUpperCase(),
      }
    };

    if(tradingEnabled) {
      body.kyc_product_type = "equity"
    };

    try {
      let result = await getPan(body, accountMerge);
      if (isEmpty(result)) return;
      setUserName(result.kyc.name);
      setIsStartKyc(true);
      if (showConfirmPan) setOpenConfirmPan(true);
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setShowLoader(false);
    }
  };

  const handleChange = (event) => {
    let target = event.target;
    let value = target ? target.value.trim() : event;
    let limit = target?.maxLength;

    if (value.length > limit) {
      return;
    }

    setPan(value);
    if (value) setPanError("");
    else setPanError("This is required");
    if (isStartKyc) {
      setIsStartKyc(false);
    }
  };

  const handleResidentialStatus = (event) => {
    let value = event.target ? event.target.value : event;
    setTradingEnabled(isTradingEnabled(value !== 1))
    setResidentialStatus(residentialStatusOptions[value].value);
  };

  const closeAccountMerge = () => {
    sendEvents("re-enter_pan", "pan_aleady_exists");
    setOpenAccountMerge(false);
  };

  const handleMerge = async (step) => {
    sendEvents("link_account", "pan_aleady_exists");
    if (step === "STEP1") {
      if(!isEmpty(authIds))
        storageService().setObject(STORAGE_CONSTANTS.AUTH_IDS, authIds);
      navigate(`${PATHNAME_MAPPER.accountMerge}${pan.toUpperCase()}`);
    } else {
      if (config.Web) {
        navigate("/logout");
      } else {
        nativeCallback({ action: "session_expired" });
      }
    }
  };

  const reEnterPan = () => {
    navigate('home');
  }

  const accountMerge = async () => {
    let email = config.email;
    let name = "fisdom";
    if (config.productName === "finity") name = "finity";
    const toastMessage = `The PAN is already associated with another ${name} account. Kindly send mail to ${email} for any clarification`;
    if (showPageDialog) {
      toast(toastMessage);
    } else {
      let response = await checkMerge(pan.toUpperCase());
      if (!response) return;
      let { result, status_code } = response;
      let { different_login, auth_ids } = result;
      if (status_code === 200) {
        const accountDetail = {
          title: "PAN already exists",
          message: "Sorry! this PAN is already registered with another account.",
          step: "STEP1",
        };
        setAuthIds(auth_ids);
        // setAccountMergeData(accountDetail);
        if (showPageDialog) {
          // setNavigateTo('pan-status');
          const newData = {
            buttonOneTitle: 'RE-ENTER PAN',
            buttonTwoTitle: 'LINK ACCOUNT',
            twoButton: true,
            status: 'linkAccount'
          }
          storageService().set('pan',pan);
          storageService().setObject(STORAGE_CONSTANTS.AUTH_IDS, auth_ids);
          internalStorage.setData('handleClickOne', reEnterPan);
          internalStorage.setData('handleClickTwo', handleMerge);
          navigate('pan-status',{state:{...accountDetail, ...newData}});
        } else { 
          setAccountMergeData({...accountDetail, buttonTitle:'LINK ACCOUNT' });
          setOpenAccountMerge(true);
        }
      } else if (different_login) {
        const accountDetail = {
          title: "PAN Is already registered",
          message: result?.message,
          step: "STEP2",
        };
        if (showPageDialog) {
          // setNavigateTo('pan-status');
          const newData = {
            buttonOneTitle: 'RE-ENTER PAN',
            buttonTwoTitle: 'SIGN OUT',
            twoButton: true,
            status: 'signOut'
          }
          storageService().set('pan',pan);
          internalStorage.setData('handleClickOne', reEnterPan);
          internalStorage.setData('handleClickTwo', handleMerge);
          navigate('pan-status',{state:{...accountDetail, ...newData}});
        } else { 
          setAccountMergeData({...accountDetail,buttonTitle:'SIGN OUT'});
          setOpenAccountMerge(true);
        }
      } else {
        toast(toastMessage);
      }
    }
  };

  const savePan = async (is_nri) => {
    try {
      if (is_nri) {
        kyc.address.meta_data.is_nri = true;
      } else {
        kyc.address.meta_data.is_nri = false;
      }
      let dob = kyc.pan.meta_data.dob;
      let oldObject = kyc.pan.meta_data;
      let newObject = Object.assign({}, oldObject);
      newObject.dob = dob;
      newObject.pan_number = pan;
      let body = {
        kyc: {
          pan: newObject,
          address: kyc.address.meta_data,
        },
      };

      const addkycType = kyc.kyc_status === "non-compliant" && !isDigilockerFlow(kyc);
      if(tradingEnabled) {
        body.set_kyc_product_type = "equity";
        if(addkycType && kyc.kyc_type !== "manual")
          body.set_kyc_type = "manual";
      } else {
        body.set_kyc_product_type = "mf";
        if(addkycType && kyc.kyc_type !== "init")
          body.set_kyc_type = "init";
      }

      let result = await kycSubmit(body);
      if (!result) return;
      if (result?.kyc?.kyc_status === "compliant") {
        setIsUserCompliant(true);
        if(result?.kyc?.kyc_type !== "init") {
          result = await kycSubmit({ kyc: {}, set_kyc_type: "init"})
        }
      } else {
        setIsUserCompliant(false);
      }
      handleNavigation(is_nri, result.kyc);
    } catch (err) {
      console.log(err);
      toast(err.message || genericErrorMessage);
    } finally {
      setOpenCheckCompliant(false);
    }
  };

  const handleNavigation = (is_nri, kycDetails) => {
    if (
      (isUserCompliant || kycDetails.kyc_status === "compliant") &&
      (homeData.kycConfirmPanScreen || isPremiumFlow)
    ) {
      sendEvents("next", "pan_entry")
      navigate(PATHNAME_MAPPER.compliantPersonalDetails1);
    } else {
      const kycProductType = storageService().get("kycStartPoint");
      if (isUserCompliant || kycDetails.kyc_status === "compliant") {
        if (is_nri) {
          if (!tradingEnabled && kycProductType === "stocks") {
            navigate(PATHNAME_MAPPER.nriError);
          } else {
            navigate(PATHNAME_MAPPER.journey);
          }
        } else {
          navigate(PATHNAME_MAPPER.journey);
        }
        sendEvents("next", "pan_entry")
      } else {
        // sendEvents(`${is_nri ? "no" : "yes"}`, "resident popup");
        if (is_nri) {
          if (!tradingEnabled && kycProductType === "stocks") {
            navigate(PATHNAME_MAPPER.nriError);
          } else {
            navigate(`${PATHNAME_MAPPER.journey}`, {
              searchParams: `${config.searchParams}&show_aadhaar=false`,
            });
          }
        } else {
          if (kycDetails?.application_status_v2 !== "init" && kycDetails?.kyc_type === "manual") {
            navigate(`${PATHNAME_MAPPER.journey}`, {
              searchParams: `${config.searchParams}&show_aadhaar=false`,
            });
          } else {
            navigate(`${PATHNAME_MAPPER.journey}`, {
              searchParams: `${config.searchParams}&show_aadhaar=true`,
            });
          }
        }
      }
    }
  };

  const handleConfirmPan = async () => {
    sendEvents("next", "confirm_pan");
    const skipApiCall = 
      pan === kyc?.pan?.meta_data?.pan_number &&
      kyc.address?.meta_data?.is_nri === !residentialStatus;
    setOpenConfirmPan(false);
    if (skipApiCall) {
      handleNavigation(
        kyc.address?.meta_data?.is_nri || false,
        kyc
      );
    } else {
      setOpenCheckCompliant(true);
      await savePan(!residentialStatus);
    }
  };

  const sendEvents = (userAction, screenName) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction,
        screen_name: screenName || "pan_entry",
      },
    };
    if (eventObj.properties.screen_name === "pan_entry") {
      eventObj.properties.resident_indian = residentialStatus ? "yes" : "no";
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  const handleClose = () => {
    sendEvents("edit_pan", "confirm_pan");
    setOpenConfirmPan(false);
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      skelton={isLoading}
      id="kyc-home"
      buttonTitle="CONTINUE"
      showLoader={showLoader}
      handleClick={handleClick}
      title={homeData.title}
      iframeRightContent={require(`assets/${config.productName}/kyc_illust.svg`)}
      data-aid='kyc-home-screen'
    >
      {!isEmpty(homeData) && (
        <div className="kyc-home" data-aid='kyc-home-screen-page'>
          <div className="kyc-main-subtitle" data-aid='kyc-main-subtitle'>{homeData.subtitle}</div>
          <main data-aid='kyc-home'>
            <Input
              label="Enter PAN"
              class="input"
              value={pan.toUpperCase()}
              error={panError ? true : false}
              helperText={panError || ""}
              onChange={handleChange}
              minLenth={10}
              maxLength={10}
              type="text"
              disabled={!!showLoader}
              autoFocus
            />
            <div className={`input ${showLoader && `disabled`}`}>
              <RadioWithoutIcon
                width="40"
                label="Are you an Indian resident?"
                options={residentialStatusOptions}
                value={residentialStatus}
                onChange={handleResidentialStatus}
                disabled={showLoader || disableResidentialStatus}
                disabledWithValue={disableResidentialStatus}
              />
            </div>
          </main>
          <ConfirmPan
            isOpen={openConfirmPan}
            name={userName}
            pan={pan}
            close={handleClose}
            handleClick={handleConfirmPan}
          />
          <CheckCompliant isOpen={openCheckCompliant} />
          <AccountMerge
            isOpen={openAccountMerge}
            close={closeAccountMerge}
            data={accountMergeData}
            handleClick={handleMerge}
          />
        </div>
      )}
    </Container>
  );
};

export default Home;
