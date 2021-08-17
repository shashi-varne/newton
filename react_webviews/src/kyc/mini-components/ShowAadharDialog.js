import React from 'react'
import Dialog from '../../common/ui/Dialog'
import { getConfig } from 'utils/functions'
import { Button } from '@material-ui/core'
import "./mini-components.scss";

const ShowAadharDialog = ({ open, onClose, redirect }) => {
  const productName = getConfig().productName
  
  return (
    <Dialog open={open} onClose={onClose} id='kyc-bottom-dialog'  data-aid='kyc-bottom-dialog'>
      <section className="kyc-show-aadhar" data-aid='kyc-show-aadhar'>
        <header className="header" data-aid='kyc-dialog-header'>
          <h1>Aadhar KYC</h1>
          <img
            src={require(`assets/${productName}/icn_aadhaar_kyc_small.svg`)}
            alt="Aadhar KYC"
          />
        </header>
        <p className="description" data-aid='kyc-description'>
          Link with DigiLocker to complete paperless KYC
        </p>
        <main className="content" data-aid='kyc-content'>
          <div className="info-box" data-aid='info-box-one'>
            <img
              src={require(`assets/${productName}/ic_instant.svg`)}
              className="icon"
              alt=""
            />
            <div className="title">Instant Investment</div>
          </div>
          <div className="info-box" data-aid='info-box-two'>
            <img
              src={require(`assets/${productName}/ic_no_doc.svg`)}
              className="icon"
              alt=""
            />
            <div className="title">No document asked</div>
          </div>
        </main>
        <Button variant="raised" fullWidth className="action-btn" data-aid='kyc-action-btn' onClick={redirect}>
          <span className="btn-text">connect digilocker</span>
        </Button>
      </section>
    </Dialog>
  )
}

export default ShowAadharDialog
