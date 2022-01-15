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
import { nativeCallback } from "../../utils/native_callback";
import SelectFreedomPlan from "../mini-components/SelectFreedomPlan";
import useFreedomDataHook from "../common/freedomPlanHook";
import { SkeltonRect } from "../../common/ui/Skelton";
import { handleExit } from "../common/functions";

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
  const {
    errorData,
    showLoader,
    freedomPlanData,
    freedomPlanList,
    freedomPlanCharges,
    resetFreedomPlan,
    updateFreedomPlanData,
  } = useFreedomDataHook(true);

  const standardVsFreedomPlanDetails = useMemo(
    getStandardVsFreedomPlanDetails(freedomPlanCharges),
    [freedomPlanCharges]
  );

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
      eventObj.properties.plan_selected = `${
        freedomPlanData.duration / 30
      }_months`;
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
    sendEvents("back");
    resetFreedomPlan();
    handleExit(props);
  };

  const closeSelectFreedomPlan = () => {
    sendEvents("back", true);
    setOpenSelectPlan(false);
  };

  const handleSelectPlan = (plan) => {
    updateFreedomPlanData(plan);
    sendEvents("next", true);
    navigate(PATHNAME_MAPPER.review);
  };

  return (
    <Container
      noPadding
      hidePageTitle
      errorData={errorData}
      showError={errorData.showError}
      title="Freedom plan"
      buttonTitle="Select Plan"
      handleClick={handleClick}
      headerData={{ goBack }}
      events={sendEvents("just_set_events")}
      customTopIconColor="white"
      classHeader="freedom-plan-landing-header-color"
      classOverRide="freedom-plan-landing-container"
      data-aid="freedomPlanLanding"
    >
      <div className="freedom-plan-landing" data-aid="freedomPlan">
        <WVInPageHeader
          withImg
          imageProps={{
            src: require(`assets/${productName}/freedom.svg`),
            className: "fpl-header-icon",
          }}
          dataAidSuffix="freedomPlan"
        >
          <WVInPageTitle>Freedom plan</WVInPageTitle>
          <WVInPageSubtitle>
            Your ultimate pass for brokerage free trading
          </WVInPageSubtitle>
        </WVInPageHeader>
        <div className="fpl-layout fpl-benefits" data-aid="grp_freedomBenefits">
          <HowToSteps
            baseData={FREEDOM_PLAN_BENEFITS_DATA}
            classNameIcon="fpl-benefits-icon"
          />
          <div className="fplb-plan-message">
            Plans start from as low as{" "}
            {formatAmountInr(MINIMUM_FREEDOM_PLAN_PRICE)}
          </div>
        </div>
        <div className="fpl-table" data-aid="grp_comparision">
          <div className="fpl-title" data-aid="tv_title">Standard vs Freedom plan</div>
          <StandardVsFreedomPlan
            data={standardVsFreedomPlanDetails}
            showLoader={showLoader}
          />
        </div>
        <div className="fpl-layout fpl-faqs" data-aid="grp_faqs">
          <div className="fpl-title" data-aid="tv_title">FAQs</div>
          <Faqs options={freedomPlanFaqs} />
        </div>
      </div>
      <SelectFreedomPlan
        showLoader={showLoader}
        isOpen={openSelectPlan}
        freedomPlanData={freedomPlanData}
        freedomPlanList={freedomPlanList}
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

const TableRow = ({ data = {}, columnReverse = false, showLoader = false, index }) => (
  <tr>
    <td className="fpl-tc-type" data-aid={`tv_title${index}`}>{data.type}</td>
    {showLoader ? (
      <>
        <td className="fpl-tc-standard">
          <SkeltonRect />
        </td>
        <td className="fpl-tc-freedom">
          <SkeltonRect />
        </td>
      </>
    ) : (
      <>
        <td className={`fpl-tc-standard ${columnReverse && `column-reverse`}`} data-aid={`tv_standardDescription${index}`}>
          {data.standardPlan}
          <div className="fpl-tc-subtext">{data.standardPlanSubtext}</div>
        </td>
        <td className="fpl-tc-freedom" data-aid={`tv_freedomDescription${index}`}>{data.freedomPlan}</td>
      </>
    )}
  </tr>
);

const StandardVsFreedomPlan = ({ data = [], showLoader = false }) => {
  const { tableBodyData, tableHeaderData } = useMemo(getTableData(data), [
    data,
  ]);
  return (
    <table className="fpl-table-content render-faqs-table" cellSpacing="0" data-aid="grp_standardFreedom">
      <thead>
        <TableRow data={tableHeaderData} columnReverse index={0} />
      </thead>
      <tbody>
        {tableBodyData.map((data, index) => {
          return <TableRow key={index} data={data} showLoader={showLoader} index={index+1} />;
        })}
      </tbody>
    </table>
  );
};
