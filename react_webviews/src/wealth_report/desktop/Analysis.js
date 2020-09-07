import React, { useState, useEffect, Fragment, useRef } from 'react';
import PieChart from '../mini-components/PieChart';
import toast from '../../common/ui/Toast';
import { TriColorScheme, MultiColorScheme, QuadColorScheme, PentaColorScheme } from '../constants';
import { getConfig } from 'utils/functions';
import WrTable from '../mini-components/WrTable';
import { fetchAnalysis } from '../common/ApiCalls';
import CardLoader from '../mini-components/CardLoader';
import WrButton from '../common/Button';
import InternalStorage from '../InternalStorage';
import { isEmpty } from '../../utils/validators';
import ErrorScreen from '../mini-components/ErrorScreen';
const isMobileDevice = getConfig().isMobileDevice;
const tabSpecificData = {
  equity: {
    graph1Name: 'Allocation',
    graph1Accessor: 'allocation',
    graph1ColorScheme: TriColorScheme,
    graph2Name: 'Sector distribution',
    graph2Accessor: 'sector_dist',
    graph2ColorScheme: MultiColorScheme,
  },
  debt: {
    graph1Name: 'Ratio wise exposure',
    graph1Accessor: 'ratio_wise_exposure',
    graph1ColorScheme: PentaColorScheme,
    graph2Name: 'Maturity wise exposure',
    graph2Accessor: 'maturity_wise_exposure',
    graph2ColorScheme: QuadColorScheme,
  },
};
const tableHeadersMap = [{
  label: 'Holding Name',
  accessor: 'holding_name',
}, {
  label: 'Instrument',
  accessor: 'holding_type',
}, {
  label: 'Holding Percentage',
  accessor: 'share',
  formatter: (val) => `${Number(val).toFixed(2)}%`,
}];

