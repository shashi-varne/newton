// ------------------ Assets --------------------------
import IlsError from 'assets/fisdom/ils_error.svg';
// ----------------------------------------------------
import React, { useEffect, useState } from 'react';
import { IconButton } from 'material-ui';
import PageHeader from '../mini-components/PageHeader';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { getConfig } from "utils/functions";
import { overview, portfolioRisk } from '../common/ApiCalls';
import { get } from 'lodash';
import toast from '../../common/ui/Toast';
import { isEmpty, numDifferentiationInr } from '../../utils/validators';
import RadialBarChart from '../mini-components/RadialBarChart';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';
const isMobileView = getConfig().isMobileDevice;

const Dashboard = () => {
  const [overviewData, setOverviewData] = useState({});
  const [riskData, setRiskData] = useState({});

  const formatNumVal = (val) => {
    if (isEmpty(val) || !val) return '--';
    return numDifferentiationInr(val);
  };

  const fetchOverview = async () => {
    try {
      const data = await overview();
      setOverviewData({
        current_val: get(data, 'current.current', ''),
        invested_val: get(data, 'current.invested', ''),
        asset_alloc: {
          equity: get(data, 'current.stock', ''),
          debt: get(data, 'current.bond', ''),
        },
        total_realised: get(data, 'past.earnings', ''),
        xirr: get(data, 'earnings_percent', '--'),
      });
      console.log(data);
    } catch (e) {
      console.log(e);
      toast(e);
    }
  };

  const fetchPortfolioRisk = async () => {
    try {
      const data = await portfolioRisk({ date_range: 'one_year' });
      setRiskData(data);
      console.log(data);
    } catch (e) {
      console.log(e);
      toast(e);
    }
  };

  useEffect(() => {
    // setEventHandler();
    fetchOverview();
    fetchPortfolioRisk();
  }, []);

  const pageChanged = (pageNum) => {
    const page = document.getElementById('iwd-dashboard');
    console.log(pageNum);
    if (page && !isEmpty(page)) {
      page.style.background = pageNum === 1 ? '' : '#F9FCFF';
    }
  };

  return (
    <div className="iwd-page" id="iwd-dashboard">
      <PageHeader>
        <>
          <div className="iwd-header-title">Dashboard</div>
          <div className="iwd-header-subtitle">Welcome back, Uttam</div>
        </>
      </PageHeader>
      <SnapScrollContainer
        pages={2}
        onPageChange={pageChanged}
        hideFooter={isMobileView}
      >
        <>
          <div className="iwd-scroll-child" data-pgno="1">
            <div id="iwd-d-numbers" style={{ background: 'white' }}>
              {true ?
                <ErrorScreen
                  useTemplate={true}
                  templateImage={IlsError}
                  templateErrText="Something went wrong! Please retry after some time or contact your wealth manager"
                /> :
                <>
                  <div className="iwd-dn-box">
                    <div className="iwd-dnb-value">
                      {formatNumVal(overviewData.current_val)}
                    </div>
                    <div className="iwd-dnb-label">
                      Current value
                </div>
                  </div>
                  <div className="iwd-dn-box">
                    <div className="iwd-dnb-value">
                      {formatNumVal(overviewData.invested_val)}
                    </div>
                    <div className="iwd-dnb-label">
                      Invested value
                </div>
                  </div>
                  <div className="iwd-dn-box">
                    <div className="iwd-dnb-value">
                      {formatNumVal(overviewData.total_realised)}
                    </div>
                    <div className="iwd-dnb-label">
                      Total Realised Gains
                </div>
                  </div>
                  <div className="iwd-dn-box">
                    <div className="iwd-dnb-value">
                      {overviewData.xirr}%
                </div>
                    <div className="iwd-dnb-label">
                      XIRR
                </div>
                  </div>

                </>}
              </div>
            <div id="iwd-d-asset-alloc">
              <div className="iwd-card-header">Asset allocation</div>
              <div id="iwd-daa-graph">
                <RadialBarChart
                  radius={100}
                  progress={42}
                  strokeWidth={10}
                  dimension={200}
                  color="#4AD0C0"
                  secondaryColor="#3fd9c7"
                />
                <div id="iwd-daa-legend">
                  <div className="iwd-daal-item">
                    <div className="label">
                      <div className="dot"></div>
                      Equity
                    </div>
                    <div className="value">42%</div>
                  </div>
                  <div className="iwd-daal-item">
                    <div className="label">
                      <div className="dot"></div>
                      Debt
                    </div>
                    <div className="value">58%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="iwd-scroll-child" data-pgno="2">
            <div id="iwd-d-risk">
              <div className="iwd-card-header">Risk analysis</div>
              <div id="iwd-dr-data">
                <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
                  <div className="iwd-drb-label">Return</div>
                  <div className="iwd-drb-value">{riskData.return}%</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
                  <div className="iwd-drb-label">Alpha</div>
                  <div className="iwd-drb-value">{riskData.alpha}%</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom' : ''}`}>
                  <div className="iwd-drb-label">Volatility</div>
                  <div className="iwd-drb-value">{riskData.std_dev}%</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
                  <div className="iwd-drb-label">Beta</div>
                  <div className="iwd-drb-value">{riskData.beta}</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
                  <div className="iwd-drb-label">Sharpe Ratio</div>
                  <div className="iwd-drb-value">{riskData.sharpe_ratio}</div>
                </div>
                <div className="iwd-dr-box">
                  <div className="iwd-drb-label">Information Ratio</div>
                  <div className="iwd-drb-value">{riskData.information_ratio}</div>
                </div>
              </div>
            </div>
            <div id="iwd-d-newsletter">
              <div className="iwd-card-header">
                Open source and non-custodial protocol enabling the creation of money markets
              </div>
              <IconButton className="iwd-dn-btn">
                <ChevronRight style={{ color: 'white' }} />
              </IconButton>
              <div id="iwd-dn-gist">
                Equities | Fixed Income | Situational
              </div>
              <div id="iwd-dn-issue">Fisdom Outlook: July 2020</div>
            </div>
          </div>
        </>
      </SnapScrollContainer>
    </div>
  );
};

export default Dashboard;