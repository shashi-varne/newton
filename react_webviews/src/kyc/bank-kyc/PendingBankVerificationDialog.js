import { Button } from '@material-ui/core'

import React from 'react'
import { getConfig } from '../../utils/functions'
import SlideBottomDialog from '../mini_components/SlideBottomDialog'

const PendingBankVerificationDialog = (props) => {
  const { title, description, label, close, open, proceed, id } = props
  const productName = getConfig().productName
  const handleProceed = () => {
    close()
    proceed()
  }
  return (
    <SlideBottomDialog close={close} open={open} id={id}>
      <section className="pending-bank-verification">
        <div className="flex flex-between">
          <div className="title">{title}</div>
          <img
            src={require(`assets/${productName}/ic_bank_partial_added.svg`)}
            alt="Bank Verification Pending"
          />
        </div>
        <div className="description">{description}</div>
        <footer className="footer">
          <Button
            variant="raised"
            color="secondary"
            fullWidth
            onClick={handleProceed}
            className="continue-btn"
          >
            {label}
          </Button>
        </footer>
      </section>
    </SlideBottomDialog>
  )
}

export default PendingBankVerificationDialog
