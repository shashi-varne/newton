import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';

import Autosuggests from '../../../../common/ui/Autosuggest';

import { FormControl } from 'material-ui/Form';
import { initialize } from '../common_data';

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
            show_loader: true
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    checkCity = (city, proceed) => {
        if(!city) {

            if(proceed) {
                this.setState({
                    city_error: 'Please select city from provided list'
                });
            }
            
            return;
        }
        let data  = this.state.suggestions_list.filter(data => (data.name).toUpperCase() === (city).toUpperCase());

        if(data.length === 0) {
            this.setState({
                city_error: 'Please select city from provided list'
            });
        } else if(proceed) {
            let groupHealthPlanData = this.state.groupHealthPlanData;
            groupHealthPlanData.city = this.state.city;
            groupHealthPlanData.post_body.city = this.state.city;
            this.setLocalProviderData(groupHealthPlanData);
    
            this.navigate('plan-list');
        }
    }

    async componentDidMount() {

        let city = this.state.groupHealthPlanData.city || '';
        this.setState({
            city: this.state.groupHealthPlanData.city || ''
        });
        try {


            if(!city) {
                try {
                    const res = await Api.get('/api/ins_service/api/insurance/account/summary');
                    if (res.pfwresponse.status_code === 200) {
                        var resultData = res.pfwresponse.result;
                        let city = resultData.insurance_account.permanent_address.city;
                        this.setState({
                            city: city === 'NA' ? '' : city,
                        });
                    } else {
                        toast(
                            resultData.error ||
                            resultData.message ||
                            'Something went wrong'
                        );
                    }
                } catch (err) {
                    console.log(err);
                    this.setState({
                        show_loader: false
                    });
                    toast('Something went wrong');
                }
            }

            const res2 = await Api.get('/api/ins_service/api/insurance/hdfcergo/get/citylist');

            this.setState({
                show_loader: false
            });
            var resultData2 = res2.pfwresponse.result;

            if (res2.pfwresponse.status_code === 200) {

                this.setState({
                    suggestions_list: resultData2.city_list
                }, () => {
                    this.checkCity(this.state.city);
                })
            } else {
                toast(resultData2.error || resultData2.message
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
        this.sendEvents('next');
        this.checkCity(this.state.city, true);
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
                <div style={{margin: '10px 0px'}}></div>
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