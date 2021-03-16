import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { Imgc } from "common/ui/Imgc";
import { getConfig } from "utils/functions";
import {
  getPathname,
  kycDocNameMapper,
  reportCardDetails,
  storageConstants,
} from "../constants";
import ContactUs from "../mini_components/ContactUs";
import { navigate as navigateFunc } from "../common/functions";
import { storageService, isEmpty } from "../../utils/validators";
import { SkeltonRect } from "../../common/ui/Skelton";
import { nativeCallback } from "utils/native_callback";
import useUserKycHook from "../common/hooks/userKycHook";

const Report = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);
  const [cardDetails, setCardDetails] = useState([]);
  const [openIndex, setOpenIndex] = useState(-1);
  const [isCompliant, setIsCompliant] = useState();
  const [is_nri, setIsNri] = useState();
  const [topTitle, setTopTitle] = useState("KYC status");
  const [appText, setAppText] = useState("Your application is submitted.");
  const [buttonTitle, setButtonTitle] = useState("OK");
  const [addressProof, setAddressProof] = useState({});

  const handleTiles = (index, key) => {
    if (key === "docs") {
      navigate(getPathname.uploadProgress, {
        state: {
          disableNext: true,
          fromState: "kyc-report",
          toState: "landing",
        },
      });
      return;
    }
    if (openIndex === index) setOpenIndex(-1);
    else setOpenIndex(index);
  };

  const [kyc, user] = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const initialize = () => {
    let is_compliant = kyc.kyc_status === "compliant" ? true : false;
    setIsCompliant(is_compliant);
    if (
      is_compliant &&
      user.active_investment &&
      user.kyc_registration_v2 !== "submitted"
    ) {
      setTopTitle("Investment status");
    }

    let address_proof = "";
    let address_proof_nri = "";
    const isNri = kyc.address.meta_data.is_nri;
    if (isNri) {
      address_proof = "Passport";
      address_proof_nri = kycDocNameMapper[kyc.address_doc_type];
    } else {
      address_proof = kycDocNameMapper[kyc.address_doc_type];
    }

    setAddressProof({
      address_proof,
      address_proof_nri,
    });

    if (is_compliant) {
      setButtonTitle("Invest Now");
      setAppText(
        "Your application is submitted. After BSE (Bombay stock exchange) verification, you can see your investment growth in Portfolio."
      );
    }

    let reportCards = [...reportCardDetails];
    setIsNri(isNri);
    if (is_compliant) {
      if (isNri) {
        reportCards.splice(4, 1); //remove docs
      } else {
        reportCards.splice(1, 1); //remove address
        reportCards.splice(3, 1); //remove docs
      }
    }
    if (kyc.nomination.nominee_optional) {
      if (is_compliant && !isNri) {
        reportCards.splice(1, 1);
      } else {
        reportCards.splice(2, 1);
      }
    }
    if (
      is_compliant &&
      user.active_investment &&
      user.kyc_registration_v2 !== "submitted"
    ) {
      setTopTitle("Investment status");
    }
    setCardDetails(reportCards);
  };

  const handleClick = () => {
    if (isCompliant) {
      proceed();
    } else {
      checkNPSAndProceed();
    }
  };

  const proceed = () => {
    if (getConfig().Web) {
      navigate(getPathname.invest);
    } else {
      if (storageService().get(storageConstants.NATIVE)) {
        nativeCallback({ action: "exit" });
      } else {
        navigate(getPathname.landing);
      }
    }
  };

  const checkNPSAndProceed = () => {
    if (user.nps_investment) {
      if (!getConfig().isIframe) {
        navigate(getPathname.reports);
      }
    } else {
      if (getConfig().Web) {
        navigate(getPathname.invest);
      } else {
        if (storageService().get(storageConstants.NATIVE)) {
          nativeCallback({ action: "exit" });
        } else {
          navigate(getPathname.landing);
        }
      }
    }
  };

  const personalDetails = () => {
    return (
      <>
        <div className="unzipped-title">{kyc.pan.meta_data.name}</div>
        {isCompliant && (
          <div className="unzipped-box">
            <div className="title">Email</div>
            <div className="subtitle">{kyc.identification.meta_data.email}</div>
          </div>
        )}
        <div className="row-align">
          {!isCompliant && (
            <div className="unzipped-box">
              <div className="title">Gender</div>
              <div className="subtitle">
                {kyc.identification.meta_data.gender}
              </div>
            </div>
          )}
          <div className="unzipped-box">
            <div className="title">Dob</div>
            <div className="subtitle">{kyc.pan.meta_data.dob}</div>
          </div>
        </div>
        {!isCompliant && (
          <>
            <div className="unzipped-box">
              <div className="title">Marital Status</div>
              <div className="subtitle">
                {kyc.identification.meta_data.marital_status}
              </div>
            </div>
            <div className="unzipped-box">
              <div className="title">Father’s name</div>
              <div className="subtitle">{kyc.pan.meta_data.father_name}</div>
            </div>
            <div className="unzipped-box">
              <div className="title">Mother’s name</div>
              <div className="subtitle">{kyc.pan.meta_data.mother_name}</div>
            </div>
          </>
        )}
        {isCompliant && (
          <div className="unzipped-box">
            <div className="title">Mobile</div>
            <div className="subtitle">
              {kyc.identification.meta_data.mobile_number}
            </div>
          </div>
        )}
      </>
    );
  };

  const addressDetails = () => {
    return (
      <>
        {!isCompliant && (
          <>
            <div className="unzipped-box">
              <div className="title">
                {is_nri && <span>Indian </span>} Address as per{" "}
                {addressProof.address_proof}
              </div>
              <div className="subtitle">
                {kyc.address.meta_data.addressline},{kyc.address.meta_data.city}
                ,{kyc.address.meta_data.state},{kyc.address.meta_data.country},
                {kyc.address.meta_data.pincode}
              </div>
            </div>
            {is_nri && (
              <div className="unzipped-box">
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
          <div className="unzipped-box">
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
        <div className="unzipped-title">{kyc.nomination.meta_data.name}</div>
        <div className="row-align">
          <div className="unzipped-box">
            <div className="title">Relationship</div>
            <div className="subtitle">
              {kyc.nomination.meta_data.relationship}
            </div>
          </div>

          <div className="unzipped-box">
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
        <div className="unzipped-title">{kyc.bank.meta_data.bank_name}</div>
        <div className="unzipped-box">
          <div className="title">A/C number</div>
          <div className="subtitle">{kyc.bank.meta_data.account_number}</div>
        </div>
        <div className="unzipped-box">
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

  return (
    <Container
      hideInPageTitle
      id="kyc-home"
      buttonTitle={buttonTitle}
      handleClick={handleClick}
    >
      <div className="kyc-report">
        <div className="kyc-main-title">{topTitle}</div>
        <main>
          <Imgc
            src={require(`assets/${productName}/congratulations_illustration.svg`)}
            alt="img"
            className="img"
          />
          <div className="congrats">Congratulations!</div>
          <div className="text">{appText}</div>
          <div className="text message">
            <img src={require(`assets/eta_icon.svg`)} alt="" />
            Approves in one working day
          </div>
          <section>
            {isEmpty(cardDetails) && (
              <>
                <SkeltonRect className="report-skelton" />
                <SkeltonRect className="report-skelton" />
                <SkeltonRect className="report-skelton" />
                <SkeltonRect className="report-skelton" />
              </>
            )}
            {cardDetails &&
              cardDetails.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="tile-info"
                    onClick={() => handleTiles(index, item.key)}
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
                      <div className="unzipped">{renderCards(item.key)}</div>
                    )}
                  </div>
                );
              })}
          </section>
        </main>
        <ContactUs />
      </div>
    </Container>
  );
};

export default Report;
