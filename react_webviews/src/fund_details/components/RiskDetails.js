import React, { useMemo, memo } from 'react';
import TableData from '../common/TableData';
import Report from '../common/Report';
import { capitalize } from 'utils/functions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
const RiskDetails = ({
  riskDetailsData: { return_vs_category, risk_measures, risk_vs_category },
}) => {
  return (
    <div className='fund-risk-details'>
      {risk_vs_category && (
        <>
          <Report title='Risk vs. Category*'>
            <RenderHorizontalStatus status={risk_vs_category} />
          </Report>
        </>
      )}
      {return_vs_category && (
        <>
          <Divider className='fd-risk-divider' />
          <Report title='Return vs. Category*'>
            <RenderHorizontalStatus status={return_vs_category} />
          </Report>
        </>
      )}
      {risk_measures?.length > 0 && (
        <>
          <Divider className='fd-risk-divider' />
          <Report title='Risk Measures'>
            {risk_measures.length > 0 ? (
              <TableData data={risk_measures} isRiskMeasure/>
            ) : (
              <Typography style={{ color: '#878787', fontSize: '14px', paddingLeft: '15px' }}>
                N/A
              </Typography>
            )}
          </Report>
        </>
      )}
    </div>
  );
};

const RenderHorizontalStatus = ({ status }) => {
  status = useMemo(() => capitalize(status), [status]);

  return (
    <>
      <div className='risk-status'>
        <span className={`hr-light-grey sub-bar ${status.match(/^Low/i) && 'selected'}`}>
          <div className='tooltip'>{status.match(/^Low/i) && status}</div>
        </span>
        <span className={`hr-light-grey sub-bar  ${status.match(/^Below Average/i) && 'selected'}`}>
          <div className='tooltip'>{status.match(/^Below Average/i) && status}</div>
        </span>
        <span className={`hr-light-grey sub-bar ${status.match(/^Average/i) && 'selected'}`}>
          <div className='tooltip'>{status.match(/^Average/i) && status}</div>
        </span>
        <span className={`hr-light-grey sub-bar ${status.match(/^Above Average/i) && 'selected'}`}>
          <div className='tooltip'>{status.match(/^Above Average/i) && status}</div>
        </span>
        <span className={`hr-light-grey sub-bar ${status.match(/^High/i) && 'selected '}`}>
          <div className='tooltip'>{status.match(/^High/i) && status}</div>
        </span>
      </div>
      <div className='fd-status-range'>
        <Typography className='status-text'>Low</Typography>
        <Typography className='status-text'>Average</Typography>
        <Typography className='status-text'>High</Typography>
      </div>
    </>
  );
};

export default memo(RiskDetails);
