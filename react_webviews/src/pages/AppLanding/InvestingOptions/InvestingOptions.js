import { isEmpty } from "lodash-es";
import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import KycBottomsheet from "../../../featureComponent/appLanding/KycBottomsheet";

import "./InvestingOptions.scss";

const InvestingOptions = ({
  investmentOptions,
  handleCardClick,
  sendEvents,
  screenData,
  showSearchIcon,
  handleKycPrimaryClick,
  handleKycSecondaryClick,
  bottomsheetStates,
  kycBottomsheetData,
  closeKycBottomsheet,
  isPageLoading,
  onRightIconClick,
}) => {
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="investor-favourites-wrapper"
      dataAid={screenData.dataAid}
      headerProps={{
        dataAid: screenData.headerDataAid,
        rightIconSrc: showSearchIcon && require("assets/search_diy.svg"),
        headerTitle: screenData.title,
        hideInPageTitle: true,
        showCloseIcon: true,
        onRightIconClick,
      }}
      eventData={sendEvents("just_set_events")}
      isPageLoading={isPageLoading}
    >
      <InvestmentOptions
        productList={investmentOptions}
        onClick={handleCardClick}
      />
      {bottomsheetStates.openKycStatusDialog &&
        !isEmpty(kycBottomsheetData) && (
          <KycBottomsheet
            isOpen={bottomsheetStates.openKycStatusDialog}
            onClose={closeKycBottomsheet}
            dataAid="kyc"
            data={kycBottomsheetData}
            onPrimaryClick={handleKycPrimaryClick}
            onSecondaryClick={handleKycSecondaryClick}
          />
        )}
    </Container>
  );
};

export default InvestingOptions;
