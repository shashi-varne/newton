import { IconButton } from 'material-ui';
import React, { createRef, useEffect, useState } from 'react';
import PageFooter from '../mini-components/PageFooter';
import PageHeader from '../mini-components/PageHeader';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

const Dashboard = () => {
  const container = createRef();
  const parent = createRef();
  const title = createRef();

  const setEventHandler = () => {
    if (!isMobileView) {
      const { current: elem } = container;
      const { current: father } = parent;
      const { current: titleOb } = title;

      elem.addEventListener('scroll', function () {
        console.log(elem.scrollTop, elem.scrollHeight);
        const htby2 = elem.scrollHeight / 2;
        const val = elem.scrollTop / htby2;
        father.style.background =
          `linear-gradient(
          180deg,
          rgb(79, 45, 167) ${(1 - val) * 100}%,
          #ececec ${(1 - val) * 100}% ${val * 100}% 
        )`;
        // console.log(father);
        if (elem.scrollTop > 500) {
          // elem.classList.remove('added');
          titleOb.style.color = 'black';
          // father.style.background = 'rgba(0, 0, 0, 0)';
          // father.style.opacity = '0';
        } else {
          // elem.classList.add('added');
          titleOb.style.color = 'white';
          // father.style.background = 'var(--primary)';
          // father.style.opacity = '1';
        }
      });
    } else {
      const { current: elem } = container;
      const { current: father } = parent;
      const { current: titleOb } = title;

      elem.addEventListener('scroll', function () {
        console.log(elem.scrollTop, elem.scrollHeight);
        const htby2 = elem.scrollHeight / 2;
        if (elem.scrollTop + 40 > htby2) {
          titleOb.style.color = 'black';
          father.style.background = '#F9FCFF';
        } else {
          titleOb.style.color = 'white';
          father.style.background = 'var(--primary)';
        }
      });
    }
  };

  useEffect(() => {
    setEventHandler();
  }, []);

  return (
    <div className="iwd-page" id="iwd-dashboard" ref={parent}>
      <PageHeader height={isMobileView ? '7vh' : '9vh'} hideProfile={true}>
        <>
          <div className="iwd-header-title" ref={title}>Dashboard</div>
          <div className="iwd-header-subtitle">Welcome back, Uttam</div>
        </>
      </PageHeader>
      <div className="iwd-p-scroll-contain added" ref={container}>
        <div className="iwd-p-scroll-child">
          <div id="iwd-d-numbers">
            <div className="iwd-dn-box">
              <div className="iwd-dnb-value">
                ₹72.1 Lacs
              </div>
              <div className="iwd-dnb-label">
                Current value
              </div>
            </div>
            <div className="iwd-dn-box">
              <div className="iwd-dnb-value">
                ₹56.3 Lacs
              </div>
              <div className="iwd-dnb-label">
                Invested value
              </div>
            </div>
            <div className="iwd-dn-box">
              <div className="iwd-dnb-value">
                ₹10.5 Lacs
              </div>
              <div className="iwd-dnb-label">
                Total Realised Gains
              </div>
            </div>
            <div className="iwd-dn-box">
              <div className="iwd-dnb-value">
                17%
              </div>
              <div className="iwd-dnb-label">
                XIRR
              </div>
            </div>
          </div>
          <div id="iwd-d-asset-alloc">

          </div>
        </div>
        <div className="iwd-p-scroll-child">
          <div id="iwd-d-risk">
            <div className="iwd-card-header">Risk analysis</div>
            <div id="iwd-dr-data">
              <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
                <div className="iwd-drb-label">Return</div>
                <div className="iwd-drb-value">6%</div>
              </div>
              <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
                <div className="iwd-drb-label">Alpha</div>
                <div className="iwd-drb-value">8%</div>
              </div>
              <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom' : ''}`}>
                <div className="iwd-drb-label">Volatility</div>
                <div className="iwd-drb-value">9%</div>
              </div>
              <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
                <div className="iwd-drb-label">Beta</div>
                <div className="iwd-drb-value">1.2</div>
              </div>
              <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
                <div className="iwd-drb-label">Sharpe Ratio</div>
                <div className="iwd-drb-value">2.3</div>
              </div>
              <div className="iwd-dr-box">
                <div className="iwd-drb-label">Information Ratio</div>
                <div className="iwd-drb-value">1.2</div>
              </div>
            </div>

          </div>
          <div id="iwd-d-newsletter">
            <div className="iwd-card-header">
              Open source and non-custodial protocol enabling the creation of money markets
            </div>
            <IconButton className="iwd-dn-btn">
              <ChevronRight color="white" />
            </IconButton>
            <div id="iwd-dn-gist">
              Equities | Fixed Income | Situational
            </div>
            <div id="iwd-dn-issue">Fisdom Outlook: jULY 2020</div>
          </div>
        </div>
      </div>
      {!isMobileView && <PageFooter currentPage="1" totalPages="2" />}
    </div>
  );
};

export default Dashboard;