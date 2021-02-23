import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { get_recommended_funds } from "../common/api";
import toast from "common/ui/Toast";
import Radio from "@material-ui/core/Radio";
import { getUrlParams } from "utils/validators";
import { initialize } from "../common/commonFunctions";

class ReplaceFund extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pension_houses: "",
      recommended: "",
      show_loader: false,
      selectedValue: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.fetchRecommendedFunds();
  };

  fetchRecommendedFunds = async () => {
    console.log(getUrlParams())
    try {
      this.setState({
        show_loader: true,
      });

      const params = {
        type: "buildwealth",
      };
      const data = await get_recommended_funds(params);

      this.setState({
        recommended: data.recommended[0].pension_house,
        pension_houses: data.pension_houses,
        show_loader: false,
      });
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast(err);
    }
  };

  handleChange = (index) => {
    this.setState({
      selectedValue: index,
    });
  };

  handleClick = () => {
    // endpoint = api/kyc/v2/mine
  };

  render() {
    let { pension_houses, recommended } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        hideInPageTitle
        hidePageTitle
        title="Replace Fund"
        showLoader={this.state.show_loader}
        buttonTitle="APPLY"
        handleClick={() => this.handleClick()}
        classOverRideContainer="pr-container"
      >
        <section className="page invest nps">
          <div className="container-padding invest-body">
            <div className="replace-funds">
              {pension_houses &&
                pension_houses.map((element, index) => (
                  <div
                    className="md-block"
                    key={index}
                    onClick={() => this.handleChange(index)}
                  >
                    <div className="item">
                      <img src={element.image} alt="" width={50} />
                      <div className="recommended-active">
                        {element.pension_house_id ===
                          recommended.pension_house_id && (
                          <div className="recommended">
                            <em>Recommended</em>
                          </div>
                        )}
                        <div>{element.name}</div>
                      </div>
                    </div>
                    <Radio
                      checked={this.state.selectedValue === index}
                      value={this.state.selectedValue || ""}
                      name="radio-button-demo"
                      color="primary"
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default ReplaceFund;
