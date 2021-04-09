import React, { useEffect, useState } from 'react';
import Slider from 'common/ui/Slider';
import { debounce } from 'lodash';

const EquityDebtSlider = ({
  stockSplit = 0,
  onChange = () => {},
  disabled,
  fixedRiskTitle
}) => {
  const [risk, setRisk] = useState('');

  const getRiskTitle = () => {
    if (fixedRiskTitle) {
      setRisk(fixedRiskTitle);
    } else {
      if (stockSplit <= 50) {
        setRisk('Low risk (Moderate returns)');
      } else if (stockSplit > 50 && stockSplit <= 70) {
        setRisk('Moderate risk (Moderately high returns)');
      } else {
        setRisk('High risk (High returns)');
      }
    }
  };

  useEffect(() => {
    getRiskTitle();
  }, [stockSplit]);

  const debouncedSliderChange = debounce(value => onChange(value), 500);

  return (
    <div className='invest-slider-container'>
      <div className='invest-slider-head'>{risk}</div>
      <div className='invest-slider'>
        <Slider
          label='Net monthly income'
          val='Net_monthly_Income'
          default={stockSplit}
          value={stockSplit}
          min='0'
          max='100'
          minValue='0'
          disabled={disabled}
          maxValue='₹ 10 Lacs'
          onChange={debouncedSliderChange}
        />
      </div>
      <div className='invest-slider-range'>
        <div className='invest-slider-stock'>{stockSplit}% Stocks</div>
        <div className='invest-slider-ratio-text'>
          <span>slide to change</span> <span>ratio</span>
        </div>
        <div className='invest-slider-bond'>{100 - stockSplit}% Bonds</div>
      </div>
    </div>
  );
}

export default EquityDebtSlider;