import React from 'react'
import Container from '../common/Container'
import Faqs from 'common/ui/Faqs'
import { FAQs } from '../constants'


function RenderFAQs(props) {
  return (
    <Container noFooter title="FAQs">
      <div className="heading1 m-bottom-4x">Frequently Asked Questions</div>
      <Faqs options={FAQs} />
    </Container>
  )
}

export default RenderFAQs
