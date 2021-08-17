import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import "./mini-components.scss";
import Slide from '@material-ui/core/Slide'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const SlidingDialog = ({ id, close, open, children, ...props }) => {
  return (
    <Dialog
      onClose={() => close()}
      open={open}
      aria-labelledby="sliding-dialog"
      TransitionComponent={Transition}
      aria-describedby="dialog-slide-selection"
      id="kyc-bank-verification-dialog"
      {...props}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default SlidingDialog
