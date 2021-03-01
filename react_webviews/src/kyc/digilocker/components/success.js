import React, { useState } from 'react'
import Container from '../../common/Container'
import { initData } from '../../services'
import toast from 'common/ui/Toast'
import { getConfig } from '../../../utils/functions'
import { dlDocs } from '../../constants'

const Success = (props) => {
  const productName = getConfig().productName
  const [showLoader, setShowLoader] = useState(false)
  return (
    <Container showLoader={showLoader} hideInPageTitle buttonTitle="PROCEED">
      <section id="digilocker-success">
        <div className="page-title">Share Details</div>
        <div className="page-desc">
          Tap on Proceed to allow fisdom to access your following documents
        </div>
        <main className="esign-steps">
          {dlDocs.map(({ name, icon }, idx) => (
            <div className="doc flex-center" key={icon}>
              <img
                src={require(`assets/${productName}/${icon}.svg`)}
                className="doc-icon"
              />
              <div className="doc-name">{idx + 1}{'. '}{name}</div>
            </div>
          ))}
        </main>
        <footer className="footer">
          <div className="bottom-text flex-center-center center">Initiative by</div>
          <img
            src={require(`assets/ic_gov_meit.svg`)}
            alt="Initiative by Ministry of Electronics and Information Technology"
            className="bottom-image flex-center-center"
          />
        </footer>
      </section>
    </Container>
  )
}

export default Success
