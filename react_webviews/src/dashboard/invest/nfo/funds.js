import React, { Component } from "react";
import Container from "../../../fund_details/common/Container";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";

class NfoFunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_funds",
      nfoFunds: [
        {
          friendly_name: "Aditya Birla Sun Life Asset Allocator Fof",
          amc_logo_small:
            "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/aditya_birla_new.png",
          scheme_option: "open_ended",
          tax_plan: "debt",
          start_date: "24/03/2020",
          end_date: "22/04/2020",
        },
        {
          friendly_name: "Aditya Birla Sun Life Asset Allocator Fof",
          amc_logo_small:
            "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/aditya_birla_new.png",
          scheme_option: "open_ended",
          tax_plan: "debt",
          start_date: "24/03/2020",
          end_date: "22/04/2020",
        },
      ],
    };
  }

  handleClick = () => {};

  getSchemeOption = (text) => {
    if (text == null) {
      return null;
    } else {
      return text.split("_").join(" ");
    }
  };

  render() {
    let { nfoFunds } = this.state;
    return (
      <Container showLoader={this.state.show_loader} noFooter={true}>
        <div className="nfo-funds">
          {!nfoFunds && (
            <div className="message">
              We are sorry ! There are no funds that match your requirements.
            </div>
          )}
          {nfoFunds &&
            nfoFunds.map((data, index) => {
              return (
                <div key={index} className="content">
                  <div className="card icon">
                    <img alt="" src={data.amc_logo_small} />
                  </div>
                  <div className="text">
                    <div className="title">{data.friendly_name}</div>
                    <div className="item">
                      <div className="sub-item">
                        <p>Type: {this.getSchemeOption(data.scheme_option)}</p>
                        <p>Category: {data.tax_plan}</p>
                      </div>
                      <div className="invest">
                        <Button>INVEST</Button>
                      </div>
                    </div>
                    <div className="date">
                      from {data.start_date} - to {data.end_date}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    );
  }
}

export default NfoFunds;
