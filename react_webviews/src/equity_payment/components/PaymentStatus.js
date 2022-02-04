import React from 'react';
import { Imgc } from '../../common/ui/Imgc';
import { getConfig } from '../../utils/functions';
import './Style.scss';
import Container from '../common/Container';
import ContactUsClass from '../../common/components/contact_us';
import { formatAmountInr, getUrlParams } from '../../utils/validators';

const PaymentStatus = () => {
  const { status = '', amount = '', message = '' } = getUrlParams();
  const paymentSuccess = status === 'success';
  const config = getConfig();
  return (
    <Container
      noFooter
      title={paymentSuccess ? 'Payment successful' : 'Payment failed'}
      noBackIcon
    >
      <section className='equity-payment-status-wrappper'>
        {paymentSuccess && (
          <div className='content'>
            <Imgc
              src={require(`assets/${config.productName}/congratulations_illustration.svg`)}
              alt=''
              className='img'
            />
            <h4>{`Funds added ${formatAmountInr(amount)}`}</h4>
            <p>
              {message ||
                'Your funds will now be available in your trading account.'}
            </p>
          </div>
        )}
        {!paymentSuccess && (
          <div className='content'>
            <Imgc
              src={require(`assets/${config.productName}/error_illustration.svg`)}
              alt=''
              className='img'
            />
            <p>
              {message ||
                'We could not process your payment due to some issues. In case, any amount has been debited it will be refunded back to your account in the next 4-5 working days.'}
            </p>
          </div>
        )}
      </section>
      <div>
        <ContactUsClass />
      </div>
    </Container>
  );
};

export default PaymentStatus;
