import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService, validatePan, isEmpty } from "utils/validators";
import Input from "../../common/ui/Input";
import { checkMerge, getPan, kycSubmit } from "../common/api";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import toast from "../../common/ui/Toast";
import AccountMerge from "../mini-components/AccountMerge";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";

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
const Home = (props) => {
  const navigate = navigateFunc.bind(props);
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("CHECK STATUS");
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
  const [tradingEnabled, setTradingEnabled] = useState()

  const isTradingEnabled = (isIndian) => {
    return !config.isSdk && isIndian
  }

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = () => {
    setPan(kyc.pan?.meta_data?.pan_number || "");
    setResidentialStatus(!kyc.address?.meta_data?.is_nri);
    setTradingEnabled(isTradingEnabled(!kyc.address?.meta_data?.is_nri));
    let data = {
      investType: "mutual fund",
      npsDetailsRequired: false,
      title: "Are you investment ready?",
      subtitle: "We need your PAN to check if you’re investment ready",
      kycConfirmPanScreen: false,
    };
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

  const renderData = {
    incomplete: {
      title: "KYC is incomplete!",
      subtitle:
        "As per Govt norm. you need to do a one-time registration process to complete KYC.",
    },
    success: {
      title: `Hey ${userName},`,
      subtitle: "You’re investment ready and eligible for premium onboarding.",
    },
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
      if (skipApiCall || isStartKyc) {
        setIsStartKyc(true);
        setUserName(kyc?.pan?.meta_data?.name);
        if (kyc?.kyc_status === "compliant") {
          setIsUserCompliant(true);
        } else {
          setIsUserCompliant(false);
        }
        savePan(kyc.address?.meta_data?.is_nri || false);
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
      throw new Error(err.message);
    } finally {
      setShowLoader(false);
    }
  };

  const handleChange = (event) => {
    let target = event.target;
    let value = target ? target.value.trim() : event;
    let limit = target?.maxLength;

    // added event listener to remove the character after limit is reached
    if (value.length > limit) {
      return
    }  
     
    setPan(value);
    if (value) setPanError("");
    else setPanError("This is required");
    if (isStartKyc) {
      setIsStartKyc(false);
      setButtonTitle("CHECK STATUS");
    }
  };

  const handleResidentialStatus = (event) => {
    let value = event.target ? event.target.value : event;
    setTradingEnabled(isTradingEnabled(value !== 1))
    setResidentialStatus(residentialStatusOptions[value].value);
  };

  const closeAccountMerge = () => {
    setOpenAccountMerge(false);
  };

  const handleMerge = async (step) => {
    if (step === "STEP1") {
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

  const accountMerge = async () => {
    let config = getConfig();
    let email = config.email;
    let name = "fisdom";
    if (config.productName === "finity") name = "finity";
    const toastMessage = `The PAN is already associated with another ${name} account. Kindly send mail to ${email} for any clarification`;
    if (config.isIframe) {
      toast(toastMessage);
    } else {
      let response = await checkMerge(pan.toUpperCase());
      if (!response) return;
      let { result, status_code } = response;
      let { different_login, auth_ids} = result;
      if (status_code === 200) {
        setAuthIds(auth_ids);
        setAccountMergeData({
          title: "PAN Already Exists",
          subtitle:
            "Sorry! this PAN is already registered with another account.",
          buttonTitle: "LINK ACCOUNT",
          step: "STEP1",
        });
        setOpenAccountMerge(true);
      } else if (different_login) {
        setAccountMergeData({
          title: "PAN Is already registered",
          subtitle: result?.message,
          buttonTitle: "SIGN OUT",
          step: "STEP2",
        });
        setOpenAccountMerge(true);
      } else {
        toast(toastMessage);
      }
    }
  };

  const savePan = async (is_nri) => {
    // sendEvents(`${is_nri ? "no" : "yes"}`,'resident popup')
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

      if(tradingEnabled) {
        body.set_kyc_product_type = "equity";
      }

      let result = await kycSubmit(body);
      if (!result) return;
      if (result?.kyc?.kyc_status === "compliant") {
        setIsUserCompliant(true);
      } else {
        setIsUserCompliant(false);
      }
      handleNavigation(is_nri, result.kyc.kyc_status);
    } catch (err) {
      console.log(err);
      toast(err.message || genericErrorMessage);
    } finally {
      setOpenCheckCompliant(false);
    }
  };

  const handleNavigation = (is_nri, kyc_status) => {
    if (
      (isUserCompliant || kyc_status === "compliant") &&
      (homeData.kycConfirmPanScreen || isPremiumFlow)
    ) {
      sendEvents("next", "pan_entry")
      navigate(PATHNAME_MAPPER.compliantPersonalDetails1);
    } else {
      const kycProductType = storageService().get("kycStartPoint");
      if (isUserCompliant || kyc_status === "compliant") {
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
        sendEvents(`${is_nri ? "no" : "yes"}`,'resident popup')
        if (is_nri) {
          if (!tradingEnabled && kycProductType === "stocks") {
            navigate(PATHNAME_MAPPER.nriError);
          } else {
            navigate(`${PATHNAME_MAPPER.journey}`, {
              searchParams: `${config.searchParams}&show_aadhaar=false`,
            });
          }
        } else {
          if (kyc?.application_status_v2 !== "init" && kyc?.kyc_type === "manual") {
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
    const skipApiCall =
      pan === kyc?.pan?.meta_data?.pan_number &&
      kyc.address?.meta_data?.is_nri === !residentialStatus;
    setOpenConfirmPan(false);
    if (skipApiCall) {
      handleNavigation(
        kyc.address?.meta_data?.is_nri || false,
        kyc?.kyc_status
      );
    } else {
      setOpenCheckCompliant(true);
      await savePan(!residentialStatus);
    }
  };

  const sendEvents = (userAction, screenName) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction,
        "screen_name": screenName || "pan_check",
        "pan": pan ? "yes" : "no",
        "initial_kyc_status": kyc?.initial_kyc_status || ""
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  console.log("trading enabled ",tradingEnabled)
  return (
    <Container
      events={sendEvents("just_set_events")}
      skelton={isLoading}
      id="kyc-home"
      buttonTitle={buttonTitle}
      showLoader={showLoader}
      handleClick={handleClick}
      title={homeData.title}
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
              disabled={showLoader}
              autoFocus
            />
            <div className={`input ${showLoader && `disabled`}`}>
              <RadioWithoutIcon
                width="40"
                label="Are you an Indian resident?"
                options={residentialStatusOptions}
                value={residentialStatus}
                onChange={handleResidentialStatus}
                disabled={showLoader}
              />
            </div>
          </main>
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
