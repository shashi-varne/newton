import React, { Component } from "react";
import "../Style.scss";
import { getConfig } from "utils/functions";
import { initialize } from "../functions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      showLoader: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  render() {
    let notifications = [
      {
        title: "Welcome",
        subtitle: "have a nice day",
      },
      {
        title: "Welcome",
        subtitle: "have a nice day",
      },
      {
        title: "Welcome",
        subtitle: "have a nice day",
      },
    ];
    return (
      <div className="notification">
        <ToastContainer autoClose={3000} />
        {notifications.length === 0 && (
          <div className="message">
            <h4>You do not have any notifications.</h4>
          </div>
        )}

        {notifications.length !== 0 && (
          <div className="list">
            {notifications.map((target, index) => {
              return (
                <div key={index} className="content">
                  <div className="icon">
                    <img alt="icon" src={require(`assets/catchup.png`)} />
                  </div>
                  <div className="text">
                    <h4>{target.title}</h4>
                    <p>{target.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Notification;
