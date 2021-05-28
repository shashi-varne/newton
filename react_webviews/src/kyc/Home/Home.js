import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService, validatePan, isEmpty } from "utils/validators";
import Input from "../../common/ui/Input";
import { checkMerge, getPan, kycSubmit } from "../common/api";
import { getPathname, storageConstants } from "../constants";
import toast from "../../common/ui/Toast";
import { navigate as navigateFunc } from "../common/functions";
import AccountMerge from "../mini-components/AccountMerge";
import { getConfig, isTradingEnabled } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { ConfirmPan } from "../Equity/mini-components/ConfirmPan";
import CheckCompliant from "../Equity/mini-components/CheckCompliant";

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

const TRADING_ENABLED = isTradingEnabled();

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
  const config = getConfig();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = () => {
    setPan(kyc.pan?.meta_data?.pan_number || "");
    setResidentialStatus(!kyc.address?.meta_data?.is_nri);
    let data = {
      investType: "mutual fund",
      npsDetailsRequired: false,
      title: "Verify PAN",
      subtitle:
        "As per SEBI, valid PAN is mandatory to open a trading & demat account",
      kycConfirmPanScreen: false,
    };
    if (
      user.nps_investment &&
      storageService().getObject("nps_additional_details_required")
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
      // if (!isStartKyc) {
      if (skipApiCall) {
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
      // }
    } catch (err) {
      toast(err.message || genericErrorMessage);
    }
  };

  const checkPanValidity = async (showConfirmPan = false) => {
    // setOpenCheckCompliant(true);
    let body = {
      kyc: {
        pan_number: pan.toUpperCase(),
      }
    };

    if(TRADING_ENABLED) {
      body.kyc_product_type = "equity"
    };

    try {
      let result = await getPan(body, accountMerge);
      if (isEmpty(result)) return;
      setUserName(result.kyc.name);
      setIsStartKyc(true);
      // if (result?.kyc?.status) {
      //   setIsUserCompliant(true);
      // } else {
      //   setIsUserCompliant(false);
      // }
      if (showConfirmPan) setOpenConfirmPan(true);
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      // setOpenCheckCompliant(false);
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
    setResidentialStatus(residentialStatusOptions[value].value);
  };

  const closeAccountMerge = () => {
    setOpenAccountMerge(false);
  };

  const handleMerge = async (step) => {
    if (step === "STEP1") {
      storageService().setObject(storageConstants.AUTH_IDS, authIds);
      navigate(`${getPathname.accountMerge}${pan.toUpperCase()}`);
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
      let { different_login, auth_ids } = result;
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
    try {
      // setShowLoader("button");
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

      if(TRADING_ENABLED) {
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
      // setShowLoader(false);
    }
  };

  const handleNavigation = (is_nri, kyc_status) => {
    if (
      (isUserCompliant || kyc_status === "compliant") &&
      (homeData.kycConfirmPanScreen || isPremiumFlow)
    ) {
      navigate(getPathname.compliantPersonalDetails1);
    } else {
      if (isUserCompliant || kyc_status === "compliant") {
        navigate(getPathname.journey);
      } else {
        if (is_nri) {
          if (!TRADING_ENABLED) {
            navigate(`${getPathname.journey}`, {
              searchParams: `${config.searchParams}&show_aadhaar=false`,
            });
          } else {
            navigate(getPathname.nriError);
          }
        } else {
          navigate(`${getPathname.journey}`, {
            searchParams: `${config.searchParams}&show_aadhaar=true`,
          });
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

  return (
    <Container
      skelton={isLoading}
      id="kyc-home"
      buttonTitle="CONTINUE"
      showLoader={showLoader}
      handleClick={handleClick}
      title={homeData.title}
    >
      {!isEmpty(homeData) && (
        <div className="kyc-home">
          <div className="kyc-main-subtitle">{homeData.subtitle}</div>
          <main>
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
                // id="account_type"
                value={residentialStatus}
                onChange={handleResidentialStatus}
                disabled={showLoader}
              />
            </div>
          </main>
          <ConfirmPan
            isOpen={openConfirmPan}
            name={userName}
            pan={pan}
            close={() => setOpenConfirmPan(false)}
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
