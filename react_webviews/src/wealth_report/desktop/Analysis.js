import React from 'react';
import PieChart from '../mini-components/PieChart';
import { dummyAlloc, dummySector } from '../constants';
import { getConfig } from 'utils/functions';
import WrTable from '../mini-components/WrTable';
const isMobileDevice = getConfig().isMobileDevice;

export default function Analysis() {
  return (
    <React.Fragment>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Allocation</div>
        <div id="wr-analysis-graph">
          <PieChart
            height={isMobileDevice ? 200 : 280}
            width={isMobileDevice ? 200 : 280}
            data={dummyAlloc}
            // margin={{ bottom: 100, left: 40 }}
          ></PieChart>
          <div className="wr-allocation-graph-legend">
            {dummyAlloc.map(alloc => (
              <div className="wr-agl-item">
                <div className="wr-agl-item-label">{alloc.label}</div>
                <div className="wr-agl-item-value">{alloc.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Sector Distribution</div>
        <div id="wr-analysis-graph">
          <PieChart
            height={isMobileDevice ? 200 : 280}
            width={isMobileDevice ? 200 : 280}
            data={dummySector}
          // margin={{ bottom: 100, left: 40 }}
          ></PieChart>
          <div className="wr-sector-graph-legend">
            {dummySector.map(({ label, value, color }) => (
              <div className="wr-sgl-item">
                <div className="wr-sgl-item-chip" style={{ backgroundColor: color || 'red' }}></div>
                <span className="wr-sgl-item-label">{label} · {Number(value).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Top Holdings</div>
        <div id="wr-analysis-top-holdings">
          <div className="wr-table-container">
            <WrTable></WrTable>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}