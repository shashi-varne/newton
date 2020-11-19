import React, { createRef, useState } from 'react';

import PageHeader from '../mini-components/PageHeader';
import PageFooter from '../mini-components/PageFooter';

import IwdComputerIcon from '../../assets/fisdom/iwd-computer.svg';
import SBIIcon from '../../assets/fisdom/sbi.svg';

import { getConfig } from 'utils/functions';

const isMobileView = getConfig().isMobileDevice;

const allocations = [
  { sector: 'Bank', allocation: 29 },
  { sector: 'Refineries/marketing', allocation: 17 },
  { sector: 'Computers-software', allocation: 11 },
  { sector: 'Engineering, designing, construction', allocation: 10 },
  { sector: 'Housing finance', allocation: 8 },
];

const topStocks = [
  { heading: 'Computer-Software', company: 'Infosys Ltd', percentage: 10.06 },
  { heading: 'Banks', company: 'HDFC Bank Ltd.', percentage: 9.12 },
  {
    heading: 'Refineries/Marketing',
    company: 'Reliance Industries Ltd',
    percentage: 9.12,
  },
  {
    heading: 'Computer - Software',
    company: 'Tata Consultancy Ltd.',
    percentage: 10.06,
  },
  { heading: 'NBFC', company: 'Bajaj Finance Ltd', percentage: 9.12 },
  { heading: 'Banks', company: 'Kotak Mahindra Bank Ltd.', percentage: 10.06 },
];

const topAMCs = [
  { name: 'SBI Mutual Fund', percentage: 8 },
  { name: 'L & T Mutual Fund', percentage: 18 },
  { name: 'Aditya Birla Capital', percentage: 9 },
  { name: 'Axis Mutual Fund', percentage: 8 },
  { name: 'Kotak Mututal Fund', percentage: 7 },
  { name: 'ICICI Prudential Asset Management', percentage: 7 },
  { name: 'BNP Paribas', percentage: 5 },
  { name: 'Invesco Asset Management', percentage: 3 },
  { name: 'Pnb Asset Management Company', percentage: 3 },
  { name: 'Hdfc Asset Management', percentage: 5 },
];

function Analysis() {
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

  return (
    <section className="iwd-page iwd-analysis" id="iwd-analysis" ref={parent}>
      <PageHeader
        height={isMobileView ? '7vh' : '9vh'}
        hideProfile={isMobileView}
      >
        <div className="iwd-header-container-left">
          <h1 className="iwd-header-title">Analysis</h1>
          <div className="iwd-header-filters">
            <button className="iwd-analysis-button iwd-analysis-button__active">
              Equity
            </button>
            <button className="iwd-analysis-button">Debt</button>
          </div>
        </div>
      </PageHeader>
      <div className="iwd-p-scroll-contain">
        <div className="iwd-card" style={{ marginTop: '50px' }} ref={container}>
          <h2 className="iwd-card-header">Top Sector Allocation</h2>
          <div className="iwd-sector-allocations">
            {allocations.map(({ sector, allocation }) => (
              <div className="iwd-sector-allocation">
                <div className="iwd-sector-name">{sector}</div>
                <div className="iwd-sector-allocation-percentage">
                  {allocation}%
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="iwd-card" style={{ marginTop: '50px' }}>
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
        <div className="iwd-sector-allocations">
          {allocations.map(({ sector, allocation }) => (
            <div className="iwd-sector-allocation">
              <div className="iwd-sector-name">{sector}</div>
              <div className="iwd-sector-allocation-percentage">
                {allocation}
              </div>
            </div>
          ))}
        </div>
      </div> */}
        <div className="iwd-analysis-card iwd-card-margin" ref={container}>
          <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
          <div className="iwd-analysis-scroll-contain added">
            <div className="iwd-analysis-scroll-child">
              {topStocks.map(({ heading, company, percentage }) => (
                <div className="iwd-analysis-portfolio-stock" key={heading}>
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

        <div className="iwd-analysis-card iwd-card-margin" ref={container}>
          <h2 className="iwd-card-header">Top AMC Exposure</h2>
          <div className="iwd-analysis-scroll-contain added">
            <div className="iwd-analysis-scroll-child">
              {topAMCs.map(({ name, percentage }) => (
                <div className="iwd-analysis-amc" key={name}>
                  <picture>
                    <img src={SBIIcon} alt={name} />
                  </picture>
                  <main>
                    <div className="iwd-analysis-amc-name">{name}</div>
                    <div className="iwd-analysis-amc-percentage">
                      {percentage}%
                    </div>
                  </main>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isMobileView && (
        <PageFooter
          currentPage={currentPage}
          totalPages="2"
          direction={currentPage === 2 ? 'up' : 'down'}
          onClick={scrollPage}
        />
      )}
    </section>
  );
}

export default Analysis;
