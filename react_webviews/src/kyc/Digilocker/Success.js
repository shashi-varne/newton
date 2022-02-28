import React, { useEffect } from 'react'
import Container from '../common/Container'
import { getConfig, navigate as navigateFunc } from '../../utils/functions'
import { DL_DOCS } from '../constants'
import "./Digilocker.scss";
import { Imgc } from '../../common/ui/Imgc';
import { nativeCallback } from '../../utils/native_callback';

const Success = (props) => {
  const config = getConfig();
  const productName = config.productName;

  const proceed = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/kyc/journey')
  }
  
  useEffect(() => {
    if (config.app === "ios") {
      nativeCallback({ action: 'hide_top_bar' });
    }
  }, [])

  return (
    <Container
      title="Allow document permission"
      buttonTitle="ALLOW PERMISSION"
      handleClick={proceed}
      headerData={{ icon: "close" }}
      iframeRightContent={require(`assets/${productName}/digilocker_kyc.svg`)}
      data-aid='kyc-success-page'
    >
      <section id="digilocker-success" data-aid='kyc-digilocker-success'>
        <div className="kyc-main-subtitle" data-aid='kyc-page-desc-text'>
          We need access to the following documents for your KYC
        </div>
        <main className="esign-steps" data-aid='kyc-esign-steps'>
          {DL_DOCS.map(({ name, icon }, idx) => (
            <div className="doc flex-center" key={icon}>
              <Imgc
                src={require(`assets/${productName}/${icon}.svg`)}
                className="doc-icon"
                alt=""
              />
              <div className="doc-name" id={`name-${idx+1}`} data-aid={`name-${idx+1}`}>{name}</div>
            </div>
          ))}
        </main>
        <footer className="footer" data-aid='kyc-footer'>
          <div className="bottom-text flex-center-center center">INITIATIVE BY</div>
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
