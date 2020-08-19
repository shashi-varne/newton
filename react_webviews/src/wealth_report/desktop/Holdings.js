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
        {/* will be hidden for the mobile view visible for desktop view */}
        <Filter onFilterChange={(filterObj) => { console.log(filterObj) }}/>

        {/* will be hidden for the desktop view and visible for mobile view */}
        <FilterMobile
          open={this.state.open}
          onClose={this.handleClose}
          onClick={this.handleClose}
          onFilterChange={(filterArr) => { console.log(filterArr) }}
        />

        <HoldingCard />

      </div>
    );
  }
}
