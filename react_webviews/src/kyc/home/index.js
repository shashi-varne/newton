import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService, validatePan, isEmpty } from "utils/validators";
import Input from "common/ui/Input";
import { checkMerge, getPan, logout, kycSubmit } from "../common/api";
import { getPathname, storageConstants } from "../constants";
import toast from "common/ui/Toast";
import ResidentDialog from "./residentDialog";
import Alert from "../mini_components/Alert";
import { navigate as navigateFunc } from "../common/functions";
import AccountMerge from "../mini_components/AccountMerge";
import { getConfig } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";

const Home = (props) => {
  const navigate = navigateFunc.bind(props);
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("CHECK STATUS");
  const [isStartKyc, setIsStartKyc] = useState(false);
  const [isUserCompliant, setIsUserCompliant] = useState();
  const [pan, setPan] = useState("");
  const [panError, setPanError] = useState("");
  const [openResident, setOpenResident] = useState(false);
  const [openAccountMerge, setOpenAccountMerge] = useState(false);
  const [homeData, setHomeData] = useState({});
  const [accountMergeData, setAccountMergeData] = useState({});
  const [authIds, setAuthIds] = useState({});
  const stateParams = props.match.state || {};
  const isPremiumFlow = stateParams.isPremiumFlow || false;

  const [kyc, user, isLoading] = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = () => {
    setPan(kyc.pan?.meta_data?.pan_number || "");
    let data = {
      investType: "mutual fund",
      npsDetailsRequired: false,
      title: "Are you investment ready?",
      subtitle: "We need your PAN to check if you’re investment ready",
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

  const renderData = {
    incomplete: {
      title: "KYC is incomplete!",
      subtitle:
        "As per Govt norm. you need to do a one-time registration process to complete KYC.",
    },
    success: {
      title: `Hey ${user.name},`,
      subtitle: "You’re investment ready and eligible for premium onboarding.",
    },
  };

  const handleClick = () => {
    if (pan.length !== 10) {
      setPanError("Minimum length is 10");
      return;
    }

    if (!validatePan(pan)) {
      setPanError("Invalid PAN number");
      return;
    }

    if (!isStartKyc) checkCompliant();
    else if (!isUserCompliant) setOpenResident(true);
    else savePan(kyc.address?.meta_data?.is_nri || false);
  };

  const checkCompliant = async () => {
    setShowLoader("button");
    try {
      let result = await getPan(
        {
          kyc: {
            pan_number: pan.toUpperCase(),
          },
        },
        accountMerge
      );
      if (!result) return;
      setIsStartKyc(true);
      if (result.kyc.status) {
        setIsUserCompliant(true);
        setButtonTitle("CONTINUE");
      } else {
        setButtonTitle("START KYC");
        setIsUserCompliant(false);
      }
    } catch (err) {
      toast(err.message || genericErrorMessage);
    } finally {
      setShowLoader(false);
    }
  };

  const handleChange = (event) => {
    let value = event.target ? event.target.value : event;
    setPan(value);
    if (value) setPanError("");
    else setPanError("This is required");
    if (isStartKyc) {
      setIsStartKyc(false);
      setButtonTitle("CHECK STATUS");
    }
  };

  const closeResident = () => {
    setOpenResident(false);
  };

  const cancel = () => {
    setOpenResident(false);
    savePan(true);
  };

  const aadharKyc = () => {
    setOpenResident(false);
    savePan(false);
  };

  const closeAccountMerge = () => {
    setOpenAccountMerge(false);
  };

  const handleMerge = async (step) => {
    if (step === "STEP1") {
      storageService().setObject(storageConstants.AUTH_IDS, authIds);
      navigate(`${getPathname.accountMerge}${pan.toUpperCase()}`);
    } else {
      if (getConfig().web) {
        let result = await logout();
        if (!result) return;
        navigate("/login");
        // $state.go('logout')
      } else {
        // callbackWeb.logout();
      }
    }
  };

  const accountMerge = async () => {
    let config = getConfig();
    let email = config.partner.email;
    let name = "fisdom";
    if (config.productName === "finity") name = "finity";
    const message = `The PAN is already associated with another ${name} account. Kindly send mail to ${email} for any clarification`;
    if (config.isIframe) {
      toast(message);
    } else {
      let response = await checkMerge(pan.toUpperCase());
      if (!response) return;
      let { result, status_code } = response;
      if (status_code === 200) {
        setAuthIds(result.auth_ids);
        setAccountMergeData({
          title: "PAN Already Exists",
          subtitle:
            "Sorry! this PAN is already registered with another account.",
          buttonTitle: "LINK ACCOUNT",
          step: "STEP1",
        });
        setOpenAccountMerge(true);
      } else {
        if (result.different_login) {
          setAccountMergeData({
            title: "PAN Is already registered",
            subtitle: result.error,
            buttonTitle: "SIGN OUT",
            step: "STEP2",
          });
          setOpenAccountMerge(true);
        } else {
          toast(message);
        }
      }
    }
  };

  const savePan = async (is_nri) => {
    try {
      setShowLoader("button");
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
      let result = await kycSubmit(body);
      if (!result) return;
      user.name = result.kyc.pan.meta_data.name;
      if (
        (isUserCompliant || result.kyc.kyc_status === "compliant") &&
        (homeData.kycConfirmPanScreen || isPremiumFlow)
      ) {
        navigate(getPathname.compliantPersonalDetails1);
      } else {
        if (isUserCompliant || result.kyc.kyc_status === "compliant") {
          navigate(getPathname.journey);
        } else {
          if (is_nri) {
            navigate(`${getPathname.journey}`, {
              searchParams: `${getConfig().searchParams}&show_aadhaar=false`,
            });
          } else {
            navigate(`${getPathname.journey}`, {
              searchParams: `${getConfig().searchParams}&show_aadhaar=true`,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
      toast(err.message || genericErrorMessage);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Container
      skelton={isLoading}
      id="kyc-home"
      buttonTitle={buttonTitle}
      showLoader={showLoader}
      // disable={isApiRunning || isLoading}
      handleClick={handleClick}
      title={homeData.title}
    >
      {!isEmpty(homeData) && (
        <div className="kyc-home">
          {/* <div className="kyc-main-title">{homeData.title}</div> */}
          <div className="kyc-main-subtitle">{homeData.subtitle}</div>
          <main>
            <Input
              label="Enter PAN"
              class="input"
              value={pan}
              error={panError ? true : false}
              helperText={panError || ""}
              onChange={handleChange}
              maxLength={10}
              type="text"
              disabled={showLoader}
            />
            {isStartKyc && isUserCompliant && (
              <Alert
                variant="success"
                message={renderData.success.subtitle}
                title={renderData.success.title}
              />
            )}
            {isStartKyc && !isUserCompliant && (
              <Alert
                variant="danger"
                message={renderData.incomplete.subtitle}
                title={renderData.incomplete.title}
              />
            )}
          </main>
          <ResidentDialog
            open={openResident}
            close={closeResident}
            cancel={cancel}
            aadhaarKyc={aadharKyc}
          />
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