export default function Analysis(props) {
  const [selectedTab, setTab] = useState('equity');
  const [tabProps, setTabProps] = useState(tabSpecificData.equity);
  const [graph1Data, setGraph1] = useState([]);
  const [graph1Err, setGraph1Err] = useState(false);
  const [graph2Data, setGraph2] = useState([]);
  const [graph2Err, setGraph2Err] = useState(false);
  const [holdingsData, setHoldings] = useState([]);
  const [graphLoading, setGraphLoad] = useState(true);

  const [analysisData, setAnalysisData] = useState({
    debt_dict: {},
    equity_dict: {},
    top_holdings: {},
    percent_split: {},
  });
  const firstTimeTrigger = useRef(true);
  function usePreviousValue(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
      firstTimeTrigger.current = false;
    });
    if (firstTimeTrigger.current) return value;
    return ref.current;
  }
  const prevPan = usePreviousValue(props.pan);
  useEffect(() => {
    (async() => {
      try {
        setGraphLoad(true);
        let data = InternalStorage.getData('analysisData', props.pan);
        const haveDepsChanged = prevPan !== props.pan;
        if (isEmpty(data) || haveDepsChanged) {
          data = await fetchAnalysis({ pan: props.pan });
          InternalStorage.setData('analysisData', data);
        }
        setAnalysisData(data);
        setGraphLoad(false);
      } catch (err) {
        console.log(err);
        toast(err);
      }
    })();
  }, [props.pan]);

  useEffect(() => {
    if (!isEmpty(analysisData) && !isEmpty(analysisData.percent_split)) {
      if (isEmpty(graph1Data)) setGraph1Err(true);
      if (isEmpty(graph2Data)) setGraph2Err(true);
    }
  }, [graph1Data, graph2Data]);

  const initialiseTabData = () => {
    const data = analysisData || {};
    const { graph1Accessor, graph2Accessor } = tabSpecificData[selectedTab];
    
    setGraph1Err(false);
    setGraph1(data[`${selectedTab}_dict`][graph1Accessor] || []);
    setGraph2Err(false);
    setGraph2(data[`${selectedTab}_dict`][graph2Accessor] || []);
    setHoldings(data.top_holdings[selectedTab] || []);
    setTabProps(tabSpecificData[selectedTab]);
  };

  useEffect(() => {
    initialiseTabData();
    return () => {};
  }, [selectedTab, analysisData]);

  return (
    <React.Fragment>
      <div id="wr-analysis-tabs" className="animated animatedFadeInUp fadeInUp">
        {["equity", "debt"].map((tab, idx) => (
          <WrButton
            classes={{
              root: selectedTab === tab ? "wr-analysis-tab-btn" : "wr-outlined-btn",
            }}
            style={{ marginRight: idx === 0 ? "24px" : 0 }}
            onClick={() => setTab(tab)}
            key={idx}
            disableRipple
          >
            {
              `${tab === 'debt' ? 'Debt & Cash' : tab}
              ${
                Math.round(analysisData.percent_split[tab] || 0) ? 
                ` · ${Math.round(analysisData.percent_split[tab] || 0)}%` : ''
              }`
            }
          </WrButton>
        ))}
      </div>    
      <div className="wr-card-template">
        <div className="wr-card-template-header" >
          {tabProps.graph1Name}
        </div>
        {graph1Err &&
          <ErrorScreen
            useTemplate={true}
            templateSvgPath="fisdom/exclamation"
            templateText={`Could not fetch data for ${tabProps.graph1Name}`}
          />}
        {!graph1Err &&
          <div id="wr-analysis-graph">
            {graphLoading ?
              (
                <CardLoader />
              ) :
              (
                <Fragment>
                  <PieChart
                    height={isMobileDevice ? 200 : 280}
                    width={isMobileDevice ? 200 : 280}
                    data={graph1Data}
                    colors={tabProps.graph1ColorScheme}
                  ></PieChart>
                  <div className="wr-pie-1-legend animated animatedFadeInUp fadeInUp">
                    {graph1Data.map((alloc, idx) => (
                      <div
                        className="wr-p1l-item"
                        style={{ backgroundColor: tabProps.graph1ColorScheme[idx] }}
                        key={idx}>
                        <div className="wr-p1l-item-label">{alloc.label}</div>
                        <div className="wr-p1l-item-value">{Math.round(alloc.value)}%</div>
                      </div>
                    ))}
                  </div>
                </Fragment>
              )
            }
          </div>
        }
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">
          {tabProps.graph2Name}
        </div>
        {graph2Err &&
          <ErrorScreen
            useTemplate={true}
            templateSvgPath="fisdom/exclamation"
            templateText={`Could not fetch data for ${tabProps.graph2Name}`}
          />
        }
        {!graph2Err &&
          <div id="wr-analysis-graph">
            {graphLoading ?
              (
                <CardLoader />
              ) :
              (
                <Fragment>
                  <PieChart
                    height={isMobileDevice ? 200 : 280}
                    width={isMobileDevice ? 200 : 280}
                    data={graph2Data}
                    colors={tabProps.graph2ColorScheme}
                  ></PieChart>
                  <div
                  className="wr-pie-2-legend animated animatedFadeInUp fadeInUp"
                    style={selectedTab === 'debt' ? {
                      height: 'auto',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    } : {}}>
                    {graph2Data.map(({ label, value }, idx) => (
                      <div className="wr-p2l-item" key={idx}
                        style={selectedTab === 'debt' ? {
                          flexBasis : '50%',
                          textAlign: 'center',
                        } : {}}>
                        <div
                          className="wr-p2l-item-chip"
                          style={{ backgroundColor: tabProps.graph2ColorScheme[idx] || 'grey' }}></div>
                        <span className="wr-p2l-item-label">{label} · {Number(value).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </Fragment>
              )
            }
          </div>
        }
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Top Holdings</div>
        <div id="wr-analysis-top-holdings">
          {graphLoading ?
            (<CardLoader />) :
            <WrTable
              data={holdingsData}
              headersMap={tableHeadersMap}
            />
          }
        </div>
      </div>
    </React.Fragment>
  )
};