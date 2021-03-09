import React, { useEffect, useState } from 'react'
import Container from '../common/Container'
import FundCard from '../mini_components/FundCard'
import isEmpty from 'lodash/isEmpty'
import { getRecommendedFund } from '../common/Api'
import { navigate as navigateFunc } from '../common/commonFunction'
import toast from 'common/ui/Toast'
import Typography from '@material-ui/core/Typography'
import { getConfig } from 'utils/functions'

const Landing = (props) => {
  const { type } = props.match?.params
  const amount = props.location?.state?.amount
  const [error, setError] = useState(false)
  const [totalAmount, setTotalAmount] = useState('')
  const [value, setValue] = useState({})
  const [recommendedFunds, setRecommendedFunds] = useState(null)
  const [limitCrossed, setLimitCrossed] = useState(false)
  const [investedUser, setInvestedUser] = useState(false)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [zeroInvested, setZeroInvested] = useState(false)
  const [buttonTitle, setButtonTitle] = useState('CONTINUE')
  const navigate = navigateFunc.bind(props)
  const fetchRecommendedFunds = async () => {
    try {
      const data = await getRecommendedFund(type, amount)
      if (type === 'insta-redeem') {
        if (data?.recommendations && data?.recommendations?.length > 0) {
          const recData = data?.recommendations[0]
          setRecommendedFunds(recData)
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
      } else {
        setRecommendedFunds(data?.recommendations[0])
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
    } catch (err) {
      console.log(err)
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
    if (zeroInvested) {
      navigate('/invest/insta-redeem', null, null, true)
    } else if (fetchFailed) {
      fetchRecommendedFunds()
    } else {
      if (!totalAmount) {
        toast('Please enter the withdraw amount')
        return
      }
      navigate(`${type}/summary`,value);
    }
  }
  const checkError = (err) => {
    setError(err)
  }
  return (
    <Container
      buttonTitle={buttonTitle}
      fullWidthButton
      classOverRideContainer="pr-container"
      classOverRide="withdraw-two-button"
      hideInPageTitle
      disable={type === 'insta-redeem' ? limitCrossed || error : true}
      handleClick2={handleClick}
      handleClick={handleClick}
      showSkelton={isEmpty(recommendedFunds)}
      twoButton={type !== 'insta-redeem'}
      footerText1={totalAmount}
      disable2={error}
    >
      {recommendedFunds?.allocations && (
        <>
          {(investedUser || type !== 'insta-redeem') && (
            <section>
              {recommendedFunds?.allocations?.map((el, idx) => (
                <FundCard
                  key={idx}
                  expand={idx === 0}
                  type={type}
                  data={el}
                  disabled={type === 'systematic' || limitCrossed}
                  calcTotalAmount={calcTotalAmount}
                  checkError={checkError}
                />
              ))}
            </section>
          )}

          {limitCrossed && (
            <section className="withdraw-insta-exceed">
              <div className="withdraw-insta-exceed-icon">
                <img src={require('assets/error_icon.svg')} alt="error"  />
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
          <section className="withdraw-instant-msg">
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
    <section className="withdraw-insta">
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
    <div className="pr-error-container withdraw-insta-failed">
      <section className="image-cover">
        <img
          src={require(`assets/${product_name}/server_error_page.svg`)}
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
