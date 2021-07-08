import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";

const config = getConfig();
class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: config.productName,
    };
  }

  render() {
    let {
      productName,
    } = this.state;
    return (
      <div className="login" data-aid='login'>
        <div className="header">
          <img src={require(`assets/${config.logo}`)} alt="logo" />
        </div>
        <div className="login-details">
          <div className="left-image">
            <img src={require(`assets/${productName}/ils_login.svg`)} alt="login" />
          </div>
          {/* <LoginForm /> */}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default LoginContainer;