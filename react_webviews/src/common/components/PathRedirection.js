import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { navigate as navigateFunc } from "utils/functions";
import eventManager from "../../utils/eventManager";

const PathRedirection = (props) => {
  const [redirectPath, setRedirectPath] = useState(false);
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    eventManager.add("redirectPath", handleRedirectPath);
  }, []);

  const handleRedirectPath = (path) => {
    setRedirectPath(path);
  };

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
      eventManager.emit("redirectPath", false);
    }
  }, [redirectPath]);

  return <div></div>;
};

export default withRouter(PathRedirection);
