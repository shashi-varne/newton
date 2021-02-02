import React, { useState } from "react";
import Input from "common/ui/Input";

import Container from "../common/Container";
const Home = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  let renderData = {
    incomplete: {
      bgColor: "#fff5f6",
      icon: "error_icon.svg",
      title: "KYC is incomplete!",
      subtitle:
        "As per Govt norm. you need to do a one-time registration process to complete KYC.",
    },
    success: {
      bgColor: "#f9fff1",
      icon: "success_icon.svg",
      title: "Hey Alekhya",
      subtitle: "You’re investment ready and eligible for premium onboarding.",
    },
  };
  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-home"
      buttonTitle="CHECK STATUS"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
    >
      <div className="kyc-home">
        <div className="kyc-main-title">Are you investment ready?</div>
        <div className="kyc-main-subtitle">
          We need your PAN to check if you’re investment ready
        </div>
        <main>
          <Input label="Enter PAN" class="input" />
          <div
            className="status-info"
            style={{ backgroundColor: renderData.success.bgColor }}
          >
            <img src={require(`assets/${renderData.success.icon}`)} alt="" />
            <div className="text">
              <div className="title">{renderData.success.title}</div>
              <div>{renderData.success.subtitle}</div>
            </div>
          </div>
          <div
            className="status-info"
            style={{ backgroundColor: renderData.incomplete.bgColor }}
          >
            <img src={require(`assets/${renderData.incomplete.icon}`)} alt="" />
            <div className="text">
              <div className="title">{renderData.incomplete.title}</div>
              <div>{renderData.incomplete.subtitle}</div>
            </div>
          </div>
        </main>
      </div>
    </Container>
  );
};

export default Home;
