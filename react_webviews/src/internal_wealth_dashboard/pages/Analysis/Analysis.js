import React, { useEffect, useState } from 'react';
import PageHeader from '../../mini-components/PageHeader';
import { getConfig } from 'utils/functions';
import toast from 'common/ui/Toast';
import { getPortfolioAnalysis } from '../../common/ApiCalls';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
import ScrollTopBtn from '../../mini-components/ScrollTopBtn';
import HeaderNavBar from '../../common/HeaderNavBar';
import ChartsContainer from './ChartsContainer';
import TopStocks from './TopStocks';
import TopHoldings from './TopHoldings';
import TopAMCS from './TopAMCS';
import IwdCard from '../../mini-components/IwdCard';
import { scrollElementToPos } from '../../common/commonFunctions';
const isMobileView = getConfig().isMobileDevice;

function Analysis() {
  const [pageType, setPageType] = useState('equity');
  const [graphData, setGraphData] = useState({});
  const [topHoldings, setTopHoldings] = useState({});
  const [topAMCs, setTopAMCs] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPortfolio = async () => {
    try {
      setIsLoading(true);
      const result = await getPortfolioAnalysis({
        scheme_type: null,
        market_cap_alloc: true,
        sector_alloc: true,
        top_holdings: true,
        top_amcs: true,
        rating_exposure: true,
        maturity_exposure: true,
      });
      const { top_holdings, top_amcs, ...graphDataPoints } = result;

      setTopAMCs(top_amcs);
      setTopHoldings(top_holdings);
      setGraphData(graphDataPoints);
      setIsLoading(false);
      setError(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setError(true);
      toast(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPortfolio();
  }, []);

  const handlePageType = (name) => {
    setPageType(name);
    scrollElementToPos('iwd-scroll-contain', 0, 0);
  };

  const pageTypeMapper = {
    equity: {
      component: <TopStocks topStocks={topHoldings.equity} />,
    },
    debt: {
      component: <TopHoldings topHoldings={topHoldings.debt} />,
    },
  };

  const renderTabNavCard = () => {
    const redirectTo = pageType === 'equity' ? 'debt' : 'equity';

    return (
      <IwdCard
        headerText={`Check the analysis of your ${redirectTo} allocations`}
        isClickable
        onClick={() => setPageType(redirectTo)}
        className="iwd-a-tab-change-card"
      >
        <div id="iwd-atcc-content">
          {redirectTo === 'debt' ? 'Next' : 'Previous'}
        </div>
      </IwdCard>
    );
  }

  return (
    <section className='iwd-page iwd-page__analysis' id='iwd-analysis'>
      <PageHeader height='9vh' hideProfile={isMobileView}>
        <HeaderNavBar
          title='Analysis'
          tabs={Object.keys(pageTypeMapper).map((key) => key)}
          handlePageType={handlePageType}
          currentTab={pageType}
        />
      </PageHeader>
      <SnapScrollContainer
        pages={3}
        isLoading={isLoading}
        loadingText='Please wait...Getting your investment data'
        error={error}
        hideFooter={isMobileView}
        onErrorBtnClick={getPortfolio}
      >
        <ChartsContainer data={graphData} page={pageType} />
        {pageTypeMapper[pageType].component}
        <TopAMCS topAMCs={topAMCs[pageType]} />
        {renderTabNavCard()}
        {isMobileView && <ScrollTopBtn />}
      </SnapScrollContainer>
    </section>
  );
}

export default Analysis;
