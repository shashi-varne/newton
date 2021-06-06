import './WVFileUploadCard.scss';
import React, { useEffect, useState } from 'react';
import { WVFilePickerWrapper } from '../FileUploadWrapper/WVFilePickerWrapper';
import SVG from 'react-inlinesvg';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';

const WVFileUploadCard = ({
  dataAidSuffix,
  title,
  subtitle,
  file,
  classes = {},
  className,
  ...wrapperProps
}) => {
  const [selectedFile, setSelectedFile] = useState(file);
  const [truncatedFileName, setTruncatedFileName] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.name.length > 8) {
        setTruncatedFileName(
          selectedFile.name.slice(0, 8) +
          '...'
        );
      } else {
        setTruncatedFileName(selectedFile.name);
      }
      setFileType(selectedFile.type.split("/")[1]);
    }
  }, [selectedFile]);

  const onFileSelected = (file, fileBase64) => {
    setSelectedFile(file);
    if (isFunction(wrapperProps.onFileSelectComplete)) {
      wrapperProps.onFileSelectComplete(file, fileBase64);
    }
  }

  return (
    <>
      <WVFilePickerWrapper
        {...wrapperProps}
        dataAidSuffix={dataAidSuffix}
        onFileSelectComplete={onFileSelected}
      >
        <div
          data-aid={`wv-file-upload-card-${dataAidSuffix}`}
          className={`
          wv-file-upload-card
          ${classes.container}
          ${className}
        `}
          style={{ border: selectedFile ? '1px solid var(--primary)' : '' }}
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
            {selectedFile?.name &&
              <span>{truncatedFileName + `.${fileType}`}</span>
            }
          </div>
        </div>
      </WVFilePickerWrapper>
    </>
  );
}

WVFilePickerWrapper.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
}

export default WVFileUploadCard;