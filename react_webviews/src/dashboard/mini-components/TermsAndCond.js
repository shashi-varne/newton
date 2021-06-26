import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import check_mark from 'assets/check_mark.png';

import { getTerms } from '../Invest/common/api';
import { getConfig } from 'utils/functions';

import './mini-components.scss';
import Button from '../../common/ui/Button';
import { nativeCallback } from '../../utils/native_callback';

const config = getConfig();
const TermsAndCond = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    terms: '',
    scheme: '',
  });
  const [doc, setDoc] = useState('');
  const productName = config.productName;
  const isWeb = config.Web;

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

  const openInBrowser = (url) => () => {
    nativeCallback({
      action: 'open_browser',
      message: {
        url: url
      }
    });
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className='recommendations-disclaimer'>
        <div className='recommendations-disclaimer-tc'>
          <img alt='check_mark' src={check_mark} width='15' />
          <span data-aid='terms-and-conditions'>
            By clicking on the button below, I agree that I have read and accepted the{' '}
            {isWeb && productName !== 'finity' && (
              <>
                <a target='_blank' rel='noopener noreferrer' href={config.termsLink} data-aid='terms-offer-link'>
                  terms & conditions
                </a>{' '}
                and understood the
                <a
                  data-aid='scheme-offer-link'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={config.schemeLink}
                >
                  {' '}
                  scheme offer documents
                </a>
              </>
            )}
            {isWeb && productName === 'finity' && (
              <>
                <span className='tc_link' data-aid='terms-link' onClick={handleClickOpen('terms')}>
                  terms
                </span>{' '}
                and understood the
                <span className='tc_link' data-aid='scheme-link' onClick={handleClickOpen('scheme')}>
                  {' '}
                  scheme offer documents
                </span>
              </>
            )}
            {!isWeb && productName === 'finity' && (
              <span className='tc_link' data-aid='terms-link' onClick={handleClickOpen('terms')}>
                terms
              </span>
            )}
            {!isWeb && productName !== 'finity' && (
              <>
                <a onClick={openInBrowser(config.termsLink)} >
                  terms & conditions
                </a>{' '}
                and understood the
                <a
                  onClick={openInBrowser(config.schemeLink)}
                >
                  {' '}
                  scheme offer documents
                </a>
              </>
            )}
          </span>
        </div>
      </div>
      <DialogTC open={open} handleClose={handleClose} data={data[doc]} docType={doc} />
    </div>
  );
};

export default TermsAndCond;

const DialogTC = ({ open, handleClose, data, docType }) => {
  const loaderMain = getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom;
  const DOC_TITLES = {
    terms: "Terms and Conditions",
    scheme: "Scheme Offer Documents"
  }

  return (
    <>
      <Dialog
        fullScreen={false}
        open={open}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
        fullWidth
        data-aid='responsive-dialog-title'
      >
        <DialogTitle data-aid='terms-condition-title' classes={{ root: 't_and_c_title' }}>{DOC_TITLES[docType] || ""}</DialogTitle>
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
          <DialogActions style={{padding: "0 20px"}}>
            <Button 
              buttonTitle="DONE"
              onClick={handleClose}
              style={{margin: "0 auto"}}
              data-aid='done-btn'
            />
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
