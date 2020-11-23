import React, { createRef, useEffect, useState } from 'react';

import PageHeader from '../mini-components/PageHeader';
import PageFooter from '../mini-components/PageFooter';

import { getConfig } from 'utils/functions';

import EquityAnalysis from '../mini-components/EquityAnalysis';
import DebtAnalysis from '../mini-components/DebtAnalysis';

import AnalysisError from '../mini-components/AnanlysisError';

import { fetchPortfolioAnalysis } from '../common/ApiCalls';

import TopAMCS from '../mini-components/TopAMCS';
import Legends from '../mini-components/Legends';

const isMobileView = getConfig().isMobileDevice;

function Analysis(props) {
  const [pageType, setPageType] = useState('equity');
  const container = createRef();
  const parent = createRef();
  const title = createRef();
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect(() => {
  //   setEventHandler();
  //   fetchPortfolioAnalysis()
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

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
      <div className="iwd-p-scroll-contain added" ref={container}>
        {pageType === 'equity' ? (
          <>
            <Legends />
            {/* <AnalysisError /> */}
            <EquityAnalysis />
            <TopAMCS />
          </>
        ) : (
          <>
            <Legends />
            <DebtAnalysis />
            <TopAMCS />
          </>
        )}
      </div>

      {!isMobileView && (
        <PageFooter
          currentPage={currentPage}
          totalPages="3"
          direction={currentPage === 3 ? 'up' : 'down'}
          onClick={scrollPage}
        />
      )}
    </section>
  );
}

export default Analysis;
