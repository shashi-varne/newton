import React, { Component } from 'react'
import Container from '../../../common/Container';
import { initialize, updateBottomPremium } from '../common_data';
import Checkbox from '../../../../common/ui/Checkbox';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class GroupHealthPlanGoodHealthDeclaration extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonDisabled: true,
            checked: false,            
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }
    componentWillMount(){
        this.initialize();
    }

    componentDidMount(){
        var groupHealthPlanData = this.state.groupHealthPlanData;
        
        var checked = groupHealthPlanData['goodhealthDec'] || false;
        var buttonDisabled = checked ? false : true;
        this.setState({checked,buttonDisabled})
        this.setLocalProviderData(groupHealthPlanData);
    }

    
    handleCheckbox = () =>{
        var buttonDisabled = this.state.buttonDisabled;
        var checked = !this.state.checked;
        buttonDisabled = checked ? false : true 

        this.setState({
            checked : checked,
            buttonDisabled: buttonDisabled
        });
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }
    
    handleClick = () =>{
        if(this.state.buttonDisabled){
            return;
        }
        this.sendEvents('next');
        
        var groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData['goodhealthDec'] = true;
        this.setLocalProviderData(groupHealthPlanData);

        this.navigate('plan-premium-summary')
    }
    sendEvents(user_action) {

        let eventObj  = {}
            eventObj = {
                "event_name": 'health_insurance',
                "properties": {
                    "user_action": user_action,
                    "product": 'care_plus',
                    "flow": this.state.insured_account_type, 
                    "screen_name": 'health declaration',
                    "medical_condition": !this.state.checked ? 'yes' : 'no'
                }
            };
            
        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    render() {
        return (
            <Container
            events={this.sendEvents('just_set_events')}
            // showLoader={this.state.show_loader}
            title="Good health declaration"
            fullWidthButton={true}
            buttonTitle="CONTINUE"
            onlyButton={true}
            handleClick={() => this.handleClick()}
            buttonDisabled={this.state.buttonDisabled}
          >
            <div>
            <div className="common-top-page-subtitle flex-between-center">
            This is key to avoid rejection of claims later
            </div>
            
                <div className="declaration-container">
                <Checkbox
                      defaultChecked
                      checked={this.state.checked}
                      color="default"
                      value="checked"
                      name="checked"
                      handleChange={this.handleCheckbox}
                      className="Checkbox"
                  />
                  <p>I hereby declare that all proposed members are in good health and entirely free from any mental ailments or physical impairments/deformities, diseases/conditions. Neither any of the proposed members have been hospitalised for treatment of an illness or injury in the past nor consulted any physician or conducted an investigation for reasons other than a common cough, cold or flu. None of the proposed members is a habitual consumer of alcohol, tobacco, gutka or any recreational drugs.</p>
                </div>
            </div>
          </Container>

        )
    }
}

export default GroupHealthPlanGoodHealthDeclaration;
