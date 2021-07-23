import React, { useEffect, useState } from 'react'
import Container from '../../common/Container'
import FundCard from '../../mini-components/FundCard'
import isEmpty from 'lodash/isEmpty'
import { getRecommendedFund } from '../../common/Api'
import { navigate as navigateFunc } from 'utils/functions'
import toast from 'common/ui/Toast'
import Typography from '@material-ui/core/Typography'
import { getConfig } from 'utils/functions'
import { formatAmountInr } from '../../../utils/validators'
import '../commonStyles.scss';
import './WithdrawType.scss';
import { nativeCallback } from '../../../utils/native_callback'

const Landing = (props) => {
  const { type } = props.match?.params
  const amount = props.location?.state?.amount
  const [error, setError] = useState({})
  const [totalAmount, setTotalAmount] = useState('')
  const [value, setValue] = useState({})
  const [recommendedFunds, setRecommendedFunds] = useState(null)
  const [limitCrossed, setLimitCrossed] = useState(false)
  const [investedUser, setInvestedUser] = useState(false)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [zeroInvested, setZeroInvested] = useState(false)
  const [buttonTitle, setButtonTitle] = useState('CONTINUE')
  const navigate = navigateFunc.bind(props)
  const [showSkeltonLoader, setShowSkeltonLoader] = useState(false)
  const [startDate] = useState(new Date())
  const fetchRecommendedFunds = async () => {
    try {
      setShowSkeltonLoader(true)
      const data = await getRecommendedFund(type, amount);
      const recData = data?.recommendations || [];
      setRecommendedFunds(recData);
      if (type === 'insta-redeem') {
        setInstaRecommendation(recData);
      } else {
        if (type === 'systematic') {
          let val = {}
          // eslint-disable-next-line no-unused-expressions
          data?.recommendations[0]?.allocations?.forEach((el) => {
            val = { ...val, [el?.mf?.isin]: Math.ceil(el?.amount) }
          })
          setValue(val)
          const totalAmount = getTotalAmount(val)
          setTotalAmount(totalAmount)
        }
      }
    } catch (error) {
      if (type === 'insta-redeem') {
        var errRec = error.pfwresponse.result.error;
        if(Array.isArray(errRec)) {
          setInstaRecommendation(errRec);
        } else{
          toast(error, 'error');
        }
      } else{
        toast(error, 'error');
      }
    } finally {
      setShowSkeltonLoader(false)
    }
  }

  useEffect(() => {
    fetchRecommendedFunds()
  }, [])

  const calcTotalAmount = (isin, num) => {
    if (num === 0) {
      if (value[isin]) {
        const newValue = value
        delete newValue[isin]
        const totalAmount = getTotalAmount(newValue)
        setTotalAmount(totalAmount)
        setValue(newValue)
      }
    } else {
      const totalAmount = getTotalAmount({ ...value, [isin]: num })
      setTotalAmount(totalAmount)
      setValue({ ...value, [isin]: num })
    }
  }
  const getTotalAmount = (val) => {
    if (val) {
      return Object.keys(val)?.reduce((total, num) => {
        return total + val[num]
      }, 0)
    } else {
      return 0
    }
  }
  const handleClick = () => {
    sendEvents('next')
    if (zeroInvested) {
      navigate('/invest/instaredeem')
    } else if (fetchFailed) {
      fetchRecommendedFunds()
    } else {
      if (!totalAmount) {
        toast('Please enter the withdraw amount')
        return
      }
      if (type === 'manual') {
        navigate(`/withdraw/self/summary`, {
          state:{
            amounts: value,
            ...recommendedFunds[0],
          }
        })
      } else {
        navigate(`/withdraw/${type}/summary`, {
          state:{
            amounts: value,
            ...recommendedFunds[0],
          }
        })
      }
    }
  }
  const checkError = (isin, err) => {
    if(err) {
      setError({ ...error, [isin]: err })
    } else {
      const newError = error;
      delete newError[isin];
      setError({...newError})
    }
  }

  const getTitle = () => {
    switch(type) {
      case "systematic": 
        return "System withdraw";
      case "insta-redeem": 
        return "Instant withdraw";
      case "self":
      case "manual":
        return "Manual withdraw";
      default:
        return "Withdraw";
    }
  }

  const setInstaRecommendation = (data) => {
    if (data?.length > 0) {
      const recData = data[0] || [];
      if (
        recData.ir_funds_available &&
        recData.all_success &&
        recData.allocations &&
        recData.allocations[0] &&
        (recData.allocations[0].amount <= 0 ||
          !recData.allocations[0].amount)
      ) {
        setLimitCrossed(true)
      }
      if (recData.ir_funds_available && recData.all_success) {
        setInvestedUser(true)
      } else if (recData.ir_funds_available && !recData.all_success) {
        setFetchFailed(true)
        setButtonTitle('RETRY')
      } else {
        setZeroInvested(true)
        setButtonTitle('DEPOSIT NOW')
      }
    } else {
      setFetchFailed(true)
    }
  }

  const sendEvents = (userAction) => {

    let redemptionType = "";
    if(type === "insta-redeem") 
      redemptionType = "instaredeem"
    else if(type === "systematic")
      redemptionType = "system"
    else if(type === "manual")
      redemptionType = "self"
    else redemptionType = type;
    
    let statusEvent = '';
    if(limitCrossed)
      statusEvent = 'exhaust limit'
    if(zeroInvested)
      statusEvent = 'empty state'
    if(fetchFailed)
      statusEvent = 'redeem amount unknown'

    let eventObj = {
      "event_name": "withdraw_flow",
      properties: {
        "user_action": userAction,
        "screen_name": "fund_amount_split",
        'flow': redemptionType,
        'time_spent_on_screen': Math.ceil((new Date() - startDate) / 1000),
      },
    };
    if(type === 'insta-redeem') {
      eventObj.properties['status'] = statusEvent;
      eventObj.properties['amount_value'] = 0 // to be checked
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      data-aid='withdraw-type-screen'
      events={sendEvents("just_set_events")}
      buttonTitle={buttonTitle}
      fullWidthButton
      classOverRideContainer="pr-container"
      classOverRide="withdraw-two-button"
      disable={type === 'insta-redeem' ? (limitCrossed || !isEmpty(error)) : !isEmpty(error)}
      handleClick={handleClick}
      skelton={isEmpty(recommendedFunds) && showSkeltonLoader}
      buttonData={{
        leftTitle: "Withdraw amount",
        leftSubtitle: formatAmountInr(totalAmount || 0),
      }}
      type={type !== 'insta-redeem' ? "withProvider" : ''}
      title={getTitle()}
    >
      {!isEmpty(recommendedFunds) && (
        <>
          {(investedUser || type !== 'insta-redeem') && (
            <section>
              {recommendedFunds?.map(el => (
                el?.allocations?.map((fundData,idx) => {
                  return <FundCard
                  key={idx}
                  expand={idx === 0}
                  type={type}
                  data={fundData}
                  disabled={type === 'systematic' || limitCrossed}
                  calcTotalAmount={calcTotalAmount}
                  checkError={checkError}
                  autoFocus={idx === 0}
                  />
                })
              ))}
            </section>
          )}

          {limitCrossed && (
            <section className="withdraw-insta-exceed" data-aid='withdraw-insta-exceed'>
              <div className="withdraw-insta-exceed-icon">
                <img src={require('assets/error_icon.svg')} alt="error" />
              </div>
              <div className="withdraw-insta-exceed-msg">
                <div className="withdraw-insta-exceed-head">
                  Withdrawal limit exhausted
                </div>
                <div className="withdraw-insta-exceed-info">
                  Sorry, your daily limit is exhausted. You can withdraw
                  additional amount from systematic or manual withdraw.
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {fetchFailed && <InstaRedeemFailed />}
      {zeroInvested && <InstaRedeemZero />}
      {type === 'insta-redeem' &&
        !fetchFailed &&
        !isEmpty(recommendedFunds?.allocations) && (
          <section className="withdraw-instant-msg" data-aid='withdraw-instant-msg'>
            <div>Instant in bank account</div>
            <div>|</div>
            <div>Get it in 30 mins</div>
          </section>
        )}
    </Container>
  )
}

export default Landing

const InstaRedeemZero = () => {
  return (
    <section className="withdraw-insta" data-aid='withdraw-insta-redeem-zero'>
      <div className="withdraw-insta-icon">
        <img src={require('assets/piggy_bank@4x.png')} alt="" />
      </div>
      <div className="withdraw-insta-head">Current invested amount: ₹0</div>
      <div className="withdraw-insta-info">
        Start investing for superior return compared to normal savings bank a/c,
        and get instant redemption facility
      </div>
    </section>
  )
}

const InstaRedeemFailed = () => {
  const product_name = getConfig().productName

  return (
    <div className="pr-error-container withdraw-insta-failed" data-aid='withdraw-insta-failed'>
      <section className="image-cover">
        <img
          src={require(`assets/${product_name}/error_illustration.svg`)}
          alt="Server Error"
          className="error-page"
        />
      </section>
      <Typography className="error-text-title">Oops!</Typography>
      <Typography className="error-text">
        Currently, we’re unable to fetch the redeemable amount due to technical
        issues. Please try again after some time.
      </Typography>
      <section className="pr-help-container ">
        <Typography className="help-text">For any help, reach us at</Typography>
        <div className="help-contact-email flex-item">
          <Typography className="help-contact">+91-7829228886</Typography>
          <hr style={{ height: '9px', margin: '0', borderWidth: '0.6px' }} />
          <Typography className="help-email">ASK@FISDOM.COM</Typography>
        </div>
      </section>
    </div>
  )
}
