import React, { useEffect, useState } from 'react';
import { TimeLine, Timelines } from '../../designSystem/atoms/TimelineList';
import {
  fetchFundGraphData,
  getFundData,
  setFundTimePeriod,
} from 'businesslogic/dataStore/reducers/fundDetails';
import isEmpty from 'lodash/isEmpty';
import format from 'date-fns/format';
import Api from '../../utils/api';

import './FundGraph.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getUrlParams } from '../../utils/validators';
import useLoadingState from '../../common/customHooks/useLoadingState';
import FundCommonGraph from './FundCommonGraph';
import { useParams } from 'react-router-dom';

const screen = 'fundDetailsV2';

const getTimeInMs = (time) => time * 60 * 60 * 24 * 1000;
const FundGraph = () => {
  let { isins } = getUrlParams();
  const {isin = ''} = useParams();
  const [graphData, setGraphData] = useState([]);
  const fundData = useSelector(getFundData);
  const fundTimePeriod = useSelector((state) => state?.fundDetails?.fundTimePeriod);
  const fundGraphData = useSelector((state) => state?.fundDetails?.fundGraphData);
  const { loadingData } = useLoadingState(screen);
  const disptach = useDispatch();
  const [periodWiseData, setPeriodWiseData] = useState({});

  const getGraphData = async (dataGraph) => {
    if (isEmpty(dataGraph)) {
      dataGraph = {};
    }
    let graph_data = {};
    const fundIsin = isin || isins;
    const payload = {
      isin: fundIsin,
      Api,
      screen,
    };
    const fundGraphDataIsin = dataGraph?.graph_report?.[0]?.isin;
    if (fundIsin !== fundData?.isin && fundGraphDataIsin !== fundIsin) {
      disptach(fetchFundGraphData(payload));
    } else {
      if (isEmpty(dataGraph)) {
        disptach(fetchFundGraphData(payload));
      } else {
        graph_data = { ...dataGraph };
      }
    }
    if (isEmpty(dataGraph)) return null;

    const amfi_data = [...graph_data.graph_report?.[0].graph_data_for_amfi];
    const maxi = amfi_data[amfi_data.length - 1][0];
    const one_month_minimum = maxi - getTimeInMs(30);
    const three_month_minimum = maxi - getTimeInMs(90);
    const six_month_minimum = maxi - getTimeInMs(180);
    const one_year_minimum = maxi - getTimeInMs(365);
    const three_year_minimum = maxi - getTimeInMs(1095);
    const five_year_minimum = maxi - getTimeInMs(1825);
    let choppedData = {
      '1M': [],
      '3M': [],
      '6M': [],
      '1Y': [],
      '3Y': [],
      '5Y': [],
    };
    for (let i = 0; i < amfi_data.length; i++) {
      let presentValue = amfi_data[i][0];
      if (presentValue <= maxi) {
        if (presentValue >= one_month_minimum) {
          choppedData['1M'].push(amfi_data[i]);
        }
        if (presentValue >= three_month_minimum) {
          choppedData['3M'].push(amfi_data[i]);
        }
        if (presentValue >= six_month_minimum) {
          choppedData['6M'].push(amfi_data[i]);
        }
        if (presentValue >= one_year_minimum) {
          choppedData['1Y'].push(amfi_data[i]);
        }
        if (presentValue >= three_year_minimum) {
          choppedData['3Y'].push(amfi_data[i]);
        }
        if (presentValue >= five_year_minimum) {
          choppedData['5Y'].push(amfi_data[i]);
        }
      }
    }
    setPeriodWiseData(choppedData);
    setGraphData(amfi_data);
  };
  useEffect(() => {
    getGraphData(fundGraphData);
  }, [fundGraphData]);

  const handleTimePeriodChange = (e, value) => {
    disptach(setFundTimePeriod(value));
    const newData = [...periodWiseData[value]];
    setGraphData(newData);
  };
  function labelFormatter() {
    if (this.isFirst) return '<p class="xaxis-label">' + format(this.pos, 'd MMM yyyy') + '</p>';
    if (this.isLast) return '<p class="xaxis-label">TODAY</p>';
    if (fundTimePeriod === '3Y' || fundTimePeriod === '1Y' || fundTimePeriod === '5Y')
      return '<p class="xaxis-label">' + format(this.pos, 'yyyy') + '</p>';
    if (fundTimePeriod === '3M' || fundTimePeriod === '6M' || fundTimePeriod === '1M')
      return '<p class="xaxis-label">' + format(this.pos, 'd MMM') + '</p>';
  }
  return (
    <div className='fund-graph-wrapper'>
      <FundCommonGraph
        isGraphLoading={loadingData.isGraphLoading}
        graphData={graphData}
        labelFormatter={labelFormatter}
      />
      <Timelines
        onChange={handleTimePeriodChange}
        value={fundTimePeriod}
        className='fund-details-timeline'
      >
        {timeLines?.map((el, id) => {
          const isDisabled = id > fundData?.performance.returns.length - 1;
          return (
            <TimeLine
              disabled={isDisabled || loadingData.isGraphLoading}
              key={id}
              label={el.label}
              value={el.value}
              dataAid={id}
            />
          );
        })}
      </Timelines>
    </div>
  );
};

const timeLines = [
  {
    label: '1M',
    value: '1M',
  },
  {
    label: '3M',
    value: '3M',
  },
  {
    label: '6M',
    value: '6M',
  },
  {
    label: '1Y',
    value: '1Y',
  },
  {
    label: '3Y',
    value: '3Y',
  },
  {
    label: '5Y',
    value: '5Y',
  },
];

export default FundGraph;
