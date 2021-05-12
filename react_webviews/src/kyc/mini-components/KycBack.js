import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import "./mini-components.scss";

const KycBackModal = ({ id, open, confirm, cancel, ...props }) => {
  return (
    <Dialog
      onClose={() => cancel()}
      open={open}
      aria-labelledby="kyc-journey-back"
      aria-describedby="kyc-journey-back-confirmation"
      id="kyc-journey-back"
      {...props}
    >
      <DialogContent>
        <section className="kyc-journey-go-back-dailog" data-aid='kyc-journey-go-back-dailog'>
          <article
            className="text"
          >
            KYC is mandatory for investment, are you sure you want to go back?
          </article>
          <footer className="actions" data-aid='kyc-actions'>
            <Button data-aid='kyc-later' onClick={confirm}>Later</Button>
            <Button data-aid='kyc-complete-kyc' onClick={cancel} variant="flat">Complete KYC</Button>
          </footer>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default KycBackModal
