import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { navigate as navigateFunc } from "utils/functions";
import { EVENT_MANAGER_CONSTANTS } from "../../utils/constants";
import eventManager from "../../utils/eventManager";

const RedirectPathContainer = (props) => {
  const [redirectPath, setRedirectPath] = useState(false);
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    eventManager.add(EVENT_MANAGER_CONSTANTS.redirectPath, handleRedirectPath);
  }, []);

  const handleRedirectPath = (path) => {
    setRedirectPath(path);
  };

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
      setRedirectPath(false);
    }
  }, [redirectPath]);

  return <div></div>;
};

export default withRouter(RedirectPathContainer);
