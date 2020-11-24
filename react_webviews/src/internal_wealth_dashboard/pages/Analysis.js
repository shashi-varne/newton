import React, { createRef, useEffect, useState } from 'react';

import PageHeader from '../mini-components/PageHeader';

import { getConfig } from 'utils/functions';

import Legends from '../mini-components/Legends';

import {
  fetchPortfolioAnalysisMock,
  fetchPortfolioAnalysis,
} from '../common/ApiCalls';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';

import IwdComputerIcon from '../../assets/fisdom/iwd-computer.svg';
import SBIIcon from '../../assets/fisdom/sbi.svg';

const isMobileView = getConfig().isMobileDevice;

function Analysis() {
  const [pageType, setPageType] = useState('equity');
  const container = createRef();
  const parent = createRef();
  const title = createRef();
  const [currentPage, setCurrentPage] = useState(1);

  const [topSectorAllocations, setTopSectorAllocations] = useState(null);
  const [ratingWiseExposure, setRatingWiseExposure] = useState(null);
  const [maturityWiseExposure, setMaturityWiseExposure] = useState(null);
  const [topHoldings, setTopHoldings] = useState(null);
  const [topAMCs, setTopAMCs] = useState(null);
  
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
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    getPortfolio();
  }, []);

  const setEventHandler = () => {
    const { current: elem } = container;
    const { current: father } = parent;
    const { current: titleOb } = title;

    elem.addEventListener('scroll', function () {
      console.log(elem.scrollTop, elem.scrollHeight);
      const htby2 = elem.scrollHeight / 2;
      if (elem.scrollTop + 40 > htby2) {
        titleOb.style.color = 'black';
        father.style.background = '#F9FCFF';
        setCurrentPage(currentPage < 2 ? currentPage + 1 : 2);
      } else {
        titleOb.style.color = 'white';
        father.style.background = 'var(--primary)';
        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
      }
    });
  };

  const scrollPage = () => {
    const { current: elem } = container;
    elem.scroll({
      top: 500,
      behavior: 'smooth',
    });
  };

  const handlePageType = (name) => () => {
    if (['equity', 'debt'].includes(name)) {
      setPageType(name);
    }
  };

  if (
    !ratingWiseExposure ||
    !topSectorAllocations ||
    !maturityWiseExposure ||
    !topHoldings
  ) {
    return <h1>Loading ...</h1>;
  }



  return (
    <section
      className="iwd-page iwd-page__analysis"
      id="iwd-analysis"
      ref={parent}
    >
      <PageHeader
        height={isMobileView ? '7vh' : '9vh'}
        hideProfile={isMobileView}
      >
        <div className="iwd-header-container-left">
          <h1 className="iwd-header-title">Analysis</h1>
          <div className="iwd-header-filters">
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
            <ChartsContainer
              ratingWiseExposure={ratingWiseExposure}
              maturityWiseExposure={maturityWiseExposure}
            />
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
  return Object.entries(([key, value]) => (
    <div>
      <h1>{key}</h1>
      <h2>{value}</h2>
    </div>
  ));
}

function RatingWiseExposure({ ratingWiseExposure }) {
  return (
    <div className="iwd-card" style={{ width: '100%' }}>
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
    <div className="iwd-card" style={{ width: '100%' }}>
      <header className="iwd-card-header">
        <h2 className="iwd-card-header">Maturity wise exposure</h2>
      </header>
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
      <div className="iwd-analysis-card iwd-card-margin">
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
                  <img src={IwdComputerIcon} alt={heading} />
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
      <div className="iwd-analysis-card iwd-card-margin">
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
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
      <div className="iwd-analysis-card iwd-card-margin">
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
        <div className="iwd-analysis-top-amcs">
          {topAMCs.map(
            ({ amc_logo: logo, amc_name: name, amc_share: percentage }) => (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Analysis;
