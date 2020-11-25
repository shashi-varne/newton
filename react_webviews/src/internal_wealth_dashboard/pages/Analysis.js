// ---------------- Assets ----------------------
import IcSecFinanceIcon from '../../assets/fisdom/ic_sec_finance.svg';
import IcSecAutoMobileIcon from '../../assets/fisdom/ic_sec_automobile.svg';
import IcSecChemicalsIcon from '../../assets/fisdom/ic_sec_chemicals.svg';
import IcSecCommunicationIcon from '../../assets/fisdom/ic_sec_communication.svg';
import IcSecConsDurableIcon from '../../assets/fisdom/ic_sec_cons_durable.svg';
import IcSecConstructionIcon from '../../assets/fisdom/ic_sec_construction.svg';
import IcSecEnergyIcon from '../../assets/fisdom/ic_sec_energy.svg';
import IcSecFMCGIcon from '../../assets/fisdom/ic_sec_fmcg.svg';
import IcSecHealthCare from '../../assets/fisdom/ic_sec_healthcare.svg';
import IcSecServicesIcon from '../../assets/fisdom/ic_sec_services.svg';
import IcSecTechnologyIcon from '../../assets/fisdom/ic_sec_technology.svg';
// ----------------------------------------------
import React, { useEffect, useState } from 'react';
import PageHeader from '../mini-components/PageHeader'
import { getConfig } from 'utils/functions';
import Legends from '../mini-components/Legends';
import {
  fetchPortfolioAnalysisMock,
  fetchPortfolioAnalysis,
} from '../common/ApiCalls';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';
import IwdBubbleChart from '../mini-components/IwdBubbleChart';
import IwdBarChart from '../mini-components/IwdBarChart';
import { isEmpty } from '../../utils/validators';

const topStocksIconMappings = {
  'Financial Services': IcSecFinanceIcon,
  Energy: IcSecEnergyIcon,
  Technology: IcSecTechnologyIcon,
  'Consumer Defensive': IcSecConsDurableIcon,
  'Real Estate': IcSecConstructionIcon,
  'Utilities': IcSecServicesIcon,
  'Consumer Cyclical': IcSecAutoMobileIcon,
  'Healthcare': IcSecHealthCare,
  'Communication Services': IcSecCommunicationIcon,
  'Others': IcSecChemicalsIcon,
};

const isMobileView = getConfig().isMobileDevice;

function Analysis() {
  const [pageType, setPageType] = useState('equity');
  const [graphData, setGraphData] = useState({});
  const [topHoldings, setTopHoldings] = useState(null);
  const [topAMCs, setTopAMCs] = useState(null);
  const [error, setError] = useState(null);

  const getPortfolio = async () => {
    try {
      const result = await fetchPortfolioAnalysis({
        scheme_type: null,
        market_cap_alloc: true,
        sector_alloc: true,
        top_holdings: true,
        top_amcs: true,
        rating_exposure: true,
        maturity_exposure: true,
      });
      const {
        top_holdings,
        top_amcs,
        ...graphDataPoints
      } = result;

      setTopAMCs({ ...top_amcs });
      setTopHoldings({ ...top_holdings });
      setGraphData(graphDataPoints);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    getPortfolio();
  }, []);

  const handlePageType = (name) => () => {
    if (['equity', 'debt'].includes(name)) {
      setPageType(name);
    }
  };

  if (
    !topHoldings ||
    isEmpty(graphData)
  ) {
    return <h1>Loading ...</h1>;
  }

  return (
    <section className="iwd-page iwd-page__analysis" id="iwd-analysis">
      <PageHeader
        height={isMobileView ? '16vh' : '9vh'}
        hideProfile={isMobileView}
      >
        <div className="iwd-analysis-header-container-left">
          <h1 className="iwd-header-title">Analysis</h1>
          <div className="iwd-analysis-header-filters">
            <button
              className={
                pageType === 'equity'
                  ? 'iwd-analysis-button iwd-analysis-button__active'
                  : 'iwd-analysis-button'
              }
              onClick={handlePageType('equity')}
            >
              Equity
            </button>
            <button
              className={
                pageType === 'debt'
                  ? 'iwd-analysis-button iwd-analysis-button__active'
                  : 'iwd-analysis-button'
              }
              onClick={handlePageType('debt')}
            >
              Debt
            </button>
          </div>
        </div>
      </PageHeader>
      <SnapScrollContainer pages={3}>
        <ChartsContainer
          data={graphData}
          page={pageType}
        />
        {pageType === 'equity' ? 
          <TopStocks topStocks={topHoldings.equity} /> :
          <TopHoldings topHoldings={topHoldings.debt} />
        }
        <TopAMCS topAMCs={topAMCs[pageType]} />
      </SnapScrollContainer>
    </section>
  );
}

