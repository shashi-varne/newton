import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { SUPPORTED_IMAGE_TYPES, VERIFICATION_DOC_OPTIONS } from "../constants";
import { uploadBankDocuments } from "../common/api";
import { getUrlParams, isEmpty } from "utils/validators";
import { checkDLPanFetchAndApprovedStatus, getFlow, isDigilockerFlow, isEquityCompleted } from "../common/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import SVG from "react-inlinesvg";
import { getConfig, isTradingEnabled, navigate as navigateFunc } from "../../utils/functions";
import toast from '../../common/ui/Toast'
import { PATHNAME_MAPPER } from "../constants";
import "./KycUploadDocuments.scss";
import KycUploadContainer from "../mini-components/KycUploadContainer";
import { nativeCallback } from "../../utils/native_callback";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import ConfirmBackDialog from "../mini-components/ConfirmBackDialog";
import { isReadyToInvest } from "../services";

const config = getConfig();
const INIT_BOTTOMSHEET_TEXT = "We've added your bank account details. The verification is in progress, meanwhile you can continue with KYC."

const KycUploadDocuments = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [file, setFile] = useState(null);
  const [dlFlow, setDlFlow] = useState(false);
  const [goBackModal, setGoBackModal] = useState(false);
  const {kyc, isLoading, updateKyc} = useUserKycHook();
  const [fileToShow, setFileToShow] = useState(null);
  const [bottomsheetText, setBottomSheetText] = useState(INIT_BOTTOMSHEET_TEXT);
  const [bottomsheetCtaText, setBottomSheetCtaText] = useState("CONTINUE WITH KYC");
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const navigate = navigateFunc.bind(props);
  const fromState = props.location?.state?.fromState || "";

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
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

  const initialize = () => {
    if (isDigilockerFlow(kyc)) {
      setDlFlow(true);
    }
    const tradeFlow = isTradingEnabled(kyc)
    setTradingEnabled(tradeFlow);

    if ((!tradeFlow && isReadyToInvest()) || (tradeFlow && isEquityCompleted())) {
      setBottomSheetText("We've added your bank account details. The verification is in progress.")
      setBottomSheetCtaText("OKAY");
    }
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
    sendEvents('next');
    try {
      if (selected === null || !file) throw new Error("No file added");
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
      toast(err.message || "Image upload failed, please retry")
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleEdit = () => {
    sendEvents('edit');
    navigate(`/kyc/${userType}/bank-details`, {
      state: { isEdit: true }
    });
  };

  const handleSampleDocument = () => {
    navigate("/kyc/sample-documents");
  };

  const handleOtherPlatformNavigation = () => {
    sendEvents('next', 'bank_verification_pending');
    if (additional) {
      navigate("/kyc/add-bank");
    } else if (userType === "compliant") {
      if (isEdit || kyc.address.meta_data.is_nri) navigate(PATHNAME_MAPPER.journey);
      else navigate(PATHNAME_MAPPER.tradingExperience)
    } else {
      if (dlFlow) {
        const isPanFailedAndNotApproved = checkDLPanFetchAndApprovedStatus(kyc);
        if (isPanFailedAndNotApproved) {
          navigate(PATHNAME_MAPPER.uploadPan, {
            state: { goBack: PATHNAME_MAPPER.journey }
          });
        } else {
          if (kyc.equity_sign_status !== 'signed') {
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
          const isPanFailedAndNotApproved = checkDLPanFetchAndApprovedStatus(kyc);
          if (isPanFailedAndNotApproved) {
            navigate("/kyc/upload/pan", {
              state: { goBack: PATHNAME_MAPPER.journey }
            });
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
    if (tradingEnabled) {
      handleOtherPlatformNavigation();
    } else {
      handleSdkNavigation();
    }
  };

  const closeConfirmBackDialog = () => {
    setGoBackModal(false);
  };

  const goBackToPath = () => {
    sendEvents("back");
    if (fromState.indexOf("/kyc/add-bank/details") !== -1) {
      props.history.goBack();
      return;
    } else {
      if (kyc?.kyc_status === "non-compliant" && (kyc?.kyc_type === "manual" || kyc?.address?.meta_data?.is_nri)) {
        navigate(PATHNAME_MAPPER.uploadProgress)
      } else {
        navigate(PATHNAME_MAPPER.journey);
      }
    }
    
  };

  const goBack = () => {
    setGoBackModal(true)
  }

  const selectedDocValue =
    selected !== null ? VERIFICATION_DOC_OPTIONS[selected].value : "";

    const sendEvents = (userAction, screen_name) => {
      let docMapper = ["bank_statement", "cancelled_cheque", "passbook"];
      let eventObj = {
        event_name: "kyc_registration",
        properties: {
          user_action: userAction || "",
          screen_name: screen_name || "bank_upload_documents",
          doc_type: selected ? docMapper[selected] : "",
          "flow": getFlow(kyc) || "",
          // "initial_kyc_status": kyc.initial_kyc_status,
          // "type": type || '',
          // "status" : screen_name ? "verification pending":""
        },
      };
      if (userAction === "just_set_events") {
        return eventObj;
      } else {
        nativeCallback({ events: eventObj });
      }
    };

    return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      hideInPageTitle
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title="Upload documents"
      headerData={{goBack}}
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
            EDIT
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
              <KycUploadContainer.Button
                withPicker
                filePickerProps={{
                  showOptionsDialog: true,
                  shouldCompress: true,
                  nativePickerMethodName: "open_gallery",
                  fileName: "doc",
                  onFileSelectComplete,
                  onFileSelectError,
                  supportedFormats: SUPPORTED_IMAGE_TYPES
                }}
                
              />
            </KycUploadContainer>
          )}
        </main>
        {selectedDocValue && (
          <div className="sample-document" data-aid='kyc-sample-document-text'>
            <WVClickableTextElement
                color="secondary"
                onClick={handleSampleDocument}
                dataAidSuffix="bank"
              >
                VIEW SAMPLE DOCUMENT
              </WVClickableTextElement>
          </div>
        )}
        <footer className="ssl-container" data-aid='kyc-footer'>
          <img
            src={require("assets/ssl_icon_new.svg")}
            alt="SSL Secure Encryption"
          />
        </footer>
      </section>
      <WVBottomSheet
        isOpen={showPendingModal}
        image={require(`assets/${config.productName}/ic_bank_partial_add.svg`)}
        title="Bank verification pending!"
        button1Props={{
          title: bottomsheetCtaText,
          variant: "contained",
          onClick: proceed,
        }}
        classes={{
          content: "penny-bank-verification-dialog-content",
        }}
      >
        <div className="generic-page-subtitle penny-bank-verification-dialog-subtitle">
         {bottomsheetText}
        </div>
      </WVBottomSheet>
      {goBackModal ?
        <ConfirmBackDialog
          isOpen={goBackModal}
          close={closeConfirmBackDialog}
          goBack={goBackToPath}
        />
        : null
      }
    </Container>
  );
};

export default KycUploadDocuments;
