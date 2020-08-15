import React, { Component } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{
          height:'100%',
          width:'100%',
          backgroundColor: "#ffffff",
      }}>
        <LinearProgress />
        <div
          style={{
            textAlign: "center",
            position:'fixed',
            top:'40%',
            left:'40%'
          }}
        >
          <CircularProgress className="" size={100} thickness={4} />
          <div style={{ fontSize: "24px", marginTop: "43px" }}>
            Preparing your report, please wait...
          </div>
        </div>
      </div>
    );
  }
}

export default Progress;
