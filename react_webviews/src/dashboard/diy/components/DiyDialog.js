import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'

import Slide from '@material-ui/core/Slide'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const DiyDialog = ({ close, open, children }) => {
  return (
    <Dialog
      onClose={() => close()}
      open={open}
      aria-labelledby="diy-dialog"
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="diy-dialog-slide-selection"
      id="diy-dialog"
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default DiyDialog
