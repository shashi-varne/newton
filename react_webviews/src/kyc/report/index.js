import React, { useState } from "react";
import Container from "../common/Container";
import { Imgc } from "common/ui/Imgc";
import { getConfig } from "utils/functions";
import { reportCardDetails } from "../constants";

const productName = getConfig().productName;
const partner = getConfig().partner;
const Report = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [isCompliant, setIsCompliant] = useState(false);
  const [is_nri, setIsNri] = useState(true);

  const handleClick = () => {};

  const handleTiles = (index, key) => {
    if (key === "docs") {
      // navigate to kyc/upload/progress
      return;
    }
    if (openIndex === index) setOpenIndex(-1);
    else setOpenIndex(index);
  };

  const personalDetails = () => {
    return (
      <>
        <div className="unzipped-title">ALEKHYA</div>
        {isCompliant && (
          <div className="unzipped-box">
            <div className="title">Email</div>
            <div className="subtitle">alekhyatest68@yopmail.com</div>
          </div>
        )}
        <div className="row-align">
          {!isCompliant && (
            <div className="unzipped-box">
              <div className="title">Gender</div>
              <div className="subtitle">FEMALE</div>
            </div>
          )}
          <div className="unzipped-box">
            <div className="title">Dob</div>
            <div className="subtitle">11/12/2000</div>
          </div>
        </div>
        {!isCompliant && (
          <>
            <div className="unzipped-box">
              <div className="title">Marital Status</div>
              <div className="subtitle">SINGLE</div>
            </div>
            <div className="unzipped-box">
              <div className="title">Father’s name</div>
              <div className="subtitle">SURYA</div>
            </div>
            <div className="unzipped-box">
              <div className="title">Mother’s name</div>
              <div className="subtitle">SAI</div>
            </div>
          </>
        )}
        {isCompliant && (
          <div className="unzipped-box">
            <div className="title">Mobile</div>
            <div className="subtitle">8686227321</div>
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
                {is_nri && <span>Indian </span>} Address as per Passport
              </div>
              <div className="subtitle">
                18-8-274/A, laxminagar, Warangal, Telangana, 506002
              </div>
            </div>
            {is_nri && (
              <div className="unzipped-box">
                <div className="title">Foreign Address as per Passport</div>
                <div className="subtitle">
                  18-8-274/A, laxminagar, Warangal, Telangana, 506002
                </div>
              </div>
            )}
          </>
        )}
        {isCompliant && (
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
      buttonTitle="OK"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-report">
        <div className="kyc-main-title">KYC status</div>
        <main>
          <Imgc
            src={require(`assets/${productName}/congratulations_illustration.svg`)}
            alt="img"
            className="img"
          />
          <div className="congrats">Congratulations!</div>
          <div className="text">Your application is submitted.</div>
          <div className="text message">
            <img src={require(`assets/eta_icon.svg`)} alt="" />
            Approves in one working day
          </div>
          <section>
            {reportCardDetails.map((item, index) => {
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
        <footer>
          For any query, reach us at
          <div className="partner-info">
            <div>{partner.mobile}</div>
            <div>|</div>
            <div>{partner.email}</div>
          </div>
        </footer>
      </div>
    </Container>
  );
};

export default Report;
