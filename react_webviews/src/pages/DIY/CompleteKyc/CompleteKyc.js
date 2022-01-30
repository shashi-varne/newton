import React, { useMemo } from 'react';
import Container from '../../../designSystem/organisms/Container';
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import Typography from '../../../designSystem/atoms/Typography';
import EMandateTrustIcon from '../../../designSystem/atoms/EMandateTrustIcon/EMandateTrustIcon';
import { getConfig } from '../../../utils/functions';
import checkedIcon from 'assets/checked.svg';
import { DIY } from 'businessLogic/strings/diy';
import Icon from '../../../designSystem/atoms/Icon';

import './CompleteKyc.scss';

const CompleteKyc = () => {
  const { productName } = useMemo(getConfig, []);
  return (
    <Container
      headerProps={{
        hideHeaderTitle: true,
      }}
      footer={{
        button1Props: {
          title: 'Continue',
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
        <div className='ck-points-list'>
          {COMPLETE_KYC_POINTS?.map((point, idx) => {
            return (
              <div className='ck-points-item' key={idx}>
                <Icon src={checkedIcon} size='24px' />
                <Typography
                  variant='body2'
                  align='left'
                  dataAid={`point${idx + 1}`}
                  component='div'
                >
                  {point}
                </Typography>
              </div>
            );
          })}
        </div>
      </section>
      <div className='ck-trust-icon-wrapper'>
        <EMandateTrustIcon opacity='0.6' />
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
