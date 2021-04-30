import React, { Component } from "react";
import Container from "../../common/Container";
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
      skelton: "g"
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
        skelton: true
      });

      let amount = storageService().get('npsAmount')
      const data = await this.get_recommended_funds(amount);

      data.pension_houses.map((el, index) => {
        if (el.name  === data.recommended[0].pension_house.name) {
          data.pension_houses.splice(index, 1);
          data.pension_houses.splice(0, 0, el)
        }
        return el;
      });

      const npsCurrent = storageService().getObject("nps-current") || {};

      let selectedIndex = 0;
      data.pension_houses.forEach((element, index) => {
        if(element.pension_house_id === npsCurrent.pension_house_id) {
          selectedIndex = index;
          return;
        }
      })

      this.setState({
        recommended: data.recommended[0].pension_house,
        pension_houses: data.pension_houses,
        show_loader: false,
        selectedValue: selectedIndex,
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
        fullWidthButton
        title="Replace Fund"
        skelton={this.state.skelton}
        showLoader={this.state.show_loader}
        buttonTitle="APPLY"
        handleClick={() => this.handleClick()}
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
