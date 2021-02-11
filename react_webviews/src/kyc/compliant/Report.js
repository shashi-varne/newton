import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { reportCardDetails, storageConstants } from "../constants";
import ContactUs from "../mini_components/ContactUs";
import { initData } from "../services";
import { storageService, isEmpty } from "../../utils/validators";
import { SkeltonRect } from "../../common/ui/Skelton";

const CompliantReport = (props) => {
  const [openIndex, setOpenIndex] = useState(-1);
  const [isCompliant] = useState(true);
  const [is_nri, setIsNri] = useState(false);
  const [cardDetails, setCardDetails] = useState([]);
  const [userKyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject(storageConstants.USER) || {}
  );
  const [topTitle, setTopTitle] = useState("KYC details");

  const handleTiles = (index, key) => {
    if (key === "docs") {
      // navigate to kyc/upload/progress
      return;
    }
    if (openIndex === index) setOpenIndex(-1);
    else setOpenIndex(index);
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userKyc };
    let user = { ...currentUser };
    if (isEmpty(userkycDetails) || isEmpty(user)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      user = storageService().getObject(storageConstants.USER);
    }
    setUserKyc(userkycDetails);
    setCurrentUser(user);
    let isNri = userkycDetails.address.meta_data.is_nri;
    setIsNri(isNri);
    if (isCompliant) {
      if (isNri) {
        reportCardDetails.splice(4, 1); //remove docs
      } else {
        reportCardDetails.splice(1, 1); //remove address
        reportCardDetails.splice(3, 1); //remove docs
      }
    }
    if (userkycDetails.nomination.nominee_optional) {
      if (isCompliant) {
        reportCardDetails.splice(1, 1);
      } else {
        reportCardDetails.splice(2, 1);
      }
    }
    if (
      isCompliant &&
      user.active_investment &&
      user.kyc_registration_v2 !== "submitted"
    ) {
      setTopTitle("Investment status");
    }
    setCardDetails(reportCardDetails);
  };

  const personalDetails = () => {
    return (
      <>
        <div className="unzipped-title">{userKyc.pan.meta_data.name}</div>
        <div className="unzipped-box">
          <div className="title">Email</div>
          <div className="subtitle">
            {userKyc.identification.meta_data.email}
          </div>
        </div>
        <div className="unzipped-box">
          <div className="title">Dob</div>
          <div className="subtitle">{userKyc.pan.meta_data.dob}</div>
        </div>
        <div className="unzipped-box">
          <div className="title">Mobile</div>
          <div className="subtitle">
            {userKyc.identification.meta_data.mobile_number}
          </div>
        </div>
      </>
    );
  };

  const addressDetails = () => {
    return (
      <>
        {is_nri && (
          <div className="unzipped-box">
            <div className="title">Foreign Address</div>
            <div className="subtitle">
              {userKyc.nri_address.meta_data.addressline},
              {userKyc.nri_address.meta_data.city},
              {userKyc.nri_address.meta_data.state},
              {userKyc.nri_address.meta_data.country},
              {userKyc.nri_address.meta_data.pincode}
            </div>
          </div>
        )}
      </>
    );
  };

  const nomineeDetails = () => {
    return (
      <>
        <div className="unzipped-title">
          {userKyc.nomination.meta_data.name}
        </div>
        <div className="row-align">
          <div className="unzipped-box">
            <div className="title">Relationship</div>
            <div className="subtitle">
              {userKyc.nomination.meta_data.relationship}
            </div>
          </div>

          <div className="unzipped-box">
            <div className="title">Dob</div>
            <div className="subtitle">{userKyc.nomination.meta_data.dob}</div>
          </div>
        </div>
      </>
    );
  };

  const bankDetails = () => {
    return (
      <>
        <div className="unzipped-title">{userKyc.bank.meta_data.bank_name}</div>
        <div className="unzipped-box">
          <div className="title">A/C number</div>
          <div className="subtitle">
            {userKyc.bank.meta_data.account_number}
          </div>
        </div>
        <div className="unzipped-box">
          <div className="title">IFSC</div>
          <div className="subtitle">{userKyc.bank.meta_data.ifsc_code}</div>
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
    <Container hideInPageTitle id="kyc-home" noFooter={true}>
      <div className="kyc-report">
        <div className="kyc-main-title">{topTitle}</div>
        <main>
          <section>
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
                        src={require(`assets/${
                          openIndex === index && item.key !== "docs"
                            ? "minus_icon.svg"
                            : item.click_image
                        }`)}
                        alt=""
                      />
                    </div>
                    {openIndex === index && (
                      <div className="unzipped">{renderCards(item.key)}</div>
                    )}
                  </div>
                );
              })}
            {isEmpty(cardDetails) && (
              <SkeltonRect className="compliant-report-skelton" />
            )}
          </section>
        </main>
        <ContactUs />
      </div>
    </Container>
  );
};

export default CompliantReport;
