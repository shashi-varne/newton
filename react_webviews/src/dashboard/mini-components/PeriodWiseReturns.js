import React, { useEffect, useState } from 'react';
import { formatAmountInr } from '../../utils/validators';

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
  stockSplit,
  stockReturns = 10,
  bondReturns = 6.5,
  principalAmount = 0,
  isRecurring
}) => {
  const [potentialValue, setPotentialValue] = useState(0);
  const [investedValue, setInvestedValue] = useState(0);
  const [currentTerm, setCurrentTerm] = useState(initialTerm);
  const termOptions = [1, 3, 5, 10, 15, 20];

  useEffect(() => {
    getPotentialValue();
    calculateInvestedVal();
  }, [stockSplit, currentTerm]);

  const getPotentialValue = () => {
    let principle = principalAmount;
    var corpus_value = 0;
    for (var i = 0; i < currentTerm; i++) {
      if (isRecurring) {
        var n = (i + 1) * 12;
        var mr = getRateOfInterest() / 12 / 100;
        corpus_value = (principalAmount * (Math.pow(1 + mr, n) - 1)) / mr;
      } else {
        var currInterest = (principle * getRateOfInterest()) / 100;
        corpus_value = principle + currInterest;
        principle += currInterest;
      }
    }
    setPotentialValue(corpus_value);
  };

  const getRateOfInterest = () => {
    var range = Math.abs(stockReturns - bondReturns);
    if (stockSplit < 1) {
      return bondReturns;
    } else if (stockSplit > 99) {
      return stockReturns;
    } else {
      var rateOffset = (range * stockSplit) / 100;
      return bondReturns + rateOffset;
    }
  };

  const calculateInvestedVal = () => {
    const value = isRecurring ? principalAmount * 12 * currentTerm : principalAmount;
    setInvestedValue(value);
  };

  return (
    <div className='invested-amount-return-container'>
      <div className='invested-amount-return-text'>{title || 'Expected returns'}</div>
      <div className='invested-amount-year-tabs'>
        {termOptions.map((termOpt, idx) => (
          <span
            className={
              // Check "Explanation" above
              currentTerm >= termOpt && currentTerm < (termOptions[idx + 1] || 100) ?
              'selected' : ''
            }
            onClick={() => setCurrentTerm(termOpt)}>
            {termOpt}YRS
          </span>
        ))}
      </div>
      <div className='invested-amount-corpus-values'>
        <div className='invested-amount-corpus-invested'>
          <div class="color-box"></div>
          <div class="text">
            <h1>Invested value</h1>
            <div>{formatAmountInr(investedValue)}</div>
          </div>
        </div>
        <div class="invested-amount-corpus-divider"></div>
        <div className='invested-amount-corpus-projected'>
          <div class="color-box"></div>
          <div class="text">
            <h1>Projected Value</h1>
            <div>{formatAmountInr(potentialValue)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PeriodWiseReturns;