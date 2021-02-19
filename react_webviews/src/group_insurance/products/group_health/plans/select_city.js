import React, { Component } from 'react';
import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import Api from 'utils/api';
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
            skelton:true
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

        let data  = this.state.suggestions_list.filter(data => (data.key).toUpperCase() === (city).toUpperCase());
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
    setErrorData = (type) => {

        this.setState({
          showError: false
        });
        if(type) {
          let mapper = {
            'onload':  {
              handleClick1: this.onload,
              button_text1: 'Retry',
              title1: ''
            },
            'submit': {
              handleClick1: this.handleClick,
              button_text1: 'Retry',
              handleClick2: () => {
                this.setState({
                  showError: false
                })
              },
              button_text2: 'Edit'
            }
          };
      
          this.setState({
            errorData: {...mapper[type], setErrorData : this.setErrorData}
          })
        }
    
      }
    async componentDidMount() {
        this.onload();
    }

    onload =async()=>{
        this.setErrorData("onload");
        this.setState({ skelton : true });
        let error = "";
        let errorType = "";
        let body = {
            "provider": this.state.providerConfig.provider_api
          };
        try {
                try {

                    const res = await Api.post(
                        `api/insurancev2/api/insurance/health/quotation/account_summary`,
                        body
                    );
                    if (res.pfwstatus_code === 200) {
                        
                        var resultData = res.pfwresponse.result;
                        let city = ''
                        
                        if(this.state.groupHealthPlanData.city){
                            city = this.state.groupHealthPlanData.city || '';
                        }else if(Object.keys(resultData.quotation).length > 0 && resultData.quotation.city_postal_code){
                            city = resultData.quotation.city_postal_code || '';
                        }else if(Object.keys(resultData.address_details).length > 0 && resultData.address_details.city){
                            city = resultData.address_details.city || '';
                        }
                        this.setState({
                            city: city
                        });
                    } else {
                        error=
                            resultData.error ||
                            resultData.message ||
                            true
                        
                    }
                } catch (err) {
                    console.log(err);
                    error=true;
                    errorType= "crash";
                }
            const res2 = await Api.get('api/insurancev2/api/insurance/health/quotation/get_cities/hdfc_ergo');
            
            var resultData2 = res2.pfwresponse.result
            var city_object =  resultData2.map(element => {
                return {
                    key: element,
                    value: element
                }
            });

            if (res2.pfwresponse.status_code === 200) {
                this.setState({
                    suggestions_list: city_object
                }, () => {
                    this.checkCity(this.state.city);
                })

            this.setState({
                skelton:false
            });    
            } else {
                error=resultData2.error || resultData2.message
                    || true;
            }
        } catch (err) {
            console.log(err)
            this.setState({
                skelton : false
            });
           error=true;
           errorType="crash";
        }
        if (error) {
            this.setState({
              errorData: {
                ...this.state.errorData,
                title2: error,
                type: errorType
              },
              showError: "page",
            });
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