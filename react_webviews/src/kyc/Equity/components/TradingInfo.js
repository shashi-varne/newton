import React, { useEffect, useMemo, useState } from "react";
import { getConfig, isNewIframeDesktopLayout, navigate as navigateFunc } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";
import { getUpgradeAccountFlowNextStep } from "../../common/functions";
import { PATHNAME_MAPPER } from "../../constants";
import useUserKycHook from "../../common/hooks/userKycHook";
import Toast from "../../../common/ui/Toast";
import { nativeCallback } from "../../../utils/native_callback";
import { capitalize, formatAmountInr } from "../../../utils/validators";
import SVG from 'react-inlinesvg';
import { Imgc } from "../../../common/ui/Imgc";
import TermsAndConditions from "../../mini-components/TermsAndConditions";
import BrokerageChargesTile from "../mini-components/BrokerageChargesTile";

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
      title: "Brokerage & other charges",
      id: "brokerage",
      list: [
        {
          name: "Annual maintainence",
          value: `${formatAmountInr(equityChargesData.demat_amc?.charges)}/yr + GST`,
          subText: "Placeholder"
        },
        {
          name: "Standard brokerage",
          className: "kaim-fit-sb"
        },
        {
          name: "Delivery",
          value: `0.15% or min ${formatAmountInr(equityChargesData.brokerage_delivery?.rupees)}/-`,
          subValue: "on transaction value"
        },
        {
          name: "Intraday",
          value: `0.05% or min ${formatAmountInr(equityChargesData.brokerage_intraday?.rupees)}/-`,
          subValue: "on transaction value"
        },
        {
          name: "Futures",
          value: `Flat ${formatAmountInr(equityChargesData.brokerage_future?.rupees)} per lot`,
          subValue: "on executed order"
        },
        {
          name: "Options",
          value: `Flat ${formatAmountInr(equityChargesData.brokerage_options?.rupees)} per lot`,
          subValue: "on executed order"
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
  const [selectedTiles, setSelectedTiles] = useState([]);
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
      noBackIcon={showSkelton}
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
          <div className="kaim-account-fee">
            <div className="kaim-af-title">One-time account opening fee</div>
            <div>
              <span
                className={`kaim-af-amount ${
                  kyc.is_aoc_equity_applicable && `kaim-af-strike-amount`
                }`}
              >
                {formatAmountInr(
                  kyc.equity_account_charges.account_opening.charges
                )}
                /-
              </span>
              {kyc.is_aoc_equity_applicable && (
                <span className="kaim-af-amount">Free</span>
              )}
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
          <TermsAndConditions
            checkTermsAndConditions={checkTermsAndConditions}
            handleCheckBox={handleCheckBox}
            setShowSkelton={setShowSkelton}
          />
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
          return <BrokerageChargesTile data={data} key={idx} />;
        })}
    </div>
  );
};
