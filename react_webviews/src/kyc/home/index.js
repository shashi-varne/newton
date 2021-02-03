import React, { useState } from "react";
import Container from "../common/Container";
import { storageService, validatePan } from "utils/validators";
import Input from "common/ui/Input";
import { getPan, savePanData } from "../common/api";
import { storageConstants } from "../constants";
import toast from "common/ui/Toast";
import ResidentDialog from "./residentDialog";

const Home = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("CHECK STATUS");
  const [isStartKyc, setIsStartKyc] = useState(false);
  const [isUserCompliant, setIsUserCompliant] = useState();
  const [pan, setPan] = useState("");
  const [panError, setPanError] = useState("");
  const [openResident, setOpenResident] = useState(false);

  let currentUser = storageService().getObject(storageConstants.USER);
  let npsDetailsRequired = false;
  let investType = "mutual fund";
  let title = "Are you investment ready?";
  let subtitle = "We need your PAN to check if you’re investment ready";
  let kycConfirmPanScreen = false;

  if (
    currentUser.nps_investment &&
    storageService().getObject("nps_additional_details_required")
  ) {
    npsDetailsRequired = true;
  }
  let stateParams = props.match.state || {};
  let isPremiumFlow = stateParams.isPremiumFlow || false;
  if (stateParams.isEdit) {
    if (npsDetailsRequired) {
      title = "Change PAN";
      subtitle = "Enter PAN to complete your NPS investment";
    } else if (isPremiumFlow) {
      title = "Edit PAN";
      subtitle = "PAN is required for premium onboarding";
    } else {
      title = "Change PAN";
      subtitle = "Change your PAN and check if you’re investment ready";
    }
  } else if (npsDetailsRequired) {
    title = "NPS investment pending!";
    subtitle = "Enter PAN to complete your NPS investment";
  }

  if (npsDetailsRequired) investType = "nps";
  let userName = "";

  let renderData = {
    incomplete: {
      bgColor: "#fff5f6",
      icon: "error_icon.svg",
      title: "KYC is incomplete!",
      subtitle:
        "As per Govt norm. you need to do a one-time registration process to complete KYC.",
    },
    success: {
      bgColor: "#f9fff1",
      icon: "success_icon.svg",
      title: "Hey ",
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
  };

  const checkCompliant = async () => {
    setIsApiRunning(true);
    try {
      let result = await getPan({
        kyc: {
          pan_number: pan.toUpperCase(),
        },
      });
      if (!result) return;
      setIsStartKyc(true);
      if (result.kyc.status) {
        userName = result.kyc.name;
        setIsUserCompliant(true);
        setButtonTitle("CONTINUE");
      } else {
        setButtonTitle("START KYC");
        setIsUserCompliant(false);
      }
    } catch (err) {
      toast(err || genericErrorMessage);
    } finally {
      setIsApiRunning(false);
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

  const savePan = async (is_nri) => {
    try {
      let result = await savePanData({ is_nri: is_nri });
      if (!result) return;
      currentUser.name = result.kyc.pan.meta_data.name;
      if (
        (isUserCompliant || result.kyc.kyc_status === "compliant") &&
        (kycConfirmPanScreen || isPremiumFlow)
      ) {
        // $state.go("kyc-compliant-personal-details");
      } else {
        if (isUserCompliant || result.kyc.kyc_status === "compliant") {
          // $state.go("kyc-journey");
        } else {
          if (is_nri) {
            // $state.go("kyc-journey", { show_aadhaar: false });
          } else {
            // $state.go("kyc-journey", { show_aadhaar: true });
          }
        }
      }
    } catch (err) {
      console.log(err);
      toast(err || genericErrorMessage);
    } finally {
      setIsApiRunning(false);
    }
  };

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-home"
      buttonTitle={buttonTitle}
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-home">
        <div className="kyc-main-title">{title}</div>
        <div className="kyc-main-subtitle">{subtitle}</div>
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
          />
          {isStartKyc && isUserCompliant && (
            <div
              className="status-info"
              style={{ backgroundColor: renderData.success.bgColor }}
            >
              <img src={require(`assets/${renderData.success.icon}`)} alt="" />
              <div className="text">
                <div className="title">
                  {renderData.success.title}
                  {userName}
                </div>
                <div>{renderData.success.subtitle}</div>
              </div>
            </div>
          )}
          {isStartKyc && !isUserCompliant && (
            <div
              className="status-info"
              style={{ backgroundColor: renderData.incomplete.bgColor }}
            >
              <img
                src={require(`assets/${renderData.incomplete.icon}`)}
                alt=""
              />
              <div className="text">
                <div className="title">{renderData.incomplete.title}</div>
                <div>{renderData.incomplete.subtitle}</div>
              </div>
            </div>
          )}
        </main>
        <ResidentDialog
          open={openResident}
          close={closeResident}
          cancel={cancel}
          aadhaarKyc={aadharKyc}
        />
      </div>
    </Container>
  );
};

export default Home;
