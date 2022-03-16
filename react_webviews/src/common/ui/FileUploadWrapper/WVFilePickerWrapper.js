/*

  Use: Generic component to support file picker methods and behaviour
    for native/web/sdk

  Example syntax:
    <WVFilePickerWrapper
      nativePickerMethodName="open_gallery"
      customPickerId="my-file-picker"
      onFileSelectComplete={functionName}
      onFileSelectError={functionName}
      sizeLimit={4}
      supportedFormats={['jpeg', 'png']}
      fileName="new file"
    >
      {Any child element for which file picker functionality is required}
    </WVFilePickerWrapper>
*/

/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { getConfig } from "utils/functions";
import { isFunction } from 'lodash';
import toast from '../Toast';
import FileAccessDialog from './FileAccessDialog';
import { openFilePicker, validateFileTypeAndSize } from '../../../utils/functions';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';

const isWeb = getConfig().Web;

export function promisableGetBase64(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    try {
      reader.onload = ev => {
        resolve(ev.target.result)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      reject({
        ...err,
        errorMessage: err?.message,
        message: "Failed to read the file, please try again later",
        type: "reader",
      })
    }
  })
}

const compressImage = async (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.7, // can go above but ideally not below 0.6
      success(compressed) {
        resolve(compressed);
      },
      error(err) {
        reject({
          ...err,
          errorMessage: err?.message,
          message: "Failed to process file, please try again later",
          type: "compress"
        });
      },
    })
  })
}

export const WVFilePickerWrapper = ({
  dataAidSuffix,
  nativePickerMethodName, // Method name for native file handler (open_gallery, open_canvas, etc.) 
  customPickerId, /*
    To uniquely identify the internal <input /> element
    (Required when there's more than 1 file pickers in a single page)
  */
  showOptionsDialog, // If true, shows a bottomsheet for camera or gallery options on click of element 
  onFileSelectStart, /*
    Callback called once file is picked, before starting file processing
    Ideally used to trigger loader on file selection
    **Works only for Native for now**
  */
  onFileSelectComplete, // Callback for when file selection is successful
  onFileSelectError, // Callback for when file selection fails
  extraValidation, // Function for any extra file validations on selected file besides size and type validations
  sizeLimit, // Number value for file size limit (in MB)
  supportedFormats, // Accepts an array of file types for file type validation
  fileName, // Name for selected file
  fileHandlerParams, // Object containing any additional params for native file handler (check functions.js > openFilePicker())
  customClickHandler, // To override <input> click handler (Not usually required, only for absolute edge cases)
  shouldCompress, // If true, image files will be compressed to make them smaller in size
  children // Any child element for which file picker functionality is required
}) => {
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
  const [filePickerType, setFilePickerType] = useState(nativePickerMethodName);

  const onFileSelected = async (file, otherParams = {}) => {
    try {
      // Basic size and file type validations
      const errMsg = validateFileTypeAndSize(file, supportedFormats, sizeLimit);
      if (errMsg) {
        const error = { message: errMsg };
        throw error
      };

      // Additional file validations, if any
      if (isFunction(extraValidation)) {
        const extraErr = extraValidation();
        if (extraErr) {
          const error = { message: extraErr };
          throw error
        };
      }

      let fileBase64 = '';

      if (file.type.split("/")[0] === 'image') {
        if (shouldCompress) {
          const compressedBlob = await compressImage(file);
          file = new File([compressedBlob], file.name || "file");
        }
        fileBase64 = await promisableGetBase64(file);
      }

      if (isFunction(onFileSelectComplete)) {
        onFileSelectComplete(file, fileBase64, otherParams);
      }
    } catch(err) {
      if (isFunction(onFileSelectError)) {
        onFileSelectError({...err, fileType: file.type});
      } else {
        console.log(err);
        toast(err.message);
      }
    }
  };

  const onElementClick = () => {
    // Note: Order of params in array matters
    const functionParams = [
      customPickerId,
      nativePickerMethodName,
      fileName,
      onFileSelected,
      fileHandlerParams,
      onFileSelectStart
    ];
    
    if (isFunction(customClickHandler)) {
      customClickHandler(...functionParams);
    } else if (!isWeb && showOptionsDialog) {
      setOpenOptionsDialog(true);
    } else {
      openFilePicker(...functionParams);
    }
  }
  
  const handleUploadFromDialog = (type) => {
    setOpenOptionsDialog(false);
    setFilePickerType(type);
    openFilePicker(customPickerId, type, fileName, onFileSelected, fileHandlerParams, onFileSelectStart);
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

WVFilePickerWrapper.propTypes = {
  nativePickerMethodName: PropTypes.oneOf([
    'open_gallery',
    'open_canvas',
    'open_camera',
    'open_file'
  ]).isRequired,
  customPickerId: PropTypes.string,
  showOptionsDialog: PropTypes.bool, 
  onFileSelectComplete: PropTypes.func.isRequired,
  onFileSelectError: PropTypes.func,
  extraValidation: PropTypes.func,
  sizeLimit: PropTypes.number,
  supportedFormats: PropTypes.array,
  fileName: PropTypes.string,
  fileHandlerParams: PropTypes.object,
  customClickHandler: PropTypes.func,
  shouldCompress: PropTypes.bool,
  children: PropTypes.any
}

WVFilePickerWrapper.defaultProps = {
  customPickerId: 'wv-file-input',
  showOptionsDialog: false,
  onFileSelectError: null,
  extraValidation: null,
  sizeLimit: 100,
  supportedFormats: [],
  fileName: 'file',
  fileHandlerParams: null,
  customClickHandler: null,
  shouldCompress: false,
}