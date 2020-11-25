import React, { createRef, useEffect, useState } from 'react';

import PageHeader from '../mini-components/PageHeader';

import { getConfig } from 'utils/functions';

import EquityAnalysis from '../mini-components/EquityAnalysis';
import DebtAnalysis from '../mini-components/DebtAnalysis';
import Legends from '../mini-components/Legends';

import { fetchPortfolioAnalysisMock } from '../common/ApiCalls';

import TopAMCS from '../mini-components/TopAMCS';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';
import IwdBubbleChart from '../mini-components/IwdBubbleChart';
import IwdBarChart from '../mini-components/IwdBarChart';
import LoaderScreen from '../../common/responsive-components/LoaderScreen';
import { CircularProgress } from 'material-ui';

const isMobileView = getConfig().isMobileDevice;

function Analysis() {
  const [pageType, setPageType] = useState('equity');
  const container = createRef();
  const parent = createRef();
  const title = createRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    fetchPortfolioAnalysisMock()
      .then(
        ({
          top_holdings: topHoldings,
          top_amcs: topAmcs,
          ...graphDataPoints
        }) => {
          setGraphData(graphDataPoints);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePageType = (name) => () => {
    if (['equity', 'debt'].includes(name)) {
      setPageType(name);
    }
  };

  // if (!ratingWiseExposure || !topSectorAllocations || !maturityWiseExposure) {
  //   return <h1>Loading ...</h1>;
  // }

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
        <ChartsContainer
          data={graphData}
          page={pageType}
        />
        {pageType === 'equity' ? 
          <EquityAnalysis /> :
          <DebtAnalysis />
        }
        <TopAMCS />
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

export default Analysis;
