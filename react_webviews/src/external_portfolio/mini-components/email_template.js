import React from 'react';
import { useMemo } from 'react';
import InfoBox from './InfoBox';

const EmailTemplate = ({
  statementSource,
  containerStyle = {},
  imageTitle
}) => {
  const copyText = useMemo(() =>
    `Consolidated Account Statement - ${statementSource === 'cams'
      ? 'CAMS'
      : 'KFINTECH'
    } Mailback Request`
  , []);

  return (
    <div style={{...containerStyle}}>
      <div className="ext-pf-subheader">
        <h4>{imageTitle}</h4>
        <img
          src={require(`assets/${statementSource === 'cams' ? 'cas' : 'karvy'}_email.png`)}
          alt="Email"
          className="email_img"
          width="100" height="200"
        />
      </div>
      <div className="ext-pf-subheader">
        <h4>Search your email under</h4>
        <InfoBox
          classes={{ root: 'info-box-cut-out' }}
          isCopiable={true}
          textToCopy={copyText}
        >
          <span className="info-box-body-text">
            {copyText}
          </span>
        </InfoBox>
      </div>
    </div>
  );
}

export default EmailTemplate;