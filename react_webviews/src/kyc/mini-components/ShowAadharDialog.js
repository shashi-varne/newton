import React from 'react'
import Dialog from '../../common/ui/Dialog'
import { getConfig } from 'utils/functions'
import { Button } from '@material-ui/core'
import "./mini-components.scss";

const ShowAadharDialog = ({ open, onClose, redirect }) => {
  const productName = getConfig().productName
  
  return (
    <Dialog open={open} onClose={onClose} id='kyc-bottom-dialog' >
      <section className="kyc-show-aadhar">
        <header className="header">
          <h1>Aadhar KYC</h1>
          <img
            src={require(`assets/${productName}/icn_aadhaar_kyc_small.svg`)}
            alt="Aadhar KYC"
          />
        </header>
        <p className="description">
          Link with Digilocker to complete paperless KYC
        </p>
        <main className="content">
          <div className="info-box">
            <img
              src={require(`assets/${productName}/ic_instant.svg`)}
              className="icon"
              alt=""
            />
            <div className="title">Instant Investment</div>
          </div>
          <div className="info-box">
            <img
              src={require(`assets/${productName}/ic_no_doc.svg`)}
              className="icon"
              alt=""
            />
            <div className="title">No document asked</div>
          </div>
        </main>
        <Button variant="contained" fullWidth className="action-btn" onClick={redirect}>
          <span className="btn-text">connect digilocker</span>
        </Button>
      </section>
    </Dialog>
  )
}

export default ShowAadharDialog
