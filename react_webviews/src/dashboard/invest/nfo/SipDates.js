import React, { Component } from "react";
import Container from "../../../fund_details/common/Container";
import { initialize } from "../functions";
import DropdownInModal from "../../../common/ui/DropdownInModal";
import { formatAmountInr } from "utils/validators";
import Button from "material-ui/Button";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import { dateOrdinal } from "utils/validators";

class SipDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "sip_dates",
      sips: [
        {
          fundName:
            "Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Dividend Option",
          amount: 5000,
          sip_date: 1,
        },
        {
          fundName:
            "Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Dividend Option",
          amount: 5000,
          sip_date: 1,
        },
        {
          fundName:
            "Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Dividend Option",
          amount: 5000,
          sip_date: 1,
        },
      ],
      options: [
        {
          name: "1st",
          value: 1,
        },
        {
          name: "2nd",
          value: 2,
        },
        {
          name: "3rd",
          value: 3,
        },
      ],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let { sips } = this.state;
    let form_data = [];
    sips.forEach(() => {
      form_data.push(0);
    });
    this.setState({ form_data: form_data });
  };

  handleClick = () => {
    this.setState({
      openDialog: true,
    });
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  handleChange = (key) => (index) => {
    let { form_data, options, sips } = this.state;
    form_data[key] = index;
    sips[key].sip_date = options[index].value;
    this.setState({
      form_data: form_data,
      sips: sips,
    });
  };

  renderDialog = () => {
    let { sips } = this.state;
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
        className="invest-redeem-dialog"
      >
        <DialogContent className="dialog-content">
          <div className="head-bar">
            <div className="text-left">Dates confirmed</div>
            <img
              src={require(`assets/${this.state.productName}/ic_date_confirmed.svg`)}
              alt=""
            />
          </div>
          <div className="subtitle text">
            Your monthly SIP investment
            {sips.length !== 1 && <span>s</span>} date
            {sips.length !== 1 && <span>s</span>}
            <span>{sips.length === 1 ? " is " : " are "}</span>
            {sips.map((sip, index) => {
              return (
                <span key={index}>
                  {index === sips.length - 1 && index !== 0 && (
                    <span>&nbsp;and</span>
                  )}
                  <b>&nbsp;{dateOrdinal(sip.sip_date)}</b>
                  {sips.length > 1 &&
                    index !== sips.length - 1 &&
                    index !== sips.length - 2 && <span>, </span>}
                </span>
              );
            })}
            &nbsp;of every month. Automate your SIP registration with easySIP.
          </div>
        </DialogContent>
        <DialogActions className="action">
          <Button onClick={this.handleClose} className="button">
            OKAY
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    let { sips, form_data, options } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        buttonTitle="CONFIRM DATE"
      >
        <div className="sip-dates">
          <div className="main-top-title">Select investment date</div>
          {sips.map((sip, index) => {
            return (
              <div className="card content" key={index}>
                <div className="text">
                  <div className="title">{sip.fundName}</div>
                  <div className="subtitle">{formatAmountInr(sip.amount)}</div>
                </div>
                <div className="mid-content">Investment date</div>
                <DropdownInModal
                  options={options}
                  header_title="Available dates"
                  cta_title="SELECT DATE"
                  selectedIndex={form_data[index]}
                  value={dateOrdinal(sip.sip_date)}
                  id="date"
                  name="date"
                  onChange={this.handleChange(index)}
                  isAppendText="of every month"
                  class="appened-text"
                  isSelectedText="of every month"
                />
              </div>
            );
          })}
          {this.renderDialog()}
        </div>
      </Container>
    );
  }
}

export default SipDates;
