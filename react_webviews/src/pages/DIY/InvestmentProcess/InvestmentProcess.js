import { DIY } from 'businesslogic/strings/diy';
import React from 'react';
import TrustIcon from '../../../designSystem/atoms/TrustIcon';
import Typography from '../../../designSystem/atoms/Typography';
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import Container from '../../../designSystem/organisms/ContainerWrapper';
import { capitalizeFirstLetter } from '../../../utils/validators';
import './InvestmentProcess.scss';

const InvestmentProcess = (props) => {
  const { onClick, isButtonLoading, showLoader, isLoading, productName } = props;
  return (
    <Container
      footer={{
        button1Props: {
          title: 'Continue',
          onClick,
          isLoading: isButtonLoading,
        },
      }}
      className='investment-process-wrapper'
      isPageLoading={showLoader || isLoading}
      dataAid='howMoneyInvested'
      headerProps={{
        dataAid: 1,
      }}
    >
      <LandingHeader variant='side' dataAid='moneyInvested'>
        <LandingHeaderImage imgSrc={require(`assets/${productName}/invest_process.svg`)} />
        <LandingHeaderTitle>{DIY.investmentProcessTitle}</LandingHeaderTitle>
        <LandingHeaderSubtitle dataIdx={1}>
          {DIY.investmentProcessSubtitle(capitalizeFirstLetter(productName))}
        </LandingHeaderSubtitle>
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
        <TrustIcon variant='secure' opacity='0.6' dataAid='1' />
      </div>
    </Container>
  );
};

const INVESTMENT_POINTS = [DIY.makePayment, DIY.amountDebited, DIY.bombayStock, DIY.amountDebited];

export default InvestmentProcess;
