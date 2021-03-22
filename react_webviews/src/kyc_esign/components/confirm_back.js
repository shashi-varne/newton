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
      {...props}
    >
      <DialogContent>
        <section className="kyc-esign-gb-dailog">
          <article
            style={{
              margin: '10px 0',
              fontSize: '16px',
            }}
          >
            You are almost there, do you really want to go back?
          </article>
          <footer style={{
              display: 'flex',
              justifyContent: 'flex-end',
          }}>
            <Button onClick={confirm}>Yes</Button>
            <Button onClick={cancel} variant="flat">No</Button>
          </footer>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBackModal
