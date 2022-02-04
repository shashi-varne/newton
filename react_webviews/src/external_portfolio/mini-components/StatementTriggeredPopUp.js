import React from 'react';
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet';
import { getConfig } from '../../utils/functions';

const { productName: productType, emailDomain } = getConfig();

export default function StatementTriggeredPopUp({
  isOpen,
  onCtaClick
}) {
  return (
    <WVBottomSheet
      disableBackdropClick
      disableEscapeKeyDown
      title="Portfolio statement generated"
      subtitle="You'll get an email with your portfolio statement in around 1 hour. Forward the email as received to"
      isOpen={isOpen}
      image={require(`assets/${productType}/statements_briefcase.svg`)}
      button1Props={{
        title: 'Okay',
        contained: true,
        fullWidth: true,
        onClick: onCtaClick
      }}
    >
      <span className='portfolio-generated-email'>cas@{emailDomain}</span>
    </WVBottomSheet>
  );
}