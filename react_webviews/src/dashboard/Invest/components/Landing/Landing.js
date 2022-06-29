import React, { useEffect, useMemo, useState } from "react";
import Container from "../../../common/Container";
import SebiRegistrationFooter from "../../../../common/ui/SebiRegistrationFooter/WVSebiRegistrationFooter";
import KycCard from "./KycCard";
import PopularCards from "./PopularCards";
import FinancialTools from "./FinancialTools";
import BotomScrollCards from "./BottomScrollCards";
import StocksAndIpoCards from "./StocksAndIpoCards";
import InvestCard from "../../mini-components/InvestCard";
import LandingBottomSheets from "../../mini-components/LandingBottomSheets";
import VerifyDetailDialog from "../../../../login_and_registration/components/VerifyDetailDialog";
import AccountAlreadyExistDialog from "../../../../login_and_registration/components/AccountAlreadyExistDialog";
import PinSetupDialog from "../../mini-components/PinSetupDialog";
import {
  getConfig,
  navigate as navigateFunc,
} from "../../../../utils/functions";
import isEmpty from "lodash/isEmpty";
import { nativeCallback } from "../../../../utils/native_callback";
import {
  getInvestCardsData,
  handleStocksAndIpoCards,
  initialize,
  openKyc,
  handleCampaign,
  handleKycPremiumLanding,
  closeCampaignDialog,
  handleKycStatus,
  handleKycStatusRedirection,
  getRecommendationsAndNavigate,
  openBfdlBanner,
  getKycData,
  handleKycAndCampaign,
  handleWealthdeskRedirection,
} from "../../functions";
import { generateOtp } from "../../../../login_and_registration/functions";
import toast from "../../../../common/ui/Toast";
import { SkeltonRect } from "../../../../common/ui/Skelton";
import useUserKycHook from "../../../../kyc/common/hooks/userKycHook";
import useFreedomDataHook from "../../../../freedom_plan/common/freedomPlanHook";
import { keyPathMapper } from "../../constants";
import "./Landing.scss";

