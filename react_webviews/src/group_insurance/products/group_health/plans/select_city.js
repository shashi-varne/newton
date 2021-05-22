import React, { Component } from 'react';
import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import Autosuggests from '../../../../common/ui/Autosuggest';
import { FormControl } from 'material-ui/Form';
import { initialize, checkCity, getPlanList } from '../common_data';
import { isEmpty, compareObjects } from '../../../../utils/validators';
class GroupHealthPlanSelectCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            city: '',
            suggestions: [],
            suggestions_list: [],
            errors: [],
            fields: [],
            screen_name: 'select_city'
        }
        this.initialize = initialize.bind(this);
        this.checkCity = checkCity.bind(this);
        this.getPlanList = getPlanList.bind(this);
    }
    componentWillMount() {
        this.initialize();
    }
    
    
    async componentDidMount() {
        this.onload();
    }

    onload = ()=>{
        var groupHealthPlanData = this.state.groupHealthPlanData;
        var resultData = groupHealthPlanData[this.state.screen_name];
        var city = resultData.city;
        var suggestions_list = resultData.suggestions_list;
        this.setState({
            suggestions_list, city
        },()=>{
            this.checkCity(city, false, suggestions_list)
        })
        
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }
    handleClick = () => {
        this.sendEvents('next');
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData['select_city']['city'] = this.state.city;
        groupHealthPlanData.city = this.state.city;
        groupHealthPlanData.post_body.city = this.state.city;
        var current_state = this.state.current_state || {};
        current_state['city'] = this.state.city; 

        this.setLocalProviderData(groupHealthPlanData);

        // eslint-disable-next-line
        var current_state = {}
        var keys_to_add = ['account_type', 'city']
        for(var x of keys_to_add){
            current_state[x] = groupHealthPlanData.post_body[x]
        }
        for(var y in groupHealthPlanData.post_body.member_details){
            current_state[`${y}`] = groupHealthPlanData.post_body.member_details[y]['dob'];
        }

        var previousData = groupHealthPlanData.list_previous_data || {};
        var sameData = compareObjects(Object.keys(current_state), current_state, previousData)
        this.setState({
            current_state
        }, ()=>{
            if(!sameData || isEmpty(groupHealthPlanData.plan_list)){
                this.checkCity(this.state.city, true, this.state.suggestions_list);
            }else{
                this.navigate('plan-list')
            }
        })
    }
    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'city of residence',
                'is_city_entered': this.state.city ? 'valid' : 'empty'
            }
        };
        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }
    handleChange = name => value => {
        this.setState({
            [name]: (value || '').toUpperCase(),
            [name + '_error']: ''
        });
    };
    render() {
        
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                skelton={this.state.skelton}
                showError={this.state.showError}
                showLoader={this.state.show_loader}
                errorData={this.state.errorData}
                title="Where do you live?"
                fullWidthButton={true}
                buttonTitle="CONTINUE"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >
                <FormControl fullWidth>
                    <div className="InputField">
                    {this.state.suggestions_list.length > 0 &&
                     <Autosuggests
                        parent={this}
                        width="40"
                        placeholder="Search for city"
                        options={this.state.suggestions_list}
                        label="City"
                        id="city"
                        name="city"
                        error={(this.state.city_error) ? true : false}
                        helperText={this.state.city_error || 'Premium depends on city of residence'}
                        value={this.state.city}
                        onChange={this.handleChange('city')} />
                    }
                    </div>
                </FormControl>
                <BottomInfo baseData={{ 'content': 'Get cashless treatment at 10000+ cities' }} />
            </Container>
        );
    }
}
export default GroupHealthPlanSelectCity;