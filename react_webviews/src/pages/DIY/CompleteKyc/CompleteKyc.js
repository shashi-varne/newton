import React, { useMemo } from 'react';
import Container from '../../../designSystem/organisms/Container';
import Stack from '@mui/material/Stack';
import {
  LandingHeader,
  LandingHeaderImage,
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

import './CompleteKyc.scss';

const CompleteKyc = (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName, Web, isIframe } = useMemo(getConfig, []);
  const onClick = () => {
    const event = {
      event_name: "journey_details",
      properties: {
        journey: {
          name: "mf",
          trigger: "cta",
          journey_status: "incomplete",
          next_journey: "kyc",
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
    >
      <LandingHeader variant='side'>
        <LandingHeaderImage imgSrc={require(`assets/${productName}/complete_kyc.svg`)} />
        <LandingHeaderTitle>{DIY.completeKycTitle}</LandingHeaderTitle>
        <LandingHeaderSubtitle dataIdx={1}>{DIY.completeKycSubtitle}</LandingHeaderSubtitle>
      </LandingHeader>
      <section className='ck-points-wrapper'>
        <Stack spacing={2}>
          {COMPLETE_KYC_POINTS?.map((point, idx) => {
            return (
              <Stack key={idx} direction='row' spacing={2} alignItems='center'>
                <Icon src={checkedIcon} size='24px' />
                <Typography
                  variant='body2'
                  align='left'
                  component='div'
                >
                  {point}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </section>
      <div className='ck-trust-icon-wrapper'>
        <TrustIcon variant='secure' opacity='0.6' />
      </div>
    </Container>
  );
};

const COMPLETE_KYC_POINTS = [
  DIY.singleKyc,
  DIY.digitalKyc,
  DIY.digilockerIntegeration,
  DIY.instantSafe,
];

export default CompleteKyc;
