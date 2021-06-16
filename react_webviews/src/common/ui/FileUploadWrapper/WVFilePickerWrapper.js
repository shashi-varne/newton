import React, { useState } from 'react';
import { getConfig } from "utils/functions";
import { isFunction } from 'lodash';
import toast from '../Toast';
import FileAccessDialog from './FileAccessDialog';
import { openFilePicker, validateFileTypeAndSize } from '../../../utils/functions';

const isWeb = getConfig().Web;

export function promisableGetBase64(file) {
  const reader = new FileReader();
  return new Promise(resolve => {
    reader.onload = ev => {
      resolve(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
}

export const WVFilePickerWrapper = ({
  dataAidSuffix,
  nativePickerMethodName = '',
  customPickerId = 'wv-file-input',
  showOptionsDialog,
  onFileSelectComplete,
  onFileSelectError,
  extraValidation,
  sizeLimit = 100,
  supportedFormats,
  fileName,
  fileHandlerParams,
  customClickHandler,
  children
}) => {
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
  const [filePickerType, setFilePickerType] = useState(nativePickerMethodName);

  const onFileSelected = async (file, otherParams = {}) => {
    try {
      // Basic size and file type validations
      const errMsg = validateFileTypeAndSize(file, supportedFormats, sizeLimit);
      if (errMsg) throw errMsg;

      // Additional file validations, if any
      if (isFunction(extraValidation)) {
        const extraErr = extraValidation();
        if (extraErr) throw extraErr;
      }

      let fileBase64 = '';

      if (file.type.split("/")[0] === 'image') {
        fileBase64 = await promisableGetBase64(file);
      }

      if (isFunction(onFileSelectComplete)) {
        onFileSelectComplete(file, fileBase64, otherParams);
      }
    } catch(err) {
      if (isFunction(onFileSelectError)) {
        onFileSelectError(err)
      } else {
        console.log(err);
        toast(err);
      }
    }
  };

  const onElementClick = () => {
    const functionParams = [customPickerId, nativePickerMethodName, fileName, onFileSelected, fileHandlerParams];
    
    if (!isWeb && showOptionsDialog) {
      setOpenOptionsDialog(true);
    } else if (isFunction(customClickHandler)) {
      customClickHandler(...functionParams);
    } else {
      openFilePicker(...functionParams);
    }
  }

  const handleUploadFromDialog = (type) => {
    setOpenOptionsDialog(false);
    setFilePickerType(type);
    openFilePicker(customPickerId, type, fileName, onFileSelected, fileHandlerParams);
  }

  return (
    <>
      <input
        id={customPickerId}
        type="file"
        style={{ visibility: 'hidden', display: 'none' }}
        onChange={(e) => onFileSelected(e.target.files[0])}
        capture={filePickerType === 'camera'}
      />
      <ClickWrappedChild
        childElem={children}
        onClickFunc={onElementClick}
      />
      <FileAccessDialog
        dataAidSuffix={dataAidSuffix}
        isOpen={openOptionsDialog}
        handleUpload={handleUploadFromDialog}
        onClose={() => setOpenOptionsDialog(false)}
      />
    </>
  );
}

const ClickWrappedChild = ({ childElem, onClickFunc }) => (
  React.cloneElement(childElem, {
    onClick: onClickFunc,
    style: {
      ...childElem?.props?.style,
      cursor: 'pointer'
    }
  })
);

