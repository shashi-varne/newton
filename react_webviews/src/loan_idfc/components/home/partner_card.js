import React, { Component } from "react";
import Button from "material-ui/Button";
import Card from "../../../common/ui/Card";
import SVG from "react-inlinesvg";
import { getConfig } from "utils/functions";

class PartnerCard extends Component {
  renderBenefits = (data, index) => {
    return (
      <div key={index} className="benefits-points">
        <div className="dot"></div>
        <div>
          <div>{data.data ? data.data : data}</div>
          {data.sub_data &&
            data.sub_data.map((element, index) => {
              return (
                <div key={index} className="sub-data">
                  {"- " + element}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  render() {
    return (
      <Card className="partner-card">
        {this.props.baseData.card_tag && this.props.baseData.displayTag && (
          <div className="card-tag">{this.props.baseData.card_tag}</div>
        )}
        <div className="flex partner">
          <div>
            <div>{this.props.baseData.title}</div>
            <div>{this.props.baseData.subtitle}</div>
          </div>
          <img
            src={require(`assets/${this.props.baseData.logo}.svg`)}
            alt={this.props.baseData.logo}
          />
        </div>
        <div className="flex">
          <div>
            <span className="sub-text">Loan upto:</span>
            {" " + this.props.baseData.loan_amount}
          </div>
          <Button
            variant="raised"
            size="large"
            autoFocus
            onClick={() =>
              this.props.handleClick(this.props.baseData.provider_name)
            }
          >
            {this.props.baseData.cta_title}
          </Button>
        </div>
        {this.props.baseData.benefits && (
          <div
            className="benefits"
            onClick={() => this.props.handleBenefits(this.props.index)}
          >
            <div className="benefits-header">
              Benefits
              <SVG
                preProcessor={(code) =>
                  code.replace(/fill=".*?"/g, "fill=" + getConfig().primary)
                }
                src={require(`assets/${
                  this.props.isSelected ? "minus_icon" : "plus_icon"
                }.svg`)}
              />
            </div>
            {this.props.isSelected && (
              <div className="benefits-content">
                {this.props.baseData.benefits.benefits_title && (
                  <div>{this.props.baseData.benefits.benefits_title}</div>
                )}
                {this.props.baseData.benefits.options.map(this.renderBenefits)}
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }
}

export default PartnerCard;
