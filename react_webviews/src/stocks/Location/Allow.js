import React from 'react'
import Container from '../common/Container'
import { getConfig } from '../../utils/functions'
import { navigate as navigateFunc } from '../common/functions'
import "./Location.scss";

const Allow = (props) => {
  const productName = getConfig().productName;
  const goBack = () => {
    const navigate = navigateFunc.bind(props)
    // navigate('path')
  }
  return (
    <Container
      force_hide_inpage_title={true}
      buttonTitle="ALLOW"
      handleClick={goBack}
      headerData={{ goBack }}
      disableBack
    >
      <section id="allow-location">
        <div className="flex-justify-center">
          <img
            src={require(`assets/${productName}/location.svg`)}
            className="location-icon"
            alt="location"
          />
        </div>
        <div className="page-desc">
          <div className="page-title">
            Allow location access
          </div>
          <div className="page-subtitle">
            As per SEBI, we need to capture your location while you take the selfie
          </div>
        </div>
      </section>
    </Container>
  )
}

export default Allow;
