import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Input from 'common/ui/Input';
import { validateNumber } from 'utils/validators';

import { inrFormatDecimal } from 'utils/validators';

import './style.scss';

const FundCard = ({ type, expand, data,disabled, calcTotalAmount, checkError }) => {
  const [open, setOpen] = useState(expand ? true : false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const {
    balance,
    amount,
    invested_since,
    mf: { friendly_name, amc_logo_small },
  } = data;
  const handleChange = (el) => {
    if (el.target.value === '' || validateNumber(el.target.value)) {
      checkLimit(Math.ceil(el.target.value), Math.ceil(amount),data?.mf?.isin);
      setValue(el.target.value);
    }
  }
  const handleToggle = () => {
    setOpen(!open);
  };
  const checkLimit = (num, compNum, isin) => {
    if(num === 0) {
      console.log("the num is", num)
      calcTotalAmount(isin,num);
      setError(false);
      checkError(false);
      return;
    }
    if (type !== 'insta-redeem') {
      if (compNum > 1000) {
        if (num < 1000) {
          setError(true);
          setHelperText('Minimum withdrawal amount for each fund is 1000');
          checkError(true);
        } else if (num > compNum) {
          setError(true);
          setHelperText('Amount cannot be more than withdrawable amount');
          checkError(true);
          return;
        } else {
          if (error) {
            setError(false);
          }
          checkError(false);
          calcTotalAmount(isin,num);
        }
      } else {
        if (num < compNum) {
          setError(true);
          checkError(true);
          setHelperText('Withdrawal amount cannot be less than balance amount');
        } else if (num > compNum) {
          setError(true);
          checkError(true);
          setHelperText(
            'Withdrawal amount cannot be greater than balance amount'
          );
        } else {
          if (error) {
            setError(false);
          }
          checkError(false);
          calcTotalAmount(isin,num);
        }
      }
    } else {
      if (num > Math.ceil(compNum)) {
        setError(true);
        setHelperText('Amount cannot be more than withdrawable amount');
        checkError(true);
      } else if (num <= 0) {
        setError(true);
        setHelperText('Minimum withdrawal amount for fund is 1');
        checkError(true);
        return;
      } else {
        if (error) {
          setError(false);
        }
        checkError(false);
      }
      calcTotalAmount(isin,num);
    }
  };

  return (
    <div className='withdraw-fund-card'>
      <div className='withdraw-fund-header' onClick={handleToggle}>
        <div>
          <div className='withdraw-fund-icon'>
            <img src={amc_logo_small} alt='' />
          </div>
          <div>{friendly_name}</div>
        </div>

        {open ? (
          <RemoveIcon
            style={{
              fontSize: '15px',
              color: '#878787',
            }}
          />
        ) : (
          <AddIcon
            style={{
              fontSize: '15px',
              color: '#878787',
            }}
          />
        )}
      </div>

      <div className='withdraw-investment-container'>
        <div className='withdraw-amount-container'>
          <div className='amount-header-text'>WITHDRAWABLE AMOUNT</div>
          <div>{inrFormatDecimal(Math.ceil(type === 'systematic' ? balance : amount))}</div>
        </div>
        <div className='withdraw-amount-container'>
          <div className='investment-header-text'>INVESTMENT SINCE</div>
          <div>{invested_since}</div>
        </div>
      </div>
      <Collapse in={open}>
        <div className='withdraw-input'>
          <Input
            id='amount'
            label='Withdraw Amount'
            value={type === 'systematic' ? Math.ceil(amount) : value}
            onChange={handleChange}
            disabled={disabled || Math.ceil(amount) === 0}
            error={error}
            helperText={error && helperText}
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
          />
        </div>
      </Collapse>
      <div className='withdraw-tax'>{data.message}</div>
    </div>
  );
};

export default FundCard;
