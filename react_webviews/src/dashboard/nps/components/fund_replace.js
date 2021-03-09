import React, { Component } from "react";
import Container from "fund_details/common/Container";
import Radio from "@material-ui/core/Radio";
import { initialize } from "../common/commonFunctions";
import { storageService } from "utils/validators";

class ReplaceFund extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pension_houses: "",
      recommended: "",
      show_loader: false,
      selectedValue: '',
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
      this.setState({
        show_loader: true,
      });

      let amount = storageService().get('npsAmount')
      const data = await this.get_recommended_funds(amount);

      data.result.pension_houses.map((el, index) => {
        if (el.name  === data.result.recommended[0].pension_house.name) {
          data.result.pension_houses.splice(index, 1);
          data.result.pension_houses.splice(0, 0, el)
        }
      })

      this.setState({
        recommended: data.result.recommended[0].pension_house,
        pension_houses: data.result.pension_houses,
        show_loader: false,
      });
      
  };

  handleChange = (index) => {
    this.setState({
      selectedValue: index,
      nps_recommended: this.state.pension_houses[index]
    });
  };

  handleClick = () => {
    
    storageService().setObject('nps-recommend', this.state.nps_recommended);
    storageService().set('nps-prevpath', 'fund-replace');
    this.navigate('recommendation/one-time')
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
                      value={this.state.selectedValue.toString() || ""}
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
