import React, { useMemo } from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import WVInPageHeader from "../../common/ui/InPageHeader/WVInPageHeader";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVInPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import HowToSteps from "../../common/ui/HowToSteps";
import {
  FREEDOM_PLAN_BENEFITS_DATA,
  getFreedomPlanFaqs,
  getStandardVsFreedomPlanDetails,
  MINIMUM_FREEDOM_PLAN_PRICE,
} from "../common/constants";
import { capitalizeFirstLetter, formatAmountInr } from "../../utils/validators";
import Faqs from "../../common/ui/Faqs";
import "./Landing.scss";
import { nativeCallback } from "../../utils/native_callback";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";

const Landing = (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const FREEDOM_PLAN_FAQS = useMemo(
    getFreedomPlanFaqs(capitalizeFirstLetter(productName)),
    [productName]
  );
  const { kyc, isLoading } = useUserKycHook();
  const standardVsFreedomPlanDetails = useMemo(
    getStandardVsFreedomPlanDetails(kyc.equity_account_charges),
    [kyc]
  );

  const handleClick = () => {
    sendEvents("next");
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "freedom_plan",
      properties: {
        user_action: userAction,
        screen_name: "freedom_plan_details",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      noPadding
      hidePageTitle
      skelton={isLoading}
      title="Freedom plan"
      buttonTitle="Select Plan"
      handleClick={handleClick}
      events={sendEvents("just_set_events")}
      customIconColor="white"
      data-aid="freedom-plan-landing"
      classHeader="freedom-plan-landing-header-color"
      classOverRide="freedom-plan-landing-container"
    >
      <div className="freedom-plan-landing">
        <WVInPageHeader
          withImg
          imageProps={{
            src: require(`assets/${productName}/freedom.svg`),
            className: "fpl-header-icon",
          }}
        >
          <WVInPageTitle>Freedom plan</WVInPageTitle>
          <WVInPageSubtitle>
            Your ultimate pass for brokerage free trading
          </WVInPageSubtitle>
        </WVInPageHeader>
        <div className="fpl-layout fpl-benefits">
          <HowToSteps
            baseData={FREEDOM_PLAN_BENEFITS_DATA}
            classNameIcon="fpl-benefits-icon"
          />
          <div className="fplb-plan-message">
            Plans start from as low as{" "}
            {formatAmountInr(MINIMUM_FREEDOM_PLAN_PRICE)}
          </div>
        </div>
        <div className="fpl-table">
          <div className="fpl-title">Standard vs Freedom plan</div>
          <StandardVsFreedomPlan data={standardVsFreedomPlanDetails} />
        </div>
        <div className="fpl-layout fpl-faqs">
          <div className="fpl-title">FAQs</div>
          <Faqs options={FREEDOM_PLAN_FAQS} />
        </div>
      </div>
    </Container>
  );
};

export default Landing;

const getTableData = (data) => () => {
  const tableHeaderData = data[0];
  const tableBodyData = data.slice(1);
  return {
    tableHeaderData,
    tableBodyData,
  };
};

const TableRow = ({ data = {}, columnReverse = false }) => (
  <tr>
    <td className="fpl-tc-type">{data.type}</td>
    <td className={`fpl-tc-standard ${columnReverse && `column-reverse`}`}>
      {data.standardPlan}
      <div className="fpl-tc-subtext">{data.standardPlanSubtext}</div>
    </td>
    <td className="fpl-tc-freedom">{data.freedomPlan}</td>
  </tr>
);

const StandardVsFreedomPlan = ({ data = [] }) => {
  const { tableBodyData, tableHeaderData } = useMemo(getTableData(data), [
    data,
  ]);
  return (
    <table className="fpl-table-content render-faqs-table" cellSpacing="0">
      <thead>
        <TableRow data={tableHeaderData} columnReverse />
      </thead>
      <tbody>
        {tableBodyData.map((data, index) => {
          return <TableRow key={index} data={data} />;
        })}
      </tbody>
    </table>
  );
};
