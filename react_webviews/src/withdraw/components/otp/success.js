import React from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/commonFunction'

const Success = (props) => {
  const successMessage = props?.location?.state?.success_message
  const type = props?.location?.state?.type
  const pageHead = type === 'switch' ? 'Switch' : 'Withdraw'
  const goTo = () => {
    const navigate = navigateFunc.bind(props)
    if (type === 'switch') {
      navigate('/reports/switched-transaction')
    } else {
      navigate('/reports/redeemed-transaction')
    }
  }
  return (
    <Container hidepageTitle buttonTitle="Okay" handleClick={goTo}>
      <section id="withdraw-otp-success">
        <img
          className="thumb-img"
          src={require(`assets/thumb.svg`)}
          alt="Successful Operation"
          width="100"
        />
        <div className="message">{pageHead} request placed</div>
      </section>
    </Container>
  )
}

export default Success
