import React, { useEffect, useState } from "react";
import { getConfig } from "utils/functions";
import Container from "../common/Container";
import UploadCard from "./UploadCard";
import { getDocuments, initData } from "../services";
import { isEmpty, storageService } from "../../utils/validators";
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

  if (!isEmpty(kyc) && !loading) {
    documents = getDocuments(kyc);
  }

  let totalDocs = 0;

  const handleCards = (key, index) => {
    if (disableNext) return;
    if (documents[index].doc_status === "approved") return;
    const stateMapper = {
      pan: getPathname.uploadPan,
      address: getPathname.uploadAddress,
      nriaddress: getPathname.uploadNriAddress,
      selfie: getPathname.uploadSelfie,
      selfie_video: getPathname.uploadSelfieVideo,
      bank: `/kyc/non-compliant/bank-details`,
      sign: getPathname.uploadSign,
    };

    navigate(stateMapper[key]);
  };

  return (
    <Container
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      noFooter={disableNext}
      disable={loading}
      classOverRideContainer="pr-container"
      showSkelton={loading}
      skeltonType="p"
      fullWidthButton={true}
      handleClick={() => {
        navigate(getPathname.journey);
      }}
    >
      <section id="kyc-upload-progress">
        <div className="header">Upload Documents</div>
        <main className="documents">
          {documents.map((document, index) => (
            <div key={index} className="document">
              <UploadCard
                default_image={document.default_image}
                title={document.title}
                subtitle={document.subtitle}
                onClick={() => handleCards(document.key, index)}
              />
            </div>
          ))}
        </main>
      </section>
    </Container>
  );
};

export default Progress;
