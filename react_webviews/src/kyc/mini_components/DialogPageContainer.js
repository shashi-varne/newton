import React from 'react';
import DialogContainer from './DialogContainer';
import {navigate as navigateFunc} from '../common/functions'

const DialogPageContainer = (props) => {
  const navigate = navigateFunc.bind(props);
  if(props.isDialog) {
    return <DialogContainer {...props} />
  } else {
    return navigate(props?.navigateTo,{state:props?.data});
  }
}

export default DialogPageContainer;