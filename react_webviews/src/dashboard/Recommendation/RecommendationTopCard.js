import React, { useState } from 'react';
import BottomSheet from '../../common/ui/BottomSheet';
import { getConfig } from '../../utils/functions';
import { formatAmountInr, getFinancialYear } from '../../utils/validators';
import { navigate as navigateFunc } from '../Invest/common/commonFunctions';
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
    if (userRiskProfile || funnelData.investType === 'investsurplus') {
      const { equity, debt, investType } = funnelData;
      const toggleRiskInfoDialog = () => setShowRiskInfo(!showRiskInfo);

      return (
        <div className="risk-profile-card" data-aid='risk-profile-card'>
          <img src={require(`assets/${productName}/risk_profile.svg`)} alt="" className="left-img" />
          <div className="risk-details" data-aid='risk-details'>
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
            data-aid='risk-profile-change-btn'
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
    } else if (['savetax', 'savetaxsip'].includes(funnelData.investType)) {
      return (
        <div className="tax-card" data-aid='tax-card'>
          <img src={require('assets/sale.svg')} alt="" />
          <div className="text">Tax savings for {getFinancialYear()}</div>
          <div className="amount">{formatAmountInr(funnelData.corpus)}</div>
        </div>
      );
    }
  }

  return (
    <div className="recommendation-top-card" data-aid='recommendation-top-card'>
      {renderContent()}
    </div>
  );
}

export default RecommendationTopCard;