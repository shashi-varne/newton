import React from 'react'
import Container from '../common/Container'
import Faqs from 'common/ui/Faqs'
import { FAQs } from '../constants'

function RenderFAQs(props) {
  return (
    <Container noFooter title="Frequently Asked Questions">
      <div className="m-top-4x tax-filing-render-faqs-container">
        <Faqs
          options={FAQs}
          callback={(index) => {
            console.log('Calling index', index)
          }}
        />
      </div>
    </Container>
  )
}

export default RenderFAQs
