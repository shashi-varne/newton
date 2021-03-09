import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import FundCard from '../mini_components/FundCard';
import isEmpty from 'lodash/isEmpty';
import { getRecommendedFund } from '../common/Api';
import { validateNumber } from 'utils/validators';
import { navigate as navigateFunc } from '../common/commonFunction';

const Landing = (props) => {
  const { type } = props.match?.params;
  const amount = props.location?.state?.amount;
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [recommendedFunds, setRecommendedFunds] = useState(null);
  const [limitCrossed, setLimitCrossed] = useState(false);
  const [investedUser, setInvestedUser] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [zeroInvested, setZeroInvested] = useState(false);
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedFunds = async () => {
    try {
      const data = await getRecommendedFund(type, amount);
      console.log(data)
      if (type === 'insta-redeem') {
        if (data?.recommendations && data?.recommendations?.length > 0) {
          const recData = data?.recommendations[0];
          setRecommendedFunds(recData);
          if (
            recData.ir_funds_available &&
            recData.all_success &&
            recData.allocations &&
            recData.allocations[0] &&
            (recData.allocations[0].amount <= 0 || !recData.allocations[0].amount)
          ) {
            setLimitCrossed(true);
          }
          if (recData.ir_funds_available && recData.all_success) {
            setInvestedUser(true);
          } else if (recData.ir_funds_available && !recData.all_success) {
            setFetchFailed(true);
          } else {
            setZeroInvested(true);
          }
        } else {
          setFetchFailed(true);
        }
      } else {
        setRecommendedFunds(data?.recommendations[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchRecommendedFunds();
  }, []);

  const handleChange = (data) => (el) => {
    if (el.target.value === '' || validateNumber(el.target.value)) {
      checkLimit(Math.ceil(el.target.value), Math.ceil(data?.amount));
      setValue(el.target.value);
    }
  };

  const checkLimit = (num, compNum) => {
    if (type !== 'insta-redeem') {
      if (compNum > 1000) {
        if (num < 1000) {
          setError(true);
          setHelperText('Minimum withdrawal amount for each fund is 1000');
        } else if (num > compNum) {
          setError(true);
          setHelperText('Amount cannot be more than withdrawable amount');
          return;
        } else {
          if (error) {
            setError(false);
          }
        }
        setValue(num);
      } else {
        if (num < compNum) {
          setError(true);
          setHelperText(`Withdrawal amount ${num} cannot be less than compNum ${compNum} amount`);
        } else if (num > compNum) {
          setError(true);
          setHelperText(
            `Withdrawal amount ${num} cannot be greater than compNum ${compNum} amount`
          );
        } else {
          if (error) {
            setError(false);
          }
        }
        setValue(num);
      }
    } else {
      if (num > Math.ceil(compNum)) {
        setError(true);
        setHelperText('Amount cannot be more than withdrawable amount');
      } else if (num <= 0) {
        setError(true);
        setHelperText('Minimum withdrawal amount for fund is 1');
        setValue('');
        return;
      } else {
        if (error) {
          setError(false);
        }
      }
      setValue(num);
    }
  };
  const handleClick = () => {
    if (zeroInvested) {
      navigate('');
    }
  };
  return (
    <Container
      buttonTitle2={zeroInvested ? 'DEPOSIT NOW' : 'CONTINUE'}
      fullWidthButton
      classOverRideContainer='pr-container'
      classOverRide="withdraw-two-button"
      hideInPageTitle
      disable={limitCrossed}
      handleClick={handleClick}
      showSkelton={isEmpty(recommendedFunds)}
      twoButton={true}
      footerText1={'1000'}
    >
      {(recommendedFunds?.allocations) && (
        <>
          {(investedUser || type !== 'insta-redeem') && (
            <section>
              {recommendedFunds?.allocations?.map((el, idx) => (
                <FundCard
                  error={error}
                  helperText={helperText}
                  key={el}
                  expand={idx === 0}
                  type={type}
                  data={el}
                  handleChange={handleChange(el)}
                  value={value}
                  disabled={type === 'systematic' || limitCrossed}
                />
              ))}
            </section>
          )}

          {limitCrossed && (
            <section className='withdraw-insta-exceed'>
              <div className='withdraw-insta-exceed-icon'>
                <img src='' alt='' style={{ width: '30px', height: '30px' }} />
              </div>
              <div className='withdraw-insta-exceed-msg'>
                <div className='withdraw-insta-exceed-head'>Withdrawal limit exhausted</div>
                <div className='withdraw-insta-exceed-info'>
                  Sorry, your daily limit is exhausted. You can withdraw additional amount from
                  systematic or manual withdraw.
                </div>
              </div>
            </section>
          )}

          {type === 'insta-redeem' && investedUser && (
            <section className='withdraw-instant-msg'>
              <div>Instant in bank account</div>
              <div>|</div>
              <div>Get it in 30 mins</div>
            </section>
          )}
        </>
      )}

      {fetchFailed && <InstaRedeemFailed />}
      {zeroInvested && <InstaRedeemZero />}
    </Container>
  );
};

export default Landing;

const InstaRedeemZero = () => {
  return (
    <section className='withdraw-insta'>
      <div className='withdraw-insta-icon'>
        <img src='' alt='' style={{ height: '50px', width: '50px', background: 'red' }} />
      </div>
      <div className='withdraw-insta-head'>Current invested amount: ₹0</div>
      <div className='withdraw-insta-info'>
        Start investing for superior return compared to normal savings bank a/c, and get instant
        redemption facility
      </div>
    </section>
  );
};

const InstaRedeemFailed = () => {
  return (
    <section className='withdraw-insta'>
      <div className='withdraw-insta-icon'>
        <img src='' alt='' style={{ height: '150px', width: '150px', background: 'red' }} />
      </div>
      <div className='withdraw-insta-head'>Oops!</div>
      <div className='withdraw-insta-info'>
        Currently, we’re unable to fetch the redeemable amount due to technical issues. Please try
        again after some time.
      </div>
    </section>
  );
};
