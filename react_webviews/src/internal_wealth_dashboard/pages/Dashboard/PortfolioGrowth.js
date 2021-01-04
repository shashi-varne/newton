// ------------------ Assets -----------------------
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
// -------------------------------------------------
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { genericErrMsg, GraphDateRanges } from '../../constants';
import { formatGrowthData } from '../../common/commonFunctions';
import IwdGrowthGraph from '../../mini-components/IwdGrowthGraph';
import { isEmpty } from '../../../utils/validators';
import IwdCard from '../../mini-components/IwdCard';
import { getGrowthData, getGrowthXirr } from '../../common/ApiCalls';
import { getConfig } from 'utils/functions';
import DotDotLoader from '../../../common/ui/DotDotLoader';
import { CSSTransition } from 'react-transition-group';
import IwdErrorScreen from '../../mini-components/IwdErrorScreen';

const dateFormatMap = {
  '1 month': "d m",
  '3 months': "d m",
  '6 months': "d m y",
  '1 year': "d m y",
  '3 years': "d m y",
  '5 years': "d m y",
  'ytd': "d m y",
};
const isMobileView = getConfig().isMobileDevice;

const PortfolioGrowth = () => {
  const [growthData, setGrowthData] = useState({});
  const [isLoadingGrowth, setIsLoadingGrowth] = useState(true);
  const [growthError, setGrowthError] = useState(false);
  const [xirr, setXirr] = useState('');
  const [isLoadingXirr, setIsLoadingXirr] = useState(true);
  const [selectedRange, setSelectedRange] = useState('1 month');

  useEffect(() => {
    fetchGrowthGraphXirr();
    fetchGrowthGraph();
  }, [selectedRange]);

  const fetchGrowthGraphXirr = async () => {
    try {
      setIsLoadingXirr(true);
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
        date_ticks,
        date_ticks_mobile,
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
        date_ticks: filterDateTicks(date_ticks, date_ticks_mobile),
      });
    } catch (e) {
      setGrowthError(true);
      console.error(e);
      // toast(e);
    }
    setIsLoadingGrowth(false);
  };

  const filterDateTicks = (ticks = [], mobileTicks = []) => {
    if (['5 years', '3 years'].includes(selectedRange) && !isMobileView) return ticks;
    if (isEmpty(mobileTicks)) {
      return [ticks[0], ticks[2], ticks[4], ticks[ticks.length - 2]];
    }
    return mobileTicks;
  };

  const GraphRangePicker = () => {
    let dateRanges = [...GraphDateRanges].reverse();
    if (moment().month() === 0) {
      dateRanges = dateRanges.slice(1);
    }
    return (
      <div
        id="iwd-range-picker"
        style={{ cursor: isLoadingGrowth ? "not-allowed" : "pointer" }}>
        {dateRanges.map((rangeObj, idx) => (
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
                      {xirr &&
                        <img
                          src={xirr > 0 ? positive : negative}
                          alt=''
                        />
                      }
                      {`${xirr ? Number(xirr).toFixed(1) + '%' : '--'}`}
                    </>
                  )
                }
              </span>
            </CSSTransition>
            XIRR
          </div>
        </div>
        {growthError ?
          <IwdErrorScreen
            hasError={true}
            templateErrText='Uh oh! Not enough data to show for this selected time period. Please try changing the time selection or retry later'
          /> :
          <div className="iwd-growth-graph">
          <IwdGrowthGraph
            isLoading={isLoadingGrowth}
            data={growthData.data}
            width="auto"
            height="100%"
            params={{
              date_ticks: growthData.date_ticks,
              min: growthData.min,
              max: growthData.max,
              dateFormat: dateFormatMap[selectedRange],
            }}
            />
            </div>
        }
      </>
    </IwdCard>
  );
};

export default PortfolioGrowth;

