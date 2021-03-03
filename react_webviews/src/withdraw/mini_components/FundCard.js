import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import './style.scss';

const FundCard = ({ type, expand, data }) => {
  const [open, setOpen] = useState(expand ? true : false);
  const {amount, invested_since, mf:{friendly_name, amc_logo_small}} = data;
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
              border: '2px #878787 solid',
              fontSize: '15px',
              borderRadius: '3px',
              color: '#878787',
            }}
          />
        ) : (
          <AddIcon
            style={{
              border: '2px #878787 solid',
              fontSize: '15px',
              borderRadius: '3px',
              color: '#878787',
            }}
          />
        )}
      </div>

      <div className='withdraw-investment-container'>
        <div className='withdraw-amount-container'>
          <div className='amount-header-text'>WITHDRAWABLE AMOUNT</div>
          <div>{amount}</div>
        </div>
        <div className='withdraw-amount-container'>
          <div className='investment-header-text'>INVESTMENT SINCE</div>
          <div>{invested_since}</div>
        </div>
      </div>
      <Collapse in={open}>
        <div className='withdraw-input'>
          <TextField id='amount' label='Withdraw Amount' value={2000} onChange={() => {}} />
        </div>
      </Collapse>
      <div className="withdraw-tax">
        * STCG Tax applicable
      </div>
    </div>
  );
};

export default FundCard;
