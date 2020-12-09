// ------------------ Assets -----------------------
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
// -------------------------------------------------
import React, { useEffect, useState } from 'react';
import { IconButton } from 'material-ui';
import PageHeader from '../mini-components/PageHeader';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { getConfig } from 'utils/functions';
import { overview, portfolioRisk } from '../common/ApiCalls';
import { get } from 'lodash';
import toast from '../../common/ui/Toast';
import { isEmpty, numDifferentiationInr, storageService } from '../../utils/validators';
import RadialBarChart from '../mini-components/RadialBarChart';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';
import IwdCard from '../mini-components/IwdCard';
import ScrollTopBtn from '../mini-components/ScrollTopBtn';
import IwdCommonPageFooter from '../mini-components/IwdCommonPageFooter';
const isMobileView = getConfig().isMobileDevice;

const Dashboard = () => {
  const username = storageService().get('iwd-user-name') || '';
  const [overviewData, setOverviewData] = useState({});
  const [assetAlloc, setAssetAlloc] = useState({});
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
        total_realised: get(data, 'past.earnings', ''),
        xirr: get(data, 'earnings_percent', '--'),
      });
      setAssetAlloc({
        equity: get(data, 'current.stock', ''),
        debt: get(data, 'current.bond', ''),
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
    const header = document.getElementById('iwd-ph-left');
    const profile = document.getElementById('iwd-profile-short');

    if (page && !isEmpty(page)) {
      if (pageNum !== 1) {
        page.style.background = '#f9f9f9';
        if (header) header.classList.add('iwd-dashboard-pg1');
        if (profile) profile.style.color = '#767e86';
      } else {
        page.style.background = '';
        if (header) header.classList.remove('iwd-dashboard-pg1');
        if (profile) profile.style.color = '#d3dbe4';
      }
    }
  };

  return (
    <div className='iwd-page' id='iwd-dashboard'>
      <PageHeader>
        <>
          <div className='iwd-header-title'>Dashboard</div>
          <div className='iwd-header-subtitle'>Welcome back, {username}</div>
        </>
      </PageHeader>
      <SnapScrollContainer
        pages={2}
        onPageChange={pageChanged}
        isLoading={isLoadingOverview} // Overview is the most important part here, hence full screen load depends on this
        loadingText='Hold tight! Getting you the good stuff ...'
        error={overviewError} // Overview is the most important part here, hence full screen error depends on this
        hideFooter={isMobileView}
        onErrorBtnClick={() => {
          fetchOverview();
          fetchPortfolioRisk();
        }}
      >
        <>
          <div className='iwd-scroll-child' data-pgno='1'>
            <IwdCard
              id='iwd-d-numbers'
              error={isEmpty(overviewData) || overviewError}
              errorText='Something went wrong! Please retry after some time or contact your wealth manager'
              isLoading={isLoadingOverview}
              style={{
                background: isLoadingOverview || isEmpty(overviewData) ? 'white' : '',
              }}
            >
              <>
                <div className='iwd-dn-box'>
                  <div className='iwd-dnb-value'>{formatNumVal(overviewData.current_val)}</div>
                  <div className='iwd-dnb-label'>Current value</div>
                </div>
                <div className='iwd-dn-box'>
                  <div className='iwd-dnb-value'>{formatNumVal(overviewData.invested_val)}</div>
                  <div className='iwd-dnb-label'>Invested value</div>
                </div>
                <div className='iwd-dn-box'>
                  <div className='iwd-dnb-value'>{formatNumVal(overviewData.total_realised)}</div>
                  <div className='iwd-dnb-label'>Total Realised Gains</div>
                </div>
                <div className='iwd-dn-box'>
                  <div className='iwd-dnb-value'>
                    {overviewData.xirr}%
                    <img
                      src={overviewData.xirr > 0 ? positive : negative}
                      alt=''
                      style={{ marginLeft: '10px' }}
                    />
                  </div>
                  <div className='iwd-dnb-label'>XIRR</div>
                </div>
              </>
            </IwdCard>
            <IwdCard
              id='iwd-d-asset-alloc'
              headerText='Asset allocation'
              error={
                isEmpty(assetAlloc.equity) ||
                isEmpty(assetAlloc.debt)
              }
              errorText='Something went wrong! Please retry after some time or contact your wealth manager'
              isLoading={isLoadingOverview}
            >
              <div id='iwd-daa-graph'>
                <RadialBarChart
                  progress={assetAlloc.equity}
                  strokeWidth={10}
                  dimension={200}
                  color='#39B7A8'
                />
                <div id='iwd-daa-legend'>
                  <div className='iwd-daal-item'>
                    <div className='label'>
                      <div className='dot'></div>
                      Equity
                    </div>
                    <div className='value'>{assetAlloc.equity}%</div>
                  </div>
                  <div className='iwd-daal-item'>
                    <div className='label'>
                      <div className='dot'></div>
                      Debt
                    </div>
                    <div className='value'>{assetAlloc.debt}%</div>
                  </div>
                </div>
              </div>
            </IwdCard>
          </div>
          <div className='iwd-scroll-child' data-pgno='2'>
            <IwdCard
              id='iwd-d-risk'
              headerText='Risk analysis'
              error={isEmpty(riskData) || riskError}
              errorText='Something went wrong! Please retry after some time or contact your wealth manager'
              isLoading={isLoadingRisk}
            >
              <div id='iwd-dr-data'>
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
              headerText="Open source and non-custodial protocol enabling the creation of money markets"
              className="iwd-d-newsletter"
            >
              <>
                <IconButton className='iwd-dn-btn'>
                  <ChevronRight style={{ color: 'white' }} />
                </IconButton>
                <div id='iwd-dn-gist'>Equities | Fixed Income | Situational</div>
                <div id='iwd-dn-issue'>Fisdom Outlook: July 2020</div>
              </>
            </IwdCard>
            <IwdCommonPageFooter />
          </div>
          {isMobileView && <ScrollTopBtn />}
        </>
      </SnapScrollContainer>
    </div>
  );
};

export default Dashboard;
