import React from "react";
import Container from "../common/Container";
import UploadCard from "./UploadCard";
import { getDocuments } from "../services";
import { isEmpty } from "utils/validators";
import { getPathname } from "../constants";
import { navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import "./commonStyles.scss";

const Progress = (props) => {
  const {kyc, isLoading} = useUserKycHook();
  const disableNext = props.location.state?.disableNext || false;
  const navigate = navigateFunc.bind(props);

  let documents = [];
  let totalDocs = 0;
  let canGoNext = false;

  if (!isEmpty(kyc) && !isLoading) {
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
      bank: `/kyc/${
        kyc.kyc_status === "compliant" ? "compliant" : "non-compliant"
      }/bank-details`,
      sign: getPathname.uploadSign,
    };

    navigate(stateMapper[key]);
  };

  const goBack = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/kyc/journey')
  }

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      noFooter={disableNext}
      disable={!canGoNext}
      classOverRideContainer="pr-container"
      skelton={isLoading}
      skeltonType="p"
      handleClick={() => {
        navigate(getPathname.journey);
      }}
      title="Upload documents"
      headerData={{goBack}}
    >
      <section id="kyc-upload-progress">
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
