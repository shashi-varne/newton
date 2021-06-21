import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import {
  PATHNAME_MAPPER,
  DOCUMENTS_MAPPER,
  REPORT_CARD_DETAILS,
} from "../constants";
import ContactUs from "../../common/components/contact_us";
import { getFlow, getGenderValue, isDigilockerFlow } from "../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import { isEmpty } from "../../utils/validators";
import { nativeCallback } from "utils/native_callback";
import useUserKycHook from "../common/hooks/userKycHook";

const Report = (props) => {
  const navigate = navigateFunc.bind(props);
  const [cardDetails, setCardDetails] = useState([]);
  const [openIndex, setOpenIndex] = useState(-1);
  const [isCompliant, setIsCompliant] = useState(false);
  const [isNri, setIsNri] = useState(false);
  const [topTitle, setTopTitle] = useState("KYC details");
  const [addressProof, setAddressProof] = useState({});
  const goBackPage = props.location.state?.goBack || "";

  const handleTiles = (index, key) => {
    if (key === "docs") {
      navigate(PATHNAME_MAPPER.uploadProgress, {
        state: {
          disableNext: true,
          fromState: "/kyc/report",
          toState: "/landing",
        },
      });
      return;
    }
    if (openIndex === index) setOpenIndex(-1);
    else setOpenIndex(index);
  };

  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) {
      initialize();
    }
  }, [kyc, user]);

  const initialize = () => {
    let compliant = kyc.kyc_status === "compliant";
    const dlFlow = isDigilockerFlow(kyc);
    setIsCompliant(compliant);
    if (
      compliant &&
      user.active_investment &&
      user.kyc_registration_v2 !== "submitted"
    ) {
      setTopTitle("Investment status");
    }

    let address_proof = "";
    let address_proof_nri = "";
    const nri = kyc.address.meta_data.is_nri;
    if (nri) {
      address_proof = "Passport";
      address_proof_nri = DOCUMENTS_MAPPER[kyc.nri_address_doc_type];
    } else {
      address_proof = DOCUMENTS_MAPPER[kyc.address_doc_type];
    }

    setAddressProof({
      address_proof,
      address_proof_nri,
    });

    let reportCards = [...REPORT_CARD_DETAILS];
    setIsNri(nri);
    if (compliant) {
      reportCards.splice(5, 1); //remove docs
    }
    if(dlFlow || (compliant && !nri)) {
      reportCards.splice(2, 1); //remove address
    }
    if (kyc.nomination.nominee_optional) {
      if ((compliant && !nri) || dlFlow) {
        reportCards.splice(2, 1);
      } else {
        reportCards.splice(3, 1);
      }
    }
    setCardDetails(reportCards);
  };

  const personalDetails = () => {
    return (
      <>
        <div className="unzipped-box" data-aid="kyc-father-name">
          <div className="title">Name</div>
          <div className="subtitle">{kyc.pan.meta_data.name}</div>
        </div>
        <div className="row-align">
          <div className="unzipped-box" data-aid="kyc-gender">
            <div className="title">Gender</div>
            <div className="subtitle">
              {getGenderValue(kyc.identification.meta_data.gender, "name")}
            </div>
          </div>
          <div className="unzipped-box" data-aid="kyc-marital-status">
            <div className="title">Marital Status</div>
            <div className="subtitle">
              {kyc.identification.meta_data.marital_status}
            </div>
          </div>
        </div>
        {!isCompliant && (
          <div className="unzipped-box" data-aid="kyc-father-name">
            <div className="title">Father’s name</div>
            <div className="subtitle">{kyc.pan.meta_data.father_name}</div>
          </div>
        )}
        <div className="unzipped-box" data-aid="kyc-mother-name">
          <div className="title">Mother’s name</div>
          <div className="subtitle">{kyc.pan.meta_data.mother_name}</div>
        </div>
      </>
    );
  };

  const addressDetails = () => {
    return (
      <>
        {!isCompliant && (
          <>
            <div className="unzipped-box" data-aid='kyc-address-proof'>
              <div className="title">
                {isNri && <span>Indian </span>} Address as per{" "}
                {addressProof.address_proof}
              </div>
              <div className="subtitle">
                {kyc.address.meta_data.addressline},{kyc.address.meta_data.city}
                ,{kyc.address.meta_data.state},{kyc.address.meta_data.country},
                {kyc.address.meta_data.pincode}
              </div>
            </div>
            {isNri && (
              <div className="unzipped-box" data-aid='kyc-address-proof-nri'>
                <div className="title">
                  Foreign Address as per {addressProof.address_proof_nri}
                </div>
                <div className="subtitle">
                  {kyc.address.meta_data.addressline},
                  {kyc.address.meta_data.city},{kyc.address.meta_data.state},
                  {kyc.address.meta_data.country},
                  {kyc.address.meta_data.pincode}
                </div>
              </div>
            )}
          </>
        )}
        {isCompliant && (
          <div className="unzipped-box" data-aid='kyc-address-proof-nri'>
            <div className="title">Foreign Address</div>
            <div className="subtitle">
              {kyc.nri_address.meta_data.addressline},
              {kyc.nri_address.meta_data.city},{kyc.nri_address.meta_data.state}
              ,{kyc.nri_address.meta_data.country},
              {kyc.nri_address.meta_data.pincode}
            </div>
          </div>
        )}
      </>
    );
  };

  const nomineeDetails = () => {
    return (
      <>
        <div className="unzipped-title" data-aid='kyc-nominee-name'>{kyc.nomination.meta_data.name}</div>
        <div className="row-align">
          <div className="unzipped-box" data-aid='kyc-relationship'>
            <div className="title">Relationship</div>
            <div className="subtitle">
              {kyc.nomination.meta_data.relationship}
            </div>
          </div>

          <div className="unzipped-box" data-aid='kyc-dob'>
            <div className="title">Dob</div>
            <div className="subtitle">{kyc.nomination.meta_data.dob}</div>
          </div>
        </div>
      </>
    );
  };

  const bankDetails = () => {
    return (
      <>
        <div className="unzipped-title" data-aid='kyc-bank-name'>{kyc.bank.meta_data.bank_name}</div>
        <div className="unzipped-box" data-aid='kyc-account-number'>
          <div className="title">A/C number</div>
          <div className="subtitle">{kyc.bank.meta_data.account_number}</div>
        </div>
        <div className="unzipped-box" data-aid='kyc-ifsc-code'>
          <div className="title">IFSC</div>
          <div className="subtitle">{kyc.bank.meta_data.ifsc_code}</div>
        </div>
      </>
    );
  };

  const professionalDetails = () => {
    return (
      <>
        <div className="unzipped-box">
          <div className="title">Occupation detail</div>
          <div className="subtitle">
            {kyc.identification.meta_data.occupation}
          </div>
        </div>
        <div className="unzipped-box">
          <div className="title">Income range</div>
          <div className="subtitle">
            {kyc.identification.meta_data.gross_annual_income}
          </div>
        </div>
      </>
    );
  };

  const renderCards = (key) => {
    switch (key) {
      case "personal":
        return personalDetails();
      case "address":
        return addressDetails();
      case "nominee":
        return nomineeDetails();
      case "bank":
        return bankDetails();
      case "professional":
        return professionalDetails();
      default:
        return <></>;
    }
  };

  const goBack = () => {
    if (goBackPage) {
      navigate(goBackPage);
    } else {
      props.history.goBack();
    }
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "kyc_done",
        "flow": getFlow(kyc) || ""
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
      id="kyc-home"
      data-aid='kyc-home-screen'
      events={sendEvents("just_set_events")}
      title={topTitle}
      headerData={{ goBack }}
      skelton={isLoading}
      noFooter
    >
      <div className="kyc-report" data-aid='kyc-report-section'>
        {cardDetails &&
          cardDetails.map((item, index) => {
            return (
              <div
                key={index}
                className="tile-info"
                onClick={() => handleTiles(index, item.key)}
                data-aid={`title-info-${item.key}`}
              >
                <div className="unzipped-title">
                  <div>{item.title}</div>
                  <img
                    alt=""
                    src={require(`assets/${
                      openIndex === index && item.key !== "docs"
                        ? "minus_icon.svg"
                        : item.click_image
                    }`)}
                  />
                </div>
                {openIndex === index && (
                  <div className="unzipped" data-aid={`items-${item.key}`}>{renderCards(item.key)}</div>
                )}
              </div>
            );
          })}
        <ContactUs />
      </div>
    </Container>
  );
};

export default Report;
