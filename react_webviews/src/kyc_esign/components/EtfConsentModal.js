import React, { useMemo, useState } from 'react';
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet';
import Toast from '../../common/ui/Toast';
import { getUserKycFromSummary } from '../../kyc/common/api';
import { getConfig } from '../../utils/functions';
import { updateEtfConsentStatus } from '../common/api';

const EtfConsentModal = (props) => {
  const config = useMemo(() => getConfig(), []);
  const [isApiRunning, setIsApiRunning] = useState({
    button1: false,
    button2: false
  });

  const updateEtfConsent = async (approve) => {
    const buttonName = approve ? 'button2' : 'button1';
    try {
      setIsApiRunning({ [buttonName]: true });
      await updateEtfConsentStatus(approve);
      await getUserKycFromSummary();
      if (approve) {
        Toast('ETF units will be credited once your demat account is activated. This could take up to 48 hours');
      }
      props.onConsentUpdate();
    } catch(err) {
      console.log(err);
      Toast(err);
      setIsApiRunning({ [buttonName]: false });
      props.onClose();
    }
  }

  return (
    <>
      <WVBottomSheet
        isOpen={props.open}
        onClose={() => props.onClose()}
        title="Free ETFs for you"
        subtitle="Get free ETFs as a welcome gift & give a solid start to your investment journey"
        image={require(`assets/${config.productName}/free_gold_etf.svg`)}
        button1Props={{
          outlined: true,
          title: 'I don’t want it',
          showLoader: isApiRunning.button1,
          onClick: () => updateEtfConsent(false),
        }}
        button2Props={{
          contained: true,
          title: 'Continue',
          showLoader: isApiRunning.button2,
          onClick: () => updateEtfConsent(true),
        }}
      >
        <span style={{ color: '#767E86' }}>
          Tap CONTINUE to accept the 
          <b
            style={{
              color: config.styles.primaryColor,
              cursor: 'pointer'
            }}
            onClick={() => props.onClose(true)}
          >
          &nbsp;terms and conditions&nbsp;
          </b> 
          and claim your ETFs now
        </span>
      </WVBottomSheet>
    </>
  );
}

export default EtfConsentModal;