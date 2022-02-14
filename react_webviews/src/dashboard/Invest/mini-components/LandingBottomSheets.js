import React from "react";
import BFDLBanner from "./BFDLBanner";
import CampaignDialog from "./CampaignDialog";
import KycPremiumLandingDialog from "./KycPremiumLandingDialog";
import KycStatusDialog from "./KycStatusDialog";
import isEmpty from "lodash/isEmpty";
import noop from "lodash/noop";

const LandingBottomSheets = ({
  modalData = {},
  dialogStates = {},
  campaignData = {},
  closeBottomSheet = noop,
  handleCampaign = noop,
  closeCampaignDialog = noop,
  handleKycPremiumLanding = noop,
  handleKycStatus = noop,
  closeKycStatusDialog = noop,
  handleKycStatusRedirection = closeKycStatusDialog,
}) => {
  return (
    <>
      <CampaignDialog
        isOpen={dialogStates.openCampaignDialog}
        close={closeCampaignDialog}
        cancel={closeCampaignDialog}
        data={campaignData}
        handleClick={handleCampaign}
      />
      {!isEmpty(modalData) && (
        <>
          <KycStatusDialog
            isOpen={dialogStates.openKycStatusDialog}
            data={modalData}
            close={closeKycStatusDialog}
            handleClick={handleKycStatus}
            handleClick2={handleKycStatusRedirection}
            cancel={closeKycStatusDialog}
          />
          <KycPremiumLandingDialog
            isOpen={dialogStates.openKycPremiumLanding}
            close={closeBottomSheet("openKycPremiumLanding")}
            cancel={closeBottomSheet("openKycPremiumLanding")}
            handleClick={handleKycPremiumLanding}
            data={modalData}
          />
        </>
      )}
      <BFDLBanner
        isOpen={dialogStates.openBfdlBanner}
        close={closeBottomSheet("openBfdlBanner")}
      />
    </>
  );
};

export default LandingBottomSheets;
