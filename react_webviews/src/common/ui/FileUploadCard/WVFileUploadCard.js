
/*

Use: A card UI to support document upload on click

Example syntax:
  <WVFileUploadCard
    title: 'Bank statement',
    subtitle: 'Last 6 months',
    nativePickerMethodName: 'open_file',
    supportedFormats: "pdf",
    fileName: "bank-statement"
    customPickerId="bank-statement-picker"
    onFileSelectComplete={onFileSelectComplete('bank-statement')}
    ...
  />

*/

import './WVFileUploadCard.scss';
import React, { useEffect, useState } from 'react';
import { WVFilePickerWrapper } from '../FileUploadWrapper/WVFilePickerWrapper';
import SVG from 'react-inlinesvg';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import DotDotLoader from '../DotDotLoaderNew';

const WVFileUploadCard = ({
  dataAidSuffix,
  title,
  subtitle,
  file,
  classes,
  className, // class name to apply to parent element
  ...wrapperProps // props for WVFilePickerWrapper (required to support file picking)
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(file);
  const [truncatedFileName, setTruncatedFileName] = useState('');

  useEffect(() => {
    if (selectedFile) {
      const fileName = selectedFile.name || selectedFile.file_name;
      const fileType = selectedFile.type.split("/")[1];
      if (fileName.length > 8) {
        setTruncatedFileName(fileName.slice(0, 8) + '....' + fileType);
      } else {
        setTruncatedFileName(fileName);
      }
    }
  }, [selectedFile]);

  const onFileSelectStart = (...functionParams) => {
    setIsLoading(true);
    if (isFunction(wrapperProps?.onFileSelectStart)) {
      wrapperProps.onFileSelectStart(...functionParams);
    }
  }

  const onFileSelectComplete = (file, ...otherParams) => {
    setSelectedFile(file);
    setIsLoading(false);
    if (isFunction(wrapperProps?.onFileSelectComplete)) {
      wrapperProps.onFileSelectComplete(file, ...otherParams);
    }
  }

  const onFileSelectError = (...functionProps) => {
    setIsLoading(false);
    if (isFunction(wrapperProps?.onFileSelectError)) {
      wrapperProps.onFileSelectError(...functionProps);
    }
  };

  return (
    <>
      <WVFilePickerWrapper
        {...wrapperProps}
        dataAidSuffix={dataAidSuffix}
        onFileSelectStart={onFileSelectStart}
        onFileSelectComplete={onFileSelectComplete}
        onFileSelectError={onFileSelectError}
      >
        <div
          data-aid={`wv-file-upload-card-${dataAidSuffix}`}
          className={`
            wv-file-upload-card
            ${selectedFile ? 'wv-fuc-selected' : ''}
            ${classes.container}
            ${className}
          `}
        >
          <div className="wv-fuc-left" data-aid={`wv-fuc-left-${dataAidSuffix}`}>
            <div className="wv-fuc-left-title">
              {title}
            </div>
            <div className="wv-fuc-left-subtitle">
              {subtitle}
            </div>
          </div>
          <div className="wv-fuc-right" data-aid={`wv-fuc-right-${dataAidSuffix}`}>
            <SVG
              preProcessor={code => code.replace(
                /fill=".*?"/g, `fill=${selectedFile ? '#24154C' : '#767E86'}`
              )}
              className="arrow"
              src={require('assets/paperclip.svg')}
            />
            {truncatedFileName &&
              <span>{truncatedFileName}</span>
            }
          </div>
          {isLoading &&
            <div className="wv-fuc-loader">
              <DotDotLoader />
            </div>
          }
        </div>
      </WVFilePickerWrapper>
    </>
  );
}

WVFileUploadCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  file: PropTypes.object,
  classes: PropTypes.object,
}

WVFileUploadCard.defaultProps = {
  classes: {},
}

export default WVFileUploadCard;