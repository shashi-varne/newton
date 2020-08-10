import React, { Component } from "react";
import HoldingCard from "../mini-components/HoldingCard";
import Filter from "../mini-components/Filter";
import FilterMobile from "../mini-components/FilterMobile";

import CloseIcon from "@material-ui/icons/Close";
import Button from "material-ui/Button";

export default class Holdings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div className="wr-holdings">
        {window.innerWidth > 812 && <Filter />}
        <FilterMobile open={this.state.open} onClose={this.handleClose} onClick={this.handleClose} />
        <HoldingCard />
        <Button
          variant="fab"
          style={{
            display: window.innerWidth > 812 ? "none" : "",
          }}
          className='wr-fab-btn'
          onClick={this.handleClick}
          disableRipple
          disableFocusRipple
        >
          {this.state.open ? (
            <CloseIcon />
          ) : (
            <img src={require("assets/fisdom/ic-mob-filter.svg")} alt="" />
          )}
        </Button>

      </div>
    );
  }
}
