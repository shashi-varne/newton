import React from 'react';
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

export default function ErrorCard(props) {
  const {
    templateSvgPath = '', // image path for image-text template
    templateText = '', // text for image-text template
  } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "300px",
        height: "60vh", //TODO: Double-check this value
        clear: "right",
      }}>
      {templateSvgPath && <img src={require(`assets/${templateSvgPath}.svg`)} alt="error" />}
      <div
        style={{
          fontSize: isMobileView ? '18px' : '22px',
          marginTop: '45px',
          textAlign: 'center',
          maxWidth: isMobileView ? '280px' : '600px'
        }}>
        {templateText || "Sorry! No results found."}
      </div>
    </div>
  );
};