import Button from 'common/ui/Button'
import React, { useEffect, useState } from 'react'
import Container from '../../common/Container'
import { withdrawOptions } from '../../constants'
import { navigate as navigateFunc } from '../../common/commonFunction'
import Dialog from '../../mini-components/Dialog'
import { getBalance } from '../../common/Api'
import toast from 'common/ui/Toast'
import { isEmpty, formatAmountInr, convertInrAmountToNumber } from 'utils/validators'
import Explore from '../../mini-components/Explore'
import './Balance.scss';

const Balance = (props) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(false)
  const [type, setType] = useState('')
  const [helperText, setHelperText] = useState('Please enter the amount');
  const navigate = navigateFunc.bind(props)
  const [balance, setBalance] = useState(null)

  const fetchBalance = async () => {
    try {
      const result = await getBalance()
      setBalance(result.balance)
    } catch (err) {
      setBalance(0)
      toast(err.message, 'error')
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  const redirect = (url, openModal) => {
    setType(url)
    if (!openModal) {
      navigate(url, null, false)
    } else {
      setAmount('');
      setOpen(true)
    }
  }
  const close = () => {
    setOpen(false)
  }

  const handleSwitch = () => {
    setAmount('');
    setError(false)
    setOpen(true)
  }

  const handleChange = (event) => {
    let value = event.target.value || "";
    value = convertInrAmountToNumber(value);
    // eslint-disable-next-line radix
    if (!isNaN(parseInt(value))) {
      // eslint-disable-next-line radix
      setAmount(parseInt(value));
      if (error) {
        setError(false);
        setHelperText('');
      }
    } else {
      setAmount('');
      setError(true);
      setHelperText('')
    }
  }
  const handleProceed = () => {
    if (amount) {
      if (type === 'systematic') {
        navigate(type, {state: {amount} })
      } else {
        // eslint-disable-next-line radix
        if( amount < 5000 ){
          setError(true);
          setHelperText(`minimum switch amount is ${formatAmountInr(5000)}`);
        } else{
          navigate('switch', {state: {amount} })
        }
      }
    } else {
      setError(true)
    }
    return
  }
  const noInvestments = isEmpty(balance?.balance) || balance === 0
  return (
    <Container
      data-aid='withdraw-screen'
      title='Withdraw'
      noFooter
      noPadding
      classOverRide={!isEmpty(balance) && "withdraw-override-container"}
      classOverRideContainer={
        `withdraw-background-override 
        ${noInvestments && "withdraw-explore-override"
      }`}
      skelton={isEmpty(balance)}
    >
      {!isEmpty(balance) && !noInvestments && (
        <>
          <section id="withdraw-balance" data-aid='withdraw-balance'>
            <div className="report-header">
              <div className="title">Withdrawable Balance</div>
              <div className="amount">
                {formatAmountInr(balance?.balance) || 0}
              </div>
              <div className="withdrawable-tile">
                <div className="tile">
                  <div className="tile-text">Total Balance</div>
                  <div className="tile-amount">
                    {formatAmountInr(balance?.total_balance) || 0}
                  </div>
                </div>
                <div className="tile">
                  <div className="tile-text">Pending Switch</div>
                  <div className="tile-amount">
                    {formatAmountInr(balance?.switch_pending_amount) || 0}
                  </div>
                </div>
                <div className="tile">
                  <div className="tile-text">Pending Redemption</div>
                  <div className="tile-amount">
                    {formatAmountInr(balance?.redeem_pending_amount)|| 0}
                  </div>
                </div>
              </div>
            </div>
            <main className="Card" data-aid='card-block'>
              <img
                src={require(`assets/surplus_graph.png`)}
                className="withdraw-mid-tile-img"
                alt="graph"
              />
              <div className="mid-tile-text">
                Don't var the money lie down idle in bank account. Switch to
                debt funds and get up to 4% more returns than bank!
              </div>
              <Button
                buttonTitle="Switch Now"
                onClick={handleSwitch}
                classes={{ button: "withdraw-mid-tile-text2" }}
                type="outlined"
              />
            </main>
            <footer className="footer Card" data-aid='footer-card'>
              <div className="title">Withdraw</div>
              {withdrawOptions.map(
                ({ title, desc, redirectUrl, openModal }, idx) => (
                  <div
                    className="withdraw-list-item flex"
                    key={idx}
                    onClick={() => redirect(redirectUrl, openModal)}
                  >
                    <img
                      className="icon"
                      src={require('assets/system_withdraw_icn.png')}
                      width="40"
                      alt='withdraw-icon'
                    />
                    <div className="text">
                      <div className="header">{title}</div>
                      <div className="desc">{desc}</div>
                    </div>
                  </div>
                )
              )}
            </footer>
          </section>
          <Dialog
            open={open}
            close={close}
            title="Enter Amount"
            id="amount"
            placeholder="Amount"
            handleChange={handleChange}
            handleProceed={handleProceed}
            value={amount ? formatAmountInr(amount) : ""}
            error={error}
            helperText={error ? helperText : ''}
          />
        </>
      )}
      {noInvestments && (
        <Explore {...props} />
      )}
    </Container>
  )
}

export default Balance
