import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { REPORT_CARD_DETAILS } from "../constants";
import ContactUs from "../../common/components/contact_us";
import { SkeltonRect } from "../../common/ui/Skelton";
import useUserKycHook from "../common/hooks/userKycHook";
import { isEmpty } from "../../utils/validators";
import { nativeCallback } from "../../utils/native_callback";
import { getConfig } from "../../utils/functions";

const CompliantReport = (props) => {
  const [openIndex, setOpenIndex] = useState(-1);
  const [isCompliant] = useState(true);
  const [is_nri, setIsNri] = useState(false);
  const [cardDetails, setCardDetails] = useState([]);
  const [topTitle, setTopTitle] = useState("KYC details");
  const config = getConfig();

  const handleTiles = (index, key) => {
    if (key === "docs") {
      return;
    }
    if (openIndex === index) setOpenIndex(-1);
    else setOpenIndex(index);
  };

  const {kyc, user} = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) {
      initialize();
    }
  }, [kyc, user]);

  const initialize = async () => {
    let isNri = kyc.address.meta_data.is_nri;
    setIsNri(isNri);
    let reportCards = [...REPORT_CARD_DETAILS];
    if (isCompliant) {
      if (isNri) {
        reportCards.splice(4, 1); //remove docs
      } else {
        reportCards.splice(1, 1); //remove address
        reportCards.splice(3, 1); //remove docs
      }
    }
    if (kyc.nomination.nominee_optional) {
      if (isCompliant && !isNri) {
        reportCards.splice(1, 1);
      } else {
        reportCards.splice(2, 1);
      }
    }
    if (
      isCompliant &&
      user.active_investment &&
      user.kyc_registration_v2 !== "submitted"
    ) {
      setTopTitle("Investment status");
    }
    setCardDetails(reportCards);
  };

  const personalDetails = () => {
    return (
      <>
        <div className="unzipped-title" data-aid='kyc-personal-details-title'>{kyc.pan.meta_data.name}</div>
        <div className="unzipped-box" data-aid='kyc-email'>
          <div className="title">Email</div>
          <div className="subtitle">{kyc.identification.meta_data.email}</div>
        </div>
        <div className="unzipped-box" data-aid='kyc-eob'>
          <div className="title">Dob</div>
          <div className="subtitle">{kyc.pan.meta_data.dob}</div>
        </div>
        <div className="unzipped-box" data-aid='kyc-mobile-number'>
          <div className="title">Mobile</div>
          <div className="subtitle">
            {kyc.identification.meta_data.mobile_number}
          </div>
        </div>
      </>
    );
  };

  const addressDetails = () => {
    return (
      <>
        {is_nri && (
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
        <div className="unzipped-title" data-aid='kyc-nomination-data'>{kyc.nomination.meta_data.name}</div>
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
      default:
        return <></>;
    }
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "kyc_status",
        "flow": 'premium onboarding'
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
      noFooter={true}
      title={topTitle}
      events={sendEvents("just_set_events")}
      data-aid="kyc-reports-screen"
      iframeRightContent={require(`assets/${config.productName}/kyc_illust.svg`)}
    >
      <div className="kyc-report">
        <main data-aid='kyc-report'>
          <section data-aid='kyc-reports-screen-page'>
            {cardDetails &&
              cardDetails.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="tile-info"
                    onClick={() => handleTiles(index, item.key)}
                    data-aid={`kyc-title-info-${index+1}`}
                  >
                    <div className="unzipped-title">
                      <div data-aid={`kyc-item-title-${index+1}`}>{item.title}</div>
                      <img
                        src={require(`assets/${
                          openIndex === index && item.key !== "docs"
                            ? "minus_icon.svg"
                            : item.click_image
                        }`)}
                        alt=""
                      />
                    </div>
                    {openIndex === index && (
                      <div className="unzipped" data-aid='kyc-unzipped'>{renderCards(item.key)}</div>
                    )}
                  </div>
                );
              })}
            {isEmpty(cardDetails) && (
              <>
                <SkeltonRect className="report-skelton" />
                <SkeltonRect className="report-skelton" />
                <SkeltonRect className="report-skelton" />
              </>
            )}
          </section>
        </main>
        <ContactUs />
      </div>
    </Container>
  );
};

export default CompliantReport;
