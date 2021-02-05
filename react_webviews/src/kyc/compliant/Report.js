import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { reportCardDetails } from "../constants";
import ContactUs from "../mini_components/ContactUs";

const CompliantReport = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [isCompliant, setIsCompliant] = useState(true);
  const [is_nri, setIsNri] = useState(false);
  const [cardDetails, setCardDetails] = useState([]);

  const handleClick = () => {};

  const handleTiles = (index, key) => {
    if (key === "docs") {
      // navigate to kyc/upload/progress
      return;
    }
    if (openIndex === index) setOpenIndex(-1);
    else setOpenIndex(index);
  };

  useEffect(() => {
    if (isCompliant) {
      if (is_nri) {
        reportCardDetails.splice(4, 1); //remove docs
        setCardDetails(reportCardDetails);
      } else {
        reportCardDetails.splice(1, 1); //remove address
        reportCardDetails.splice(3, 1); //remove docs
        setCardDetails(reportCardDetails);
      }
    }
  }, []);

  const personalDetails = () => {
    return (
      <>
        <div className="unzipped-title">ALEKHYA</div>
        <div className="unzipped-box">
          <div className="title">Email</div>
          <div className="subtitle">alekhyatest68@yopmail.com</div>
        </div>
        <div className="unzipped-box">
          <div className="title">Dob</div>
          <div className="subtitle">11/12/2000</div>
        </div>
        <div className="unzipped-box">
          <div className="title">Mobile</div>
          <div className="subtitle">8686227321</div>
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
              18-8-274/A, laxminagar, Warangal, Telangana, 506002
            </div>
          </div>
        )}
      </>
    );
  };

  const nomineeDetails = () => {
    return (
      <>
        <div className="unzipped-title">ALEKHYA</div>
        <div className="row-align">
          <div className="unzipped-box">
            <div className="title">Relationship</div>
            <div className="subtitle">FATHER</div>
          </div>

          <div className="unzipped-box">
            <div className="title">Dob</div>
            <div className="subtitle">11/12/2000</div>
          </div>
        </div>
      </>
    );
  };

  const bankDetails = () => {
    return (
      <>
        <div className="unzipped-title">ALEKHYA</div>
        <div className="unzipped-box">
          <div className="title">A/C number</div>
          <div className="subtitle">FATHER</div>
        </div>
        <div className="unzipped-box">
          <div className="title">IFSC</div>
          <div className="subtitle">11/12/2000</div>
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
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-home"
      isApiRunning={isApiRunning}
      noFooter={true}
    >
      <div className="kyc-report">
        <div className="kyc-main-title">KYC details</div>
        <main>
          <section>
            {cardDetails.map((item, index) => {
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

export default CompliantReport;
