import React, { Component } from "react";
import { IconButton } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { isMobileDevice } from "utils/functions";
import Dialog from "common/ui/Dialog";

class PanSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown_open: false,
      selectedPan: "BXRPR87008N",
      panModal: false,
      pans: ["BXRPR87008N", "QWCTE6223N", "TRQEW2995K"],
    };
  }

  selectPan = (pan) => {
    this.setState({
      dropdown_open: false,
      selectedPan: pan,
    });
  };

  handleClick = () => {
    this.setState({
      dropdown_open: !this.state.dropdown_open,
      panModal: !this.state.panModal,
    });
  };

  handleClose = () => {
    this.setState({
      dropdown_open: false,
      panModal: false,
    });
  };

  render() {
    let { dropdown_open, pans, selectedPan } = this.state;
    let count = 1;

    return (
      <div className="wr-pan-dropdown">
        <div className="wr-header-pan-select">
          {/* visibility will be modified based on the condition in media queries */}
          <ClickAwayListener onClickAway={this.handleClose}>
            <div className="wr-pan-content">
              <img
                id="wr-pan-logo"
                src={require(`assets/fisdom/ic-added-pans.svg`)}
                alt=""
              />

              <div className="wr-pan-detail">
                <div className="wr-pan-title">Showing report for</div>
                <div className="wr-pan">{selectedPan}</div>
              </div>

              <IconButton
                classes={{ root: "wr-icon-button" }}
                color="inherit"
                aria-label="Menu"
                onClick={this.handleClick}
              >
                <img src={require(`assets/fisdom/ic-dropdown.svg`)} id="wr-ic-drop" alt="" />
                <img
                  src={require(`assets/fisdom/ic-mob-dropdown.svg`)}
                  id="wr-ic-mob-drop"
                  alt=""
                />
              </IconButton>
            </div>
          </ClickAwayListener>

          {/* visibility will be modified based on condition 'isMobileDevice()' */}
          {!isMobileDevice() && (
            <div style={{ display: dropdown_open ? "inherit" : "none" }}>
              {pans.map(
                (pan, index) =>
                  pan !== selectedPan && (
                    <div onClick={() => this.selectPan(pan)} key={index}>
                      {index !== 0 && <div className="hr"></div>}
                      <div className="wr-pan-content">
                        <img
                          id="wr-pan-logo"
                          src={require(`assets/fisdom/ic-added-pans.svg`)}
                          alt=""
                        />
                        <div className="wr-pan-detail">
                          <div className="wr-pan-title">{`PAN ${++count}`}</div>
                          <div className="wr-pan">{pan}</div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}

          {/* visibility will be modified based on condition 'isMobileDevice()' */}
          {isMobileDevice() && (
            <Dialog
              open={this.state.panModal}
              onClose={this.handleClose}
              classes={{ paper: "wr-dialog-paper" }}
            >
              {pans.map((pan, index) => (
                <div onClick={() => this.selectPan(pan)} key={index}>
                  {index !== 0 && <div className="wr-pan-hr"></div>}
                  <div className="wr-pan-select-content">
                    <img
                      id="wr-pan-logo"
                      src={require(`assets/fisdom/ic-added-pans.svg`)}
                      alt=""
                    />
                    <span className="wr-pan-detail">
                      <div className="wr-pan-title">{`PAN ${index + 1}`}</div>
                      <div className="wr-pan">{pan}</div>
                    </span>
                  </div>
                </div>
              ))}
            </Dialog>
          )}
        </div>
      </div>
    );
  }
}

export default PanSelect;
