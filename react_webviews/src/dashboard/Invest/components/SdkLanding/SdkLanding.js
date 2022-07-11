import React, { Fragment, useEffect, useState } from "react";
import Container from "../../../common/Container";
import SebiRegistrationFooter from "../../../../common/ui/SebiRegistrationFooter/WVSebiRegistrationFooter";
import LandingBottomSheets from "../../mini-components/LandingBottomSheets";
import SdkInvestCard from "../../mini-components/SdkInvestCard";
import TermsAndConditions from "../../mini-components/TermsAndConditionsDialog";
import BankListOptions from "../../mini-components/BankListOptions";
import {
  getConfig,
  navigate as navigateFunc,
} from "../../../../utils/functions";
import isEmpty from "lodash/isEmpty";
import { nativeCallback } from "../../../../utils/native_callback";
import {
  initialize,
  openKyc,
  handleCampaign,
  handleKycPremiumLanding,
  closeCampaignDialog,
  getRecommendationsAndNavigate,
  openBfdlBanner,
  getKycData,
  getSdkLandingCardsData,
  updateBank,
  updateConsent,
  dateValidation,
  handleKycAndCampaign,
  validateFeature,
} from "../../functions";
import toast from "../../../../common/ui/Toast";
import { Imgc } from "../../../../common/ui/Imgc";
import { SkeltonRect } from "../../../../common/ui/Skelton";
import useUserKycHook from "../../../../kyc/common/hooks/userKycHook";
import { storageService } from "../../../../utils/validators";
import "./SdkLanding.scss";
import { applyReferralCode } from "../../common/api";

const screenName = "sdkLanding";

const PATHNAME_MAPPER = {
  nfo: "/advanced-investing/new-fund-offers/info",
  diy: "/invest/explore-v2",
  buildwealth: "/invest/buildwealth",
  instaredeem: "/invest/instaredeem",
  mf: "/invest",
  elss: "/invest/savetax",
  ipo: "/market-products",
  taxFiling: "/tax-filing"
};

