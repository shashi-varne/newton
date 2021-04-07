import React from 'react'
import Dialog from 'common/ui/Dialog'
import { getConfig } from 'utils/functions'
import Button from '@material-ui/core/Button'

const KnowMoreDialog = ({ open, onClose, message }) => {
  const productName = getConfig().productName

  return (
    <Dialog open={open} onClose={onClose} id="withdraw-know-more">
      <section className="withdraw-know-more-content">
        <div className="header">
          <div className="title">
            Avoid taxes for better returns  
          </div>
          <img
            src={require(`assets/${productName}/ic_btm_sheet_high_returns.svg`)}
            alt="Get Better Returns"
          />
        </div>
        <p className="description">
          {message}
        </p>

        <Button
          color="secondary"
          variant="raised"
          fullWidth
          className="action-btn"
          onClick={onClose}
        >
          GOT IT
        </Button>
      </section>
    </Dialog>
  )
}

export default KnowMoreDialog
