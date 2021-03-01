import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import isEmpty from 'lodash/isEmpty';
import { navigate as navigateFunc } from '../common/commonFunction';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import './style.scss';

import { getWithdrawReasons } from '../common/Api';
import TextField from '@material-ui/core/TextField'
import { storageService } from '../../utils/validators';

const Landing = (props) => {
  const [reasons, setReasons] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    const data = storageService().getObject('withdrawReasons');
    if(isEmpty(data)){
      fetchWithdrawReasons();
    } else {
      setReasons(data);
    }
  }, []);

  const fetchWithdrawReasons = async () => {
    const result = await getWithdrawReasons();
    storageService().setObject('withdrawReasons',result?.survey?.question);
    setReasons(result?.survey?.question);
  };

  const getSubQuestions = (qstn) => () => {
    if (qstn?.action?.dismiss) {
      alert('got to withdraw');
      return;
    }

    if (qstn?.tag === 'others') {
      setOpen(true);
      return;
    }
    navigate('remark',qstn);
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Container
      buttonTitle='Continue'
      fullWidthButton
      hidePageTitle
      noPadding
    >
      {!isEmpty(reasons) && (
        <section className='withdraw-reasons'>
          <div className='withdraw-reason-title'>{reasons?.title}</div>

          <div className='withdraw-reason-list'>
            {reasons?.options?.map((el) => (
              <div className='withdraw-reason-items' onClick={getSubQuestions(el)}>
                <div>{el?.title}</div>
                <KeyboardArrowRightIcon />
              </div>
            ))}
          </div>
        </section>
      )}
      <Dialog open={open} aria-labelledby='form-dialog-title'>
        <DialogTitle id="form-dialog-title">Please specify your reason</DialogTitle>
          <DialogContent>
            <TextField
              id="reason"
              value=''
              onChange={() => {}}
            />
          </DialogContent>
          <DialogActions className="content-button">
            <Button onClick={handleClose} color="primary" >
              CANCEL
            </Button>
            <Button onClick={handleClose} className="DialogButtonFullWidth">
              CONTINUE
            </Button>
          </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Landing;
