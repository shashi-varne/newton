import React from 'react';
import IwdBubbleChart from '../../mini-components/IwdBubbleChart';
import IwdLineChart from '../../mini-components/IwdLineChart';
import IwdCard from '../../mini-components/IwdCard';
import Legends from '../../mini-components/Legends';
import { isEmpty } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { formatPercentVal } from '../../common/commonFunctions';

const isMobileView = getConfig().isMobileDevice;
function MarketCapAllocation({ data = [], isLoading }) {
  // Market cap alloc data not pre-sorted from backend, so sorting here
  data = data.sort(({ share: share1 }, { share: share2 }) => share2 - share1);
  return (
    <IwdCard
      className='iwd-analysis-graph-left'
      id='iwd-market-alloc'
      isLoading={isLoading}
      headerText='Market cap allocation'
      noData={isEmpty(data)}
      noDataText="Oops! There is no data to show here currently."
    >
      <section className='iwd-agl-content'>
        <div className='iwd-chart'>
          <IwdBubbleChart data={data} />
        </div>
        <Legends
          data={data}
          columns={isMobileView ? 3 : 1}
          classes={{
            container: 'iwd-aglc-legend',
            child: 'iwd-aglc-legend-child',
          }}
        />
      </section>
    </IwdCard>
  );
}

function TopSectorAllocation({ data = [], isLoading }) {
  return (
    <IwdCard
      className='iwd-analysis-graph-right'
      id='iwd-sector-alloc'
      isLoading={isLoading}
      noData={isEmpty(data)}
      noDataText="Oops! There is no data to show here currently."
      headerText='Top sector allocation'
    >
      <section className='iwd-agr-content'>
        <div className='iwd-chart'>
          <IwdLineChart data={data} />
        </div>
        <div className='iwd-sector-alloc-legend'>
          {data.map(({name, share}, idx) => (
            <div className='iwd-sal-item' key={idx}>
              <span className='iwd-sali-label'>{name}</span>
              <span className='iwd-sali-value'>{formatPercentVal(share)}</span>
            </div>
          ))}
        </div>
      </section>
    </IwdCard>
  );
}

function RatingWiseExposure({ data = [], isLoading }) {
  return (
    <IwdCard
      className='iwd-analysis-graph-left'
      id='iwd-rating-exposure'
      noData={isEmpty(data)}
      noDataText="Oops! There is no data to show here currently."
      isLoading={isLoading}
      headerText='Rating wise exposure'
    >
      <section className='iwd-agl-content'>
        <div className='iwd-chart'>
          <IwdBubbleChart data={data} />
        </div>
        <Legends
          data={data}
          columns={2}
          classes={{
            container: 'iwd-aglc-legend',
            child: 'iwd-aglc-legend-child',
          }}
        />
      </section>
    </IwdCard>
  );
}

function MaturityWiseExposure({ data = [], isLoading }) {
  return (
    <IwdCard
      className='iwd-analysis-graph-right'
      id='iwd-maturity-exposure'
      error={isEmpty(data)}
      errorText="Something went wrong! Please retry after some time or contact your wealth manager"
      isLoading={isLoading}
      headerText='Maturity wise exposure'
    >
      <section className='iwd-agr-content'>
        <div className='iwd-chart'>
          <IwdLineChart data={data} />
        </div>
        <Legends
          data={data}
          classes={{
            container: 'iwd-agrc-legend',
            child: 'iwd-agrc-legend-child',
          }}
        />
      </section>
    </IwdCard>
  );
}

const ChartsContainer = ({ data = {}, page, isLoading }) => {
  return (
    <div className='iwd-scroll-child' data-pgno='1'>
      {page === 'equity' ? (
        <>
          <MarketCapAllocation data={data.market_cap_alloc} isLoading={isLoading} />
          <TopSectorAllocation data={data.sector_alloc} isLoading={isLoading} />
        </>
      ) : (
        <>
          <RatingWiseExposure data={data.rating_exposure} isLoading={isLoading} />
          <MaturityWiseExposure data={data.maturity_exposure} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default ChartsContainer;
