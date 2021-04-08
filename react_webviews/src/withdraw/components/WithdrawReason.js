import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import isEmpty from 'lodash/isEmpty';
import { navigate as navigateFunc } from '../common/commonFunction';
import Dialog from '../mini_components/Dialog';

import './style.scss';

import { getWithdrawReasons } from '../common/Api';
import { postWithdrawReasons } from '../common/Api';
import { storageService } from '../../utils/validators';

const Landing = (props) => {
  const [reasons, setReasons] = useState(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedQstn,setSelectedQstn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    const data = storageService().getObject('withdrawReasons');
    if (isEmpty(data)) {
      fetchWithdrawReasons();
    } else {
      setReasons(data);
    }
  }, []);

  const fetchWithdrawReasons = async () => {
    const result = await getWithdrawReasons();
    if (result?.dnd_flag) {
      navigate('');
    } else {
      storageService().setObject('withdrawReasons', result?.survey?.question);
      setReasons(result?.survey?.question);
    }
  };
  const sendWithdrawReason = async (param) => {
    try {
      setIsLoading(true);
      await postWithdrawReasons(param);
      navigate('');
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubQuestions = (qstn) => () => {
    
    if (qstn?.action?.text_input) {
      setSelectedQstn(qstn);
      setError(false);
      setOpen(true);
      return;
    } else{
      if (qstn?.action?.dismiss) {
        try {
          sendWithdrawReason({ choice: qstn?.tag, reason: qstn?.title });
          return;
        } catch (err) {
          console.log(err);
        }
      }
    }

    navigate('remark', qstn);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProceed = () => {
    if(value){
      const data = { choice: selectedQstn?.tag, reason: value };
      sendWithdrawReason(data);
      setOpen(false);
    } else {
      setError(true);
    }
  };

  const handleChange = (event) => {
    console.log("value is", value);
    if (event.target.value.length !== 0) {
      setValue(event.target.value);
      if (error) {
        setError(false);
      }
    } else {
      setValue(event.target.value);
      setError(true);
    }
  };

  return (
    <Container 
      buttonTitle='Continue' 
      fullWidthButton       
      title="Withdraw"
      noPadding 
      noFooter 
      skelton={isLoading}
    >
      {!isEmpty(reasons) && (
        <section className='withdraw-reasons'>
          <div className='withdraw-reason-title'>{reasons?.title}</div>

          <div className='withdraw-reason-list'>
            {reasons?.options?.map((el, idx) => (
              <div className='withdraw-reason-items' onClick={getSubQuestions(el)} key={idx}>
                <div>{el?.title}</div>
                <KeyboardArrowRightIcon />
              </div>
            ))}
          </div>
        </section>
      )}
      <Dialog
        open={open}
        close={handleClose}
        title='Please specify your reason'
        id='reason'
        placeholder='Reason'
        handleChange={handleChange}
        handleProceed={handleProceed}
        value={value}
        error={error}
        helperText={error ? 'Please enter the reason' : ''}
      />
    </Container>
  );
};

export default Landing;
