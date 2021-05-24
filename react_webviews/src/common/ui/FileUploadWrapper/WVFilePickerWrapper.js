import React, { useState } from 'react';
import { getConfig } from "utils/functions";
import { isArray, isFunction } from 'lodash';
import toast from '../Toast';
import FileAccessDialog from './FileAccessDialog';

const isWeb = getConfig().Web;

const openFileHandler = (filepickerId, methodName, docName, nativeHandler) => {
  if (getConfig().html_camera) {
    const filepicker = document.getElementById(filepickerId);
    if (filepicker){
      filepicker.click();
    }
  } else {
    window.callbackWeb[methodName]({
      docName,
      upload: nativeHandler // callback from native
    });
  }
}

function getBase64(file) {
  const reader = new FileReader();
  return new Promise(resolve => {
    reader.onload = ev => {
      resolve(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const validateFileTypeAndSize = (file, supportedTypes, sizeLimit) => {
  const fileType = file.type.split("/")[1];
  const sizeInBytes = sizeLimit * 1000 * 1000;
  
  if (!isArray(supportedTypes)) {
    supportedTypes = [supportedTypes]
  }
  
  if (!supportedTypes.includes(fileType)) {
    return "File type not supported";
  } else if (file.size > sizeInBytes) {
    return `File size cannot exceed ${sizeLimit}MB`;
  }
  
  return "";
}

export const WVFilePickerWrapper = ({
  nativePickerMethodName = '',
  customPickerId = 'wv-file-input',
  showOptionsDialog,
  onFileSelectComplete,
  onFileSelectError,
  extraValidation,
  sizeLimit = 100,
  supportedFormats,
  fileName,
  children
}) => {
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
  const [filePickerType, setFilePickerType] = useState(nativePickerMethodName);

  const onFileSelected = async (file) => {
    try {
      // Basic size and file type validations
      const errMsg = validateFileTypeAndSize(file, supportedFormats, sizeLimit)
      if (errMsg) throw errMsg;

      // Additional file validations, if any
      if (isFunction(extraValidation)) {
        const extraErr = extraValidation();
        if (extraErr) throw extraErr;
      }

      let fileBase64 = '';

      if (file.type.split("/")[0] === 'image') {
        fileBase64 = await getBase64(file);
      }

      if (isFunction(onFileSelectComplete)) {
        onFileSelectComplete(file, fileBase64);
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
    if (!isWeb && showOptionsDialog) {
      setOpenOptionsDialog(true);
    } else {
      openFileHandler(customPickerId, nativePickerMethodName, fileName, onFileSelected);
    }
  }

  const handleUploadFromDialog = (type) => {
    setOpenOptionsDialog(false);
    setFilePickerType(type);
    openFileHandler(customPickerId, type, fileName, onFileSelected)
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
      ...childElem.style,
      cursor: 'pointer'
    }
  })
);

