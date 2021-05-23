import './WVFileUploadCard.scss';
import React, { useEffect, useState } from 'react';
import { WVFilePickerWrapper } from '../FileUploadWrapper';
import SVG from 'react-inlinesvg';
import { isFunction } from 'lodash';

const WVFileUploadCard = ({
  title,
  subtitle,
  ...wrapperProps
}) => {
  const [selectedFile, setSelectedFile] = useState('');
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

  const onFileSelected = (file) => {
    console.log(file);
    setSelectedFile(file);
    if (isFunction(wrapperProps.onFileSelected)) {
      wrapperProps.onFileSelected(file);
    }
  }

  return (
    <WVFilePickerWrapper
      {...wrapperProps}
      onFileSelectComplete={onFileSelected}
    >
      <div className="wv-file-upload-card">
        <div className="wv-fuc-left">
          <div className="wv-fuc-left-title">
            {title}
          </div>
          <div className="wv-fuc-left-subtitle">
            {subtitle}
          </div>
        </div>
        <div className="wv-fuc-right">
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
  );
}

export default WVFileUploadCard;