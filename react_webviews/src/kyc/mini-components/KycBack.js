import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'

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
        <section className="kyc-journey-go-back-dailog">
          <article
            className="text"
          >
            KYC is mandatory for investment, are you sure you want to go back?
          </article>
          <footer className="actions">
            <Button onClick={confirm}>Later</Button>
            <Button onClick={cancel} variant="flat">Complete KYC</Button>
          </footer>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default KycBackModal
