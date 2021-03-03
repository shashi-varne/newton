import React, {useEffect, useState} from 'react';
import Container from '../common/Container';
import FundCard from '../mini_components/FundCard';
import isEmpty from 'lodash/isEmpty'
import {getRecommendedFund} from '../common/Api';

const Landing = (props) => {
  const {type} = props.match?.params;
  const amount = props.location?.state?.amount;
  console.log(props?.location);
  const [recommendedFunds, setRecommendedFunds] = useState(null);
  const fetchRecommendedFunds = async () => {
    try {
      const data = await getRecommendedFund(type, amount);
      setRecommendedFunds(data?.recommendations[0]);
    } catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    fetchRecommendedFunds();
  },[]);
  return (
    <Container
      buttonTitle='Continue'
      fullWidthButton
      classOverRideContainer='pr-container'
      hideInPageTitle
    >
      {
        !isEmpty(recommendedFunds?.allocations) && 
        <>
        <section>
        {
          recommendedFunds?.allocations?.map((el,idx) => (
            <FundCard key={el} expand={idx === 0} type={type} data={el}/>
            ))
        }
      </section>
      {
        type === 'insta-redeem' &&
        <section className='withdraw-instant-msg'>
        <div>
          Instant in bank account
        </div>
        <div>
          |
        </div>
        <div>
          Get it in 30 mins
        </div>
      </section>
      }
      </>
          }
    </Container>
  );
};


export default Landing;
