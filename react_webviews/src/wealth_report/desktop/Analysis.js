import React, { useState, useEffect, Fragment } from 'react';
import PieChart from '../mini-components/PieChart';
import toast from '../../common/ui/Toast';
import { TriColorScheme, MultiColorScheme } from '../constants';
import { getConfig } from 'utils/functions';
import WrTable from '../mini-components/WrTable';
import { fetchAnalysis } from '../common/ApiCalls';
import { isEmpty } from '../../utils/validators';
import { CircularProgress } from 'material-ui';
const isMobileDevice = getConfig().isMobileDevice;
const tabSpecificData = {
  equity: {
    graph1Name: 'Allocation',
    graph1Accessor: 'allocation',
    graph2Name: 'Sector distribution',
    graph2Accessor: 'sector_dist',
  },
  debt: {
    graph1Name: 'Ratio wise exposure',
    graph1Accessor: 'ratio_wise_exposure',
    graph2Name: 'Maturity wise exposure',
    graph2Accessor: 'maturity_wise_exposure',
  },
};
const tableHeadersMap = [{
  label: 'Holding Name',
  accessor: 'holding_name',
}, {
  label: 'Instrument',
  accessor: 'holding_type',
}, {
  label: '% Share',
  accessor: 'share',
}];

export default function Analysis(props) {
  const [selectedTab, setTab] = useState('equity');
  const [graph1Data, setGraph1] = useState([]);
  const [graph2Data, setGraph2] = useState([]);
  const [holdingsData, setHoldings] = useState([]);
  const [graphLoading, setGraphLoad] = useState(true);

  const [analysisData, setAnalysisData] = useState({
    debt_dict: {},
    equity_dict: {},
    top_holdings: {},
    percent_split: {},
  });
  useEffect(() => {
    (async() => {
      try {
        setGraphLoad(true);
        const data = await fetchAnalysis({ pan: props.pan });
        setAnalysisData(data);
        initialiseTabData(data);
        setGraphLoad(false);
      } catch (err) {
        console.log(err);
        toast(err);
      }
    })();
  }, [props.pan]);

  const initialiseTabData = (data) => {
    console.log(data, !data);
    if (!data || isEmpty(data)) data = analysisData || {};
    const { graph1Accessor, graph2Accessor } = tabSpecificData[selectedTab];
    setGraph1(data[`${selectedTab}_dict`][graph1Accessor] || []);
    setGraph2(data[`${selectedTab}_dict`][graph2Accessor] || []);
    setHoldings(data.top_holdings[selectedTab]);
  };

  return (
    <React.Fragment>
      <div className="wr-card-template">
        <div className="wr-card-template-header">
          {(tabSpecificData[selectedTab] || {}).graph1Name}
        </div>
        <div id="wr-analysis-graph">
          {graphLoading ?
            (
              <div style={{textAlign: 'center'}}>
                <CircularProgress size={50} thickness={4} />
              </div>
            ) :
            (
              <Fragment>
                <PieChart
                  height={isMobileDevice ? 200 : 280}
                  width={isMobileDevice ? 200 : 280}
                  data={graph1Data}
                  colors={TriColorScheme}
                  // margin={{ bottom: 100, left: 40 }}
                ></PieChart>
                <div className="wr-allocation-graph-legend">
                  {graph1Data.map((alloc, idx) => (
                    <div className="wr-agl-item" style={{ backgroundColor: TriColorScheme[idx] }}>
                      <div className="wr-agl-item-label">{alloc.label}</div>
                      <div className="wr-agl-item-value">{alloc.value}%</div>
                    </div>
                  ))}
                </div>
              </Fragment>
            )
          }
        </div>
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">
          {(tabSpecificData[selectedTab] || {}).graph2Name}
        </div>
        <div id="wr-analysis-graph">
          {graphLoading ?
            (
              <div style={{textAlign: 'center'}}>
                <CircularProgress size={50} thickness={4} />
              </div>
            ) :
            (
              <Fragment>
                <PieChart
                  height={isMobileDevice ? 200 : 280}
                  width={isMobileDevice ? 200 : 280}
                  data={graph2Data}
                  colors={MultiColorScheme}
                // margin={{ bottom: 100, left: 40 }}dummySector
                ></PieChart>
                <div className="wr-sector-graph-legend">
                  {graph2Data.map(({ label, value }, idx) => (
                    <div className="wr-sgl-item">
                      <div className="wr-sgl-item-chip" style={{ backgroundColor: MultiColorScheme[idx] || 'grey' }}></div>
                      <span className="wr-sgl-item-label">{label} · {Number(value).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </Fragment>
            )
          }
        </div>
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Top Holdings</div>
        <div id="wr-analysis-top-holdings">
          <div className="wr-table-container">
            <WrTable
              data={holdingsData}
              headersMap={tableHeadersMap}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}