import React, { useState } from 'react';
import WVButton from '../../common/ui/Button/WVButton';
import { WVFilePickerWrapper } from '../../common/ui/FileUploadWrapper/WVFilePickerWrapper';
import { isFunction } from '../../utils/validators';

const KycUploadContainer = ({
  classes = {},
  buttonClasses,
  titleText,
  fileToShow,
  illustration,
  buttonText,
  onButtonClick,
  children,
  dataAidSuffix
}) => {
  return (
    <div
      className={`kyc-upload-container ${classes.container}`}
      data-aid={`kyc-upload-container-${dataAidSuffix}`}
    >
      {titleText &&
        <TitleText>{titleText}</TitleText>
      }
      <div className={`kuc-upload ${classes.uploadContainer}`}>
        {(fileToShow || illustration) &&
          <Image
            src={fileToShow || illustration}
            className={classes.image}
          />
        }
        {buttonText &&
          <Button onClick={onButtonClick} classes={buttonClasses}>
            {buttonText}
          </Button>
        }
        {children}
      </div>
    </div>
  )
}

const TitleText = ({ children, className, alignLeft, dataAidSuffix }) => {
  return (
    <div
      className={`kuc-caption ${className}`}
      dataAidSuffix={`kuc-caption-${dataAidSuffix}`}
      style={{ textAlign: alignLeft ? 'left' : 'center' }}
    >
      {children}
    </div>
  );
}

KycUploadContainer.TitleText = TitleText;

const Image = ({ fileToShow, illustration, alt, className, dataAidSuffix, ...props }) => {
  return (
    <img
      src={fileToShow || illustration}
      className={`kuc-image ${className}`}
      data-aid={`kuc-image-${dataAidSuffix}`}
      alt={alt || "upload"}
      {...props}
    />
  );
}

KycUploadContainer.Image = Image;

const Button = ({
  withPicker,
  dataAidSuffix,
  children,
  filePickerProps = {}, // Check WVFilePickerWrapper for props list
  showLoader,
  ...buttonProps
}) => {
  const [fileLoading, setFileLoading] = useState(false);

  const onFileSelectStart = (...functionProps) => {
    setFileLoading(true);
    if (isFunction(filePickerProps?.onFileSelectStart)) {
      filePickerProps.onFileSelectStart(...functionProps);
    }
  };

  const onFileSelectComplete = (...functionProps) => {
    setFileLoading(false);
    if (isFunction(filePickerProps?.onFileSelectComplete)) {
      filePickerProps.onFileSelectComplete(...functionProps);
    }
  };

  const onFileSelectError = (...functionProps) => {
    setFileLoading(false);
    if (isFunction(filePickerProps?.onFileSelectError)) {
      filePickerProps.onFileSelectError(...functionProps);
    }
  };

  if (withPicker) {
    return (
      <WVFilePickerWrapper
        {...filePickerProps}
        onFileSelectStart={onFileSelectStart}
        onFileSelectComplete={onFileSelectComplete}
        onFileSelectError={onFileSelectError}
      >
        <WVButton
          outlined
          dataAidSuffix={dataAidSuffix}
          color="secondary"
          classes={{ root: 'kuc-action-btn' }}
          showLoader={fileLoading || showLoader}
          {...buttonProps}
        >
          {children || 'ATTACH DOCUMENT'}
        </WVButton>
      </WVFilePickerWrapper>
    );
  }
  return (
    <WVButton
      outlined
      dataAid={dataAidSuffix}
      color="secondary"
      classes={{ root: 'kuc-action-btn' }}
      {...buttonProps}
    >
      {children || 'ATTACH DOCUMENT'}
    </WVButton>
  );
}

KycUploadContainer.Button = Button;

export default KycUploadContainer;