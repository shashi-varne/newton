import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { SUPPORTED_IMAGE_TYPES, VERIFICATION_DOC_OPTIONS } from "../constants";
import { uploadBankDocuments } from "../common/api";
import PendingBankVerificationDialog from "./PendingBankVerificationDialog";
import { getUrlParams, isEmpty } from "utils/validators";
import { checkPanFetchStatus, isDigilockerFlow, navigate as navigateFunc } from "../common/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import SVG from "react-inlinesvg";
import { getConfig, isTradingEnabled } from "../../utils/functions";
import toast from '../../common/ui/Toast'
import { PATHNAME_MAPPER } from "../constants";
import "./KycUploadDocuments.scss";
import KycUploadContainer from "../mini-components/KycUploadContainer";

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
    navigate(`/kyc/${userType}/bank-details`);
  };

  const handleSampleDocument = () => {
    navigate("/kyc/sample-documents");
  };

  const handleOtherPlatformNavigation = () => {
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

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
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
          <div className="doc-title">Select document for verification</div>
          <div className="subtitle">
            Make sure your name, account number and IFSC code is clearly visible in the document
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
            <KycUploadContainer>
              <div className="kuc-sign-image-container" style={{ height: fileToShow ? 'auto' : '250px' }}>
                <KycUploadContainer.Image
                  fileToShow={fileToShow}
                  illustration={require("assets/signature_icon.svg")}
                  alt={`${fileToShow ? 'Uploaded' : 'Upload'} Document`}
                  className={fileToShow ? '' : 'kuc-sign-image'}
                  onLoad={handleImageLoad}
                />
              </div>
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
