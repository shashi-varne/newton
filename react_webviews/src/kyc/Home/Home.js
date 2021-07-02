import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService, validatePan } from "utils/validators";
import Input from "../../common/ui/Input";
import { checkMerge, getPan, kycSubmit } from "../common/api";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import toast from "../../common/ui/Toast";
import ResidentDialog from "../mini-components/residentDialog";
import Alert from "../mini-components/Alert";
import AccountMerge from "../mini-components/AccountMerge";
import { getConfig, isNewIframeDesktopLayout, navigate as navigateFunc } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import internalStorage from './InternalStorage';
import isEmpty from 'lodash/isEmpty';

const config = getConfig();
const showPageDialog = isNewIframeDesktopLayout();
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
  const { kyc, user, isLoading } = useUserKycHook();
  const [userName, setUserName] = useState('');
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
    if(isEmpty(savedPan)){
      setPan(kyc.pan?.meta_data?.pan_number || "");
    } else{
      storageService().remove('pan');
    }
    let data = {
      investType: "mutual fund",
      npsDetailsRequired: false,
      title: "Check if you’re investment ready",
      subtitle: "PAN is mandatory for investing in Mutual Funds",
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
      if (!isStartKyc) {
        sendEvents("next")
        if (skipApiCall) {
          setIsStartKyc(true);
          setUserName(kyc?.pan?.meta_data?.name)
          if (kyc?.kyc_status === "compliant") {
            setIsUserCompliant(true);
            setButtonTitle("CONTINUE");
          } else {
            setButtonTitle("START KYC");
            setIsUserCompliant(false);
          }
          return;
        }
        await checkCompliant();
      } else if (!isUserCompliant) {
        if(showPageDialog) {
          const residentData = {
            title: "Residence Status",
            message: 'Are you an Indian resident?',
            buttonOneTitle: 'NO',
            buttonTwoTitle: 'YES',
            twoButton: true
          }
          internalStorage.setData('isApiCall', true);
          internalStorage.setData('handleClickOne', cancel);
          internalStorage.setData('handleClickTwo', aadharKyc);
          navigate('residence-status',{state:residentData});
        } else {
          setOpenResident(true);
        }
      }
      else {
        if (skipApiCall) {
          handleNavigation(
            kyc.address?.meta_data?.is_nri || false,
            kyc?.kyc_status
          );
        }
        savePan(kyc.address?.meta_data?.is_nri || false);
      }
    } catch (err) {
      toast(err.message || genericErrorMessage);
    }
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
      if (isEmpty(result)) return;
        setUserName(result.kyc.name);
        setIsStartKyc(true);
      if (result?.kyc?.status) {
        setIsUserCompliant(true);
        setButtonTitle("CONTINUE");
      } else {
        setButtonTitle("START KYC");
        setIsUserCompliant(false);
      }
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
      let { different_login, auth_ids} = result;
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
    // sendEvents(`${is_nri ? "no" : "yes"}`,'resident popup')
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
      handleNavigation(is_nri, result.kyc.kyc_status);
    } catch (err) {
      console.log(err);
      toast(err.message || genericErrorMessage);
    } finally {
      setShowLoader(false);
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
      if (isUserCompliant || kyc_status === "compliant") {
        sendEvents("next", "pan_entry")
        navigate(PATHNAME_MAPPER.journey);
      } else {
        sendEvents(`${is_nri ? "no" : "yes"}`,'resident popup')
        if (is_nri) {
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
  return (
    <Container
      events={sendEvents("just_set_events")}
      skelton={isLoading}
      id="kyc-home"
      buttonTitle={buttonTitle}
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
          {/* {
            (x || openAccountMerge)  &&
            <DialogPageContainer 
              isOpen={openAccountMerge}
              close={closeAccountMerge}
              data={accountMergeData}
              handleClick={handleMerge}
              component={AccountMerge}
              isDialog={isDialog}
              navigateTo={navigateTo}
              {...props}
            />
          } */}
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
