import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Input from 'common/ui/Input';

import { inrFormatDecimal } from 'utils/validators';

import './style.scss';

const FundCard = ({ type, expand, data, handleChange, value, error, helperText,disabled }) => {
  const [open, setOpen] = useState(expand ? true : false);
  const {
    amount,
    invested_since,
    mf: { friendly_name, amc_logo_small },
  } = data;
  const handleToggle = () => {
    setOpen(!open);
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
          <div>{inrFormatDecimal(Math.ceil(amount))}</div>
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
            value={type === 'systematic' ? amount : value}
            onChange={handleChange}
            disabled={disabled}
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
