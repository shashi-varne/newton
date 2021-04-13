import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService, validatePan } from "utils/validators";
import Input from "common/ui/Input";
import { checkMerge, getPan, logout, kycSubmit } from "../common/api";
import { getPathname, storageConstants } from "../constants";
import toast from "common/ui/Toast";
import ResidentDialog from "./residentDialog";
import Alert from "../mini_components/Alert";
import { navigate as navigateFunc } from "../common/functions";
import AccountMerge from "../mini_components/AccountMerge";
// import DialogPageContainer from "../mini_components/DialogPageContainer";
import { getConfig, isIframe } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import isEmpty from 'lodash/isEmpty';
import internalStorage from './InternalStorage';

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
  const iFrame = isIframe();
  let config = getConfig();
  // const [navigateTo, setNavigateTo] = useState('');
  // const [x,setX] = useState(false);

  const savedPan = storageService().get('pan');
  useEffect(() => {
    setPan(savedPan);
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

      if (!validatePan(pan)) {
        setPanError("Invalid PAN number");
        return;
      }

      const skipApiCall = pan === kyc?.pan?.meta_data?.pan_number;
      if (!isStartKyc) {
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
        if(iFrame) {
          const residentData = {
            title: 'Are you an Indian resident?',
            buttonOneTitle: 'NO',
            buttonTwoTitle: 'YES',
            twoButton: true
          }
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
    let value = event.target ? event.target.value.trim() : event;
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
      if (getConfig().Web) {
        let result = await logout();
        if (!result) return;
        navigate("/login");
      } else {
        // callbackWeb.logout();
      }
    }
  };

  const reEnterPan = () => {
    navigate('home');
  }

  const accountMerge = async () => {
    
    let email = config.partner.email;
    let name = "fisdom";
    if (config.productName === "finity") name = "finity";
    const toastMessage = `The PAN is already associated with another ${name} account. Kindly send mail to ${email} for any clarification`;
    if (config.isIframe && false) {
      toast(toastMessage);
    } else {
      let response = await checkMerge(pan.toUpperCase());
      if (!response) return;
      let { result, status_code } = response;
      let { different_login, auth_ids} = result;
      if (status_code !== 200) {
        const accountDetail = {
          title: "PAN Already Exists",
          message: "Sorry! this PAN is already registered with another account.",
          step: "STEP1",
        };
        setAuthIds(auth_ids);
        // setAccountMergeData(accountDetail);
        if (iFrame) {
          // setNavigateTo('pan-status');
          const newData = {
            buttonOneTitle: 'RE-ENTER PAN',
            buttonTwoTitle: 'LINK ACCOUNT',
            twoButton: true,
            status: 'linkAccount'
          }
          storageService().set('pan',pan);
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
        if (iFrame) {
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
      navigate(getPathname.compliantPersonalDetails1);
    } else {
      if (isUserCompliant || kyc_status === "compliant") {
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
  };

  return (
    <Container
      skelton={isLoading}
      id="kyc-home"
      buttonTitle={buttonTitle}
      showLoader={showLoader}
      handleClick={handleClick}
      title={homeData.title}
      iframeRightContent={require(`assets/${config.productName}/kyc_illust.svg`)}
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
              maxLength={11}
              type="text"
              disabled={showLoader}
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
