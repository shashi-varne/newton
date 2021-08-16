import React from 'react';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import GoBackToLoginBtn from '../common/GoBackToLoginBtn';

export default function SessionExpiredUi({ onGoBackClicked }) {
  return (
    <>
      <WVInfoBubble
        type="error"
        hasTitle
        customTitle="Session not found or expired"
      />
      <GoBackToLoginBtn onClick={onGoBackClicked} />
    </>
  );
}