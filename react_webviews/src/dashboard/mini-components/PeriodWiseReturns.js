import React, { useEffect, useState } from 'react';
import BottomSheet from '../../common/ui/BottomSheet';
import { formatAmountInr, storageService } from '../../utils/validators';
import {
  getInvestedValue,
  getPotentialValue,
  getRateOfInterest
} from '../Invest/common/commonFunctions';

import './mini-components.scss';
/*
  Explanation:

  The initial setting for currently selected term (currentTerm) is based on
  'initialTerm'. If value for initialTerm is not an exact match to any value
  in termOptions, then we set the currentTerm to the nearest floor value of
  termOptions.

  examples:
    initialTerm = 4 => currentTerm = 3
    intialTerm = 12 => currentTerm = 10
    intialTerm = 40 => currentTerm = 20
*/

const PeriodWiseReturns = ({
  title,
  initialTerm = 3,
  equity,
  stockReturns = 10,
  bondReturns = 6.5,
  principalAmount = 0,
  isRecurring,
  showInfo
}) => {
  const [potentialValue, setPotentialValue] = useState(0);
  const [investedValue, setInvestedValue] = useState(0);
  const [currentTerm, setCurrentTerm] = useState(initialTerm);
  const [openInfoSheet, setOpenInfoSheet] = useState(false);
  const termOptions = [1, 3, 5, 10, 15, 20];

  useEffect(() => {
    updatePotentialValue();
    calculateInvestedVal();
  }, [equity, currentTerm]);

  const updatePotentialValue = () => {
    const potentialVal = getPotentialValue(
      equity,
      principalAmount,
      isRecurring,
      currentTerm
    );
    setPotentialValue(potentialVal);
  };

  const calculateInvestedVal = () => {
    const value = getInvestedValue(currentTerm, principalAmount, isRecurring);
    setInvestedValue(value);
  };

  const toggleInfoSheet = () => {
    storageService().setBoolean("info_clicked", true);
    setOpenInfoSheet(!openInfoSheet);
  };

  const onClickTerm = (termOpt) => {
    storageService().setBoolean("period_changed", true);
    setCurrentTerm(termOpt);
  };

  return (
    <div className='invested-amount-return-container' data-aid='invested-amount-return-container'>
      <div className='invested-amount-return-text' data-aid='invested-amount-return-text'>{title || 'Average returns'}</div>
      <div className='invested-amount-year-tabs' data-aid='invested-amount-year-tabs'>
        {termOptions.map((termOpt, idx) => (
          <span
            data-aid={`years-btn-${idx+1}`}
            key={idx}
            className={
              // Check "Explanation" above
              currentTerm >= termOpt && currentTerm < (termOptions[idx + 1] || 100) ?
              'selected' : ''
            }
            onClick={() => onClickTerm(termOpt)}>
            {termOpt}YRS
          </span>
        ))}
      </div>
      <div className='invested-amount-corpus-values' data-aid='invested-amount-corpus-values'>
        <div className='invested-amount-corpus-invested'>
          <div className="color-box"></div>
          <div className="text" data-aid='amt-invest-text'>
            <h1>Amount Invested</h1>
            <div>{formatAmountInr(investedValue)}</div>
          </div>
        </div>
        <div className="invested-amount-corpus-divider"></div>
        <div className='invested-amount-corpus-projected' data-aid='invested-amount-corpus-projected'>
          <div className="color-box"></div>
          <div className="text" data-aid='return-invest-text'>
            <h1>
              Estimated Return
              {showInfo &&
                <img
                  alt="i"
                  src={require('assets/info_icon_grey.svg')}
                  className="info-icn pointer"
                  onClick={toggleInfoSheet}
                />
              }
            </h1>
            <div>{formatAmountInr(potentialValue)}</div>
          </div>
          <BottomSheet
            open={openInfoSheet}
            data={{
              header_title: 'Average returns',
              button_text1: 'Okay',
              handleClick1: toggleInfoSheet,
              handleClose: toggleInfoSheet,
            }}
          >
            <>
              <div className="avg-return-ror" data-aid='avg-return-ror'>
                <span className="value">{getRateOfInterest(equity).toFixed(2)}%*</span>
                <span className="text">is the Rate of Return (RoR) used to estimate projected returns.</span>
              </div>
              <div className="avg-return-content" data-aid='avg-return-content'>
                Rate of return is dependent on the component of debt & equity in recommended funds for this investment
              </div>
              <div className="avg-return-breakup" data-aid='avg-return-breakup'>
                * Rate of return assumed for debt is {bondReturns}% and
                rate of return assumed for equity is {stockReturns}%
              </div>
            </>
          </BottomSheet>
        </div>
      </div>
    </div>
  );
}

export default PeriodWiseReturns;