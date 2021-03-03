import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import Container from '../../common/Container';
import { withdrawTiles, withdrawOptions } from '../../constants';
import { navigate as navigateFunc } from '../../common/commonFunction';
import Dialog from '../../mini_components/Dialog';

const Balance = (props) => {
  const [open, setOpen] = useState(false);
  const [amount,setAmount] = useState(0);
  const navigate = navigateFunc.bind(props);
  const redirect = (url, openModal) => {
    if (!openModal) {
      navigate(url, null, false);
    } else {
      setOpen(true);
    }
  };
  const close = () => {
    setOpen(false);
  };

  const handleSwitch = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
    setAmount(event.target.value);
  };
  const handleProceed = () => {
    navigate('switch',{amount});
    return;
  };
  return (
    <Container
      hideInPageTitle
      noFooter
      noPadding
      classOverRideContainer='withdraw-background-override'
    >
      <section id='withdraw-balance'>
        <div className='report-header'>
          <div className='title'>Withdrawable Balance</div>
          <div className='amount'>₹ 7,68,756</div>
          <div className='withdrawable-tile flex-between'>
            {withdrawTiles.map(({ title, amount }, idx) => (
              <div className='tile' key={idx}>
                <div className='tile-text'>{title}</div>
                <div className='tile-amount'>{amount}</div>
              </div>
            ))}
          </div>
        </div>
        <main className='Card'>
          <img src={require(`assets/surplus_graph.png`)} className='withdraw-mid-tile-img' />
          <div className='mid-tile-text'>
            Don't var the money lie down idle in bank account. Switch to debt funds and get up to 4%
            more returns than bank!
          </div>
          <Button
            className='withdraw-mid-tile-text2'
            variant='outlined'
            onClick={handleSwitch}
            fullWidth
          >
            switch now
          </Button>
        </main>
        <footer className='footer Card'>
          <div className='title'>Withdraw</div>
          {withdrawOptions.map(({ title, desc, redirectUrl, openModal }, idx) => (
            <div
              className='withdraw-list-item flex'
              key={idx}
              onClick={() => redirect(redirectUrl, openModal)}
            >
              <img className='icon' src={require('assets/system_withdraw_icn.png')} width='40' />
              <div className='text'>
                <div className='header'>{title}</div>
                <div className='desc'>{desc}</div>
              </div>
            </div>
          ))}
        </footer>
      </section>
      <Dialog
        open={open}
        close={close}
        title='Enter Amount'
        id='amount'
        placeholder='Amount'
        handleChange={handleChange}
        handleProceed={handleProceed}
        value={amount}
      />
    </Container>
  );
};

export default Balance;
