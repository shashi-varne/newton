import React, { useState } from 'react';
import Container from '../common/Container';
import { Redirect} from 'react-router-dom';
import { getConfig } from "utils/functions";
import internalStorage from '../home/InternalStorage';
import isEmpty from 'lodash/isEmpty';


const DialogAsPage = (props) => {
  let src = 'kyc_illust';
  const {state} = props.location;
  const handleClickOne = internalStorage.getData('handleClickOne');
  const handleClickTwo = internalStorage.getData('handleClickTwo');
  const handleClick = internalStorage.getData('handleClick');
  const productName = getConfig().productName;
  if(isEmpty(state)){
    return <Redirect to={{
      pathname: "home",
      search: getConfig().searchParams,
    }} />
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
      handleClickOne={handleClickOne}
      handleClickTwo={handleClickTwo}
      buttonTitle={state?.buttonTitle}
      handleClick={handleClick}
      title={state?.title}
      iframeRightContent={require(`assets/${productName}/${src}.svg`)}
    >
      <div className='kyc-pan-status'>
        {state?.message}
      </div>
    </Container>
  );
};

export default DialogAsPage;
