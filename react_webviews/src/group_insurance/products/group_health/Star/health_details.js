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

class GroupHealthPlanStarHealthDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            header_title: 'Health details'
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let account_type = groupHealthPlanData.account_type;

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
            radio_options: radio_options
        })
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
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

        if (value === 'yes') {
            this.setState({
                open: true
            })
        }

        this.setState({
            value: value
        })
    }

    // handleClose = () => {
        // this.setState({
            // open: false
        // })
    // }

    handleClick2 = () => {
        // this
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
                            onClick={this.handleClick2()}
                            autoFocus>OK
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    handleClick = () => {

    }

    render() {
        console.log(this.state)
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
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
                {this.state.account_type && <RadioWithoutIcon
                    style={{width: '20px'}}
                    isVertical={false}
                    options={this.state.radio_options}
                    id="health"
                    value={this.state.value || ''}
                    onChange={(event) => this.handleChangeRadio(event)} />}
                {this.renderDialog()}
            </Container>
        )
    }
};

export default GroupHealthPlanStarHealthDetails;