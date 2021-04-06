import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Container from '../../common/Container'
import { withdrawTiles, withdrawOptions } from '../../constants'
import { navigate as navigateFunc } from '../../common/commonFunction'
import Dialog from '../../mini_components/Dialog'
import { getBalance } from '../../common/Api'
import toast from 'common/ui/Toast'
import { isEmpty } from '../../../utils/validators'

const Balance = (props) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(false)
  const [type, setType] = useState('')
  const navigate = navigateFunc.bind(props)
  const [balance, setBalance] = useState(null)

  const fetchBalance = async () => {
    try {
      const result = await getBalance()
      setBalance(result.balance)
    } catch (err) {
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
      setOpen(true)
    }
  }
  const close = () => {
    setOpen(false)
  }

  const handleSwitch = () => {
    setError(false)
    setOpen(true)
  }

  const handleChange = (event) => {
    if (event.target.value.length !== 0) {
      setAmount(event.target.value)
      if (error) {
        setError(false)
      }
    } else {
      setAmount(event.target.value)
      setError(true)
    }
  }
  const handleProceed = () => {
    if (amount) {
      if (type === 'systematic') {
        navigate(type, { amount })
      } else {
        navigate('switch', { amount })
      }
    } else {
      setError(true)
    }
    return
  }
  return (
    <Container
      title="Withdraw"
      noFooter
      noPadding
      classOverRideContainer="withdraw-background-override"
      skelton={isEmpty(balance)}
      // noHeader={isEmpty(balance)}
    >
      {!isEmpty(balance) && (
        <>
          <section id="withdraw-balance">
            <div className="report-header">
              <div className="title">Withdrawable Balance</div>
              <div className="amount">
                ₹ {balance.balance.toLocaleString('en-IN')}
              </div>
              <div className="withdrawable-tile flex-between">
                <div className="tile">
                  <div className="tile-text">Total Balance</div>
                  <div className="tile-amount">
                    {balance.total_balance.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="tile">
                  <div className="tile-text">Pending Switch</div>
                  <div className="tile-amount">
                    ₹ {balance.switch_pending_amount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="tile">
                  <div className="tile-text">Pending Redemption</div>
                  <div className="tile-amount">
                    ₹ {balance.redeem_pending_amount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
            <main className="Card">
              <img
                src={require(`assets/surplus_graph.png`)}
                className="withdraw-mid-tile-img"
              />
              <div className="mid-tile-text">
                Don't var the money lie down idle in bank account. Switch to
                debt funds and get up to 4% more returns than bank!
              </div>
              <Button
                className="withdraw-mid-tile-text2"
                variant="outlined"
                onClick={handleSwitch}
                fullWidth
              >
                switch now
              </Button>
            </main>
            <footer className="footer Card">
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
            value={amount}
            error={error}
            helperText={error ? 'Please enter the amount' : ''}
          />
        </>
      )}
    </Container>
  )
}

export default Balance
