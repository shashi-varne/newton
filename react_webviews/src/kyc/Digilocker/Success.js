import React, { useState } from 'react'
import Container from '../common/Container'
import { getConfig, navigate as navigateFunc } from '../../utils/functions'
import { DL_DOCS } from '../constants'
import { navigate as navigateFunc } from '../common/functions'
import "./Digilocker.scss";
import ConfirmBackDialog from '../mini-components/ConfirmBackDialog'

const Success = (props) => {
  const productName = getConfig().productName;
  const [isBackDialogOpen, setBackDialogOpen] = useState(false);
  const proceed = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/kyc/journey')
  }
  return (
    <Container
      title="Share Details"
      buttonTitle="PROCEED"
      handleClick={proceed}
      headerData={{goBack: () => setBackDialogOpen(true) }}
    >
      <section id="digilocker-success">
        <div className="page-desc">
          Tap on Proceed to allow fisdom to access your following documents
        </div>
        <main className="esign-steps">
          {DL_DOCS.map(({ name, icon }, idx) => (
            <div className="doc flex-center" key={icon}>
              <img
                src={require(`assets/${productName}/${icon}.svg`)}
                className="doc-icon"
                alt=""
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
      <ConfirmBackDialog
        isOpen={isBackDialogOpen}
        close={() => setBackDialogOpen(false)}
        goBack={proceed}
      />
    </Container>
  )
}

export default Success
