import React from "react";
import { Redirect } from "react-router-dom";
import { getConfig } from "utils/functions";
import eventManager from "../../utils/eventManager";

const PathRedirection = (props) => {
  if (props.redirectPath) {
    return (
      <>
        <Redirect
          to={{
            pathname: props.redirectPath,
            search: getConfig().searchParams,
          }}
          push
        />
        {eventManager.emit("redirectPath", false)}
      </>
    );
  }
  return <div></div>;
};

export default PathRedirection;
