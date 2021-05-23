import React, { useEffect, useRef, useState } from "react";
import Container from "../common/Container";
import Button from '../../common/ui/Button'
import { verificationDocOptions } from "../constants";
import { uploadBankDocuments } from "../common/api";
import PendingBankVerificationDialog from "./PendingBankVerificationDialog";
import FileAccessDialog from '../mini-components/FileAccessDialog'
import { getUrlParams, isEmpty } from "utils/validators";
import { navigate as navigateFunc } from "../common/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import SVG from "react-inlinesvg";
import { getBase64, getConfig } from "../../utils/functions";
import toast from '../../common/ui/Toast'
import { getPathname } from "../constants";
import "./KycUploadDocuments.scss";

const KycUploadDocuments = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [file, setFile] = useState(null);
  const inputEl = useRef(null);
  const [dlFlow, setDlFlow] = useState(false);
  const {kyc, isLoading, setKycToSession} = useUserKycHook();
  const [fileToShow, setFileToShow] = useState(null)
  const [showLoader, setShowLoader] = useState(false)
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false)
  const isWeb = getConfig().Web;

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
    if(getConfig().html_camera)
      inputEl.current.click()
    else {
      setIsAccessDialogOpen(false);
      native_call_handler(method_name, 'doc', 'doc.jpg', 'front')
    }
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
        verificationDocOptions[selected].value,
        bank_id
      );
      if(!isEmpty(result))
        setKycToSession(result.kyc)
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

  const handleClick = () => {
    if (!isWeb) {
      setIsAccessDialogOpen(true);
    } else {
      handleUpload("open_gallery");
    }
  }

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
            navigate(getPathname.uploadSign, {
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

  const handleAccessDialogClose = (event, reason) => {
    setIsAccessDialogOpen(false);
  }

  const selectedDocValue =
    selected !== null ? verificationDocOptions[selected].value : "";

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading || showLoader}
      hideInPageTitle
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title="Upload documents"
      data-aid='kyc-upload-documents-page'
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
            {verificationDocOptions.map((data, index) => {
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
                          "fill=" + getConfig().styles.primaryColor
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
            <div className="docs-image-container" data-aid='kyc-docs-image-container'>
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
              <div className="upload-container" data-aid='upload-container'>
                <input
                  type="file"
                  ref={inputEl}
                  capture
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
                <div className="button-container">
                  <Button
                    dataAid='attach-doc-btn'
                    type="outlined"
                    buttonTitle="ATTACH DOCUMENT"
                    onClick={handleClick}
                    />
                </div>
              </div>
            </div>
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
        <FileAccessDialog 
            isOpen={isAccessDialogOpen}
            handleUpload={handleUpload}
            onClose={handleAccessDialogClose}
          />
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
