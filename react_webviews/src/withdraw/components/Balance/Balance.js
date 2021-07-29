// import Button from 'common/ui/Button'
import React, { useEffect, useState } from 'react'
import Container from '../../common/Container'
import { withdrawOptions } from '../../constants'
import { navigate as navigateFunc } from 'utils/functions'
import Dialog from '../../mini-components/Dialog'
import { getBalance } from '../../common/Api'
import toast from 'common/ui/Toast'
import { isEmpty, formatAmountInr, convertInrAmountToNumber } from 'utils/validators'
import Explore from '../../mini-components/Explore'
import './Balance.scss';
import { nativeCallback } from '../../../utils/native_callback'
import { getInvestCards } from '../../../utils/functions'

const Balance = (props) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(false)
  const [type, setType] = useState('')
  const [helperText, setHelperText] = useState('Please enter the amount');
  const navigate = navigateFunc.bind(props)
  const [balance, setBalance] = useState(null)
  const investCards = getInvestCards(["instaredeem"]);

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

  const redirect = (title, url, openModal) => {
    sendEvents('next', title)
    setType(url)
    if (!openModal) {
      navigate(url)
    } else {
      setAmount('');
      setError(false)
      setHelperText('');
      setOpen(true)
    }
  }
  const close = () => {
    sendEvents('back', "", "withdraw_amount")
    setOpen(false)
  }

  // const handleSwitch = () => {
  //   sendEvents('next', 'switch_now')
  //   setType("/withdraw/switch")
  //   setAmount('');
  //   setError(false)
  //   setHelperText('');
  //   setOpen(true)
  // }

  const validateAmount = (value) => {
    let data = { error: false, helperText: "" };
    if (!value) {
      data.error = true;
      data.helperText = `This is required`;
    } else if (value > balance?.balance) {
      data.error = true;
      data.helperText = `Amount cannot be greater than withdrawable amount.`;
    } else if (type === "/withdraw/systematic" && value < 500) {
      data.error = true;
      data.helperText = `Minimum amount is ${formatAmountInr(500)}`;
    } else if (type === "/withdraw/switch" && value < 5000) {
      data.error = true;
      data.helperText = `Minimum amount is ${formatAmountInr(5000)}`;
    } else if (value % 100 !== 0) {
      data.error = true;
      data.helperText = `Amount must be multiple of ${formatAmountInr(100)}`;
    }
    return data;
  };

  const handleChange = (event) => {
    let value = event.target.value || "";
    value = convertInrAmountToNumber(value) || "";
    setAmount(value);
    const errorData = validateAmount(value);
    setError(errorData.error);
    setHelperText(errorData.helperText);
  }

  const handleProceed = () => {
    const errorData = validateAmount(amount);
    if(errorData.error) {
      setError(errorData.error);
      setHelperText(errorData.helperText);
      return;
    }
    if (type === '/withdraw/systematic') {
      sendEvents('next', type, "withdraw_amount")
      navigate(type, {state: {amount} })
    } else {
      sendEvents('next', "switch_now", "withdraw_amount")
      navigate('/withdraw/switch', {state: {amount} })
    }
    return
  }
  const noInvestments = isEmpty(balance?.balance) || balance === 0

  const sendEvents = (userAction, cardClicked, screenName) => {
    let cardClickedName = "";
    if(cardClicked === "Instant Withdraw") 
      cardClickedName = "instant withdraw"
    else if(cardClicked === "System Selected")
      cardClickedName = "system_selected"
    else if(cardClicked === "Manual")
      cardClickedName = "self"
    else
      cardClickedName = cardClicked

    let eventObj = {
      "event_name": "withdraw_flow",
      properties: {
        "user_action": userAction,
        "screen_name": screenName || "withdraw_screen",
      },
    };
    if(screenName !== "withdraw_amount")
      eventObj.properties["card_clicked"] = cardClickedName || "";
    if(screenName === "withdraw_amount"){
      eventObj.properties["flow"] = (cardClickedName === "systematic" ? "system_selected" : cardClickedName) || "";
      eventObj.properties["value_entered"] = amount || "";
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      data-aid='withdraw-screen'
      events={sendEvents("just_set_events")}
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
            <div className="report-header" data-aid='report-header'>
              <div className="title" data-aid='withdraw-title-text' >Withdrawable Balance</div>
              <div className="amount" data-aid='withdraw-amount'>
                {formatAmountInr(balance?.balance) || 0}
              </div>
              <div className="withdrawable-tile">
                <div className="tile" data-aid='withdraw-balance-tile'>
                  <div className="tile-text">Total Balance</div>
                  <div className="tile-amount">
                    {formatAmountInr(balance?.total_balance) || 0}
                  </div>
                </div>
                <div className="tile" data-aid='withdraw-pending-switch-tile'>
                  <div className="tile-text">Pending Switch</div>
                  <div className="tile-amount">
                    {formatAmountInr(balance?.switch_pending_amount) || 0}
                  </div>
                </div>
                <div className="tile" data-aid='withdraw-pending-redemption-tile'>
                  <div className="tile-text">Pending Redemption</div>
                  <div className="tile-amount">
                    {formatAmountInr(balance?.redeem_pending_amount)|| 0}
                  </div>
                </div>
              </div>
            </div>
            {/* <main className="Card" data-aid='card-block'>
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
                dataAid='switch-now-btn'
                buttonTitle="Switch Now"
                onClick={handleSwitch}
                classes={{ button: "withdraw-mid-tile-text2" }}
                type="outlined"
              />
            </main> */}
            <footer className="footer Card" data-aid='footer-card'>
              <div className="title">Withdraw</div>
              {withdrawOptions.map(
                ({ title, desc, redirectUrl, openModal, type }, idx) => {
                  const showCard = type !== "instaredeem" ? true : investCards.instaredeem;
                  return (
                    <>
                      {showCard && (
                        <div
                          className="withdraw-list-item flex"
                          key={idx}
                          data-aid={`withdraw-list-item flex-${idx + 1}`}
                          onClick={() =>
                            redirect(title, redirectUrl, openModal)
                          }
                        >
                          <img
                            className="icon"
                            src={require("assets/system_withdraw_icn.png")}
                            width="40"
                            alt="withdraw-icon"
                          />
                          <div
                            className="text"
                            data-aid={`withdraw-list-text-${idx + 1}`}
                          >
                            <div className="header">{title}</div>
                            <div className="desc">{desc}</div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                }
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
