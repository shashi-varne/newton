import React, { useEffect, useState } from "react";
// import { Steps, Hints } from "intro.js-react";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import "./index.css";
import ThemeWrapper from "./theme/ThemeWrapper";

function ComponentTest() {
  console.log("in test page");
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
