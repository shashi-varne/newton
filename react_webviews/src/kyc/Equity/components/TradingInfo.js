import React, { useEffect, useMemo, useState } from "react";
import { getConfig, isNewIframeDesktopLayout, navigate as navigateFunc } from "../../../utils/functions";
import Container from "../../common/Container";
import Checkbox from "../../../common/ui/Checkbox";
import "./commonStyles.scss";
import SebiRegistrationFooter from "../../../common/ui/SebiRegistrationFooter/WVSebiRegistrationFooter";
import { getUpgradeAccountFlowNextStep } from "../../common/functions";
import { PATHNAME_MAPPER } from "../../constants";
import useUserKycHook from "../../common/hooks/userKycHook";
import Toast from "../../../common/ui/Toast";
import { nativeCallback, openPdfCall } from "../../../utils/native_callback";
import { capitalize, formatAmountInr } from "../../../utils/validators";
import SVG from 'react-inlinesvg';
import { Imgc } from "../../../common/ui/Imgc";

const BENEFITS = [
  {
    icon: "one_account.svg",
    text: "One account for stocks, IPO, F&O",
  },
  {
    icon: "paperless.svg",
    text: "Paperless process - fast & secure",
  },
  {
    icon: "experience.svg",
    text: "Get the best investment experience",
  },
];

const getEquityChargesData = (equityChargesData={}) => {
  return [
    {
      title: "Fees and charges",
      id: "fees",
      list: [
        {
          name: "Account opening charges",
          subText: "(one-time fee)",
          value: `${formatAmountInr(equityChargesData.account_opening?.charges)}/yr + GST`,
          message: equityChargesData.account_opening?.actual_charges,
          lineStroke: true,
        },
        {
          name: "Platform charges",
          value: `${formatAmountInr(equityChargesData.platform?.charges)}/yr + GST`,
          message: equityChargesData.platform?.actual_charges,
          lineStroke: true,
        },
        {
          name: "Demat AMC",
          subText: "(Account maintainence charges)",
          value: `${formatAmountInr(equityChargesData.demat_amc?.charges)}/yr + GST`,
          message: equityChargesData.demat_amc?.actual_charges,
          lineStroke: true,
        }
      ]
    },
    {
      title: "Brokerage",
      id: "brokerage",
      list: [
        {
          name: "Delivery",
          value: `Flat ${formatAmountInr(equityChargesData.brokerage_delivery?.rupees)}`,
          subValue: "per executed order"
        },
        {
          name: "Intraday",
          value: `Flat ${formatAmountInr(equityChargesData.brokerage_intraday?.rupees)}`,
          subValue: "per executed order"
        },
        {
          name: "Futures",
          value: `Flat ${formatAmountInr(equityChargesData.brokerage_future?.rupees)}`,
          subValue: "per executed order"
        },
        {
          name: "Options",
          value: `Flat ${formatAmountInr(equityChargesData.brokerage_options?.rupees)}`,
          subValue: "per executed order"
        }
      ]
    },
  ];
}

