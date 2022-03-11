import React, { useMemo } from 'react';
import { getConfig, navigate as navigateFunc } from 'utils/functions';
import { DIY_PATHNAME_MAPPER } from '../../pages/DIY/common/constants';
import CompleteKyc from '../../pages/DIY/CompleteKyc/CompleteKyc';

const completeKycContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName, Web, isIframe } = useMemo(getConfig, []);
  const onClick = () => {
    const event = {
      event_name: 'journey_details',
      properties: {
        journey: {
          name: 'mf',
          trigger: 'cta',
          journey_status: 'incomplete',
          next_journey: 'kyc',
        },
      },
    };
    // send event
    if (!Web) {
      window.callbackWeb.eventCallback(event);
    } else if (isIframe) {
      const message = JSON.stringify(event);
      window.callbackWeb.sendEvent(message);
    }
    navigate(DIY_PATHNAME_MAPPER.kycWeb);
  };
  return <WrappedComponent onClick={onClick} productName={productName} />;
};

export default completeKycContainer(CompleteKyc);
