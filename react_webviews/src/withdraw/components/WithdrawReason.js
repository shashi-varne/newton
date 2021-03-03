import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import isEmpty from 'lodash/isEmpty';
import { navigate as navigateFunc } from '../common/commonFunction';
import Dialog from '../mini_components/Dialog';

import './style.scss';

import { getWithdrawReasons } from '../common/Api';
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
      navigate('');
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
      hideInPageTitle
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
      <Dialog open={open} close={handleClose} title='Please specify your reason' id='reason' placeholder='Reason' />
    </Container>
  );
};

export default Landing;
