import React from 'react';
import WVButton from '../../common/ui/Button/WVButton';
import { WVFilePickerWrapper } from '../../common/ui/FileUploadWrapper/WVFilePickerWrapper';

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
  fileName,
  dataAidSuffix,
  nativePickerMethodName,
  onFileSelectComplete,
  fileHandlerParams,
  showOptionsDialog,
  onFileSelectError,
  supportedFormats,
  customPickerId,
  withPicker,
  children,
  ...props
}) => {
  if (withPicker) {
    return (
      <WVFilePickerWrapper
        fileName={fileName}
        dataAidSuffix={dataAidSuffix}
        nativePickerMethodName={nativePickerMethodName}
        showOptionsDialog={showOptionsDialog}
        onFileSelectComplete={onFileSelectComplete}
        onFileSelectError={onFileSelectError}
        supportedFormats={supportedFormats}
        customPickerId={customPickerId}
        fileHandlerParams={fileHandlerParams}
      >
        <WVButton
          dataAidSuffix={dataAidSuffix}
          variant="outlined"
          color="secondary"
          classes={{
            root: 'kuc-action-btn'
          }}
          {...props}
        >
          {children || 'ATTACH DOCUMENT'}
        </WVButton>
      </WVFilePickerWrapper>
    );
  }
  return (
    <WVButton
      dataAid={dataAidSuffix}
      variant="outlined"
      color="secondary"
      classes={{
        root: 'kuc-action-btn'
      }}
      {...props}
    >
      {children || 'ATTACH DOCUMENT'}
    </WVButton>
  );
}

KycUploadContainer.Button = Button;

export default KycUploadContainer;