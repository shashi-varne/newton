import React, { useMemo, useState } from 'react';
import Container from '../../../designSystem/organisms/Container';
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import { DIY } from 'businesslogic/strings/diy';
import Typography from '../../../designSystem/atoms/Typography';
import TrustIcon from '../../../designSystem/atoms/TrustIcon';
import Api from '../../../utils/api';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import { triggerInvestment } from 'businesslogic/dataStore/reducers/mfOrders';
import { handlePaymentRedirection } from '../common/functions';
import useUserKycHook from '../../../kyc/common/hooks/userKycHook';
import useLoadingState from '../../../common/customHooks/useLoadingState';
import { useDispatch } from 'react-redux';
import { storageService } from '../../../utils/validators';

import './InvestmentProcess.scss';

const screen = 'investProcess';
const InvestmentProcess = (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const { productName } = useMemo(getConfig, []);
  const { kyc, isLoading } = useUserKycHook();
  const { isButtonLoading } = useLoadingState(screen);
  const [showLoader, setShowLoader] = useState(false);

  const onClick = () => {
    const investment = storageService().getObject("investment");
    const body = {
      investment
    }
    const sagaCallback = handlePaymentRedirection({ navigate, kyc, handleApiRunning: setShowLoader })
    const payload = {
      screen,
      Api,
      body,
      sagaCallback
    };
    dispatch(triggerInvestment(payload))
  };

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

const INVESTMENT_POINTS = [DIY.makePayment, DIY.amountDebited, DIY.bombayStock, DIY.amountDebited];

export default InvestmentProcess;
