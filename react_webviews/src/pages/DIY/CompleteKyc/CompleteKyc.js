import React, { useMemo } from 'react';
import Container from '../../../designSystem/organisms/Container';
import Stack from '@mui/material/Stack';
import {
  LandingHeader,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import Typography from '../../../designSystem/atoms/Typography';
import TrustIcon from '../../../designSystem/atoms/TrustIcon';
import { getConfig } from '../../../utils/functions';
import checkedIcon from 'assets/checked.svg';
import { DIY } from 'businesslogic/strings/diy';
import Icon from '../../../designSystem/atoms/Icon';
import { navigate as navigateFunc } from '../../../utils/functions';
import { DIY_PATHNAME_MAPPER } from '../common/constants';
import Lottie from 'lottie-react';

import './CompleteKyc.scss';

const CompleteKyc = (props) => {
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

  return (
    <Container
      headerProps={{
        hideHeaderTitle: true,
      }}
      footer={{
        button1Props: {
          title: 'Continue',
          onClick,
        },
      }}
      className='complete-kyc-wrapper'
      dataAid="completeKyc"
    >
      <LandingHeader variant='side' dataAid="completeKyc" >
        <Lottie
          animationData={require(`assets/${productName}/lottie/kyc_complete.json`)}
          autoPlay
          loop
          className='kyc-compl-lottie-anim'
          data-aid="iv_top"
        />
        <LandingHeaderTitle>{DIY.completeKycTitle}</LandingHeaderTitle>
        <LandingHeaderSubtitle dataIdx={1}>{DIY.completeKycSubtitle}</LandingHeaderSubtitle>
      </LandingHeader>
      <section className='ck-points-wrapper'>
        <Stack spacing={2}>
          {COMPLETE_KYC_POINTS?.map((data, idx) => {
            return (
              <Stack key={idx} direction='row' spacing={2} alignItems='center'>
                <Icon src={checkedIcon} size='24px' dataAid={`left${idx+1}`} />
                <Typography variant='body2' align='left' component='div' dataAid={data.dataAid} >
                  {data.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </section>
      <div className='ck-trust-icon-wrapper'>
        <TrustIcon variant='secure' opacity='0.6' dataAid="1" />
      </div>
    </Container>
  );
};

const COMPLETE_KYC_POINTS = [
  { label: DIY.singleKyc, dataAid: "singleKyc" },
  { label: DIY.digitalKyc, dataAid: "aadhaar" },
  { label: DIY.digilockerIntegeration, dataAid: "digiLocker" },
  { label: DIY.instantSafe, dataAid: "oneTime" },
];

export default CompleteKyc;
