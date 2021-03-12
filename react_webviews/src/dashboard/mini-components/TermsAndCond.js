import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import check_mark from 'assets/check_mark.png';

import { getTerms } from '../invest/common/api';
import { getConfig } from 'utils/functions';

import './style.scss';

const TermsAndCond = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    terms: '',
    scheme: '',
  });
  const [doc, setDoc] = useState('');
  const partner_code = getConfig().partner_code;
  const isWeb = getConfig().isWebCode;

  const fetchTerms = async (docType) => {
    try {
      const response = await getTerms(docType);
      setData({ ...data, [docType]: response?.content });
    } catch (err) {
      console.log('err is', err);
    }
  };

  const handleClickOpen = (docType) => () => {
    setDoc(docType);
    setOpen(true);
    if (!data[docType]) {
      fetchTerms(docType);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className='recommendations-disclaimer'>
        <div className='recommendations-disclaimer-tc'>
          <img alt='check_mark' src={check_mark} width='15' />
          <span>
            By clicking on the button below, I agree that I have read and accepted the{' '}
            {isWeb && partner_code !== 'finity' && (
              <>
                <a target='_blank' rel='noopener noreferrer' href='https://www.fisdom.com/terms/'>
                  terms & conditions
                </a>{' '}
                and understood the
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://www.fisdom.com/scheme-offer-documents/'
                >
                  {' '}
                  scheme offer documents
                </a>
              </>
            )}
            {isWeb && partner_code === 'finity' && (
              <>
                <span className='tc_link' onClick={handleClickOpen('terms')}>
                  terms
                </span>{' '}
                and understood the
                <span className='tc_link' onClick={handleClickOpen('scheme')}>
                  {' '}
                  scheme offer documents
                </span>
              </>
            )}
            {!isWeb && partner_code === 'finity' && (
              <span className='tc_link' onClick={handleClickOpen('terms')}>
                terms
              </span>
            )}
          </span>
        </div>
      </div>
      <DialogTC open={open} handleClose={handleClose} data={data[doc]} />
    </div>
  );
};

export default TermsAndCond;

const DialogTC = ({ open, handleClose, data }) => {
  const loaderMain = getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom;

  return (
    <>
      <Dialog
        fullScreen={false}
        open={open}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
        fullWidth
      >
        <DialogTitle classes={{ root: 't_and_c_title' }}>Terms and Conditions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {data ? (
              <div dangerouslySetInnerHTML={{ __html: `${data}` }} />
            ) : (
              <div className="tc-dialog-loader" >
                <img src={loaderMain} alt='' width='100' />
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        {data && (
          <DialogActions>
            <Button
              className='DialogButtonFullWidth'
              onClick={handleClose}
              color='default'
              autoFocus
            >
              DONE
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
