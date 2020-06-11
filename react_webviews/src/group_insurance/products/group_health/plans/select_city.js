import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../../constants';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { storageService } from 'utils/validators';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';

import Autosuggests from '../../../../common/ui/Autosuggest';

import { FormControl } from 'material-ui/Form';
class GroupHealthPlanSelectCity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            provider: this.props.match.params.provider,
            groupHealthPlanData: storageService().getObject('groupHealthPlanData'),
            city: '',
            suggestions: [],
            suggestions_list: [],
            errors: [],
            fields: [],
            show_loader: true
        }
    }

    componentWillMount() {
        this.setState({
            providerData: health_providers[this.state.provider],
        })
    }

    async componentDidMount() {
        try {


            const res = await Api.get('/api/ins_service/api/insurance/hdfcergo/get/citylist');

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;

            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    suggestions_list: resultData.city_list
                })


            } else {
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }




    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = () => {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.city = this.state.city;
        storageService().setObject('groupHealthPlanData', groupHealthPlanData);

        this.navigate('plan-list');
    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_suraksha',
            "properties": {
                "user_action": user_action,
                "screen_name": 'insurance'
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
            [name]: value,
            [name + '_error']: ''
        });

    };


    render() {
       
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Where do you live?"
                fullWidthButton={true}
                buttonTitle="CONTINUE"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >

                <FormControl fullWidth>
                    <div className="InputField">
                    <Autosuggests
                        parent={this}
                        width="40"
                        employers={this.state.suggestions_list}
                        label="City"
                        id="city"
                        name="city"
                        error={(this.state.city_error) ? true : false}
                        helperText={this.state.city_error || 'Premium depends on city of residence'}
                        value={this.state.city}
                        onChange={this.handleChange('city')} />
                    </div>



                </FormControl>
                {/* <div className="InputField">
                    <Input
                        type="text"
                        width="40"
                        label="City"
                        id="city"
                        name="city"
                        error={(this.state.city_error) ? true : false}
                        helperText={this.state.city_error || 'Premium depends on city of residence'}
                        value={this.state.city}
                        onChange={this.handleChange()} />
                </div> */}
                <BottomInfo baseData={{ 'content': 'Get cashless treatments at 10000+ cities' }} />
            </Container>
        );
    }
}

export default GroupHealthPlanSelectCity;