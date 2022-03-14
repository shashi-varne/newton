import Stack from '@mui/material/Stack';
import checkedIcon from 'assets/checked.svg';
import { DIY } from 'businesslogic/strings/diy';
import Lottie from 'lottie-react';
import React from 'react';
import Icon from '../../../designSystem/atoms/Icon';
import TrustIcon from '../../../designSystem/atoms/TrustIcon';
import Typography from '../../../designSystem/atoms/Typography';
import {
  LandingHeader,
  LandingHeaderSubtitle,
  LandingHeaderTitle
} from '../../../designSystem/molecules/LandingHeader';
import Container from '../../../designSystem/organisms/ContainerWrapper';
import './CompleteKyc.scss';


const CompleteKyc = ({ onClick, productName }) => {
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
      dataAid='completeKyc'
    >
      <LandingHeader variant='side' dataAid='completeKyc'>
        <Lottie
          animationData={require(`assets/${productName}/lottie/kyc_complete.json`)}
          autoPlay
          loop
          className='kyc-compl-lottie-anim'
          data-aid='iv_top'
        />
        <LandingHeaderTitle>{DIY.completeKycTitle}</LandingHeaderTitle>
        <LandingHeaderSubtitle dataIdx={1}>{DIY.completeKycSubtitle}</LandingHeaderSubtitle>
      </LandingHeader>
      <section className='ck-points-wrapper'>
        <Stack spacing={2}>
          {COMPLETE_KYC_POINTS?.map((data, idx) => {
            return (
              <Stack key={idx} direction='row' spacing={2} alignItems='center'>
                <Icon src={checkedIcon} size='24px' dataAid={`left${idx + 1}`} />
                <Typography variant='body2' align='left' component='div' dataAid={data.dataAid}>
                  {data.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </section>
      <div className='ck-trust-icon-wrapper'>
        <TrustIcon variant='secure' opacity='0.6' dataAid='1' />
      </div>
    </Container>
  );
};

const COMPLETE_KYC_POINTS = [
  { label: DIY.singleKyc, dataAid: 'singleKYC' },
  { label: DIY.digitalKyc, dataAid: 'aadhaar' },
  { label: DIY.digilockerIntegeration, dataAid: 'digiLocker' },
  { label: DIY.instantSafe, dataAid: 'oneTime' },
];

export default CompleteKyc;
