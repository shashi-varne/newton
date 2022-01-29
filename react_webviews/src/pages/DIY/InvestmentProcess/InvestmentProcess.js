import React, { useMemo } from 'react';
import Container from '../../../designSystem/organisms/Container';
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import { DIY } from '../../../common/strings/diy';
import Typography from '../../../designSystem/atoms/Typography';
import EMandateTrustIcon from '../../../designSystem/atoms/EMandateTrustIcon/EMandateTrustIcon';
import { getConfig } from '../../../utils/functions';

import './InvestmentProcess.scss';

const InvestmentProcess = () => {
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
      className='investment-process-wrapper'
    >
      <LandingHeader variant='side'>
        <LandingHeaderImage imgSrc={require(`assets/${productName}/invest_process.svg`)} />
        <LandingHeaderTitle>{DIY.InvestmentProcess}</LandingHeaderTitle>
        <LandingHeaderSubtitle dataIdx={1}>{DIY.InvestmentProcessSubtitle}</LandingHeaderSubtitle>
      </LandingHeader>
      <section className='ip-points-wrapper'>
        <ul className='ip-points-list'>
          {INVESTMENT_POINTS?.map((point, idx) => {
            return (
              <li className='ip-points-item' key={idx}>
                <Typography
                  variant='body2'
                  align='left'
                  dataAid={`point${idx + 1}`}
                  component='div'
                >
                  {point}
                </Typography>
              </li>
            );
          })}
        </ul>
      </section>
      <div className='ip-trust-icon-wrapper'>
        <EMandateTrustIcon opacity='0.6' />
      </div>
    </Container>
  );
};

const INVESTMENT_POINTS = [
  'You select a fund & make payment',
  'Amount is debited from your bank account',
  'Bombay Stock Exchange receives the amount & sends it to AMC',
  'AMC allots units on the next working day',
];

export default InvestmentProcess;
