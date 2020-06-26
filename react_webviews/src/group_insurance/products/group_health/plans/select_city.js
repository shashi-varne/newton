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
            city: this.state.groupHealthPlanData.city || ''
        })
    }

    checkCity = (city, proceed) => {
        if(!city) {
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
            storageService().setObject('groupHealthPlanData', groupHealthPlanData);
    
            this.navigate('plan-list');
        }
    }

    async componentDidMount() {
        try {


            if(!this.state.city) {
                try {
                    const res = await Api.get('/api/ins_service/api/insurance/account/summary');
                    if (res.pfwresponse.status_code === 200) {
                        var resultData = res.pfwresponse.result;
                        let city = resultData.insurance_account.permanent_address.city;
                        console.log(city);
                        this.setState({
                            city: city
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
        this.checkCity(this.state.city, true);
        
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
                    {this.state.suggestions_list.length > 0 &&
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
                    }
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