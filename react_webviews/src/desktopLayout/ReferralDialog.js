import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from 'common/ui/Button';
import Close from '@material-ui/icons/Close';
import Input from 'common/ui/Input';
import { SkeltonRect } from 'common/ui/Skelton';
import { applyPromoCode, getPromocode } from './api';
import './RefferalDialog.scss';
import { storageService } from 'utils/validators';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import { getConfig } from 'utils/functions';

const isMobileDevice = getConfig().isMobileDevice;

const ReferDialog = ({ isOpen, close }) => {
  const user = storageService().getObject('user');
  const [referralCode, setReferralCode] = useState('');
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [promoData, setPromoData] = useState({});
  // const [copyText, setCopyText] = useState('');
  const textToCopy = useRef(null);
  useEffect(() => {
    if (user?.active_investment && isOpen) {
      fetchPromoCode();
    }
  }, [isOpen]);

  const fetchPromoCode = async () => {
    try {
      setLoader(true);
      const promoData = await getPromocode();
      setPromoData({
        promoCode: promoData?.code,
        promoMsg: promoData?.message,
      });
    } catch (err) {
      setPromoData({
        promoMsg: err,
      });
    } finally {
      setLoader(false);
    }
  };

  const handleRefferalCode = (e) => {
    setReferralCode(e.target.value);
  };
  const handleClose = () => {
    close();
    setReferralCode('');
    setMessage('');
    setPromoData({});
    // setCopyText('');
    setError(false);
  };

  const handlePromoCode = async () => {
    try {
      setLoader('button');
      await applyPromoCode(referralCode);
      if (error) {
        setError(false);
      }
      setMessage('Congratulations! referral code applied successfully');
    } catch (err) {
      setError(true);
      setMessage(err);
    } finally {
      setLoader(false);
    }
  };

  // const copyToClipboard = async () => {
  //   try{
  //     await navigator.clipboard.writeText(textToCopy.current.innerText);
  //     setCopyText('copied successfully')
  //   } catch(err){
  //     console.log("failed to copy")
  //     setCopyText('Oops..! failed to copy text');
  //   }
  // }
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='referral-dialog'
      aria-describedby='referral-dialog'
      className='referral-dialog'
      id='referral-dialog'
      data-aid='referral-dialog'
      disableBackdropClick
      TransitionComponent={Transition}
    >
      <DialogContent>
        <div className='refer-close-icon' data-aid='refer-close-icon' onClick={handleClose}>
          <Close />
        </div>
        {user?.active_investment ? (
          <div className='referral-message-dialog' data-aid='referral-message-dialog'>
            <div className='refer-title' data-aid='refer-title'>Refer & Earn</div>
            <div className='referral-dialog-message'>
              <div className='referral-img-wrapper'>
                <img src={require('assets/referal.png')} alt='send_icon' />
              </div>
              {!loader ? (
                <div className='referral-message-wrapper'>
                  <div className='referral-message' data-aid='referral-message'>{promoData?.promoMsg}</div>
                  {promoData?.promoCode && (
                    <>
                      <div className='share-refferal' data-aid='share-refferal'>Share your referral code:</div>
                      <div className='referral-code' data-aid='referral-code' ref={textToCopy}>{promoData?.promoCode}</div>
                      {/* <p>{copyText}</p>
                      <button onClick={copyToClipboard}>copy</button> */}
                    </>
                  )}
                </div>
              ) : (
                <div className='referral-skeleton-container'>
                  <SkeltonRect className='refer-promo-skeleton' />
                  <SkeltonRect className='refer-promo-skeleton' />
                  <SkeltonRect className='refer-promo-skeleton' />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='referral-input-container' data-aid='referral-input-container'>
            <div className='referral-promo-text'>Promo / Partner Code</div>
            <div>
              <Input
                id='invest-amount'
                class='invest-amount-num'
                value={referralCode}
                onChange={handleRefferalCode}
                type='text'
                autoFocus
                variant='standard'
                placeholder='Enter Promo Code'
                helperText={message}
                error={error}
              />
            </div>
          </div>
        )}
      </DialogContent>
      {!user?.active_investment && (
        <DialogActions className='dialog-action'>
          <Button dataAid='close-btn' onClick={handleClose} buttonTitle='CLOSE' classes={{ button: 'button no-bg' }} />
          <Button
            dataAid='apply-btn'
            onClick={handlePromoCode}
            classes={{ button: 'button bg-full' }}
            buttonDisabled={!referralCode}
            showLoader={loader}
            buttonTitle='APPLY'
          />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReferDialog;

const Transition = (props) => {
  if(isMobileDevice){
    return <Slide direction='up' {...props} />;
  } else {
    return <Grow {...props} />;
  }
};
