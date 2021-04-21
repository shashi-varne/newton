import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../common_data';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import Dialog, {
    DialogContent
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import { isEmpty } from '../../../../utils/validators';

class GroupHealthPlanStarHealthDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            header_title: 'Health details',
            open: false,
            screen_name: 'health_details',
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let account_type = groupHealthPlanData.account_type;
        let value = groupHealthPlanData.health_details;

        let radio_options = [
            {
                name: 'Yes',
                value: 'yes'
            },
            {
                name: 'No',
                value: 'no'
            }
        ];

        this.setState({
            account_type: account_type,
            radio_options: radio_options,
            value: value
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "screen_name": "health details",
                medical_condition: this.state.value,
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    navigate = (pathname) => {
        console.log(pathname)
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleChangeRadio = (event) => {
        let { radio_options } = this.state;
        let value = radio_options[event].value;

        this.setState({
            value: value,
            error: ''
        }, () => {

            if (value === 'yes') {
                this.sendEvents('next');
                this.setState({
                    open: true
                })
            }
            
        })

       
    }

    handleClick2 = () => {
        this.navigate('insure-type');
    }

    renderDialog = () => {
        return (
            <Dialog
                id="bottom-popup"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                open={this.state.open}
                // onClose={this.handleClose}
            >
                <DialogContent>
                    <div style={{fontWeight:600, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{fontSize:'20px'}}>Sorry</div>
                        <img
                          src={ require(`assets/${this.state.productName}/ic_medical_checkup2.svg`)}
                          alt="" />
                    </div>
                    
                    <div style={{fontSize:'14px', color:'#767E86', lineHeight:1.5}}>
                        This insurer does not cover members with adverse medical conditions. Please try without the concerned member or try with a different insurer.
                    </div>

                    <div style={{marginTop:'30px'}}>
                        <Button
                            fullWidth={true}
                            variant="raised"
                            size="large"
                            color="secondary"
                            onClick={() => this.handleClick2()}
                            autoFocus>OK
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    handleClick = async () => {

    
        this.sendEvents('next');
        let { groupHealthPlanData } = this.state;

        let canProceed = true;
        let error = '';
        if (!this.state.value) {
            error = 'Please select one option';
            canProceed = false;
        }

        this.setState({
            error: error
        })

        if (canProceed) {
            
            groupHealthPlanData.health_details = this.state.value;
            groupHealthPlanData.sum_assured = "300000";
            groupHealthPlanData.cover_plan = "FHONEW";
            groupHealthPlanData.post_body.sum_assured = "300000";
            groupHealthPlanData.post_body.si = "300000";
            groupHealthPlanData.post_body.cover_plan = "FHONEW";
            groupHealthPlanData.post_body.plan_id = "FHONEW";
            groupHealthPlanData.plan_selected = {
                copay: ' 0% copay is applicable only where insured age is less than 60 yrs, there will be 20% copay for insured whose age at the time of entry is above 60 yrs',
                recommendation_tag: '',
                plan_title: "Star Health",
                plan_type: "FHONEW",
                sum_assured: "500000",
                claim_settlement_ratio: '78.15'
            }
            groupHealthPlanData.post_body.plan_title = 'Family Health Optima';

            if(isEmpty(groupHealthPlanData.plan_details_screen)){
                this.setErrorData("submit");            
                let error = "";
                let errorType = "";
                var post_body = groupHealthPlanData.post_body;
                let keys_to_remove = ['base_premium', 'sum_assured', 'discount_amount', 'insured_pattern','tax_amount', 'tenure','total_amount', 'type_of_plan']
                for(let key in keys_to_remove){
                  delete post_body[keys_to_remove[key]]
                }

                let body = {};
                let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'postal_code'];
                for(let key of allowed_post_body_keys){
                    body[key] = post_body[key];
                }
                groupHealthPlanData.post_body = post_body;

                this.setState({ show_loader: "button"});
                try {
                    const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/plan_information/${this.state.providerConfig.provider_api}`,body);
                    var resultData = res.pfwresponse.result;
                    if (res.pfwresponse.status_code === 200) {
                        
                        groupHealthPlanData['plan_details_screen'] = resultData;
                        this.setLocalProviderData(groupHealthPlanData);
                        this.navigate(this.state.next_screen);
                        
                    } else {
                        error = resultData.error || resultData.message
                            || true;
                    }
                } catch (err) {
                    console.log(err)
                    this.setState({
                        show_loader: false
                    });
                    error = true;
                    errorType = "crash";
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
            }else{
                this.setLocalProviderData(groupHealthPlanData);
                this.navigate(this.state.next_screen);
            }
        }
    }

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title={this.state.header_title}
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
            >
                <div style={{color:'#767E86', fontSize:'13px', marginRight: '20px'}}>
                    Please disclose correct details to make hassle-free claim later
                </div>
                <div style={{color: '#0A1D32', fontSize:'13px', lineHeight:1.5, margin:'30px 20px 0 0'}}>
                    Does any member proposed to be insured, suffered or are suffering from any adverse medical condition of any kind especially Heart/Stroke/ Cancer/Renal disorder/Alzheimer's disease/Parkinson’s disease?
                </div>
                {this.state.account_type &&
                <RadioWithoutIcon
                    style={{width: '20px'}}
                    isVertical={false}
                    options={this.state.radio_options}
                    id="health"
                    value={this.state.value || ''}
                    error={this.state.error ? true : false}
                    helperText={this.state.error}
                    onChange={(event) => this.handleChangeRadio(event)} />}
                {this.renderDialog()}
            </Container>
        )
    }
};

export default GroupHealthPlanStarHealthDetails;