const fromLoginStates = ["/login", "/logout", "/verify-otp"];
const screenName = "investLanding";
const SECTION_TITLE_MAPPER = {
  ourRecommendations: "Our recommendations",
  popularCards: "More investment options",
  financialTools: "Financial tools",
  stocksAndIpo: "Stocks & IPOs",
  diy: "Do it yourself",
};
const Landing = (props) => {
  const navigate = navigateFunc.bind(props);
  const stateParams = useMemo(() => props.location.state || {}, [
    props.location.state,
  ]);
  const isFromLoginStates = fromLoginStates.includes(stateParams.fromState);
  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
    kycStatusLoader: false,
  });
  const [modalData, setModalData] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [baseConfig, setBaseConfig] = useState(getConfig());
  const [campaignData, setCampaignData] = useState({});
  const [dialogStates, setDialogStates] = useState({
    openCampaignDialog: false,
    openKycStatusDialog: false,
    openKycPremiumLanding: false,
    openBfdlBanner: false,
    openPinSetupDialog: false,
    accountAlreadyExists: false,
    verifyDetails: false,
  });
  const [investCardsData, setInvestCardsData] = useState({
    investSections: [],
    cardsData: {},
  });
  const [accountAlreadyExistsData, setAccountAlreadyExistsData] = useState({});
  const { user, kyc, updateKyc, updateUser } = useUserKycHook();
  const { subscriptionStatus, updateSubscriptionStatus } = useFreedomDataHook();
  const [kycData, setKycData] = useState(getKycData(kyc, user));

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    const data = getKycData(kyc, user);
    setKycData(data);
  }, [kyc, user]);

  const handleDialogStates = (dialogStatus, dialogData) => {
    setDialogStates({ ...dialogStates, ...dialogStatus });
    if (!isEmpty(dialogData)) {
      setModalData(dialogData);
    }
  };

  const onLoad = async () => {
    const investCardsData = getInvestCardsData();
    setInvestCardsData(investCardsData);
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
      setContactDetails,
      handleDialogStates,
    });
    openBfdlBanner(handleDialogStates);
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

  const showAccountAlreadyExist = (show, data) => {
    handleDialogStates({
      verifyDetails: false,
      accountAlreadyExists: show,
    });
    setAccountAlreadyExistsData(data);
  };

  const continueAccountAlreadyExists = async (type, data) => {
    sendEvents("next", "continuebottomsheet");
    let body = {};
    if (type === "email") {
      body.email = data?.data?.contact_value;
    } else {
      body.mobile = data?.data?.contact_value;
      body.whatsapp_consent = true;
    }
    const otpResponse = await generateOtp(body);
    if (otpResponse) {
      let result = otpResponse.pfwresponse.result;
      toast(result.message || "Success");
      navigate("secondary-otp-verification", {
        state: {
          value: data?.data?.contact_value,
          otp_id: otpResponse.pfwresponse.result.otp_id,
          communicationType: type,
        },
      });
    }
  };

  const editDetailsAccountAlreadyExists = () => {
    sendEvents("edit", "continuebottomsheet");
    navigate("/secondary-verification", {
      state: {
        page: "landing",
        edit: true,
        communicationType: accountAlreadyExistsData?.data?.contact_type,
        contactValue: accountAlreadyExistsData?.data?.contact_value,
      },
    });
  };

  const handleSummaryData = (data) => {
    updateKyc(data.kyc);
    updateUser(data.user);
    updateSubscriptionStatus(data.subscriptionStatus);
  };

  const handleFreedomCard = () => {
    const eventObj = {
      event_name: "home_screen",
      properties: {
        screen_name: "home_screen",
        banner_clicked: "freedom_plan_explore_now",
      },
    };
    nativeCallback({ events: eventObj });
    navigate("/freedom-plan");
  };

  const sendEvents = (userAction, cardClick = "") => {
    if (cardClick === "bottomsheet" || cardClick === "continuebottomsheet") {
      let screen_name =
        cardClick === "continuebottomsheet"
          ? "account_already_exists"
          : contactDetails.contact_type === "email"
          ? "verify_email"
          : "verify_mobile";
      let eventObj = {
        event_name: "verification_bottom_sheet",
        properties: {
          screen_name: screen_name,
          user_action: userAction,
        },
      };
      if (userAction === "just_set_events") {
        return eventObj;
      } else {
        nativeCallback({
          events: eventObj,
        });
      }
      return;
    } else if (cardClick === "ipo") {
      cardClick = "ipo_gold";
    }

    const kycStatus = kycData?.kycStatusData?.eventStatus || kycData?.kycJourneyStatus;

    let eventObj = {
      event_name: "landing_page",
      properties: {
        action: userAction,
        screen_name: "invest home",
        primary_category: "primary navigation",
        card_click: cardClick,
        channel: getConfig().code,
        user_investment_status: user?.active_investment,
        kyc_status: kycStatus,
      },
    };
    if (cardClick === "kyc_bottom_sheet") {
      eventObj.event_name = "bottom_sheet";
      eventObj.properties.intent = "kyc status";
      eventObj.properties.option_clicked = userAction;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const sendHomeScreenEvents = (userAction, cardName) => {
    let eventObj = {
      event_name: "home_screen",
      properties: {
        user_action: userAction,
        card_clicked: cardName,
        screen_name: "home_screen",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const clickCard = (state, title) => () => {
    if (state === "passiveIndexFunds") {
      sendHomeScreenEvents("next", "explore_passive_funds");
    } else {
      sendEvents("next", title);
    }
    switch (state) {
      case "100_sip":
        getRecommendationsAndNavigate({ amount: 100, handleLoader, navigate });
        break;
      case "300_sip":
        getRecommendationsAndNavigate({ amount: 300, handleLoader, navigate });
        break;
      case "kyc":
        openKyc({
          ...kycData,
          kyc,
          user,
          navigate,
          handleLoader,
          handleDialogStates,
          updateKyc,
        });
        break;
      case "stocks":
      case "ipo":
        handleStocksAndIpoCards(
          {
            ...kycData,
            key: state,
            kyc,
            user,
            navigate,
            handleLoader,
            handleDialogStates,
            handleSummaryData,
            closeKycStatusDialog,
          },
          props
        );
        break;
      case "risk_profile":
        navigate("/risk/result-new", {
          state: { fromExternalSrc: true },
        });
        break;
      case "wealthdesk":
        handleWealthdeskRedirection(handleLoader);
        break;
      default:
        navigate(keyPathMapper[state] || state);
        break;
    }
  };

  return (
    <Container
      skelton={loaderData.skelton}
      noFooter={true}
      title="Start Investing"
      data-aid="start-investing-screen"
      showLoader={loaderData.pageLoader}
      noBackIcon={!baseConfig.isSdk || baseConfig.isIframe}
      background={
        baseConfig.isMobileDevice &&
        isFromLoginStates &&
        "invest-landing-background"
      }
      classHeader={
        baseConfig.isMobileDevice &&
        isFromLoginStates &&
        "invest-landing-header"
      }
      headerData={{
        partnerLogo: !baseConfig.isSdk && baseConfig.isMobileDevice,
      }}
      events={sendEvents("just_set_events")}
    >
      <div className="invest-landing" data-aid="invest-landing">
        {!loaderData.kycStatusLoader ? (
          <div
            className="generic-page-subtitle"
            data-aid="generic-page-subtitle"
          >
            {kycData.isKycCompleted
              ? " Your KYC is verified, You’re ready to invest"
              : "Invest in your future"}
          </div>
        ) : (
          <SkeltonRect className="il-subtitle-skelton" />
        )}
        {!isEmpty(investCardsData.investSections) &&
          investCardsData.investSections.map((element, idx) => {
            return (
              <React.Fragment key={idx}>
                {(!isEmpty(investCardsData.cardsData[element]) ||
                  element === "kyc") &&
                  (element !== "stocksAndIpo" || kycData.tradingEnabled) && (
                    <>
                      {SECTION_TITLE_MAPPER[element] ? (
                        <div
                          className="invest-main-top-title"
                          data-aid={`${element}-title`}
                        >
                          {SECTION_TITLE_MAPPER[element]}
                        </div>
                      ) : null}
                      {element === "kyc" ? (
                        <>
                          {!isEmpty(kycData.kycStatusData) &&
                          kycData.showKycCard ? (
                            <KycCard
                              data={kycData.kycStatusData}
                              showLoader={loaderData.kycStatusLoader}
                              handleClick={clickCard(
                                element,
                                kycData.kycStatusData.title
                              )}
                              productName={baseConfig.productName}
                            />
                          ) : null}
                        </>
                      ) : element === "stocksAndIpo" ? (
                        <StocksAndIpoCards
                          stocksAndIpo={investCardsData.cardsData[element]}
                          handleFreedomCard={handleFreedomCard}
                          handleClick={clickCard}
                          showLoader={loaderData.kycStatusLoader}
                          subscriptionStatus={subscriptionStatus}
                        />
                      ) : (
                        renderCards(
                          element,
                          investCardsData.cardsData[element],
                          clickCard,
                          baseConfig.productName
                        )
                      )}
                    </>
                  )}
              </React.Fragment>
            );
          })}
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
        handleKycStatus={handleKycStatus({
          kyc,
          kycData,
          modalData,
          navigate,
          updateKyc,
          closeKycStatusDialog,
          handleLoader,
        })}
        closeKycStatusDialog={closeKycStatusDialog}
        handleKycPremiumLanding={handleKycPremiumLanding({
          screenName,
          modalData,
          navigate,
          handleDialogStates,
        })}
        handleKycStatusRedirection={handleKycStatusRedirection(
          {
            kyc,
            user,
            kycData,
            modalData,
            baseConfig,
            contactDetails,
            navigate,
            handleLoader,
            handleSummaryData,
            handleDialogStates,
            closeKycStatusDialog,
          },
          props
        )}
      />
      {!isEmpty(contactDetails) && dialogStates.verifyDetails && (
        <VerifyDetailDialog
          data={contactDetails}
          parent={{ sendEvents, navigate }}
          type={contactDetails.contact_type}
          showAccountAlreadyExist={showAccountAlreadyExist}
          isOpen={dialogStates.verifyDetails}
          onClose={closeBottomSheet("verifyDetails", "bottomsheet")}
        />
      )}
      {dialogStates.accountAlreadyExists && (
        <AccountAlreadyExistDialog
          type={contactDetails.contact_type}
          isOpen={dialogStates.accountAlreadyExists}
          data={accountAlreadyExistsData}
          onClose={closeBottomSheet(
            "accountAlreadyExists",
            "continuebottomsheet"
          )}
          next={continueAccountAlreadyExists}
          editDetails={editDetailsAccountAlreadyExists}
        />
      )}
      <PinSetupDialog
        open={dialogStates.openPinSetupDialog}
        onClose={closeBottomSheet("openPinSetupDialog")}
        comingFrom={dialogStates.cardKey}
      />
    </Container>
  );
};

export default Landing;

const InvestCards = ({ data, clickCard }) => (
  <>
    {data.map((item, index) => {
      return (
        <InvestCard
          data={item}
          key={index}
          handleClick={clickCard(item.key, item.title)}
        />
      );
    })}
  </>
);

const renderCards = (key, data, clickCard, productName) => {
  const cardsMapper = {
    popularCards: (
      <PopularCards
        data={data}
        clickCard={clickCard}
        productName={productName}
      />
    ),
    diy: <InvestCards data={data} clickCard={clickCard} />,
    financialTools: (
      <FinancialTools
        financialTools={data}
        handleClick={clickCard}
        productName={productName}
      />
    ),
    bottomCards: <InvestCards data={data} clickCard={clickCard} />,
    bottomScrollCards: (
      <BotomScrollCards
        bottomScrollCards={data}
        handleClick={clickCard}
        productName={productName}
      />
    ),
    ourRecommendations: <InvestCards data={data} clickCard={clickCard} />,
    indexFunds: <InvestCards data={data} clickCard={clickCard} />,
  };
  return cardsMapper[key];
};
