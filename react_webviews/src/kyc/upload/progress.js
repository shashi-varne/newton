import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import UploadCard from "./UploadCard";
import { getDocuments, initData } from "../services";
import { isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../constants";
import toast from "common/ui/Toast";
import { navigate as navigateFunc } from "../common/functions";

const Progress = (props) => {
  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  );
  const [loading, setLoading] = useState(false);
  const disableNext = props.location.state?.disableNext || false;
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (isEmpty(kyc)) {
      initialize();
    }
  }, []);

  const initialize = async () => {
    try {
      setLoading(true);
      await initData();
      const kyc = storageService().getObject(storageConstants.KYC);
      setKyc(kyc);
    } catch (err) {
      console.error(err);
      toast(err.message);
    } finally {
      setLoading(false);
    }
  };

  let documents = [];
  let totalDocs = 0;
  let canGoNext = false;

  if (!isEmpty(kyc) && !loading) {
    documents = getDocuments(kyc);
    for (let document of documents) {
      if (
        document.doc_status === "submitted" ||
        document.doc_status === "approved"
      ) {
        totalDocs++;
      }
    }
    canGoNext = documents.length === totalDocs;
  }

  const handleCards = (key, index) => {
    if (disableNext) return;
    if (documents[index].doc_status === "approved") return;
    const stateMapper = {
      pan: getPathname.uploadPan,
      address: getPathname.uploadAddress,
      nriaddress: getPathname.uploadNriAddress,
      selfie: getPathname.uploadSelfie,
      selfie_video: getPathname.uploadSelfieVideo,
      bank: `/kyc/${kyc.kyc_status}/bank-details`,
      sign: getPathname.uploadSign,
    };

    navigate(stateMapper[key]);
  };

  return (
    <Container
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      noFooter={disableNext}
      disable={loading || !canGoNext}
      classOverRideContainer="pr-container"
      showSkelton={loading}
      skeltonType="p"
      fullWidthButton={true}
      handleClick={() => {
        navigate(getPathname.journey);
      }}
    >
      <section id="kyc-upload-progress">
        <div className="header">Upload documents</div>
        <main className="documents">
          {documents.map((document, index) => (
            <div key={index} className="document">
              <UploadCard
                default_image={document.default_image}
                title={document.title}
                subtitle={document.subtitle}
                doc_status={document.doc_status}
                onClick={() => handleCards(document.key, index)}
                approved_image={document.approved_image}
              />
            </div>
          ))}
        </main>
      </section>
    </Container>
  );
};

export default Progress;
