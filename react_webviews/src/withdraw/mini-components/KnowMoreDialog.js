import React from 'react'
import Dialog from 'common/ui/Dialog'
import { getConfig } from 'utils/functions'
import Button from '@material-ui/core/Button'
import './mini-components.scss';

const KnowMoreDialog = ({ open, onClose, message }) => {
  const productName = getConfig().productName

  return (
    <Dialog open={open} onClose={onClose} id="withdraw-know-more" data-aid='withdraw-know-more'>
      <section className="withdraw-know-more-content" data-aid='withdraw-know-more-content'>
        <div className="header" data-aid='dialog-header'>
          <div className="title">
            Avoid taxes for better returns  
          </div>
          <img
            src={require(`assets/${productName}/ic_btm_sheet_high_returns.svg`)}
            alt="Get Better Returns"
          />
        </div>
        <p className="description" data-aid='dialog-description'>
          {message}
        </p>

        <Button
          color="secondary"
          variant="raised"
          fullWidth
          className="action-btn"
          onClick={onClose}
          data-aid='action-btn'
        >
          GOT IT
        </Button>
      </section>
    </Dialog>
  )
}

export default KnowMoreDialog
