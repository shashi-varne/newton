import React, { useState, useEffect } from 'react';
import Container from './common/Container';
import DropdownWithoutIcon from 'common/ui/SelectWithoutIcon';
import toast from 'common/ui/Toast';
import isEmpty from 'lodash/isEmpty';
import Input from 'common/ui/Input';
import { getFeedBackList, postFeedBackList } from './common/api';
import { withStyles } from 'material-ui/styles';
import './FeedBack.scss';
import { storageService } from 'utils/validators';

const styles = {
  root: {
    border: '1px solid #e8e8e8 !important',
    borderRadius: '3px !important',
    padding: '10px !important',
  },
};

const characterLength = 150;
const FeedBack = ({ classes }) => {
  const [feedBackList, setFeedBackList] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const user = storageService().getObject('user');

  useEffect(() => {
    fetchFeedBackList();
  }, []);
  const fetchFeedBackList = async () => {
    try {
      setIsLoading(true);
      const data = await getFeedBackList();
      console.log('data', data);
      const newData = data?.relevant_categories?.map(el => {
        el.value = el.tag;
        return el;
      })
      setFeedBackList(newData);
    } catch (err) {
      toast(err, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedBack = async () => {
    if(message.length < 10) {
      toast('Minimum 10 characters required');
      return;
    }
    const params = {
      email: user?.email,
      message,
      tag: selectedValue
    }
    try{
      await postFeedBackList(params);
      
    } catch(err){
      console.log("errr");
    } finally {

    }
  }

  const handleChange = (value) => {
    setSelectedValue(value);
  };
  return (
    <Container buttonTitle='NEXT' title='Write to us' handleClick={sendFeedBack} skelton={isLoading} buttonDisabled={!selectedValue || !message}>
      {!isEmpty(feedBackList) && (
        <div>
          <div className='fund-list-input'>
            <DropdownWithoutIcon
              options={feedBackList}
              id='subject'
              label='Subject'
              isAOB={true}
              value={selectedValue || ""}
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
              className={classes.root}
              helperText={`${message.length}/${characterLength}`}
              variant='outlined'
              inputProps={{
                maxlength: characterLength,
              }}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default withStyles(styles)(FeedBack);


