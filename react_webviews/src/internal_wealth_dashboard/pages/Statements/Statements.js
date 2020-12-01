import React, { useState } from 'react';
import PageHeader from '../../mini-components/PageHeader';

import { getConfig } from 'utils/functions';
import HeaderNavBar from '../../common/HeaderNavBar';

import CapitalGainTax from './CapitalGainTax';
import Elss from './Elss';
import Transactions from './Transactions';
const isMobileView = getConfig().isMobileDevice;
const Statements = () => {
  const [pageType, setPageType] = useState('transactions');
  const handlePageType = (name) => {
    setPageType(name);
  };

  const pageTypeMapper = {
    transactions: {
      component: <Transactions />,
    },
    'capital gain tax': {
      component: <CapitalGainTax name='Capital gain tax' />,
    },
    'elss report': {
      component: <Elss name='ELSS report' />,
    },
  };
  return (
    <div className='iwd-page'>
      <PageHeader height='10vh' hideProfile={isMobileView}>
        <HeaderNavBar
          title='Statements'
          tabs={Object.keys(pageTypeMapper).map((key) => key)}
          handlePageType={handlePageType}
        />
      </PageHeader>
      <section className='iwd-statements-container'>{pageTypeMapper[pageType].component}</section>
    </div>
  );
};

export default Statements;
