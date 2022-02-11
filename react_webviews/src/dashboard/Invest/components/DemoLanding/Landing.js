import React, { useEffect, useMemo, useState } from "react";
import Container from "../../../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { isEmpty } from "lodash";
import { nativeCallback } from "../../../../utils/native_callback";
import {
  getInvestCardsData,
  handleStocksAndIpoCards,
  initialize,
  initializeKyc,
  openKyc,
} from "../../functions";
import InvestCard from "../../mini-components/InvestCard";
import SebiRegistrationFooter from "../../../../common/ui/SebiRegistrationFooter/WVSebiRegistrationFooter";
import useUserKycHook from "../../../../kyc/common/hooks/userKycHook";
import "./Landing.scss";
import { keyPathMapper } from "../../constants";
import KycCard from "../Landing/KycCard";
import FinancialTools from "../Landing/FinancialTools";
import useFreedomDataHook from "../../../../freedom_plan/common/freedomPlanHook";
import PopularCards from "../Landing/PopularCards";
import BotomScrollCards from "../Landing/BottomScrollCards";
import StocksAndIpoCards from "../Landing/StocksAndIpoCards";

const fromLoginStates = ["/login", "/logout", "/verify-otp"];
const screenName = "invest_landing";
const SECTION_TITLE_MAPPER = {
  ourRecommendations: "Our recommendations",
  popularCards: "More investment options",
  financialTools: "Financial tools",
  stocksAndIpo: "Stocks & IPOs",
  diy: "Do it yourself",
};
const Landing = (props) => {
  const {
    code: partnerCode,
    productName,
    isSdk,
    isIframe,
    isMobileDevice,
  } = getConfig();
  const stateParams = props.location.state || {};
  const navigate = navigateFunc.bind(props);
  const isFromLoginStates = fromLoginStates.includes(stateParams.fromState);
  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
    kycStatusLoader: false,
  });
  const [modalData, setModalData] = useState({});
  const { user, kyc, updateKyc, updateUser } = useUserKycHook();
  const { subscriptionStatus, updateSubscriptionStatus } = useFreedomDataHook();

  const handleDialogStates = (dialogStatus, dialogData) => {
    setDialogStates(dialogStatus);
    setModalData(dialogData);
  };

  const { kycData, contactDetails } = useMemo(
    initializeKyc({ kyc, user, partnerCode, screenName, handleDialogStates }),
    [kyc, user]
  );
  const [investCardsData, setInvestCardsData] = useState({
    investSections: [],
    cardsData: {},
  });
  const [dialogStates, setDialogStates] = useState({});
  const {
    showKycCard,
    kycStatusData,
    tradingEnabled,
    isKycCompleted,
    kycJourneyStatus,
  } = kycData;

  const verifyDetailsType = {};
  useEffect(() => {}, []);

  useEffect(() => {
    initialize({ screenName, handleSummaryData, handleLoader });
    const data = getInvestCardsData();
    setInvestCardsData(data);
  }, []);

  const handleLoader = (data) => {
    setLoaderData({ ...loaderData, ...data });
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
          : verifyDetailsType === "email"
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

    let eventObj = {
      event_name: "landing_page",
      properties: {
        action: userAction,
        screen_name: "invest home",
        primary_category: "primary navigation",
        card_click: cardClick,
        channel: getConfig().code,
        user_investment_status: user?.active_investment,
        kyc_status: kycJourneyStatus,
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
        // this.getRecommendationApi(100);
        break;
      case "300_sip":
        // this.getRecommendationApi(300);
        break;
      case "kyc":
        openKyc({
          ...kycData,
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
            key: state,
            ...kycData,
            handleLoader,
            handleDialogStates,
            handleSummaryData,
          },
          props
        );
        break;
      case "risk_profile":
        navigate("/risk/result-new", {
          state: { fromExternalSrc: true },
        });
        break;
      case "top_equity":
        navigate(`/diy/fundlist/Equity/Multi_Cap`, {
          state: {
            name: "Top equity funds",
          },
        });
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
      noBackIcon={!isSdk || isIframe}
      background={
        isMobileDevice && isFromLoginStates && "invest-landing-background"
      }
      classHeader={
        isMobileDevice && isFromLoginStates && "invest-landing-header"
      }
      headerData={{
        partnerLogo: !isSdk && isMobileDevice,
      }}
      events={sendEvents("just_set_events")}
    >
      <div className="invest-landing" data-aid="invest-landing">
        {!loaderData.kycStatusLoader && (
          <div
            className="generic-page-subtitle"
            data-aid="generic-page-subtitle"
          >
            {isKycCompleted
              ? " Your KYC is verified, You’re ready to invest"
              : "Invest in your future"}
          </div>
        )}
        {!isEmpty(investCardsData.investSections) &&
          investCardsData.investSections.map((element, idx) => {
            return (
              <React.Fragment key={idx}>
                {(!isEmpty(investCardsData.cardsData[element]) ||
                  element === "kyc") &&
                  (element !== "stocksAndIpo" || tradingEnabled) && (
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
                          {!isEmpty(kycStatusData) && showKycCard ? (
                            <KycCard
                              data={kycStatusData}
                              showLoader={loaderData.kycStatusLoader}
                              handleClick={clickCard(
                                element,
                                kycStatusData.title
                              )}
                              productName={productName}
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
                          productName
                        )
                      )}
                    </>
                  )}
              </React.Fragment>
            );
          })}
        <SebiRegistrationFooter className="invest-sebi-registration-disclaimer" />
      </div>
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
