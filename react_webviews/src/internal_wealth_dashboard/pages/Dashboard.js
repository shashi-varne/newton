import React, { useEffect, useState } from 'react';
import { IconButton } from 'material-ui';
import PageHeader from '../mini-components/PageHeader';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { getConfig } from 'utils/functions';
import { overview, portfolioRisk } from '../common/ApiCalls';
import { get } from 'lodash';
import toast from '../../common/ui/Toast';
import { isEmpty, numDifferentiationInr } from '../../utils/validators';
import RadialBarChart from '../mini-components/RadialBarChart';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';
import IwdCard from '../mini-components/IwdCard';
import ScrollTopBtn from '../mini-components/ScrollTopBtn';
const isMobileView = getConfig().isMobileDevice;

const Dashboard = () => {
  const [overviewData, setOverviewData] = useState({});
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState(false);
  const [riskData, setRiskData] = useState({});
  const [isLoadingRisk, setIsLoadingRisk] = useState(true);
  const [riskError, setRiskError] = useState(false);

  const formatNumVal = (val) => {
    if (isEmpty(val) || !val) return '--';
    return numDifferentiationInr(val);
  };

  const fetchOverview = async () => {
    try {
      setIsLoadingOverview(true);
      setOverviewError(false);
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
    } catch (e) {
      console.error(e);
      setOverviewError(true);
      toast(e);
    }
    setIsLoadingOverview(false);
  };

  const fetchPortfolioRisk = async () => {
    try {
      setIsLoadingRisk(true);
      setRiskError(false);
      const data = await portfolioRisk({ date_range: 'one_year' });
      setRiskData(data);
      console.log(data);
    } catch (e) {
      console.log(e);
      setRiskError(true);
      toast(e);
    }
    setIsLoadingRisk(false);
  };

  useEffect(() => {
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
          <div className='iwd-header-title'>Dashboard</div>
          <div className='iwd-header-subtitle'>Welcome back, Uttam</div>
        </>
      </PageHeader>
      <SnapScrollContainer
        pages={2}
        onPageChange={pageChanged}
        hideFooter={isMobileView}
        error={overviewError && riskError}
      >
        <>
          <div className="iwd-scroll-child" data-pgno="1">
            <IwdCard
              id="iwd-d-numbers"
              error={isEmpty(overviewData) || overviewError}
              isLoading={isLoadingOverview}
              style={{
                background: isLoadingOverview || isEmpty(overviewData) ? 'white' : ''
              }}
            >
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
              </>
            </IwdCard>
            <IwdCard
              id="iwd-d-asset-alloc"
              headerText="Asset allocation"
              error={
                isEmpty(overviewData) ||
                isEmpty(overviewData.asset_alloc.equity) ||
                isEmpty(overviewData.asset_alloc.debt)
              }
              isLoading={isLoadingOverview}
            >
              <div id="iwd-daa-graph">
                <RadialBarChart
                  radius={100}
                  progress={42}
                  strokeWidth={10}
                  dimension={200}
                  color='#4AD0C0'
                  secondaryColor='#3fd9c7'
                />
                <div id='iwd-daa-legend'>
                  <div className='iwd-daal-item'>
                    <div className='label'>
                      <div className='dot'></div>
                      Equity
                    </div>
                    <div className='value'>42%</div>
                  </div>
                  <div className='iwd-daal-item'>
                    <div className='label'>
                      <div className='dot'></div>
                      Debt
                    </div>
                    <div className='value'>58%</div>
                  </div>
                </div>
              </div>
            </IwdCard>
          </div>
          <div className="iwd-scroll-child" data-pgno="2">
            <IwdCard
              id="iwd-d-risk"
              headerText="Risk analysis"
              error={isEmpty(riskData) || riskError}
              isLoading={isLoadingRisk}
            >
              <div id="iwd-dr-data">
                <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
                  <div className='iwd-drb-label'>Return</div>
                  <div className='iwd-drb-value'>{riskData.return}%</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
                  <div className='iwd-drb-label'>Alpha</div>
                  <div className='iwd-drb-value'>{riskData.alpha}%</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom' : ''}`}>
                  <div className='iwd-drb-label'>Volatility</div>
                  <div className='iwd-drb-value'>{riskData.std_dev}%</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
                  <div className='iwd-drb-label'>Beta</div>
                  <div className='iwd-drb-value'>{riskData.beta}</div>
                </div>
                <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
                  <div className='iwd-drb-label'>Sharpe Ratio</div>
                  <div className='iwd-drb-value'>{riskData.sharpe_ratio}</div>
                </div>
                <div className='iwd-dr-box'>
                  <div className='iwd-drb-label'>Information Ratio</div>
                  <div className='iwd-drb-value'>{riskData.information_ratio}</div>
                </div>
              </div>
            </IwdCard>
            <IwdCard
              id="iwd-d-newsletter"
              headerText="Open source and non-custodial protocol enabling the creation of money markets"
              error={isEmpty(riskData) || riskError}
              isLoading={isLoadingRisk}
            >
              <>
                <IconButton className="iwd-dn-btn">
                  <ChevronRight style={{ color: 'white' }} />
                </IconButton>
                <div id="iwd-dn-gist">
                  Equities | Fixed Income | Situational
                </div>
                <div id="iwd-dn-issue">Fisdom Outlook: July 2020</div>
              </>
            </IwdCard>
          </div>
          {isMobileView && <ScrollTopBtn />}
        </>
      </SnapScrollContainer>
    </div>
  );
};

export default Dashboard;
