import React, { useState } from 'react';
import Container from '../common/Container';
import { Redirect} from 'react-router-dom';
import { getConfig } from "utils/functions";
import internalStorage from '../Home/InternalStorage';
import isEmpty from 'lodash/isEmpty';


const DialogAsPage = (props) => {
  const [showLoader, setShowLoader] = useState('');
  let src = 'kyc_illust';
  const {state} = props.location;
  const handleClickOne = internalStorage.getData('handleClickOne');
  const handleClickTwo = internalStorage.getData('handleClickTwo');
  const handleClick = internalStorage.getData('handleClick');
  const isApiCall = internalStorage.getData('isApiCall');
  const productName = getConfig().productName;
  if(isEmpty(state) || isEmpty(internalStorage.getStore())){
    return <Redirect to={{
      pathname: "home",
      search: getConfig().searchParams,
    }} />
  }

  const handleButtonLoader = () => {
    if(isApiCall) {
      setShowLoader('button');
      internalStorage.setData('isApiCall', true);
    }
  }

  const handleButtonOneClick = () => {
    handleButtonLoader();
    handleClickOne();
  }

  const handleButtonTwoClick = () => {
    handleButtonLoader();
    handleClickTwo();
  }

  const handleButtonClick = () => {
    handleButtonLoader();
    handleClick();
  }

  switch(state?.status){
    case 'linkAccount':
    case 'signOut':
      src = 'kyc_error';
      break;
    case 'pennyFailed':
    case 'pennyExhausted':
      src = 'bank_add_failed';
      break;
    case 'bankVerificationPending':
      src = 'bank_verify_pending';
      break;
    default:
      src = 'kyc_illust'
  }

  return (
    <Container
      id='kyc-home'
      buttonOneTitle={state?.buttonOneTitle}
      buttonTwoTitle={state?.buttonTwoTitle}
      twoButton={state?.twoButton}
      handleClickOne={handleButtonOneClick}
      handleClickTwo={state?.status === 'linkAccount' ? () => handleClickTwo(state?.step) :handleButtonTwoClick }
      buttonTitle={state?.buttonTitle}
      handleClick={handleButtonClick}
      title={state?.title}
      iframeRightContent={require(`assets/${productName}/${src}.svg`)}
      showLoader={showLoader}
      dualbuttonwithouticon={state?.twoButton}
    >
      <div className='kyc-dialog-page-message'>
        {state?.message}
      </div>
    </Container>
  );
};

export default DialogAsPage;
