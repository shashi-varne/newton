import React, { createRef, useState } from 'react';

import PageHeader from '../mini-components/PageHeader';
import PageFooter from '../mini-components/PageFooter';

import IwdComputerIcon from '../../assets/fisdom/iwd-computer.svg';
import SBIIcon from '../../assets/fisdom/sbi.svg';

import { getConfig } from 'utils/functions';

import { topStocks, topAMCs, topHoldings } from '../constants';

const isMobileView = getConfig().isMobileDevice;

function Analysis() {
  const [pageType, setPageType] = useState('equity');
  const container = createRef();
  const parent = createRef();
  const title = createRef();
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="iwd-page iwd-page__analysis" id="iwd-analysis">
      <PageHeader
        height={isMobileView ? '7vh' : '9vh'}
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
      <div className="iwd-p-scroll-contain added" ref={container}>
        <div className="iwd-scroll-child">
          <div className="iwd-analysis-card iwd-card-margin">
            <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
            <div className="iwd-analysis-portfolios-equity">
              {topStocks.map(({ heading, company, percentage }) => (
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
              ))}
            </div>
          </div>
        </div>
        <div className="iwd-scroll-child">
          <div className="iwd-analysis-card iwd-card-margin">
            <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
            <div className="iwd-analysis-top-amcs">
              {topAMCs.map(({ name, percentage }) => (
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
              ))}
            </div>
          </div>
        </div>
        <div className="iwd-scroll-child">
          <div className="iwd-analysis-card iwd-card-margin">
            <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
            <div className="iwd-analysis-portfolios-equity">
              {topHoldings.map(({ name, percentage }) => (
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
      </div>
      {!isMobileView && (
        <PageFooter
          currentPage={currentPage}
          totalPages="3"
          direction={currentPage === 2 ? 'up' : 'down'}
          onClick={scrollPage}
        />
      )}
    </div>
  );
}

export default Analysis;