const TradingInfo = (props) => {
  const config = getConfig();
  const productName = config.productName;
  const navigate = navigateFunc.bind(props);
  const [checkTermsAndConditions, setCheckTermsAndConditions] = useState(true);
  const [showSkelton, setShowSkelton] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState([0]);
  const [equityChargesData, setEquityChargesData] = useState([])
  const newIframeDesktopLayout = useMemo(isNewIframeDesktopLayout, [])
  const { kyc, isLoading } = useUserKycHook();
  const title = `${capitalize(productName)} Trading & Demat account`;

  useEffect(() => {
    setEquityChargesData(getEquityChargesData(kyc.equity_account_charges))
  }, [kyc])

  const handleTiles = (index) => () => {
    let newValues = []
    if(selectedTiles?.includes(index)) {
      newValues = selectedTiles.filter(el => el !== index) || [];
    } else {
      newValues = [...selectedTiles, index];
    }
    setSelectedTiles(newValues);
  }
  
  const handleCheckBox = () => {
    setCheckTermsAndConditions(!checkTermsAndConditions);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading",
      properties: {
        user_action: userAction || "",
        screen_name: "trading_and_demat_info",
        tnc_checked: checkTermsAndConditions ? "yes" : "no",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  
  const handleClick = () => {
    sendEvents("next");
    if(!checkTermsAndConditions) {
      Toast("Tap on T&C check box to continue");
      return;
    }
    if (kyc?.mf_kyc_processed) {
      if (!kyc.pan?.meta_data?.mother_name) {
        const data = {
          state: {
            flow: "upgradeAccount"
          }
        };
        if (kyc.initial_kyc_status === "compliant") {
          navigate(PATHNAME_MAPPER.compliantPersonalDetails2, data);
        } else {
          navigate(PATHNAME_MAPPER.personalDetails2, data);
        }
      } else {
        const pathName = getUpgradeAccountFlowNextStep(kyc);
        navigate(pathName);
      }
    } else {
      navigate(PATHNAME_MAPPER.tradingExperience);
    }
  };

  const openInBrowser = (url) => () => {
    nativeCallback({
      action: "open_browser",
      message: {
        url: url,
      },
    });
  };

  const openPdf = (url) => () => {
    if (config.iOS) {
      nativeCallback({
        action: "open_inapp_tab",
        message: {
          url: url || "",
          back_url: "",
        },
      });
    } else {
      setShowSkelton(true);
      const data = {
        url: url,
        header_title: "EQUITY ANNEXURE",
        icon: "close",
      };

      openPdfCall(data);
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle="CONTINUE"
      title={title}
      hidePageTitle
      data-aid='kyc-demate-account-screen'
      handleClick={handleClick}
      skelton={isLoading || showSkelton}
      iframeRightContent={require(`assets/${productName}/ic_upgrade.svg`)}
    >
      <div className="kyc-account-info" data-aid='kyc-account-info'>
        <header className="kyc-account-info-header" data-aid='kyc-account-info-header'>
          <div className="kaih-text">{title}</div>
          {!newIframeDesktopLayout && (
            <Imgc
              src={require(`assets/${productName}/ic_upgrade.svg`)}
              alt=""
              className="kyc-ai-header-icon"
            />
          )}
        </header>
        <main className="kyc-account-info-main" data-aid='kyc-account-info-main'>
          <div className="kaim-subtitle" data-aid='kyc-subtitle'>
            Invest & trade in India’s valuable companies in a few taps
          </div>
          <div className="kaim-key-benefits" data-aid='key-benefits'>
            <div className="generic-page-title">Key benefits</div>
            <div className="kaim-benefits">
              {BENEFITS.map((data, index) => {
                return (
                  <div key={index} className="kaim-benefits-info" data-aid='kaim-benefits-info'>
                    <Imgc
                      src={require(`assets/${productName}/${data.icon}`)}
                      alt=""
                      className="kaim-benefits-icon"
                    />
                    <div className="kaim-benefits-info-text">{data.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {equityChargesData.map((data, index) => {
            return (
              <AccountAndBrokerageCharges
                {...data}
                open={selectedTiles.includes(index)}
                key={data.id}
                onClick={handleTiles(index)}
              />
            );
          })}
          <div className="line-divider"/>
          <div className="kaim-terms" data-aid='kaim-terms'>
            <Checkbox
              checked={checkTermsAndConditions}
              handleChange={handleCheckBox}
            />
            <div className="kaim-terms-info">
              I agree to have read and understood the{" "}
              {config.Web ? (
                <>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={config.termsLink}
                    className="terms-text"
                  >
                    Terms & conditions
                  </a>{" "}
                  and{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={config.equityAnnexure}
                    className="terms-text"
                  >
                    Equity Annexure
                  </a>{" "}
                </>
              ) : (
                <>
                  <span
                    className="terms-text"
                    onClick={openInBrowser(config.termsLink)}
                  >
                    Terms & conditions
                  </span>{" "}
                  and{" "}
                  <span
                    className="terms-text"
                    onClick={openPdf(config.equityAnnexure)}
                  >
                    Equity Annexure
                  </span>{" "}
                </>
              )}
            </div>
          </div>
          <div className="line-divider bottom-line-divider" />
          <SebiRegistrationFooter />
        </main>
      </div>
    </Container>
  );
};

export default TradingInfo;

const AccountAndBrokerageCharges = ({open, onClick, ...props }) => {
  return (
    <div className="account-and-brokerage-charges" onClick={onClick}>
      <div className="flex-between-center">
        <div className="aabc-title" data-aid="kyc-free-charges">
          {props.title}
        </div>
        <SVG
          preProcessor={(code) =>
            code.replace(
              /fill=".*?"/g,
              "fill=" + getConfig().styles.primaryColor
            )
          }
          src={require(`assets/${open ? `collapse` : `expand`}.svg`)}
        />
      </div>
      {open &&
        props?.list?.map((data, idx) => {
          return (
            <div
              className="kaim-fees-info"
              data-aid="kyc-opening-charges"
              key={idx}
            >
              <div className="kaim-fees-info-text">
                <div>{data.name}</div>
                <div className="kaim-fees-info-subtext">{data.subText}</div>
              </div>
              <div>
                <div
                  className="kaim-no-fees-text1"
                  style={{
                    textDecorationLine: data.lineStroke
                      ? "line-through"
                      : "none",
                    color: props.id === "brokerage" ? "var(--dark)" : "var(--steelgrey)"
                  }}
                >
                  {data.value}
                </div>
                {data.message && (
                  <div className="kaim-no-fees-text2">{data.message}</div>
                )}
                {data.subValue && (
                  <div className="kaim-fees-info-subvalue">{data.subValue}</div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};
