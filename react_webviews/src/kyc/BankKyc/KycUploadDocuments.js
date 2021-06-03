import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { SUPPORTED_IMAGE_TYPES, VERIFICATION_DOC_OPTIONS } from "../constants";
import { uploadBankDocuments } from "../common/api";
import PendingBankVerificationDialog from "./PendingBankVerificationDialog";
import { getUrlParams, isEmpty } from "utils/validators";
import { checkPanFetchStatus, isDigilockerFlow } from "../common/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import SVG from "react-inlinesvg";
import { getConfig, isTradingEnabled, navigate as navigateFunc } from "../../utils/functions";
import toast from '../../common/ui/Toast'
import { PATHNAME_MAPPER } from "../constants";
import "./KycUploadDocuments.scss";
import KycUploadContainer from "../mini-components/KycUploadContainer";
import { getFlow } from "../common/functions";
import { nativeCallback } from "../../utils/native_callback";

const config = getConfig();
const isWeb = config.Web;
const KycUploadDocuments = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [file, setFile] = useState(null);
  const [dlFlow, setDlFlow] = useState(false);
  const {kyc, isLoading, updateKyc} = useUserKycHook();
  const [fileToShow, setFileToShow] = useState(null)
  // const [showLoader, setShowLoader] = useState(false)
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (!isEmpty(kyc)) {
      if (isDigilockerFlow(kyc)) {
        setDlFlow(true);
      }
    }
  }, [kyc]);

  let bankData = {};

  const userType = props?.match.params?.userType;

  const urlparams = getUrlParams(props.location.search);

  const additional = urlparams?.additional;
  const isEdit = urlparams?.isEdit;

  let bank_id = urlparams.bank_id || kyc?.bank?.meta_data?.bank_id;

  if (!urlparams.bank_id) {
    bankData = kyc?.bank?.meta_data;
  } else {
    bankData = kyc?.additional_approved_banks?.find(function (obj) {
      return obj.bank_id === Number(bank_id);
    });
  }

  const onFileSelectComplete = (file, fileBase64) => {
    setFile(file);
    setFileToShow(fileBase64);
  };

  const onFileSelectError = () => {
    toast('Please select image file only');
  }

  const handleDocType = (index) => {
    setSelected(index);
  };

  const handleImageLoad = (event) => {
    URL.revokeObjectURL(event.target.src);
  };

  const handleSubmit = async () => {
    sendEvents('next')
    if (selected === null || !file) return;
    try {
      setIsApiRunning("button");
      const result = await uploadBankDocuments(
        file,
        VERIFICATION_DOC_OPTIONS[selected].value,
        bank_id
      );
      if(!isEmpty(result))
        updateKyc(result.kyc)
      setShowPendingModal(true);
    } catch (err) {
      toast("Image upload failed, please retry")
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleEdit = () => {
    sendEvents('edit')
    navigate(`/kyc/${userType}/bank-details`);
  };

  const handleSampleDocument = () => {
    navigate("/kyc/sample-documents");
  };

  const handleOtherPlatformNavigation = () => {
    sendEvents('next', "", 'bottom_sheet')
    if (additional) {
      navigate("/kyc/add-bank");
    } else if (userType === "compliant") {
      if (isEdit || kyc.address.meta_data.is_nri) navigate(PATHNAME_MAPPER.journey);
      else navigate(PATHNAME_MAPPER.tradingExperience)
    } else {
      if (dlFlow) {
        const isPanFailedAndNotApproved = checkPanFetchStatus(kyc);
        if (isPanFailedAndNotApproved) {
          navigate(PATHNAME_MAPPER.uploadPan);
        } else {
          if (kyc.sign_status !== 'signed') {
            navigate(PATHNAME_MAPPER.tradingExperience);
          } else {
            navigate(PATHNAME_MAPPER.journey);
          }
        }
      } else {
        navigate(PATHNAME_MAPPER.uploadProgress);
      }
    }
  };

  const handleSdkNavigation = () => {
    if (additional) {
      navigate("/kyc/add-bank");
    } else {
      if (userType === "compliant") {
        navigate(PATHNAME_MAPPER.journey);
        // if (isEdit) {
        //   navigate("/kyc/journey");
        // } else {
        //   if (kyc.sign.doc_status !== "submitted" && kyc.sign.doc_status !== "approved") {
        //     navigate(PATHNAME_MAPPER.uploadSign, {
        //       state: {
        //         backToJourney: true,
        //       },
        //     });
        //   } else navigate("/kyc/journey");
        // }
      } else {
        if (dlFlow) {
          const isPanFailedAndNotApproved = checkPanFetchStatus(kyc);
          if (isPanFailedAndNotApproved) {
            navigate("/kyc/upload/pan");
          } else {
            if (kyc.sign_status !== 'signed') {
              navigate("/kyc-esign/info");
            } else {
              navigate("/kyc/journey");
            }
          }
        } else {
          navigate("/kyc/upload/progress");
        }
      }
    } 
  };

  const proceed = () => {
    if (isTradingEnabled()) {
      handleOtherPlatformNavigation();
    } else {
      handleSdkNavigation();
    }
  };

  const selectedDocValue =
    selected !== null ? VERIFICATION_DOC_OPTIONS[selected].value : "";

    const sendEvents = (userAction, type, screen_name) => {
      let eventObj = {
        "event_name": 'KYC_registration',
        "properties": {
          "user_action": userAction || "",
          "screen_name": screen_name || 'bank_docs',
          "initial_kyc_status": kyc.initial_kyc_status,
          "flow": getFlow(kyc) || "",
          "document":VERIFICATION_DOC_OPTIONS[selected]?.name || "",
          "type": type || '',
          "status" : screen_name ? "verification pending":""
        }
      };
      if (userAction === 'just_set_events') {
        return eventObj;
      } else {
        nativeCallback({ events: eventObj });
      }
    }

    return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      hideInPageTitle
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title="Upload documents"
      data-aid='kyc-upload-documents-page'
      events={sendEvents("just_set_events")}
    >
      <section id="kyc-bank-kyc-upload-docs" data-aid='kyc-bank-kyc-upload-docs'>
        <div className="banner" data-aid='kyc-banner'>
          <div className="left">
            <img src={bankData?.ifsc_image} alt="bank" className="icon" />
            <div className="acc_no" data-aid='kyc-acc-no'>
              <div className="title">Account number</div>
              <div className="value">{bankData?.account_number}</div>
            </div>
          </div>

          <div className="edit" data-aid='kyc-edit' onClick={handleEdit}>
            edit
          </div>
        </div>
        <main data-aid='kyc-upload-documents'>
          <div className="doc-title" data-aid='kyc-doc-title'>Select document for verification</div>
          <div className="subtitle" data-aid='kyc-subtitle'>
            Make sure your name, account number and IFSC code is clearly visible in the document
          </div>
          <div className="kyc-upload-doc-options" data-aid='kyc-upload-doc-options'>
            {VERIFICATION_DOC_OPTIONS.map((data, index) => {
              const selectedType = data.value === selectedDocValue;
              const disableField =
                kyc.address?.meta_data?.is_nri && data.value !== "cheque";
              return (
                <div
                  key={index}
                  className={`kyc-upload-doc-option-type ${selectedType && "selected-doc"} ${
                    disableField && "disabled-doc"
                  }`}
                  onClick={() => {
                    if (!disableField) handleDocType(index);
                  }}
                  id={`name_${index}`}
                  data-aid={`name_${index}`}
                >
                  {data.name}
                  {selectedType && (
                    <SVG
                      className="kyc-upload-doc-check-icon"
                      preProcessor={(code) =>
                        code.replace(
                          /fill=".*?"/g,
                          "fill=" + config.styles.primaryColor
                        )
                      }
                      src={require(`assets/check_selected_blue.svg`)}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {!isEmpty(selected) && selected >= 0 && (
            <KycUploadContainer>
              <div className="kuc-sign-image-container" style={{ height: fileToShow ? 'auto' : '250px' }} data-aid='kyc-docs-image-container'>
                <KycUploadContainer.Image
                  fileToShow={fileToShow}
                  illustration={require("assets/signature_icon.svg")}
                  alt={`${fileToShow ? 'Uploaded' : 'Upload'} Document`}
                  className={fileToShow ? '' : 'kuc-sign-image'}
                  onLoad={handleImageLoad}
                />
              </div>
<<<<<<< HEAD
              <KycUploadContainer.Button
                withPicker
                showOptionsDialog
                nativePickerMethodName="open_gallery"
                fileName="doc"
                onFileSelectComplete={onFileSelectComplete}
                onFileSelectError={onFileSelectError}
                supportedFormats={SUPPORTED_IMAGE_TYPES}
              />
            </KycUploadContainer>
=======
              {isWeb ? (
                <div className="web-upload-container">
                  <div
                    className="upload-container"
                    onClick={() => handleUpload("open_gallery")}
                  >
                    <input
                      type="file"
                      ref={inputEl}
                      capture
                      style={{ display: "none" }}
                      onChange={handleChange('gallery')}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      role="button"
                    >
                      <g transform="translate(0 3)">
                        <path d="M21.4883721,0 L2.51162791,0 C1.12449412,0 0,1.11584416 0,2.49230769 L0,15.5076923 C0,16.8841558 1.12449412,18 2.51162791,18 L21.4883721,18 C22.8755059,18 24,16.8841558 24,15.5076923 L24,2.49230769 C24,1.11584416 22.8755059,0 21.4883721,0 Z M21.1219512,17 L2.87804878,17 C1.84083108,17 1,16.1078831 1,15.0074011 L1,13.1372047 L7.12780488,7 L13,13 L18,9 L23,13.8516937 L23,15.0074011 C23,16.1078831 22.1591689,17 21.1219512,17 Z M23,13 C19.7357846,9.6105021 18.0691179,7.94383544 18,8 L13,12 C9.068603,7.93471236 7.068603,5.93471236 7,6 L1,12 L1,2.92714951 C1,1.86281423 1.84083108,1 2.87804878,1 L21.1219512,1 C22.1591689,1 23,1.86281423 23,2.92714951 L23,13 Z" />
                        <path d="M13.5,2 C12.1192881,2 11,3.11928813 11,4.5 C11,5.88071187 12.1192881,7 13.5,7 C14.8807119,7 16,5.88071187 16,4.5 C16,3.11928813 14.8807119,2 13.5,2 Z M13.5,3 C14.3284271,3 15,3.67157288 15,4.5 C15,5.32842712 14.3284271,6 13.5,6 C12.6715729,6 12,5.32842712 12,4.5 C12,3.67157288 12.6715729,3 13.5,3 Z" />
                      </g>
                    </svg>

                    <div className="upload-action">Upload file</div>
                  </div>
                </div>
              ) : (
                <div className="camera-upload-container">
                  <div
                    className="upload-container"
                    onClick={() => handleUpload("open_camera")}
                  >
                    <input
                      type="file"
                      ref={inputEl}
                      capture
                      style={{ display: "none" }}
                      onChange={handleChange('open-camera')}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      role="button"
                    >
                      <g transform="translate(0 3)">
                        <path d="M21.4883721,0 L2.51162791,0 C1.12449412,0 0,1.11584416 0,2.49230769 L0,15.5076923 C0,16.8841558 1.12449412,18 2.51162791,18 L21.4883721,18 C22.8755059,18 24,16.8841558 24,15.5076923 L24,2.49230769 C24,1.11584416 22.8755059,0 21.4883721,0 Z M21.1219512,17 L2.87804878,17 C1.84083108,17 1,16.1078831 1,15.0074011 L1,13.1372047 L7.12780488,7 L13,13 L18,9 L23,13.8516937 L23,15.0074011 C23,16.1078831 22.1591689,17 21.1219512,17 Z M23,13 C19.7357846,9.6105021 18.0691179,7.94383544 18,8 L13,12 C9.068603,7.93471236 7.068603,5.93471236 7,6 L1,12 L1,2.92714951 C1,1.86281423 1.84083108,1 2.87804878,1 L21.1219512,1 C22.1591689,1 23,1.86281423 23,2.92714951 L23,13 Z" />
                        <path d="M13.5,2 C12.1192881,2 11,3.11928813 11,4.5 C11,5.88071187 12.1192881,7 13.5,7 C14.8807119,7 16,5.88071187 16,4.5 C16,3.11928813 14.8807119,2 13.5,2 Z M13.5,3 C14.3284271,3 15,3.67157288 15,4.5 C15,5.32842712 14.3284271,6 13.5,6 C12.6715729,6 12,5.32842712 12,4.5 C12,3.67157288 12.6715729,3 13.5,3 Z" />
                      </g>
                    </svg>

                    <div className="upload-action">Open camera</div>
                  </div>
                  <div
                    className="upload-container"
                    onClick={() => handleUpload("open_gallery")}
                  >
                    <input
                      type="file"
                      ref={inputEl}
                      capture
                      style={{ display: "none" }}
                      onChange={handleChange('gallery')}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      role="button"
                    >
                      <g transform="translate(0 3)">
                        <path d="M21.4883721,0 L2.51162791,0 C1.12449412,0 0,1.11584416 0,2.49230769 L0,15.5076923 C0,16.8841558 1.12449412,18 2.51162791,18 L21.4883721,18 C22.8755059,18 24,16.8841558 24,15.5076923 L24,2.49230769 C24,1.11584416 22.8755059,0 21.4883721,0 Z M21.1219512,17 L2.87804878,17 C1.84083108,17 1,16.1078831 1,15.0074011 L1,13.1372047 L7.12780488,7 L13,13 L18,9 L23,13.8516937 L23,15.0074011 C23,16.1078831 22.1591689,17 21.1219512,17 Z M23,13 C19.7357846,9.6105021 18.0691179,7.94383544 18,8 L13,12 C9.068603,7.93471236 7.068603,5.93471236 7,6 L1,12 L1,2.92714951 C1,1.86281423 1.84083108,1 2.87804878,1 L21.1219512,1 C22.1591689,1 23,1.86281423 23,2.92714951 L23,13 Z" />
                        <path d="M13.5,2 C12.1192881,2 11,3.11928813 11,4.5 C11,5.88071187 12.1192881,7 13.5,7 C14.8807119,7 16,5.88071187 16,4.5 C16,3.11928813 14.8807119,2 13.5,2 Z M13.5,3 C14.3284271,3 15,3.67157288 15,4.5 C15,5.32842712 14.3284271,6 13.5,6 C12.6715729,6 12,5.32842712 12,4.5 C12,3.67157288 12.6715729,3 13.5,3 Z" />
                      </g>
                    </svg>

                    <div className="upload-action">Upload file</div>
                  </div>
                </div>
              )}
            </div>
>>>>>>> 4266f7bddd6ef825467feb7b23f5e4ce78f1a543
          )}
        </main>
        {selectedDocValue && (
          <div className="sample-document" data-aid='kyc-sample-document-text' onClick={handleSampleDocument}>
            view sample document
          </div>
        )}
        <footer className="ssl-container" data-aid='kyc-footer'>
          <img
            src={require("assets/ssl_icon_new.svg")}
            alt="SSL Secure Encryption"
          />
        </footer>
      </section>
      <PendingBankVerificationDialog
        open={showPendingModal}
        close={setShowPendingModal}
        title="Bank Verification Pending!"
        description="We’ve added your bank account details. The verification is in progress, meanwhile you can continue with KYC"
        label="CONTINUE WITH KYC"
        proceed={proceed}
        cancel={setShowPendingModal}
      />
    </Container>
  );
};

export default KycUploadDocuments;
