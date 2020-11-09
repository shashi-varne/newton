import React, { Component } from "react";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";
import arrow from "assets/next_arrow.png";
import right_arrow from "assets/right_arrow.svg";
import left_arrow from "assets/left_arrow.svg";
import download from "assets/download.svg";
import SVG from "react-inlinesvg";
import "./style.scss";
import { getConfig } from "utils/functions";

class CustomButton extends Component {
  render() {
    const props = this.props;
    const { button: buttonClass, arrowButton, ...classes } =
      props.classes || {};
    if (props.twoButton) {
      return (
        <div className="FlexButton">
          <Button
            onClick={props.handleClickOne}
            fullWidth={false}
            variant="raised"
            size="large"
            className={`${buttonClass} borderButton`}
            style={{
              color: getConfig().secondary,
              borderColor: getConfig().secondary,
              flex: !getConfig().isMobileDevice ? "inherit" : 2,
            }}
            disabled={props.disable}
          >
            <SVG
              preProcessor={(code) =>
                code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
              }
              src={download}
            />
            {props.buttonOneTitle}
          </Button>
          <Button
            onClick={props.handleClickTwo}
            fullWidth={false}
            variant="raised"
            size="large"
            color="secondary"
            className={`${buttonClass} filledButton`}
            disabled={props.disable}
          >
            {props.buttonTwoTitle}
          </Button>
        </div>
      );
    } else if (props.leftRightCta) {
      return (
        <div style={{ display: "flex", width: "100%", ...props.style }}>
          {!this.props.no_previous_button && (
            <Button
              onClick={() => this.props.history.goBack()}
              fullWidth={false}
              variant="outlined"
              // size="large"
              color="secondary"
              className={arrowButton}
              disabled={props.disable}
              style={{ marginRight: "10px" }}
            >
              <SVG
                preProcessor={(code) =>
                  code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
                }
                src={left_arrow}
              />
            </Button>
          )}
          <Button
            onClick={props.handleClickTwo}
            fullWidth={false}
            variant="raised"
            // size="large"
            color="secondary"
            className={`${buttonClass} filledButton`}
            disabled={props.disable}
          >
            {props.buttonTitle}
          </Button>
          {!this.props.no_next_button && (
            <Button
              onClick={props.handleClickTwo}
              fullWidth={false}
              variant="outlined"
              // size="large"
              color="secondary"
              className={arrowButton}
              disabled={props.disable}
              style={{ marginLeft: "10px" }}
            >
              <SVG
                preProcessor={(code) =>
                  code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
                }
                src={right_arrow}
              />
            </Button>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <Button
            fullWidth={props.reset || props.type === "summary" ? true : false}
            variant="raised"
            size="large"
            color="secondary"
            style={{ backgroundColor: getConfig().secondary, color: "white" }}
            className={buttonClass}
            classes={classes}
            disabled={props.disable}
          >
            {props.buttonTitle}
            {props.arrow && (
              <img
                alt=""
                src={arrow}
                width={20}
                className="FooterButtonArrow"
              />
            )}
          </Button>
        </div>
      );
    }
  }
}

const styles = {
  button: {
    padding: !getConfig().isMobileDevice
      ? "12px 15px 12px 15px !important"
      : "16px 0px !important",
    borderRadius: 6,
    textTransform: "capitalize",
    fontSize: "16px !important",
    boxShadow: "none",
    // boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
    width: !getConfig().isMobileDevice ? "auto" : "100% !important",
  },
  label: {},
  arrowButton: {
    padding: "15px 12px !important",
    borderRadius: 6,
    textTransform: "capitalize",
    border: "2px solid var(--secondary)",
    // backgroundColor: "#fff",
    boxShadow: "none",
    minWidth: "60px"
  },
};

export default withStyles(styles)(CustomButton);
