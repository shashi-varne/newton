import React from 'react'
import Container from '../common/Container'
import { getConfig } from '../../utils/functions'
import { dlDocs } from '../constants'
import { navigate as navigateFunc } from '../common/functions'
import "./Digilocker.scss";

const Success = (props) => {
  const productName = getConfig().productName
  const proceed = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/kyc/journey')
  }
  return (
    <Container
      title="Share Details"
      buttonTitle="PROCEED"
      handleClick={proceed}
      headerData={{goBack: proceed }}
      data-aid='kyc-success-page'
    >
      <section id="digilocker-success">
        <div className="page-desc" data-aid='kyc-page-desc-text'>
          Tap on Proceed to allow fisdom to access your following documents
        </div>
        <main className="esign-steps" data-aid='kyc-esign-steps'>
          {dlDocs.map(({ name, icon }, idx) => (
            <div className="doc flex-center" key={icon}>
              <img
                src={require(`assets/${productName}/${icon}.svg`)}
                className="doc-icon"
                alt=""
              />
              <div className="doc-name" id={`name_${idx+1}`}>{idx + 1}{'. '}{name}</div>
            </div>
          ))}
        </main>
        <footer className="footer" data-aid='kyc-footer'>
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
