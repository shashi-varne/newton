import { Button } from 'material-ui';
import React, { Fragment } from 'react';

const ErrorScreen = ({
  classes = {},
  useTemplate, // set this to 'true' to use the image-text template
  templateImage = '', // image for image-text template
  templateGraphic = '', // for any non-image asset in image-text template
  templateErrTitle, // title text for image-text template
  templateErrText, // sub-text for image-text template
  templateBtnText, // button text for image-text template
  clickHandler = () => {}, // template button click handler
  children = '', // to show content when useTemplate is set to 'false'
}) => {
  const {
    container: containerClass = '',
    button: buttonClass = '',
    image: imageClass = '',
    title: titleClass = '',
    text: textClass = '',
  } = classes;

  const imageTextTemplate = (
    <Fragment>
      {templateImage &&
        <img
          src={templateImage}
          className={`fisdom-ecb-img ${imageClass}`}
          alt="error"
        />
      }
      {templateGraphic}
      {templateErrTitle &&
        <div className={`fisdom-ecb-error-title ${titleClass}`}>
          {templateErrTitle}
        </div>
      }
      {templateErrText &&
        <div
          className={`fisdom-ecb-error-text ${textClass}`}
          style={{
            
          }}>
          {templateErrText}
        </div>
      }
      {templateBtnText &&
        <Button
          fullWidth
          className={`fisdom-ecb-btn ${buttonClass}`}
          onClick={clickHandler}
        >
          {templateBtnText}
        </Button>
      }
    </Fragment>
  );

  return (
    <div className={`fisdom-error-container ${containerClass}`}>
      {useTemplate ? imageTextTemplate : children}
    </div>
  );
};

export default ErrorScreen;