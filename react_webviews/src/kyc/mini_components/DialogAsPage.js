import React from 'react';
import Container from '../common/Container';
import { Redirect} from 'react-router-dom';
import { getConfig } from "utils/functions";
import internalStorage from '../home/InternalStorage';
import isEmpty from 'lodash/isEmpty';

const DialogAsPage = (props) => {
  const {state} = props.location;
  const handleClickOne = internalStorage.getData('handleClickOne');
  const handleClickTwo = internalStorage.getData('handleClickTwo');
  const handleClick = internalStorage.getData('handleClick');
  if(isEmpty(state)){
    return <Redirect to={{
      pathname: "home",
      search: getConfig().searchParams,
    }} />
  }

  return (
    <Container
      id='kyc-home'
      buttonOneTitle={state.buttonOneTitle}
      buttonTwoTitle={state.buttonTwoTitle}
      twoButton={state?.twoButton}
      handleClickOne={handleClickOne}
      handleClickTwo={handleClickTwo}
      buttonTitle={state?.buttonTitle}
      handleClick={handleClick}
      title={state.title}
    >
      <div className='kyc-pan-status'>
        {state.message}
      </div>
    </Container>
  );
};

export default DialogAsPage;
