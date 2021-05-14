import './RiskIntroContent.scss';
import React from 'react';
import { getConfig } from "utils/functions";

const platform = getConfig().productName;
const BENEFITS_LIST = [
  {
    key: "Benefit_1",
    description: "You'll be able to better understand your risk appetite",
    icon: "ic_risk_analyse",
  },
  {
    key: "Benefit_2",
    description: "We'll be able to give you personalised recommendations",
    icon: "ic_intelligent_pf",
  },
  {
    key: "Benefit_3",
    description: "You'll know which asset allocation works best for you",
    icon: "ic_diverse_pf",
  },
];

const RiskIntroContent = () => {
  return (
    <div className="risk_profiler-intro">
      <h1 className="risk_profiler-intro-heading">What is Risk Profile</h1>
      <img
        src={require(`assets/${platform}/rp_intro_banner.svg`)}
        alt=""
        className="risk_profiler-intro-image"
      />
      <p className="risk_profiler-intro-des">
        Risk Profile is an indication of your willingness and ability to
        take on risk in your investments.
          </p>
      <div className="risk_profiler-benefit-outer">
        <h1 className="risk_profiler-benefit-heading">
          How does it help you?
            </h1>
        <div style={{ margin: "17.9px 0 0 0" }}>
          {BENEFITS_LIST.map((benefit, idx) => (
            <RenderBenefit data={benefit} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RiskIntroContent;

const RenderBenefit = ({ data }) => {
  return (
    <div className="risk_profiler-benefitList">
      <img
        src={require(`assets/${platform}/${data.icon}.svg`)}
        alt=""
        className="risk_profiler-benefitList-img"
      />
      <p className="risk_profiler-benefitList-des">{data.description}</p>
    </div>
  );
}