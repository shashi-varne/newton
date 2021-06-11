import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

const CampaignDialog = ({ isOpen, close, handleClick, cancel, data }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby='campaign-dialog'
      keepMounted
      aria-describedby='campaign-dialog'
      TransitionComponent={Transition}
      className='campaign-dialog'
      id='sdk-campaign-dialog'
    >
      <DialogContent className='campaign-dialog-content'>
        <div className='title'>
          <div className='text'>{data?.title}</div>
        </div>
        <div className='campaign-img-container'>
          <img src={data?.image} alt='' className='img' />
        </div>
        <div className='subtitle'>{data?.subtitle}</div>
      </DialogContent>

      <DialogActions className='dialog-action'>
        {data?.action_buttons?.buttons?.length === 2 && (
          <Button className='button no-bg' onClick={cancel}>
            NOT NOW
          </Button>
        )}
        <Button className='button bg-full' onClick={handleClick}>
          {data?.action_buttons?.buttons[0]?.title || ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignDialog;

const Transition = (props) => {
  return <Slide direction="up" {...props} />;
}
