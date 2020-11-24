import React, { createRef, useEffect, useState } from 'react';

import PageHeader from '../mini-components/PageHeader';

import { getConfig } from 'utils/functions';

import EquityAnalysis from '../mini-components/EquityAnalysis';
import DebtAnalysis from '../mini-components/DebtAnalysis';
import Legends from '../mini-components/Legends'

import { fetchPortfolioAnalysisMock } from '../common/ApiCalls';

import TopAMCS from '../mini-components/TopAMCS';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';

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

  useEffect(() => {
    fetchPortfolioAnalysisMock()
      .then(
        ({
          rating_exposure: ratingExposure,
          top_holdings: topHoldings,
          top_amcs: topAmcs,
          sector_alloc: sectorAlloc,
          market_cap_alloc: marketCapAlloc,
          maturity_exposure: maturityExposure,
        }) => {
          setRatingWiseExposure(ratingExposure);
          setTopSectorAllocations(sectorAlloc);
          setMaturityWiseExposure(maturityExposure);
        }
      )
      .catch((err) => {
        console.log(err);
      });
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

  if (!ratingWiseExposure || !topSectorAllocations || !maturityWiseExposure) {
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
            <EquityAnalysis />
            <TopAMCS />
          </>
        ) : (
          <>
            <ChartsContainer
              ratingWiseExposure={ratingWiseExposure}
              maturityWiseExposure={maturityWiseExposure}
            />
            <DebtAnalysis />
            <TopAMCS />
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
    <div className="iwd-card" style={{ width: '100%'}}>
      <header className="iwd-card-header">
        <h2>Rating wise exposure</h2>
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
        <h2>Maturity wise exposure</h2>
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



export default Analysis;
