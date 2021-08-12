import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import UploadCard from "./UploadCard";
import { getDocuments } from "../services";
import { isEmpty } from "utils/validators";
import { navigate as navigateFunc } from "utils/functions";
import { PATHNAME_MAPPER } from "../constants";
import useUserKycHook from "../common/hooks/userKycHook";
import "./commonStyles.scss";
import { nativeCallback } from "../../utils/native_callback";
import { getConfig } from "../../utils/functions";
import ConfirmBackDialog from "../mini-components/ConfirmBackDialog";
import { storageService } from "../../utils/validators";
import { landingEntryPoints } from "../../utils/constants";

const Progress = (props) => {
  const { productName, Web } = getConfig();
  const { kyc, isLoading } = useUserKycHook();
  const disableNext = props?.location?.state?.disableNext || false;
  const fromState = props?.location?.state?.fromState;
  const goBackPath = props.location?.state?.goBack || "";
  const navigate = navigateFunc.bind(props);
  const [openConfirmBack, setOpenConfirmBack] = useState(false);

  let documents = [];
  let totalDocs = 0;
  let canGoNext = false;

  useEffect(() => {
    if ((landingEntryPoints.includes(fromState)) || (!Web && storageService().get("native") && (goBackPath === "exit"))) {
      storageService().set("uploadDocsEntry", "landing");
    }
  },[])

  if (!isEmpty(kyc) && !isLoading) {
    documents = getDocuments(kyc);
    for (let document of documents) {
      const notBankDocStatus = (document.key !== "bank" && (document.doc_status === "submitted" || document.doc_status === "approved"));
      const bankDocStatus = (document.key === "bank" && (document.doc_status === "submitted" || document.doc_status === "approved") && 
      (kyc.bank.meta_data.bank_status === "doc_submitted" || kyc.bank.meta_data.bank_status === "verified"));

      const submittedOrApprovedCondition = notBankDocStatus || bankDocStatus;
      if (submittedOrApprovedCondition) {
        totalDocs++;
      }
    }
    canGoNext = documents.length === totalDocs;
  }

  const handleCards = (key, index) => {
    sendEvents("next", key);
    if (disableNext) return;
    const approvedCondition = (key !== "bank" && documents[index].doc_status === "approved") ||
    (key === "bank" && documents[index].doc_status === "approved" &&
    (kyc.bank.meta_data.bank_status === "doc_submitted" || kyc.bank.meta_data.bank_status === "verified"));

    if (approvedCondition) return;
    const stateMapper = {
      pan: PATHNAME_MAPPER.uploadPan,
      address: PATHNAME_MAPPER.uploadAddress,
      nriaddress: PATHNAME_MAPPER.uploadNriAddress,
      selfie: PATHNAME_MAPPER.uploadSelfie,
      selfie_video: PATHNAME_MAPPER.uploadSelfieVideo,
      bank: `/kyc/${
        kyc.kyc_status === "compliant" ? "compliant" : "non-compliant"
      }/bank-details`,
      sign: PATHNAME_MAPPER.uploadSign,
    };
    navigate(stateMapper[key], {
      state: { goBack: PATHNAME_MAPPER.uploadProgress }
    });
  };

  const goBack = () => {
    sendEvents("back");
    if(disableNext) {
      props.history.goBack();
      return;
    }
    setOpenConfirmBack(true);
  }

  const goBackToPath = () => {
    if (storageService().get("uploadDocsEntry") === "landing") {
      storageService().remove("uploadDocsEntry");
      if (!Web && storageService().get("native")) {
        nativeCallback({ action: "exit_web"});
      } else {
        navigate("/");
      }
    } else {
      navigate(PATHNAME_MAPPER.journey);
    }
  };

  const goNext = () => {
    sendEvents('next');
    goBackToPath();
  }

  const sendEvents = (userAction, docs) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "upload_documents",
        stage: docs || "",
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
      events={sendEvents("just_set_events")}
      noFooter={disableNext}
      disable={!canGoNext}
      classOverRideContainer="pr-container"
      skelton={isLoading}
      skeltonType="p"
      handleClick={goNext}
      title="Upload documents"
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
      headerData={{goBack}}
      data-aid='kyc-progress-screen'
      hidePageTitle
    >
      <section id="kyc-upload-progress" data-aid='kyc-upload-progress'>
        <header className="flex-between kup-header">
          <div>
            <div className="generic-page-title">Upload documents</div>
            <div className="generic-page-subtitle">Attach required documents to verify your personal and address details</div>
          </div>
          <img alt="" src={require(`assets/${productName}/upload_documents.svg`)} />
        </header>
        <main className="documents" data-aid='kyc-progress-screen-documents'>
          {documents.map((document, index) => (
            <div key={index} className="document" data-aid={`kyc-document-${index+1}`}>
              <UploadCard
                kyc={kyc}
                default_image={document.default_image}
                docKey={document.key}
                title={document.title}
                subtitle={document.subtitle}
                doc_status={document.doc_status}
                onClick={() => handleCards(document.key, index)}
                approved_image={document.approved_image}
                index={index}
              />
            </div>
          ))}
        </main>
        <footer className="kup-footer">
          <img
            alt=""
            src={require(`assets/${productName}/trust_icons.svg`)}
          />
        </footer>
        <ConfirmBackDialog 
          isOpen={openConfirmBack}
          goBack={goBackToPath}
          close={() => setOpenConfirmBack(false)}
        />
      </section>
    </Container>
  );
};

export default Progress;
