import React, { useMemo } from 'react';
import Container from '../../../designSystem/organisms/Container';
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import { DIY } from 'businessLogic/strings/diy';
import Typography from '../../../designSystem/atoms/Typography';
import TrustIcon from '../../../designSystem/atoms/TrustIcon';
import { getConfig } from '../../../utils/functions';
import PropTypes from 'prop-types';

import './InvestmentProcess.scss';

const InvestmentProcess = ({ onCtaClick }) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <Container
      footer={{
        button1Props: {
          title: 'Continue',
          onClick: onCtaClick,
        },
      }}
      className='investment-process-wrapper'
    >
      <LandingHeader variant='side'>
        <LandingHeaderImage imgSrc={require(`assets/${productName}/invest_process.svg`)} />
        <LandingHeaderTitle>{DIY.investmentProcessTitle}</LandingHeaderTitle>
        <LandingHeaderSubtitle dataIdx={1}>{DIY.investmentProcessSubtitle}</LandingHeaderSubtitle>
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
        <TrustIcon variant='secure' opacity='0.6' />
      </div>
    </Container>
  );
};

InvestmentProcess.propTypes = {
  onCtaClick: PropTypes.func.isRequired,
};

const INVESTMENT_POINTS = [DIY.makePayment, DIY.amountDebited, DIY.bombayStock, DIY.amountDebited];

export default InvestmentProcess;
