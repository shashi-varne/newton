import React, { useEffect, useMemo, useState } from "react";
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
  PATHNAME_MAPPER,
} from "../common/constants";
import { capitalizeFirstLetter, formatAmountInr } from "../../utils/validators";
import Faqs from "../../common/ui/Faqs";
import "./Landing.scss";
import { handleNativeExit, nativeCallback } from "../../utils/native_callback";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import SelectFreedomPlan from "../mini-components/SelectFreedomPlan";
import useFreedomDataHook from "../common/freedomPlanHook";

const Landing = (props) => {
  const navigate = navigateFunc.bind(props);
  const [openSelectPlan, setOpenSelectPlan] = useState(false);

  const initialize = () => {
    const config = getConfig();
    return {
      ...config,
      freedomPlanFaqs: getFreedomPlanFaqs(
        capitalizeFirstLetter(config.productName)
      ),
    };
  };

  const { productName, freedomPlanFaqs = [] } = useMemo(initialize, []);
  const { kyc, isLoading } = useUserKycHook();
  const standardVsFreedomPlanDetails = useMemo(
    getStandardVsFreedomPlanDetails(kyc.equity_account_charges),
    [kyc]
  );
  const {
    errorData,
    showLoader,
    freedomPlanData,
    updateFreedomPlan,
  } = useFreedomDataHook();

  useEffect(() => {
    if (errorData.showError && openSelectPlan) {
      closeSelectFreedomPlan();
    }
  }, [errorData.showError]);

  const sendEvents = (userAction, isSelectPlan) => {
    let eventObj = {
      event_name: "freedom_plan",
      properties: {
        user_action: userAction,
        screen_name: "freedom_plan_details",
      },
    };
    if (isSelectPlan) {
      eventObj.properties.screen_name = "select_plan";
      eventObj.properties.plan_selected = `${freedomPlanData.duration}_months`;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleClick = () => {
    sendEvents("next");
    setOpenSelectPlan(true);
  };

  const goBack = () => {
    handleNativeExit(props, { action: "exit" });
  };

  const closeSelectFreedomPlan = () => {
    sendEvents("back", true);
    setOpenSelectPlan(false);
  };

  const handleSelectPlan = (plan) => {
    updateFreedomPlan(plan);
    sendEvents("next", true);
    navigate(PATHNAME_MAPPER.review);
  };

  return (
    <Container
      noPadding
      hidePageTitle
      skelton={isLoading}
      errorData={errorData}
      showError={errorData.showError}
      title="Freedom plan"
      buttonTitle="Select Plan"
      handleClick={handleClick}
      headerData={{ goBack }}
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
          <Faqs options={freedomPlanFaqs} />
        </div>
      </div>
      <SelectFreedomPlan
        isOpen={openSelectPlan}
        freedomPlanData={freedomPlanData}
        showLoader={showLoader}
        onClose={closeSelectFreedomPlan}
        onClick={handleSelectPlan}
      />
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
