import React, { useMemo } from "react";
import { withRouter } from "react-router-dom";
import Icon from "../../atoms/Icon";
import { navigate as navigateFunc, getConfig } from "../../../utils/functions";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import "./PageNotFound.scss";

const NotFound = (props) => {
  const { productName } = useMemo(getConfig, []);
  const navigate = navigateFunc.bind(props);

  const redirectToHome = () => {
    navigate("/");
  };

  return (
    <section className="page-not-found">
      <Typography component="div" variant="heading4" className="text-center">
        Page Not Found !
      </Typography>
      <Icon
        src={require(`assets/${productName}/error_illustration.svg`)}
        alt="page not found"
        className="pnf-icon"
      />
      <Button title="HOME" onClick={redirectToHome} className="pnf-home" />
    </section>
  );
};

export default withRouter(NotFound);
