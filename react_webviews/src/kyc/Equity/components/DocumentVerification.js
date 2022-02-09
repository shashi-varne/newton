import React, {useEffect, useState, Fragment, useMemo} from "react";
import { nativeCallback } from "../../../utils/native_callback";
import { getConfig, isNewIframeDesktopLayout, navigate as navigateFunc } from "../../../utils/functions";
import Container from "../../common/Container";
import WVJourneyShortening from "../../../common/ui/JourneyShortening/JourneyShortening";
import useUserKycHook from "../../common/hooks/userKycHook";
import { isEmpty, storageService } from "../../../utils/validators";
import { getPendingDocuments } from "../../common/functions";
import "./commonStyles.scss";
import { Imgc } from "../../../common/ui/Imgc";

const DocumentVerification = (props) => {
  const { productName, Web } = useMemo(() => {
    return getConfig();
  }, []);
  const newIframeDesktopLayout = useMemo(isNewIframeDesktopLayout, []);
  const navigate = navigateFunc.bind(props);
  const {kyc, isLoading} = useUserKycHook();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!isEmpty(kyc)) {
        let pendingDocs = await getPendingDocuments(kyc);
        setDocs([...docs, ...pendingDocs]);
      }
    }

    init();
  }, [kyc]);

  const handleCTAClick = () => {
    sendEvents("next");
    goBack();
  }

  const goBack = () => {
    if(!Web && storageService().get("native")) {
      nativeCallback({ action: "exit_web" });
    } else {
      navigate("/");
    }
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "document_verification_under_process",
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
      events={sendEvents("just_set_events")}
      data-aid='doc-verification-screen'
      buttonTitle="HOME"
      handleClick={handleCTAClick}
      title="Document verification is under process"
      hidePageTitle
      type="outlined"
      skelton={isLoading}
      headerData={{ goBack }}
      iframeRightContent={require(`assets/${productName}/upload_documents_pending.svg`)}
    >
      <div className="kyc-document-verification" data-aid='kyc-document-verification'>
        <header className="kyc-document-verification-header" data-aid='kyc-document-verification-header'>
          <div className="kdv-text">Document verification is under process</div>
          {!newIframeDesktopLayout && (
            <Imgc
              src={require(`assets/${productName}/upload_documents_pending.svg`)}
              alt=""
              className="kyc-dv-header-icon"
            />
          )}
        </header>
        <main className="kyc-document-verification-main" data-aid='kyc-document-verification-main'>
          <div className="kdvm-subtitle">
            Once the below documents are verified by us, you can complete eSign
            to start investing
          </div>
          {docs.length ? docs.map((docObj) => (
            <Fragment key={docObj.title}>
              <div className="kdvm-title">{docObj.title}</div>
              <div className="kdvm-subtitle">{docObj.doc}</div>
            </Fragment>
          )) : ""}
          <WVJourneyShortening
            title="Next step"
            stepName="Complete esign"
            stepActionText="Pending"
            stepActionType="pending"
          />
        </main>
      </div>
    </Container>
  );
};

export default DocumentVerification;