function MarketCapAllocation({ data }) {
  return (
    <div className="iwd-analysis-graph-left" id="iwd-market-alloc">
      <header className="iwd-card-header">
        Rating wise exposure
      </header>
      <section className="iwd-agl-content">
        <div className="iwd-chart">
          <IwdBubbleChart data={data} />
        </div>
        <Legends
          data={data}
          columns={1}
          classes={{
            container: 'iwd-aglc-legend',
            child: 'iwd-aglc-legend-child'
          }}
        />
      </section>
    </div>
  );
}

function TopSectorAllocation({ data = {} }) {
  return (
    <div className="iwd-analysis-graph-right" id="iwd-sector-alloc">
      <header className="iwd-card-header">
        Top sector allocation
      </header>
      <section className="iwd-agr-content">
        <div className="iwd-chart">
          <IwdBarChart data={data} />
        </div>
        <div className="iwd-sector-alloc-legend">
          {Object.entries(data).map(([key, value], idx) => (
            <div className="iwd-sal-item" key={idx}>
              <span className="iwd-sali-label">{key}</span>
              <span className="iwd-sali-value">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RatingWiseExposure({ data }) {
  return (
    <div className="iwd-analysis-graph-left" id="iwd-rating-exposure">
      <header className="iwd-card-header">
        Rating wise exposure
      </header>
      <section className="iwd-agl-content">
        <div className="iwd-chart">
          <IwdBubbleChart data={data} />
        </div>
        <Legends
          data={data}
          columns={2}
          classes={{
            container: 'iwd-aglc-legend',
            child: 'iwd-aglc-legend-child'
          }}
        />
      </section>
    </div>
  );
}

function MaturityWiseExposure({ data }) {
  return (
    <div className="iwd-analysis-graph-right" id="iwd-maturity-exposure">
      <header className="iwd-card-header">
        Maturity wise exposure
      </header>
      <section className="iwd-agr-content">
        <div className="iwd-chart">
          <IwdBarChart data={data} />
        </div>
        <Legends
          data={data}
          classes={{
            container: 'iwd-agrc-legend',
            child: 'iwd-agrc-legend-child'
          }}
        />
      </section>
    </div>
  );
}

function ChartsContainer({ data, page }) {
  return (
    <div className="iwd-scroll-child" data-pgno="1">
      {page === 'equity' ?
        <>
          <MarketCapAllocation data={data.market_cap_alloc} />
          <TopSectorAllocation data={data.sector_alloc} />
        </> :
        <>
          <RatingWiseExposure data={data.rating_exposure} />
          <MaturityWiseExposure data={data.maturity_exposure} />
        </>
      }
    </div>
  );
}

function TopStocks({ topStocks }) {
  return (
    <div className="iwd-scroll-child" data-pgno="2">
      <div className="iwd-analysis-card">
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
        <div className="iwd-analysis-portfolios-equity">
          {topStocks.map(
            ({
              holding_sector_name: heading,
              instrument_name: company,
              share: percentage,
            }) => (
              <div className="iwd-analysis-portfolio-stock" key={company}>
                <picture>
                  <img
                    src={topStocksIconMappings[heading] || IcSecFMCGIcon}
                    alt={heading}
                  />
                </picture>
                <main>
                  <div className="iwd-analysis-portfolio-heading">
                    {heading}
                  </div>
                  <div className="iwd-analysis-portfolio-name">{company}</div>
                  <div className="iwd-analysis-portfolio-percentage">
                    {percentage}%
                  </div>
                </main>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function TopHoldings({ topHoldings }) {
  return (
    <div className="iwd-scroll-child" data-pgno="2">
      <div className="iwd-analysis-card">
        <h2 className="iwd-card-header">Top holdings in portfolio</h2>
        <div className="iwd-analysis-portfolios-equity">
          {topHoldings.map(({ instrument_name: name, share: percentage }) => (
            <div className="iwd-analysis-debt-holding" key={name}>
              <div className="iwd-analysis-debt-holding-logo">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="iwd-analysis-debt-holding-details">
                <div className="iwd-analysis-debt-holding-name">{name}</div>
                <div className="iwd-analysis-debt-holding-percentage">
                  {percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopAMCS({ topAMCs }) {
  return (
    <div className="iwd-scroll-child" data-pgno="3">
      <div className="iwd-analysis-card">
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
        <div className="iwd-analysis-top-amcs">
          {topAMCs.map(
            ({ amc_logo: logo, amc_name: name, share: percentage }) => (
              <div className="iwd-analysis-amc" key={name}>
                  <img src={logo} alt={name} className="iwd-analysis-amc-logo"/>
                <main>
                  <div className="iwd-analysis-amc-name">{name}</div>
                  <div className="iwd-analysis-amc-percentage">
                    {percentage}%
                  </div>
                </main>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Analysis;
