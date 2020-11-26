import React from 'react';
import PageHeader from '../mini-components/PageHeader';
import StatementCard from '../mini-components/StatementCard';
import { getConfig } from 'utils/functions';
const isMobileView = getConfig().isMobileDevice;
const Statements = () => {
  return (
    <div className='iwd-page' id='iwd-dashboard'>
      <PageHeader height={isMobileView ? '7vh' : '9vh'} hideProfile={isMobileView}>
        <>
          <div className='iwd-header-title'>Dashboard</div>
          <div className='iwd-header-subtitle'>Welcome back, Uttam</div>
        </>
      </PageHeader>
      <section className='iwd-statements-container'>
        {[1, 2, 3, 4, 1].map((el, idx) => (
          <StatementCard key={idx} />
        ))}
      </section>
    </div>
  );
};

export default Statements;
