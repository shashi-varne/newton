import React from 'react';
import { getConfig } from "utils/functions";
import { isArray, isFunction } from 'lodash';
import toast from '../Toast';

const openFileHandler = (filepickerId, methodName, docType, nativeHandler) => {
  if (true || getConfig().html_camera) {
    const filepicker = document.getElementById(filepickerId);
    if (filepicker){
      filepicker.click();
    }
  } else {
    window.callbackWeb[`open_${methodName}`]({
      type: "doc",
      doc_type: docType,
      // callback from native
      upload: nativeHandler
    });
  }
}

function getBase64(file) {
  const reader = new FileReader()
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
  type = '', // 'file', 'camera', 'gallery'
  onFileSelectComplete,
  onFileSelectError,
  extraValidation,
  sizeLimit,
  supportedFormats,
  children
}) => {

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

      if (file.type.split("/")[0] === 'image') {
        file = await getBase64(file);
      }

      if (isFunction(onFileSelectComplete)) {
        onFileSelectComplete(file);
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

  return (
    <>
      <input
        id="wv-file-input"
        type="file"
        style={{ 'visibility': "hidden" }}
        onChange={(e) => onFileSelected(e.target.files[0])}
      />
      <ClickWrappedChild
        childElem={children}
        onClickFunc={() => openFileHandler("wv-file-input", type, "", onFileSelected)}
      />
    </>
  );
}

const ClickWrappedChild = ({ childElem, onClickFunc }) => (
  React.cloneElement(childElem, {
    onClick: onClickFunc,
    style: {
      cursor: 'pointer'
    }
  })
);

