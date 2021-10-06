import React from 'react';
import WVButton from '../../common/ui/Button/WVButton';
import WVFullscreenDialog from '../../common/ui/FullscreenDialog/WVFullscreenDialog';
import { ETF_TERMS_AND_COND } from '../constants';

export default function EtfTermsAndCond(props) {
  return (
    <WVFullscreenDialog
      title='ETSPS : Terms and conditions'
      open={props.open}
      onClose={props.onClose}
      closeIconPosition="left"
    >
      <WVFullscreenDialog.Content>
        <ol className="etf-tnc">
          {ETF_TERMS_AND_COND.map((tnc) =>
            <li>
              {tnc}
            </li>
          )}
        </ol>
      </WVFullscreenDialog.Content>
      <WVFullscreenDialog.Action>
        <WVButton contained color="secondary" onClick={props.onClose}>
          Close
        </WVButton>
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
}