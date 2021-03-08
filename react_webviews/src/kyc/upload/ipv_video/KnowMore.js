import React from 'react'
import Dialog from '@material-ui/core/Dialog'

const KnowMore = ({ isOpen }) => {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="ipv-know-dialog"
      keepMounted
      aria-describedby="ipv-know-dialog"
      className="ipv-know-dialog"
      id="kyc-bottom-dialog"
      fullScreen={true}
    >
      <div className="know_more_dialog">
        adhaskjdhkjsahdsakjhd
      </div>
    </Dialog>
  );
}

export default KnowMore