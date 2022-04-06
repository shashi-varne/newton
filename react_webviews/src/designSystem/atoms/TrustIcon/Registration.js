import React, { useMemo } from 'react';
import { getConfig } from '../../../utils/functions';
import Icon from '../Icon';

const Registration = () => {
    const {productName} = useMemo(getConfig,[]);
  return (
      <Icon width='100%' src={require(`assets/${productName}/trust_icon_registration.svg`)} />
  )
};

export default Registration;
