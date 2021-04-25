import React, { useState, useEffect } from 'react';
import Container from './common/Container';
import DropdownWithoutIcon from 'common/ui/SelectWithoutIcon';
import toast from 'common/ui/Toast';
import isEmpty from 'lodash/isEmpty';
import Input from 'common/ui/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { getFeedBackList, postFeedBackList } from './common/api';
import { navigate as navigateFunc } from './common/commonFunctions';
import { withRouter } from 'react-router-dom';
import Grow from '@material-ui/core/Grow';
import './FeedBack.scss';
import { storageService } from 'utils/validators';

const characterLength = 150;
const FeedBack = (props) => {
  const [feedBackList, setFeedBackList] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = navigateFunc.bind(props);
  const user = storageService().getObject('user');

  useEffect(() => {
    fetchFeedBackList();
  }, []);
  const fetchFeedBackList = async () => {
    try {
      setIsLoading(true);
      const data = await getFeedBackList();
      console.log('data', data);
      const newData = data?.relevant_categories?.map((el) => {
        el.value = el.tag;
        return el;
      });
      setFeedBackList(newData);
    } catch (err) {
      toast(err, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedBack = async () => {
    if (message.length < 10) {
      toast('Minimum 10 characters required');
      return;
    }
    const params = {
      email: user?.email,
      message,
      tag: selectedValue,
    };
    try {
      setButtonLoader('button');
      await postFeedBackList(params);
      setShowMessage(true);
    } catch (err) {
      toast(err, 'error');
      console.log('errr');
    } finally {
      setButtonLoader(false);
    }
  };

  const handleDialog = () => {
    setShowMessage(!showMessage);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const handleClick = () => {
    setShowMessage(false);
    navigate('/');
  };
  return (
    <Container
      buttonTitle='NEXT'
      title='Write to us'
      handleClick={sendFeedBack}
      skelton={isLoading}
      buttonDisabled={!selectedValue || !message}
      showLoader={buttonLoader}
    >
      {!isEmpty(feedBackList) && (
        <div>
          <div className='fund-list-input'>
            <DropdownWithoutIcon
              options={feedBackList}
              id='subject'
              label='Subject'
              isAOB={true}
              value={selectedValue || ''}
              name='subject'
              onChange={handleChange}
            />
          </div>
          <div className='feedback-message'>
            <Input
              id='message'
              multiline
              rows={9}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              helperText={`${message.length}/${characterLength}`}
              variant='outlined'
              inputProps={{
                maxlength: characterLength,
              }}
            />
          </div>
        </div>
      )}
      <DialogSucess close={handleDialog} isOpen={showMessage} handleClick={handleClick} />
    </Container>
  );
};

export default withRouter(FeedBack);

const DialogSucess = ({ isOpen, close, handleClick }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby='feedback-dialog'
      aria-describedby='feedback-dialog'
      className='feedback-dialog'
      id='feedback-campaign-dialog'
      disableBackdropClick
      TransitionComponent={Transition}
    >
      <DialogContent>
        <div className='feedback-message-dialog'>
          <div className='feedback-img-wrapper'>
            <img src={require('assets/send_icon.png')} alt='send_icon' />
          </div>
          <div className='feedback-dialog-res'>
            Thanks for writing to us. <br />
            We will revert to you shortly.
          </div>
          <Button className='button-bg-full' onClick={handleClick}>
            OK
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Transition = (props) => {
  return <Grow {...props} />;
}