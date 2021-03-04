import React, { Component } from 'react'
import { numDifferentiationInr } from 'utils/validators';
import Container from '../../../common/Container';
import { initialize, updateBottomPremium } from '../common_data';
import ValueSelector from '../../../../common/ui/ValueSelector';
import Checkbox from '../../../../common/ui/Checkbox';

class GroupHealthPlanSelectPaymentFrequency extends Component {

    constructor(props){
        super(props);
        this.state = {
            optionsList : [{value: '10 monthly', name: 'a'},{value: '10 yearly', name: 'b'}],
            selectedIndex : 0,
            ctaWithProvider: true,
            checked: false,
            buttonDisabled: true            
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }
    componentDidMount(){
        this.initialize();
    }

    choosePlan = (index, props) => {
        var buttonDisabled = this.state.buttonDisabled;
        buttonDisabled = props.name === 'a' ? true : false;
        
        this.setState({
            selectedIndex: index,
            buttonDisabled: buttonDisabled
        }, () => {
            this.updateBottomPremium(this.state.optionsList[this.state.selectedIndex].value);
        });
    }
    
    handleCheckbox = () =>{
        var checked = this.state.checked; 
        var buttonDisabled = this.state.buttonDisabled;
        checked = !this.state.checked
        buttonDisabled = checked ? false : true 

        this.setState({
            checked : checked,
            buttonDisabled: buttonDisabled
        });
    }
    
    handleClick = () =>{
        if(this.state.buttonDisabled && !this.state.checked){
            return;
        }
        console.log('click')
    }

    render() {
        return (
            <Container
            // events={this.sendEvents("just_set_events")}
            // showLoader={this.state.show_loader}
            title="Select payment frequency"
            buttonTitle="CONTINUE"
            withProvider={true}
            buttonData={this.state.bottomButtonData}
            handleClick={() => this.handleClick()}
            buttonDisabled={this.state.buttonDisabled}
          >
            <div className="common-top-page-subtitle flex-between-center">
            Premiums can be paid either monthly or yearly
            </div>
            <div className="group-health-plan-select-sum-assured">
              <div className="generic-choose-input">
                <ValueSelector optionsList={this.state.optionsList} selectedIndex={this.state.selectedIndex} handleSelect={this.choosePlan} />
              </div>

            { this.state.buttonDisabled ? (
                <div className="disclaimer-checkbox">
                <div className="note-container">
                    <p>Note:</p>
                    <p>Monthly premiums can only be paid with a credit card</p>
                </div>
                <div className="check-box-conainer">
                <Checkbox
                      defaultChecked
                      checked={this.state.checked}
                      color="default"
                      value="checked"
                      name="checked"
                      handleChange={this.handleCheckbox}
                      className="Checkbox"
                  />
                  <p> I would like to set up auto-debit on my credit card for future premium payments</p>
                </div>
            </div>
            ) : null}
              
            </div>
          </Container>

        )
    }
}

export default GroupHealthPlanSelectPaymentFrequency;
