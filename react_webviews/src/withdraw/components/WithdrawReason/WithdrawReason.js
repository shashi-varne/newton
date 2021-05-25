import React, { useEffect, useState } from 'react';
import Container from '../../common/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import isEmpty from 'lodash/isEmpty';
import { navigate as navigateFunc } from '../../common/commonFunction';
import Dialog from '../../mini-components/Dialog';
import toast from 'common/ui/Toast';

import './WithdrawReason.scss';

import { getWithdrawReasons } from '../../common/Api';
import { postWithdrawReasons } from '../../common/Api';
import { storageService } from '../../../utils/validators';

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
    setIsLoading(true)
    try {
      const result = await getWithdrawReasons();
      if (result?.dnd_flag) {
        navigate("");
      } else {
        storageService().setObject("withdrawReasons", result?.survey?.question);
        setReasons(result?.survey?.question);
      }
    } catch (err) {
      props.history.goBack();
    } finally {
      setIsLoading(false);
    }
  };
  const sendWithdrawReason = async (param) => {
    try {
      setIsLoading(true);
      await postWithdrawReasons(param);
      navigate('');
    } catch (err) {
      toast(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubQuestions = (qstn) => () => {
    
    if (qstn?.action?.text_input) {
      setSelectedQstn(qstn);
      setError(false);
      setValue('');
      setOpen(true);
      return;
    } else{
      if (qstn?.action?.dismiss) {
        try {
          sendWithdrawReason({ choice: qstn?.tag, reason: qstn?.title });
          return;
        } catch (err) {
          toast(err);
        }
      }
    }

    navigate('remark', {state:qstn});
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
      data-aid='withdraw-reason-screen' 
      buttonTitle='Continue' 
      fullWidthButton       
      title="Withdraw"
      noPadding 
      noFooter 
      skelton={isLoading}
    >
      {!isEmpty(reasons) && (
        <section className='withdraw-reasons' data-aid='withdraw-reason'>
          <div className='withdraw-reason-title' data-aid='withdraw-reason-title'>{reasons?.title}</div>

          <div className='withdraw-reason-list'>
            {reasons?.options?.map((el, idx) => (
              <div className='withdraw-reason-items' data-aid={`withdraw-reason-items-${idx+1}`} onClick={getSubQuestions(el)} key={idx}>
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
