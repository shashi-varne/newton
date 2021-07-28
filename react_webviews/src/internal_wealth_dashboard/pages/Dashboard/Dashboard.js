// ------------------ Assets -----------------------
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
// -------------------------------------------------
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import PageHeader from '../../mini-components/PageHeader';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
import ScrollTopBtn from '../../mini-components/ScrollTopBtn';
import IwdCard from '../../mini-components/IwdCard';
import { getOverview } from '../../common/ApiCalls';
import RadialBarChart from '../../mini-components/RadialBarChart';
import { isEmpty, storageService } from '../../../utils/validators';
// import PortfolioGrowth from './PortfolioGrowth';
import PortfolioRisk from './PortfolioRisk';
import { formatNumVal } from '../../common/commonFunctions';
import { genericErrMsg } from '../../constants';

const isMobileView = getConfig().isMobileDevice;

const Dashboard = () => {
  const username = storageService().get('iwd-user-name') || '';
  const [overviewData, setOverviewData] = useState({});
  const [assetAlloc, setAssetAlloc] = useState({});
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState(false);

  const hasAllEmptyProps = (obj) => {
    return Object.entries(obj).every(([, val]) => !val); 
  };

  const fetchOverview = async () => {
    try {
      setIsLoadingOverview(true);
      setOverviewError(false);
      const data = await getOverview();
      const overviewObj = {
        current_val: get(data, 'current.current', ''),
        invested_val: get(data, 'current.invested', ''),
        total_realised: get(data, 'past.earnings', ''),
        xirr: get(data, 'earnings_percent', '--'),
      };
      const allocObj = {
        equity: get(data, 'current.stock', ''),
        debt: get(data, 'current.bond', ''),
      };
      if (hasAllEmptyProps(overviewObj) || hasAllEmptyProps(allocObj)) {
        throw (genericErrMsg);
      }
      setOverviewData(overviewObj);
      setAssetAlloc(allocObj);
    } catch (e) {
      setOverviewError(true);
      console.error(e);
      toast(e);
    }
    setIsLoadingOverview(false);
  };

  const fetchAllData = () => {
    fetchOverview();
  };

  useEffect(() => {
    fetchAllData();
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
        pages={3}
        hideFooter={isMobileView}
        onPageChange={pageChanged}
        isLoading={isLoadingOverview}
        loadingText='Please wait...Getting your investment data'
        error={overviewError}
        onErrorBtnClick={fetchAllData}
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
            {/* <PortfolioGrowth /> */}
            <IwdCard
              id="iwd-d-growth-graph"
              headerText="Portfolio growth"
              noData
              noDataText="We are working on improving your portfolio growth reporting and the update will be available soon."
            >
              
            </IwdCard>
          </div> 
          <div className='iwd-scroll-child' data-pgno='3'>
            <PortfolioRisk />
          </div>
          {isMobileView && <ScrollTopBtn />}
        </>
      </SnapScrollContainer>
    </div>
  );
};

export default Dashboard;
