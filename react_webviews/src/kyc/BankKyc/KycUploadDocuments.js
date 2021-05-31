import React, { useEffect, useRef, useState } from "react";
import Container from "../common/Container";
import { VERIFICATION_DOC_OPTIONS } from "../constants";
import { uploadBankDocuments } from "../common/api";
import PendingBankVerificationDialog from "./PendingBankVerificationDialog";
import { getUrlParams, isEmpty } from "utils/validators";
import { navigate as navigateFunc } from "../common/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import SVG from "react-inlinesvg";
import { getBase64, getConfig } from "../../utils/functions";
import toast from '../../common/ui/Toast'
import { PATHNAME_MAPPER } from "../constants";
import "./KycUploadDocuments.scss";

const config = getConfig();
const isWeb = config.Web;
const KycUploadDocuments = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [file, setFile] = useState(null);
  const inputEl = useRef(null);
  const [dlFlow, setDlFlow] = useState(false);
  const {kyc, isLoading, updateKyc} = useUserKycHook();
  const [fileToShow, setFileToShow] = useState(null)
  const [showLoader, setShowLoader] = useState(false)

  const native_call_handler = (method_name, doc_type, doc_name, doc_side) => {
    window.callbackWeb[method_name]({
      type: 'doc',
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side,
      // callbacks from native
      upload: function upload(file) {
        try {
          switch (file.type) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/bmp':
              setFile(file)
              getBase64(file, function (img) {
                setFileToShow(img)
              })
              setTimeout(
                function () {
                  setShowLoader(false);
                },
                1000
              );
              break;
            default:
              toast('Please select image file')
          }
        } catch (e) {
          //
        }
      },
    })

    window.callbackWeb.add_listener({
      type: 'native_receiver_image',
      show_loader: function (show_loader) {
        setShowLoader(true)
      },
    })
  }

  useEffect(() => {
    if (
      !isEmpty(kyc) &&
      kyc.kyc_status !== "compliant" &&
      !kyc.address.meta_data.is_nri &&
      kyc.dl_docs_status !== "" &&
      kyc.dl_docs_status !== "init" &&
      kyc.dl_docs_status !== null
    ) {
      setDlFlow(true);
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

  const handleChange = (event) => {
    event.preventDefault();
    const uploadedFile = event.target.files[0]
    let acceptedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']

    if (acceptedType.indexOf(uploadedFile.type) === -1) {
      toast('Please select image file only')
      return
    }

    setFile(uploadedFile)
    getBase64(uploadedFile, function (img) {
      setFileToShow(img)
    })
  };

  const handleDocType = (index) => {
    setSelected(index);
  };

  const handleUpload = (method_name) => {
    if(isWeb)
      inputEl.current.click()
    else
      native_call_handler(method_name, 'doc', 'doc.jpg', 'front')
  };

  const handleImageLoad = (event) => {
    URL.revokeObjectURL(event.target.src);
  };

  const handleSubmit = async () => {
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
    const navigate = navigateFunc.bind(props);
    navigate(`/kyc/${userType}/bank-details`);
  };

  const handleSampleDocument = () => {
    const navigate = navigateFunc.bind(props);
    navigate("/kyc/sample-documents");
  };

  const proceed = () => {
    const navigate = navigateFunc.bind(props);
    if (additional) {
      navigate("/kyc/add-bank");
    } else {
      if (userType === "compliant") {
        if (isEdit) {
          navigate("/kyc/journey");
        } else {
          if (kyc.sign.doc_status !== "submitted" && kyc.sign.doc_status !== "approved") {
            navigate(PATHNAME_MAPPER.uploadSign, {
              state: {
                backToJourney: true,
              },
            });
          } else navigate("/kyc/journey");
        }
      } else {
        if (dlFlow) {
          if (
            (kyc.all_dl_doc_statuses.pan_fetch_status === null ||
            kyc.all_dl_doc_statuses.pan_fetch_status === "" ||
            kyc.all_dl_doc_statuses.pan_fetch_status === "failed") && 
            kyc.pan.doc_status !== "approved"
          ) {
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

  const selectedDocValue =
    selected !== null ? VERIFICATION_DOC_OPTIONS[selected].value : "";

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading || showLoader}
      hideInPageTitle
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title="Upload documents"
    >
      <section id="kyc-bank-kyc-upload-docs">
        <div className="banner">
          <div className="left">
            <img src={bankData?.ifsc_image} alt="bank" className="icon" />
            <div className="acc_no">
              <div className="title">Account number</div>
              <div className="value">{bankData?.account_number}</div>
            </div>
          </div>

          <div className="edit" onClick={handleEdit}>
            edit
          </div>
        </div>
        <main>
          <div className="doc-title">Select the document for verification</div>
          <div className="subtitle">
            Ensure your name is clearly visible in the document
          </div>
          <div className="kyc-upload-doc-options">
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
            <div className="docs-image-container">
              <div className="preview">
                {file && fileToShow ? (
                  <img
                    className="preview-image"
                    src={fileToShow}
                    onLoad={handleImageLoad}
                    alt="Uploaded Document"
                  />
                ) : (
                  <img
                    className="sign-img"
                    src={require("assets/signature_icon.svg")}
                    alt=""
                  />
                )}
              </div>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
          )}
        </main>
        {selectedDocValue && (
          <div className="sample-document" onClick={handleSampleDocument}>
            view sample document
          </div>
        )}
        <footer className="ssl-container">
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
