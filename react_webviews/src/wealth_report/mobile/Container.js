import React, { Component } from "react";
import "./Style.scss";
import Button from "material-ui/Button";
import EmailListMobile from "../mini-components/EmailListMobile";
// import UserAccountMobile from "../mini-components/UserAccountMobile";
// import FilterMobile from "../mini-components/FIlterMobile";
// import SelectedMember from "../mini-components/SelectMembersMobile";
import { withRouter } from "react-router";
import CloseIcon from "@material-ui/icons/Close";
import Icon from "@material-ui/core/Icon";

class Popups extends Component {
  state = {
    open: false,
    bottom: false,
  };

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  toggleDrawer = (open) => () => {
    this.setState({
      bottom: open,
    });
  };

  render() {
    const dialog4 = (
      <div className="wr-estd-tax">
        <div className="head">Estimated Tax</div>
        <div className="content">
          Disclaimer: Calculation is solely based on the statement provided by
          you.
        </div>
      </div>
    );

    return (
      <div className={`ContainerWrapper`}>
        <div className={`Container ${this.props.classOverRideContainer}`}>
          <Button onClick={this.handleOpen}>Logout</Button>
          <Button onClick={this.toggleDrawer(true)}>open drawer</Button>
          <EmailListMobile
            open={this.state.open}
            onClose={this.handleClose}
            bottom={this.state.bottom}
            close={this.toggleDrawer(false)}
          />
          {/* <FilterMobile open={this.state.open} onClose={this.handleClose} /> */}
          {/* <Button
            onClick={this.handleOpen}
            variant="fab"
            style={{
              backgroundColor: "var(--primary",
              color: "white",
              position: "fixed",
              right: "28px",
              bottom: "28px",
              zIndex: 1000000,
            }}
          >
            <CloseIcon />
            <img src={require("assets/fisdom/ic-mob-filter.svg")} alt="" />
          </Button> */}
        </div>
      </div>
    );
  }
}

export default withRouter(Popups);
