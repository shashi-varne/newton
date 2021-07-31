import React, { Fragment } from 'react';
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

const ErrorScreen = (props) => {
  const {
    useTemplate, // set this to 'true' to use the image-text template
    templateSvgPath = '', // image path for image-text template
    templateText = '', // text for image-text template
    children = '', // to show content when useTemplate is set to 'false'
  } = props;
  // Todo: Fix webpack require resoltuion issue to allow full paths to be sent for templateSvgPath
  const imageTextTemplate = (
    <Fragment>
      {templateSvgPath &&
        <img
          src={require(`assets/${templateSvgPath}.svg`)}
          alt="error"
          width={isMobileView ? '80px' : ''}
        />
      }
      <div
        style={{
          fontSize: isMobileView ? '18px' : '22px',
          marginTop: '45px'
        }}>
        {templateText || "Sorry! No results found."}
      </div>
    </Fragment>
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "300px",
      height: isMobileView ? "40vh" : "60vh",
      clear: "right",
      background: "white",
      borderRadius: "6px",
    }}>
      <div
        style={{
          fontSize: isMobileView ? '18px' : '22px',
          marginTop: isMobileView ? 0 : '45px',
          textAlign: 'center',
          maxWidth: isMobileView ? '280px' : '600px'
        }}
      >
        {useTemplate ? imageTextTemplate : children}
      </div>
    </div>
  );
};

export default ErrorScreen;