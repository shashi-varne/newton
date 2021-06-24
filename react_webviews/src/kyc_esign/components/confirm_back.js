import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'

const ConfirmBackModal = ({ id, open, confirm, cancel, ...props }) => {
  return (
    <Dialog
      onClose={() => cancel()}
      open={open}
      aria-labelledby="kyc-esign-back"
      aria-describedby="kyc-esign-back-confirmation"
      id="kyc-esign-back-dialog"
      data-aid='kyc-esign-back-dialog'
      {...props}
    >
      <DialogContent>
        <section className="kyc-esign-gb-dailog" data-aid='kyc-esign-gb-dailog'>
          <article
            className="text" data-aid='kyc-esign-text'
          >
            You are almost there, do you really want to go back?
          </article>
          <footer className="actions">
            <Button data-aid='yes-btn' onClick={confirm}>Yes</Button>
            <Button data-aid='no-btn' onClick={cancel} variant="flat">No</Button>
          </footer>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBackModal
