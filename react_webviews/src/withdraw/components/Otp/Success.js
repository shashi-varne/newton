import React from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from 'utils/functions'

import './Success.scss';

const Success = (props) => {
  const successMessage = props?.location?.state?.message;
  const navigate = navigateFunc.bind(props);
  if(!successMessage){
    navigate('/withdraw');
  }
  const type = props?.location?.state?.type
  const pageHead = type === 'switch' ? 'Switch' : 'Withdraw'
  const goTo = () => {
    if (type === 'switch') {
      navigate('/reports/switched-transaction')
    } else {
      navigate('/reports/redeemed-transaction')
    }
  }
  return (
    <Container hidepageTitle buttonTitle="Okay" handleClick={goTo} headerData={{icon: "close"}} >
      <section id="withdraw-otp-success">
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
