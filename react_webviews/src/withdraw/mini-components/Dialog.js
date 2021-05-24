import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Input from 'common/ui/Input';
import Button from '@material-ui/core/Button'
import './mini-components.scss';

const AmountDialog = ({ open, close, disableBackdropClick,title, id, placeholder,handleChange,handleProceed,value,error, helperText }) => {
  return (
    <Dialog open={open} onClose={close} className="withdraw-amount-dialog" disableBackdropClick={disableBackdropClick} data-aid='dialog-withdraw-amount'>
      <section className="withdraw-amount-dialog-content" data-aid='withdraw-amount-dialog-content'>
        <div className="title">{title}</div>
        <form className="withdraw-amount-form" data-aid='withdraw-amount-form'>
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
          <div className="flex-between" data-aid='flex-between'>
            <Button color="primary" onClick={close} className="cancel-btn" data-aid='cancel-btn'>
              cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleProceed}
              className="proceed-btn"
              data-aid='proceed-btn'
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
