import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Container from '../../common/Container'
import TaxSummaryCard from '../../mini_components/TaxSummaryCard'
import { disclaimers } from '../../constants'
import Disclaimer from './Disclaimer'
import toast from 'common/ui/Toast'
import { getTaxes } from '../../common/Api'

const Insta = (props) => {
  console.log(props)
  if (!props?.location?.state?.amounts) {
    return <Redirect to="/withdraw" />
  }

  const fetchTaxes = async () => {
    try {
      const taxes = await getTaxes()
      console.log(taxes)
    } catch(err) {
      toast(err.message, 'error')
    }
  }

  useEffect(() => {
    fetchTaxes()
  }, [])

  return (
    <Container
      buttonTitle={'CONTINUE'}
      fullWidthButton
      classOverRideContainer="pr-container"
      classOverRide="withdraw-two-button"
      hideInPageTitle
      // handleClick2={type === 'insta-redeem' ? handleClick : ''}
      // handleClick={handleClick}
      showSkelton={false}
      twoButton={true}
      footerText1={1000}
      // disable2={error}
    >
      <section id="withdraw-insta-summary">
        <div className="title">Tax Summary</div>
        <TaxSummaryCard hideIcon={true} />
      </section>
      <Disclaimer disclaimers={disclaimers} />
    </Container>
  )
}

export default Insta
