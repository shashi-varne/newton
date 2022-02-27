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
import PropTypes from 'prop-types';

import './CompleteKyc.scss';

const CompleteKyc = ({ onCtaClick }) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <Container
      headerProps={{
        hideHeaderTitle: true,
      }}
      footer={{
        button1Props: {
          title: 'Continue',
          onClick: onCtaClick,
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

CompleteKyc.propTypes = {
  onCtaClick: PropTypes.func.isRequired,
};

export default CompleteKyc;
