import React from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/commonFunction'

import './Success.scss';

const Success = (props) => {
  const successMessage = props?.location?.state?.message;
  const navigate = navigateFunc.bind(props);
  if(!successMessage){
    navigate('');
  }
  const type = props?.location?.state?.type
  const pageHead = type === 'switch' ? 'Switch' : 'Withdraw'
  const goTo = () => {
    if (type === 'switch') {
      navigate('/reports/switched-transaction', null, true)
    } else {
      navigate('/reports/redeemed-transaction', null, true)
    }
  }
  return (
    <Container hidepageTitle buttonTitle="Okay" handleClick={goTo} data-aid='opt-success-screen' >
      <section id="withdraw-otp-success" data-aid='withdraw-otp-success'>
        <img
          className="thumb-img"
          src={require(`assets/thumb.svg`)}
          alt="Successful Operation"
          width="100"
        />
        <div className="message">{pageHead} request placed</div>
        <div className="withdraw-success-msg" dangerouslySetInnerHTML={{ __html: successMessage }}></div>
      </section>
    </Container>
  )
}

export default Success
