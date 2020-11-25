import React, { Fragment, useEffect, useState } from 'react';

import PageHeader from '../mini-components/PageHeader';

import { topAMCs as amcs } from '../constants';

import { getConfig } from 'utils/functions';

import Legends from '../mini-components/Legends';

import {
  fetchPortfolioAnalysisMock,
  fetchPortfolioAnalysis,
} from '../common/ApiCalls';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';

import IwdComputerIcon from '../../assets/fisdom/iwd-computer.svg';
import SBIIcon from '../../assets/fisdom/sbi.svg';
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

  const [topSectorAllocations, setTopSectorAllocations] = useState(null);
  const [ratingWiseExposure, setRatingWiseExposure] = useState(null);
  const [maturityWiseExposure, setMaturityWiseExposure] = useState(null);
  const [topHoldings, setTopHoldings] = useState(null);
  const [topAMCs, setTopAMCs] = useState(null);
  const [marketCapAllocations, setMarketCapAllocations] = useState(null);

  const [error, setError] = useState(null);

  const getPortfolio = async (pageType) => {
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
        rating_exposure,
        top_holdings,
        top_amcs,
        sector_alloc,
        market_cap_alloc,
        maturity_exposure,
      } = result;

      setRatingWiseExposure({ ...rating_exposure });
      setTopSectorAllocations({ ...sector_alloc });
      setMaturityWiseExposure({ ...maturity_exposure });
      setTopAMCs({ ...top_amcs });
      setTopHoldings({ ...top_holdings });
      setMarketCapAllocations({ ...market_cap_alloc });
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
    !ratingWiseExposure ||
    !topSectorAllocations ||
    !maturityWiseExposure ||
    !topHoldings ||
    !marketCapAllocations
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
        {pageType === 'equity' ? (
          <>
            <div className="iwd-scroll-child" data-pgno="1">
              <div className="iwd-analysis-chart-container">
                <TopSectorAllocations
                  topSectorAllocations={topSectorAllocations}
                />
                <MarketCapAllocations
                  marketCapAllocations={marketCapAllocations}
                />
              </div>
            </div>
            <TopStocks topStocks={topHoldings.equity} />
            <TopAMCS topAMCs={topAMCs.equity} />
          </>
        ) : (
          <>
            <ChartsContainer
              ratingWiseExposure={ratingWiseExposure}
              maturityWiseExposure={maturityWiseExposure}
            />
            <TopHoldings topHoldings={topHoldings.debt} />
            <TopAMCS topAMCs={topAMCs.debt} />
          </>
        )}
      </SnapScrollContainer>
    </section>
  );
}

function TopSectorAllocations({ topSectorAllocations }) {
  return (
    <div className="iwd-analysis-card">
      <h2 className="iwd-card-header">Top Sector Allocations</h2>
      <main className="iwd-analysis-top-sector-allocation-chart-container">
        {Object.entries(topSectorAllocations).map(([name, share]) => (
          <Fragment key={name}>
            <div
              className="iwd-analysis-top-sector-allocation-chart"
              style={{ width: `${share}%`, opacity: share / 100 + 0.3 }}
            ></div>
          </Fragment>
        ))}
      </main>
      <section className="iwd-analysis-top-sector-allocation-container">
        <ul className="iwd-analysis-top-sector-allocation-list">
          {Object.entries(topSectorAllocations).map(([name, share]) => (
            <li className="iwd-analysis-top-sector-allocation-item" key={name}>
              <div className="iwd-analysis-top-sector-allocation-name">
                {name}
              </div>
              <div className="iwd-analysis-top-sector-allocation-name">
                {share}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function MarketCapAllocations({ marketCapAllocations }) {
  return (
    <div className="iwd-analysis-card">
      <h2 className="iwd-card-header">Market cap allocation</h2>
      <section className="iwd-analysis-market-cap-allocation-container">
        <div className="iwd-chart"></div>
        <Legends legends={marketCapAllocations} row={3} />
      </section>
    </div>
  );
}

function RatingWiseExposure({ ratingWiseExposure }) {
  return (
    <div className="iwd-card" style={{ flex: '1 0 50%' }}>
      <header className="iwd-card-header">
        <h2 className="iwd-card-header">Rating wise exposure</h2>
      </header>
      <section className="iwd-analysis-ratings-exposure-container">
        <div className="iwd-chart"></div>
        <Legends legends={ratingWiseExposure} />
      </section>
    </div>
  );
}

function MaturityWiseExposure({ maturityWiseExposure }) {
  return (
    <div className="iwd-card" style={{ flex: '1 0 50%' }}>
      <header className="iwd-card-header">
        <h2 className="iwd-card-header">Maturity wise exposure</h2>
      </header>
      <main className="iwd-analysis-top-sector-allocation-chart-container">
        {Object.entries(maturityWiseExposure).map(([name, share]) => (
          <Fragment key={name}>
            <div
              className="iwd-analysis-top-sector-allocation-chart"
              style={{ width: `${share}%`, opacity: share / 100 + 0.3 }}
            ></div>
          </Fragment>
        ))}
      </main>
      <section className="iwd-analysis-maturity-exposure-container">
        <div className="iwd-chart"></div>
        <Legends legends={maturityWiseExposure} />
      </section>
    </div>
  );
}

function ChartsContainer({ ratingWiseExposure, maturityWiseExposure }) {
  return (
    <div className="iwd-scroll-child" data-pgno="1">
      <div className="iwd-analysis-chart-container">
        <RatingWiseExposure ratingWiseExposure={ratingWiseExposure} />
        <MaturityWiseExposure maturityWiseExposure={maturityWiseExposure} />
      </div>
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
                    {percentage}
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
                    {percentage}
                  </div>
                </main>
              </div>
            )
          )}
          {/* {amcs.map(
            ({ name, percentage }) => (
              <div className="iwd-analysis-amc" key={name}>
                <picture>
                  <img src={SBIIcon} alt={name} />
                </picture>
                <main>
                  <div className="iwd-analysis-amc-name">{name}</div>
                  <div className="iwd-analysis-amc-percentage">
                    {percentage}
                  </div>
                </main>
              </div>
            )
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Analysis;
