import React, { useState } from "react";
import WrapperBox from "./designSystem/atoms/WrapperBox/WrapperBox";
import PfFeatureCard from "./designSystem/feature/portfolio/PfFeatureCard/PfFeatureCard";
import PfFundSelectionCard from "./designSystem/feature/portfolio/PfFundSelectionCard";
import PfProgressCard from "./designSystem/feature/portfolio/PfProgressCard";
import ThemeWrapper from "./theme/ThemeWrapper";

function ComponentTest() {
  const [checked, setChecked] = useState(null);
  const fun = () => {
    setChecked(!checked);
  };
  return (
    <ThemeWrapper>
      <div
        style={{
          padding: 20,
          width: "100%",
          height: "100%",
          background: "#DFDFDF",
        }}
      >
        {/* <WrapperBox elevation={1}> */}

        <PfFundSelectionCard
          leftImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
          rightImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
          middleImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
          bottomImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
          label={"label"}
          checked={checked}
          onClick={fun}
          topTitle={"Main title"}
          topLabel={"Top Label"}
          leftTitle={" Title"}
          leftSubtitle={"subtitle"}
          middleTitle={" Title"}
          middleSubtitle={"subtitle"}
          rightTitle={"Title"}
          rightSubtitle={"Subtitle"}
          bottomTitle={"Info"}
          bottomSubtitle={"Fucked"}
          bottomLabel={"WHAT"}
        />
        {/* <PfProgressCard
          topImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
          bottomImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
          title={"Title placeholder"}
          subtitle={"Subtitle"}
          leftTitle={"Title 1"}
          leftSubtitle={"Subtitle 1"}
          rightTitle={"Title 2"}
          rightSubtitle={"Subtitle 2"}
          label={"Label"}
          textLabel={"Text Label"}
          buttonText={"FIX"}
          onClick={fun}
        /> */}
        {/* <PfFeatureCard
          title={"Title Placeholder"}
          topImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
          leftTitle={"Title 1"}
          leftSubtitle={"Subtitle 1"}
          rightTitle={"Title 2"}
          rightSubtitle={"Subtitle 2"}
          middleTitle={"Title 3"}
          middleSubtitle={"Subtitle 3"}
          leftIcon={require("assets/ec_info.svg")}
          middleIcon={require("assets/ec_info.svg")}
          rightIcon={require("assets/ec_info.svg")}
          onClick={() => console.log("card")}
          onIconClick={() => console.log("icon")}
        /> */}
        {/* </WrapperBox> */}
      </div>
    </ThemeWrapper>
  );
}

export default ComponentTest;
