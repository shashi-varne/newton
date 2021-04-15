import React, { useState } from 'react';
import BottomSheet from '../../common/ui/BottomSheet';
import { getConfig } from '../../utils/functions';
import { formatAmountInr, getFinancialYear } from '../../utils/validators';
import { navigate as navigateFunc } from '../invest/common/commonFunction';
import './RecommendationTopCard.scss';
const { productName } = getConfig();

const RecommendationTopCard = ({
  data = {},
  parentProps
}) => {
  const navigate = navigateFunc.bind(parentProps);
  const { userRiskProfile, funnelData } = data;
  const [showRiskInfo, setShowRiskInfo] = useState(false);

  const renderContent = () => {
    if (userRiskProfile) {
      const { equity, debt, investType } = funnelData;
      const toggleRiskInfoDialog = () => setShowRiskInfo(!showRiskInfo);

      return (
        <div className="risk-profile-card">
          <img src={require(`assets/${productName}/risk_profile.svg`)} alt="" className="left-img" />
          <div className="risk-details">
            {userRiskProfile ?
              <>
                <div className="risk-details-header">
                  Risk profile
                  <img
                    onClick={toggleRiskInfoDialog}
                    src={require('assets/info_icon_grey.svg')}
                    className="info-icn"
                    alt="i"
                  />
                </div>
                <div className="risk-type">{userRiskProfile}</div>
                <div className="risk-distribution">{equity}% Equity | {debt}% Debt</div>
              </> :
              <>
                <div className="risk-type" ng-if="showStartRiskProfile">Select risk profile</div>
                <div className="desc" ng-if="showStartRiskProfile">Get better fund recommendations</div>
              </>
            }
          </div>
          <div
            className="risk-profile-change-btn"
            onClick={() => navigate(`${investType}/risk-${userRiskProfile ? 'modify' : 'select'}`)}>
            {userRiskProfile ? "Change" : "Select"}
          </div>
          <BottomSheet
            open={showRiskInfo}
            data={{
              header_title: 'Risk Profile',
              content: 'According to your risk profile, your money will be invested in a combination of equity and debt funds',
              button_text1: 'Okay',
              handleClick1: toggleRiskInfoDialog,
              handleClose: toggleRiskInfoDialog,
            }}
          />
        </div>
      );
    } else if (funnelData.investType === 'savetax') {
      return (
        <div className="tax-card">
          <img src="assets/img/sale.svg" alt="" />
          <div className="text">Tax savings for {getFinancialYear()}</div>
          <div className="amount">{formatAmountInr(funnelData.corpus)}</div>
        </div>
      );
    }
  }

  return (
    <div className="recommendation-top-section">
      {renderContent()}
    </div>
  );
}

export default RecommendationTopCard;