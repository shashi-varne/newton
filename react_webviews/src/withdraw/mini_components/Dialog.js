import React, { useState } from 'react'
import Dialog from 'common/ui/Dialog'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const AmountDialog = ({ open, close, title, id, placeholder,handleChange,handleProceed,value,error, helperText }) => {
  // const handleChange = (event) => {
  //   setValue(event.target.value)
  // }
  // const handleProceed = () => {
  //   /**
  //    * @TODO
  //    */
  // }
  return (
    <Dialog open={open} onClose={close} className="withdraw-amount-dialog">
      <section className="withdraw-amount-dialog-content">
        <div className="title">{title}</div>
        <form className="withdraw-amount-form">
          <TextField
            id={id}
            name={id}
            placeholder={placeholder}
            fullWidth
            value={value}
            onChange={handleChange}
            error={error}
            helperText={helperText}
            autoComplete={false}
          />
          <div className="flex-between">
            <Button color="primary" onClick={close} className="cancel-btn">
              cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleProceed}
              className="proceed-btn"
            >
              continue
            </Button>
          </div>
        </form>
      </section>
    </Dialog>
  )
}

export default AmountDialog
