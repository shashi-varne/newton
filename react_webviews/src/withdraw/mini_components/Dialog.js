import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Input from 'common/ui/Input';
import Button from '@material-ui/core/Button'

const AmountDialog = ({ open, close, disableBackdropClick,title, id, placeholder,handleChange,handleProceed,value,error, helperText }) => {
  // const handleChange = (event) => {
  //   setValue(event.target.value)
  // }
  // const handleProceed = () => {
  //   /**
  //    * @TODO
  //    */
  // }
  return (
    <Dialog open={open} onClose={close} className="withdraw-amount-dialog" disableBackdropClick={disableBackdropClick}>
      <section className="withdraw-amount-dialog-content">
        <div className="title">{title}</div>
        <form className="withdraw-amount-form">
          <Input
            id={id}
            name={id}
            placeholder={placeholder}
            fullWidth
            value={value}
            onChange={handleChange}
            type='text'
            error={error}
            autoFocus
            helperText={helperText}
            inputMode='numeric'
            pattern='[0-9]*'
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
