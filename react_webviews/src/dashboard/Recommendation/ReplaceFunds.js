/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import Container from '../common/Container';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import FundCard from '../Invest/mini-components/FundCard';
import useFunnelDataHook from '../Invest/common/funnelDataHook';
import AmountUpdateDialog from './AmountUpdateDialog';

import './ReplaceFunds.scss';

const ReplaceFunds = (props) => {
  const [selectedFundId, setSelectedFundId] = useState('');
  const [selectedFund, setSelectedFund] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const { funnelData, updateFunnelData } = useFunnelDataHook();
  const { recommendation, alternatives } = funnelData;
  const { originalFund, alternateFunds } = props.location.state;
  let {
    mf: { mftype, mfid },
    amount,
  } = originalFund;
  const fundCount = recommendation?.length;
  let remainingAmount = 0;

  const updateRecommendationFunds = (newFund) => {
    const updatedRecommendationFunds = recommendation.map((el, idx) => {
      if (el.mf.mfid === mfid) {
        return newFund;
      }
      return el;
    });
    return updatedRecommendationFunds;
  }

  const replaceAmount = (newFund) => {
    const originalFundAmount = amount;
    const originalFundAmountMultiple = originalFund.mf.mfamountmultiple;
    const newFundAmountMultiple = newFund.mf.mfamountmultiple;

    if (
      originalFundAmountMultiple === newFundAmountMultiple ||
      newFundAmountMultiple === 1
    ) {
      newFund.amount = originalFundAmount;
      return updateRecommendationFunds(newFund);
    }

    if (newFundAmountMultiple > originalFundAmount) {
      newFund.amount = newFundAmountMultiple;
      return updateRecommendationFunds(newFund);
    }

    if (newFundAmountMultiple !== originalFundAmountMultiple) {
      const mod = amount % newFundAmountMultiple;
      if (mod === 0) {
        newFund.amount = amount;
        return updateRecommendationFunds(newFund);
      } else {
        newFund.amount = amount - mod;
        const updatedRecommendationFunds = updateRecommendationFunds(newFund);
        if (mod > 0) {
          remainingAmount = Math.floor(mod % fundCount);
          const amountLeftToDistribute = mod / fundCount;
          return addRemainingAmountToFunds(
            amountLeftToDistribute,
            updatedRecommendationFunds
          );
        }
        return updatedRecommendationFunds;
      }
    }
  };

  const addRemainingAmountToFunds = (
    amountLeftToDistribute,
    updatedRecommendationFunds
  ) => {
    const newRecommendedFunds = updatedRecommendationFunds.map((fund) => {
      const currentFundMultiple = fund.mf.mfamountmultiple;
      const mod = Math.floor(amountLeftToDistribute % currentFundMultiple);
      const amountToBeAdded = Math.floor(amountLeftToDistribute - mod);
      fund.amount = fund.amount + amountToBeAdded;
      remainingAmount = remainingAmount + mod;
      return fund;
    });
    if (remainingAmount > 0) {
      return setFinalAmount(newRecommendedFunds);
    }
    return newRecommendedFunds;
  };

  const updateAmount = (newFund, amountMod) => {
    newFund.some((fund) => {
      if (fund.mf.mfamountmultiple === amountMod) {
        fund.amount =
          fund.amount + remainingAmount - (remainingAmount % amountMod);
        remainingAmount = remainingAmount % amountMod;
        if (remainingAmount > 0) {
          setFinalAmount(newFund);
        }
        return true;
      }
    });
  };

  const setFinalAmount = (newRecommendedFunds) => {
    if (remainingAmount >= 1000) {
      updateAmount(newRecommendedFunds, 1000);
    } else if (remainingAmount >= 500 && remainingAmount < 1000) {
      updateAmount(newRecommendedFunds, 500);
    } else if (remainingAmount >= 100 && remainingAmount < 500) {
      updateAmount(newRecommendedFunds, 100);
    }
    if (remainingAmount > 0) {
      newRecommendedFunds.some((fund) => {
        if (fund.mf.mfamountmultiple === 1) {
          fund.amount = fund.amount + remainingAmount;
          remainingAmount = 0;
          return true;
        }
      });
    }
    return newRecommendedFunds;
  };

  const handleChange = (e) => {
    setSelectedFundId(e.target.value);
  };

  const setRecommendationFunds = (alternateFund) => {
    let totalAmount = 0;
    const newRecommendedFunds = replaceAmount(alternateFund);
    const finalRecommendedFunds = newRecommendedFunds?.map((fund) => {
      totalAmount += fund.amount;
      if (fund.mf.mfid === mfid) {
        return alternateFund;
      }
      return fund;
    });
    updateFunnelData({
      recommendation: finalRecommendedFunds,
      amount: totalAmount,
    });
    props.history.goBack();
  };

  const replaceFund = () => {
    const alternateFund = alternatives[mftype].find(
      (fund) => fund.mf.mfid === selectedFundId
    );
    setSelectedFund(alternateFund);
    if (alternateFund) {
      if (
        originalFund.mf.mfamountmultiple < alternateFund.mf.mfamountmultiple
      ) {
        setOpenDialog(true);
      } else {
        setRecommendationFunds(alternateFund);
      }
    } else {
      props.history.goBack();
    }
  };
  const CloseDialog = () => {
    setOpenDialog(false);
  };

  const onConfirmDialog = () => {
    setOpenDialog(false);
    setRecommendationFunds(selectedFund);
  };
  return (
    <Container
      data-aid='replace-fund-screen'
      classOverRide='pr-error-container'
      buttonTitle='Done'
      title='Replace fund'
      handleClick={replaceFund}
      classOverRideContainer='pr-container'
    >
      <section
        className='recommendations-replace-funds-container'
        data-aid='recommendations-replace-funds-containe'
      >
        <FormControl component='fieldset'>
          <RadioGroup
            aria-label='alternateFund'
            value={selectedFundId}
            name='alternateFund'
            onChange={handleChange}
          >
            {alternateFunds?.map((el, idx) => (
              <FormControlLabel
                data-aid={`replace-funds--item-${idx + 1}`}
                className='alternate-funds-item'
                key={idx}
                value={el?.mf?.mfid}
                labelPlacement='start'
                control={<Radio color='primary' />}
                label={<FundCard fund={el} history={props.history} />}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <div>
          {alternateFunds?.length === 0 && (
            <h1 data-aid='no-alternate-funds'>No alternative fund</h1>
          )}
        </div>
      </section>
      <AmountUpdateDialog
        fundName={selectedFund.mf?.mfname}
        fundMinPurchase={selectedFund.mf?.min_purchase}
        isOpen={openDialog}
        onClose={CloseDialog}
        onConfirm={onConfirmDialog}
        onCancel={CloseDialog}
      />
    </Container>
  );
};
export default ReplaceFunds;
