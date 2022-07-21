import React from "react";
import "./index.css";
import ThemeWrapper from "./theme/ThemeWrapper";

function ComponentTest() {
  return (
    <ThemeWrapper>
      <div
        style={{
          padding: 20,
          width: "100%",
          height: "100%",
          background: "white",
        }}
      ></div>
    </ThemeWrapper>
  );
}

export default ComponentTest;
