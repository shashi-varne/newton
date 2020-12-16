// ------------------ Assets -----------------------
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
// -------------------------------------------------
import React, { useEffect, useState } from 'react';
import { genericErrMsg, GraphDateRanges } from '../../constants';
import { formatGrowthData } from '../../common/commonFunctions';
import IwdGrowthGraph from '../../mini-components/IwdGrowthGraph';
import { isEmpty } from '../../../utils/validators';
import IwdCard from '../../mini-components/IwdCard';
import { getGrowthData, getGrowthXirr } from '../../common/ApiCalls';
import { getConfig } from 'utils/functions';
import DotDotLoader from '../../../common/ui/DotDotLoader';
import { CSSTransition } from 'react-transition-group';

const dateFormatMap = {
  '1 month': "d m'",
  '3 months': "m yy'",
  '6 months': "m yy'",
  '1 year': "m yy'",
  '3 years': "m yy'",
  '5 years': "m yy'",
  'ytd': "m yy'",
};
const isMobileView = getConfig().isMobileDevice;

const PortfolioGrowth = () => {
  const [growthData, setGrowthData] = useState({});
  const [isLoadingGrowth, setIsLoadingGrowth] = useState(true);
  const [growthError, setGrowthError] = useState(false);
  const [xirr, setXirr] = useState('');
  const [isLoadingXirr, setIsLoadingXirr] = useState(true);
  const [selectedRange, setSelectedRange] = useState('ytd');

  useEffect(() => {
    fetchGrowthGraphXirr();
    fetchGrowthGraph();
  }, [selectedRange]);

  const fetchGrowthGraphXirr = async () => {
    try {
      setIsLoadingXirr(true);
      setGrowthError(false);
      const res = await getGrowthXirr({
        date_range: selectedRange,
      });

      setXirr(res.xirr);
    } catch (e) {
      console.error(e);
    }
    setIsLoadingXirr(false);
  };

  const fetchGrowthGraph = async () => {
    try {
      setIsLoadingGrowth(true);
      setGrowthError(false);
      const {
        current: current_amount_data,
        invested: invested_amount_data,
        date_ticks
      } = await getGrowthData({
        date_range: selectedRange,
      });

      if (
        isEmpty(current_amount_data) ||
        isEmpty(invested_amount_data) ||
        isEmpty(date_ticks)
      ) {
        throw new Error(genericErrMsg);
      }
      setGrowthData({
        ...formatGrowthData(current_amount_data, invested_amount_data),
        date_ticks: filterDateTicks(date_ticks),
      });
    } catch (e) {
      console.error(e);
      setGrowthError(true);
      // toast(e);
    }
    setIsLoadingGrowth(false);
  };

  const filterDateTicks = (ticks = []) => {
    if (!isMobileView) return ticks;

    return ticks;
  };

  const GraphRangePicker = () => {
    return (
      <div
        id="iwd-range-picker"
        style={{ cursor: isLoadingGrowth ? "not-allowed" : "pointer" }}>
        {[...GraphDateRanges].reverse().map((rangeObj, idx) => (
          <span
            key={idx}
            onClick={() => isLoadingGrowth ? '' : setSelectedRange(rangeObj.value)}
            className={`
              ${selectedRange === rangeObj.value ? 'selected' : ''}
              iwd-rp-item
            `}>
            {rangeObj.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <IwdCard
      id="iwd-d-growth-graph"
      headerText="Portfolio growth"
      error={isEmpty(growthData) || growthError}
      errorText='Something went wrong! Please retry after some time or contact your wealth manager'
      // isLoading={isLoadingGrowth}
    >
      <>
        <div id="iwd-dgg-filter">
          <GraphRangePicker />
          <div id="iwd-dggf-nav" style={{ color: isLoadingXirr ? '#d3dbe4' : '#767e86'}}>
            <CSSTransition
              in={isLoadingXirr}
              classNames="iwd-fade-animate"
              timeout={500}
            >
              <span>
                {isLoadingXirr ?
                  <DotDotLoader className="iwd-dot-loader" /> :
                  (
                    <>
                      <img
                        src={xirr > 0 ? positive : negative}
                        alt=''
                      />
                      {`${xirr ? Number(xirr).toFixed(1) + '%' : '--'}`}
                    </>
                  )
                }
              </span>
            </CSSTransition>
            XIRR
          </div>
        </div>
        <IwdGrowthGraph
          isLoading={isLoadingGrowth}
          data={growthData.data}
          width="auto"
          height="260px"
          params={{
            date_ticks: growthData.date_ticks,
            min: growthData.min,
            max: growthData.max,
            dateFormat: dateFormatMap[selectedRange],
          }}
        />
      </>
    </IwdCard>
  );
};

export default PortfolioGrowth;

