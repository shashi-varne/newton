import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import './style.scss';

const FundCard = ({ type, expand }) => {
  const [open, setOpen] = useState(expand ? true : false);
  const handleToggle = () => {
    setOpen(!open);
  };
  return (
    <div className='withdraw-fund-card'>
      <div className='withdraw-fund-header' onClick={handleToggle}>
        <div>
          <img style={{ width: '40px', height: '40px', background: 'red' }} src='' alt='' />
          <div>Nippon India Liquid Fund</div>
        </div>

        {open ? (
          <RemoveIcon
            style={{
              border: '2px #878787 solid',
              fontSize: '20px',
              borderRadius: '3px',
              color: '#878787',
            }}
          />
        ) : (
          <AddIcon
            style={{
              border: '2px #878787 solid',
              fontSize: '20px',
              borderRadius: '3px',
              color: '#878787',
            }}
          />
        )}
      </div>

      <div className='withdraw-investment-container'>
        <div className='withdraw-amount-container'>
          <div className='amount-header-text'>WITHDRAWABLE AMOUNT</div>
          <div>900</div>
        </div>
        <div className='withdraw-amount-container'>
          <div className='investment-header-text'>INVESTMENT SINCE</div>
          <div>20 JAB 2018</div>
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
