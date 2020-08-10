import React, { Component } from 'react';
import HoldingCard from '../mini-components/HoldingCard';
import Filter from '../mini-components/FIlter';

import CloseIcon from "@material-ui/icons/Close";
import Button from "material-ui/Button";

export default class Holdings extends Component {
  render() {
    return (
      <div className="wr">
        <Filter />
        <HoldingCard />
        <Button
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
          </Button>
      </div>
    );
  }
}