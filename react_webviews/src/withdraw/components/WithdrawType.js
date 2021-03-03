import React, {useEffect, useState} from 'react';
import Container from '../common/Container';
import FundCard from '../mini_components/FundCard';
import isEmpty from 'lodash/isEmpty'
import {getRecommendedFund} from '../common/Api';

const Landing = (props) => {
  const {type} = props.match?.params;
  const [recommendedFunds, setRecommendedFunds] = useState(null);
  const fetchRecommendedFunds = async () => {
    try {
      const data = await getRecommendedFund(type);
      setRecommendedFunds(data?.recommendations[0]);
      console.log(data);
    } catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    fetchRecommendedFunds();
  },[])
  return (
    <Container
      buttonTitle='Continue'
      fullWidthButton
      title='Portfolio rebalancing'
      classOverRideContainer='pr-container'
      hidePageTitle
    >
      {
        !isEmpty(recommendedFunds?.allocations) && 
        <section>
        {
          recommendedFunds?.allocations?.map((el,idx) => (
            <FundCard key={el} expand={idx === 0} type={type} data={el}/>
            ))
        }
      </section>
          }
    </Container>
  );
};


export default Landing;
