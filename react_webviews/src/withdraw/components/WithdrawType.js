import React from 'react';
import Container from '../common/Container';
import FundCard from '../mini_components/FundCard'
const Landing = (props) => {

  return (
    <Container
      buttonTitle='Continue'
      fullWidthButton
      title='Portfolio rebalancing'
      classOverRideContainer='pr-container'
      hidePageTitle
    >
      <section>
        {
          [1,1,1,1].map((el,idx) => (
            <FundCard key={el} expand={idx === 0} type='insta'/>
            ))
        }
      </section>
    </Container>
  );
};


export default Landing;
