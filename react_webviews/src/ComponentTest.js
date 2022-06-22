import React from "react";
import ThemeWrapper from "./theme/ThemeWrapper";

function ComponentTest() {
  const onChange = (val) => {
    console.log(val);
  };
  return (
    <ThemeWrapper>
      <div
        style={{ padding: 20, backgroundColor: "#DFDFDF", height: "100%" }}
      ></div>
    </ThemeWrapper>
  );
}

export default ComponentTest;
