import React, { useEffect, useState } from 'react';
import Slider from 'common/ui/Slider';

const EquityDebtSlider = ({
  equity = 0,
  onChange = () => {},
  disabled,
  fixedRiskTitle
}) => {
  const [risk, setRisk] = useState('');

  const getRiskTitle = () => {
    if (fixedRiskTitle) {
      setRisk(fixedRiskTitle);
    } else {
      if (equity <= 50) {
        setRisk('Low risk (Moderate returns)');
      } else if (equity > 50 && equity <= 70) {
        setRisk('Moderate risk (Moderately high returns)');
      } else {
        setRisk('High risk (High returns)');
      }
    }
  };

  useEffect(() => {
    getRiskTitle();
  }, [equity]);

  return (
    <div className='invest-slider-container'>
      <div className='invest-slider-head'>{risk}</div>
      <div className='invest-slider'>
        <Slider
          label='Net monthly income'
          val='Net_monthly_Income'
          default={equity}
          value={equity}
          min='0'
          max='100'
          minValue='0'
          disabled={disabled}
          maxValue='₹ 10 Lacs'
          onChange={onChange}
        />
      </div>
      <div className='invest-slider-range'>
        <div className='invest-slider-stock'>{equity}% Stocks</div>
        <div className='invest-slider-ratio-text'>
         {!disabled && <><span>slide to change</span> <span>ratio</span></>}
        </div>
        <div className='invest-slider-bond'>{100 - equity}% Bonds</div>
      </div>
    </div>
  );
}

export default EquityDebtSlider;