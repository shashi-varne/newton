import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import isEmpty from 'lodash/isEmpty';
import { navigate as navigateFunc } from '../common/commonFunction';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '../mini_components/Dialog';

import { postWithdrawReasons } from '../common/Api';
import './style.scss';
import toast from 'common/ui/Toast';

const WithdrawRemark = ({ location, ...props }) => {
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const subQstn = isEmpty(location?.state) ? null : location?.state;
  const navigate = navigateFunc.bind(props);
  useEffect(() => {
    if (isEmpty(subQstn)) {
      navigate('reason');
    }
  }, []);

  const sendWithdrawReason = async (param) => {
    try {
      setIsLoading("button");
      await postWithdrawReasons(param);
      navigate('');
    } catch (err) {
      toast(err);
      console.log(err);
    } finally{
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (subQstn?.tag === 'app_concerns') {
      if (!value) {
        toast('Please select one reason');
        return;
      }
    }
    const data = {
      choice: subQstn?.tag,
      reason: subQstn?.title,
    };
    sendWithdrawReason(data);
  };

  const handleChange = (el) => {
    if (el.target.value.includes('Other')) {
      setValue(el.target.value);
      setOpen(true);
    } else {
      setValue(el.target.value);
    }
  };

  const handleChangeDialog = (event) => {
    if (event.target.value.length !== 0) {
      setReason(event.target.value);
      if (error) {
        setError(false);
      }
    } else {
      setReason(event.target.value);
      setError(true);
    }
  };

  const handleProceed = () => {
    if (reason) {
      const data = {
        choice: subQstn?.tag,
        reason,
      };
      setOpen(false);
      sendWithdrawReason(data);
    } else {
      setError(true);
    }
    return;
  };

  const handleClose = () => {
    setValue(null);
    setOpen(false);
  };

  return (
    <Container
      buttonTitle='Continue'
      fullWidthButton
      // hideInPageTitle
      title="Withdraw"
      noPadding
      handleClick={handleClick}
      showLoader={isLoading}
    >
      {!isEmpty(subQstn?.action) && (
        <section className='withdraw-remark'>
          <div className='withdraw-remark-title'>{subQstn?.action?.sub_question?.title}</div>
          {subQstn?.tag !== 'app_concerns' ? (
            <div className='withdraw-remark-list'>
              {subQstn?.action?.sub_question?.options?.map((el, idx) => (
                <div className='withdraw-remark-items' key={idx}>
                  <FiberManualRecordIcon color='primary' />
                  <div>{el.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className='withdraw-fisdom-radio'>
              <FormControl component='fieldset'>
                <RadioGroup
                  aria-label='fisdom-reasons'
                  name='reasons'
                  value={value}
                  onChange={handleChange}
                >
                  {subQstn?.action?.sub_question?.options?.map((el) => (
                    <FormControlLabel
                      value={el.title}
                      control={<Radio color='primary' />}
                      label={el.title}
                      labelPlacement='start'
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          )}
          <Dialog
            open={open}
            disableBackdropClick
            title='Please specify your reason'
            id='reason'
            close={handleClose}
            placeholder='Reason'
            handleChange={handleChangeDialog}
            handleProceed={handleProceed}
            value={reason}
            error={error}
            helperText={error ? 'Please enter the reason' : ''}
          />
        </section>
      )}
    </Container>
  );
};

export default WithdrawRemark;