const CARD_NAME_MAPPER = {
  portfolio: "Portfolio",
  withdraw: "short_term",
  account: "Account",
  refer: "refer&earn",
  help: "help&support",
  gold: "gold card",
  "100_sip": "SIP 100",
};
const SdkLanding = (props) => {
  const navigate = navigateFunc.bind(props);
  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
    kycStatusLoader: false,
    dotLoader: false,
  });
  const [modalData, setModalData] = useState({});
  const [baseConfig, setBaseConfig] = useState(getConfig());
  const [campaignData, setCampaignData] = useState({});
  const [dialogStates, setDialogStates] = useState({
    openCampaignDialog: false,
    openKycStatusDialog: false,
    openKycPremiumLanding: false,
    openBfdlBanner: false,
    showBankList: false,
    showTermsAndConditions: false,
  });
  const [referral, setReferral] = useState("");
  const [bankData, setBankData] = useState({});
  const [landingCardsData, setLandingCardsData] = useState([]);
  const { user, kyc, updateKyc, updateUser } = useUserKycHook();
  const [kycData, setKycData] = useState(getKycData(kyc, user));

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    const data = getKycData(kyc, user);
    setKycData(data);
    const cardsData = getSdkLandingCardsData({ user, kyc });
    setLandingCardsData(cardsData);
  }, [kyc, user]);

  const handleDialogStates = (dialogStatus, dialogData) => {
    setDialogStates({ ...dialogStates, ...dialogStatus });
    if (!isEmpty(dialogData)) {
      setModalData(dialogData);
    }
  };

  const onLoad = async () => {
    const cardsData = getSdkLandingCardsData({ user, kyc });
    setLandingCardsData(cardsData);
    const data = await initialize({
      screenName,
      kyc,
      user,
      handleSummaryData,
      handleLoader,
    });
    const config = getConfig();
    setBaseConfig(config);
    handleKycAndCampaign({
      screenName,
      kyc: data.kyc,
      user: data.user,
      isWeb: config.Web,
      partnerCode: config.code,
      setKycData,
      setCampaignData,
      handleDialogStates,
    });
    const consentRequired = storageService().getBoolean("consent_required");
    if (consentRequired && config.code === "lvb") {
      handleDialogStates({ showTermsAndConditions: true });
    }
    handleBankList();
    if (config.isSdk && config.Android) {
      nativeCallback({ action: "get_data" });
    }
    openBfdlBanner(handleDialogStates);
  };

  const handleBankList = () => {
    const bankList = storageService().getObject("banklist");
    if (!isEmpty(bankList)) {
      let bankListOptions = [];
      bankList.forEach((data) => {
        bankListOptions.push({
          value: data.account_number,
          name: data.account_number,
        });
      });
      setBankData({ bankList, bankListOptions });
      handleDialogStates({ showBankList: true });
    }
  };

  const changeSelectedBank = (event) => {
    const value = event.target.value;
    setBankData({ ...bankData, selectedBank: value, bankListErrorMessage: "" });
  };

  const handleBankListOptions = async () => {
    let { selectedBank, bankList } = bankData;
    if (selectedBank) {
      bankList = bankList.map((data) => {
        if (data.account_number === selectedBank) {
          data.is_primary = "true";
        }
        return data;
      });
      setLoaderData({ showBankListLoader: "button" });
      try {
        const result = await updateBank({ bank_list: bankList });
        toast(result.status);
        storageService().set("banklist", false);
      } catch (err) {
        toast(err.message);
      } finally {
        setLoaderData({ showBankListLoader: false });
        handleDialogStates({ showBankList: false });
      }
    } else {
      setBankData({ ...bankData, bankListErrorMessage: "Please select bank" });
    }
  };

  const handleTermsAndConditions = async () => {
    try {
      setLoaderData({ showTermsAndConditionsLoader: "button" });
      await updateConsent();
      storageService().setBoolean("consent_required", false);
    } catch (err) {
      toast(err.message);
    } finally {
      setLoaderData({ showTermsAndConditionsLoader: false });
      handleDialogStates({ showTermsAndConditions: false });
    }
  };

  const handleMarketingBanner = (bannerType = "", actionUrl) => () => {
    sendEvents("marketing_banner_clicked", bannerType);
    if (actionUrl) {
      nativeCallback({
        action: "open_in_browser",
        message: {
          url: actionUrl,
        },
      })
      return;
    }
    if (bannerType === "100_sip") {
      getRecommendationsAndNavigate({ amount: 100, navigate, handleLoader });
    } else {
      const path = PATHNAME_MAPPER[bannerType] || "/";
      navigate(path);
    }
  };

  const handleRefferalInput = (e) => {
    const value = e.target.value;
    setReferral(value);
  };

  const handleReferral = async () => {
    try {
      handleLoader({ dotLoader: true });
      const result = await applyReferralCode(referral);
      const data = {
        ...kyc,
        equity_enabled: result.is_equity_enabled
      }
      updateKyc(data);
      toast("You have applied referral code successfully", "success");
    } catch (err) {
      toast(err, "error");
    } finally {
      handleLoader({ dotLoader: false });
    }
  };

  const handleLoader = (data) => {
    setLoaderData({ ...loaderData, ...data });
  };

  const closeBottomSheet = (bottomSheetKey, eventName) => () => {
    if (!isEmpty(eventName)) {
      sendEvents("back", eventName);
    }
    handleDialogStates({
      [bottomSheetKey]: false,
    });
  };

  const closeKycStatusDialog = () => {
    sendEvents("dismiss", "kyc_bottom_sheet");
    handleDialogStates({
      openKycStatusDialog: false,
    });
  };

  const handleSummaryData = (data) => {
    updateKyc(data.kyc);
    updateUser(data.user);
  };

  const handleKycStatus = () => {
    sendEvents("next", "kyc_bottom_sheet");
    if (modalData.nextState) {
      navigate(modalData.nextState);
    } else {
      closeKycStatusDialog();
    }
  };

  const handleCard = (path, key) => () => {
    sendEvents("next", key);
    if (path) {
      if (path === "/kyc") {
        openKyc();
      } else {
        navigate(path);
      }
    }
  };

  const sendEvents = (userAction, cardClick = "") => {
    let eventObj = {
      event_name: "landing_page",
      properties: {
        user_action: "next",
        action: userAction,
        screen_name: "sdk landing",
        primary_category: "primary navigation",
        card_click: CARD_NAME_MAPPER[cardClick] || cardClick,
        intent: "",
        kyc_status: kycData.kycJourneyStatus,
        option_clicked: "",
        channel: baseConfig.code,
      },
    };
    if (cardClick === "kyc_bottom_sheet") {
      eventObj.event_name = "bottom_sheet";
      eventObj.properties.intent = "kyc status";
      eventObj.properties.option_clicked = userAction;
    } else if (userAction === "marketing_banner_clicked") {
      eventObj.properties.action = "next";
      eventObj.properties.primary_category = "marketing carousel";
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const goBack = () => {
    nativeCallback({ action: "exit_web" });
  };

  return (
    <Container
      title="Hello"
      notification
      noFooter={true}
      background="sdk-background"
      data-aid="sdk-landing-screen"
      skelton={loaderData.skelton}
      showLoader={loaderData.pageLoader}
      events={sendEvents("just_set_events")}
      handleNotification={handleCard("/notification", "notification")}
      classHeader={
        baseConfig.uiElements?.header?.backgroundColor
          ? "sdk-partner-header"
          : "sdk-header"
      }
      headerData={{
        goBack,
        partnerLogo: true,
      }}
    >
      <div className="sdk-landing" data-aid="sdk-landing">
        {!loaderData.kycStatusLoader ? (
          <div
            className="generic-page-subtitle"
            data-aid="generic-page-subtitle"
          >
            {kycData.isKycCompleted
              ? " Your KYC is verified, You’re ready to invest"
              : "Let’s make your money work for you!"}
          </div>
        ) : (
          <SkeltonRect
            style={{
              marginBottom: "20px",
              marginTop: "-20px",
              width: "75%",
              lineHeight: "1.6",
            }}
          />
        )}

        {/* Marketing Banners */}
        {!isEmpty(baseConfig.landingMarketingBanners) && (
          <div
            className="landing-marketing-banners"
            data-aid="landing-marketing-banners"
          >
            <div
              className={`marketing-banners-list ${
                baseConfig.landingMarketingBanners.length === 1 &&
                `single-marketing-banner`
              }`}
              data-aid="marketing-banners-list"
            >
              {baseConfig.landingMarketingBanners?.map((el, idx) => {
                return (
                  <Fragment key={idx}>
                    {dateValidation(el?.endDate, el?.startDate) && validateFeature(el?.type) && (
                      <div
                        className="marketing-banner-icon-wrapper"
                        onClick={handleMarketingBanner(el?.type, el?.actionUrl)}
                      >
                        <Imgc
                          src={require(`assets/${el.image}`)}
                          alt=""
                          style={{ width: "100%" }}
                        />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}
        {!isEmpty(landingCardsData) && (
          <div className="sdk-landing-cards">
            {landingCardsData.map((el) => {
              return (
                <SdkInvestCard
                  referral={referral}
                  handleReferral={handleReferral}
                  handleRefferalInput={handleRefferalInput}
                  {...el}
                  handleCard={handleCard(el?.path, el?.key)}
                  dotLoader={loaderData.dotLoader}
                />
              );
            })}
          </div>
        )}
        <SebiRegistrationFooter className="invest-sebi-registration-disclaimer" />
      </div>
      <LandingBottomSheets
        modalData={modalData}
        dialogStates={dialogStates}
        campaignData={campaignData}
        closeBottomSheet={closeBottomSheet}
        closeCampaignDialog={closeCampaignDialog({
          campaignData,
          handleDialogStates,
        })}
        handleCampaign={handleCampaign({
          campaignData,
          handleDialogStates,
          handleLoader,
        })}
        handleKycStatus={handleKycStatus}
        closeKycStatusDialog={closeKycStatusDialog}
        handleKycPremiumLanding={handleKycPremiumLanding({
          screenName,
          modalData,
          navigate,
          handleDialogStates,
        })}
        handleKycStatusRedirection={closeKycStatusDialog}
      />
      <TermsAndConditions
        isOpen={dialogStates.showTermsAndConditions}
        showLoader={loaderData.showTermsAndConditionsLoader}
        handleClick={handleTermsAndConditions}
      />
      <BankListOptions
        isOpen={dialogStates.showBankList}
        options={bankData.bankListOptions}
        selectedValue={bankData.selectedBank}
        error={bankData.bankListErrorMessage}
        showLoader={loaderData.showBankListLoader}
        handleChange={changeSelectedBank}
        handleClick={handleBankListOptions}
      />
    </Container>
  );
};

export default SdkLanding;
