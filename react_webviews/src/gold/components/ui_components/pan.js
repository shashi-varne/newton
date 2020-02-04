import React, { Component } from 'react';

import Container from '../../common/Container';
import Api from 'utils/api';
import Input from '../../../common/ui/Input';
import Dialog, {
    DialogContent
} from 'material-ui/Dialog';
import { validatePan, validateEmpty } from 'utils/validators';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

import ic_live_green from 'assets/ic_live_green.svg';
import SVG from 'react-inlinesvg';
import { WithProviderLayout } from '../../common/footer/layout';

const commonMapper = {
    'buy': {
        'editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per government guidelines, PAN is mandatory to buy more than ₹1 lac worth gold',
            'cta': 'Continue',
            'cta2': 'Buy gold worth',
            'name': 'Buy'
        },
        'non-editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per government guidelines, PAN is mandatory to buy more than ₹1 lac worth gold',
            'cta': 'Continue',
            'cta2': 'Buy gold worth',
            'name': 'Buy'
        }
    },
    'sell': {
        'editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per Indian government, PAN is mandatory to sell gold',
            'cta': 'Continue',
            'cta2': 'Sell gold worth',
            'name': 'Sell'
        },
        'non-editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per Indian government, PAN is mandatory to sell gold',
            'cta': 'Continue',
            'cta2': 'Sell gold worth',
            'name': 'Sell'
        }
    }

}

class GoldPanDataClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            pan_number: "",
            pan_number_error: '',
            openConfirmDialog: false,
            provider: this.props.parent.props.match.params.provider,
            orderType: this.props.parent.state.orderType,
            pan_editable_status: 'editable'
        }
    }

    componentWillMount() {
        this.setState({
            commonMapper: commonMapper[this.state.orderType][this.state.pan_editable_status]
        })
    }

    async componentDidMount() {
        try {

            const res = await Api.get('/api/gold/user/account');
            if (res.pfwresponse.status_code === 200) {
                let result = res.pfwresponse.result;

                const { pan_number } = result;
                this.setState({
                    show_loader: false,
                    pan_number: pan_number || '',
                });

            } else {
                this.setState({
                    show_loader: false
                });
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
                    'Something went wrong', 'error');
            }
        } catch (err) {
            this.setState({
                show_loader: false
            });
            toast('Something went wrong', 'error');
        }
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleChange = (field) => (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            [event.target.name + '_error']: ''
        });
    }


    handleClose = () => {
        this.setState({
            openConfirmDialog: false
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'GOLD',
            "properties": {
                "user_action": user_action,
                "screen_name": 'Registeration',
                'pan_number': this.state.pan_number_error ? 'invalid' : this.state.pan_number ? 'valid' : 'empty',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {
        if (!validateEmpty(this.state.pan_number)) {
            this.setState({
                pan_number_error: 'PAN number cannot be empty'
            });
            return;
        } else if (!validatePan(this.state.pan_number)) {
            this.setState({
                pan_number_error: 'Invalid PAN number'
            });
            return;
        } else {

            this.setState({
                show_loader: true
            });

            let options = {
                pan_number: this.state.pan_number
            }


            try {
                const res = await Api.post('/api/gold/user/account', options);

                this.setState({
                    show_loader: false
                });


                if (res.pfwresponse.status_code === 200) {
                    //   next step
                } else {

                    toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
                        'Something went wrong', 'error');

                }
            } catch (err) {
                this.setState({
                    show_loader: false
                });
                toast('Something went wrong', 'error');
            }
        }
    }

    renderConfirmDialog = () => {
        return (
            <Dialog
                id="bottom-popup"
                open={this.state.openConfirmDialog}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <div className="gold-dialog" id="alert-dialog-description">
                        <div className="live-price-gold">
                            <div className="left-img">
                                <SVG
                                    // preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                                    src={ic_live_green}
                                />
                            </div>
                            <div className="mid-text">
                                Live price: ₹4,173.00/gm
                            </div>
                            <div className="right-text">
                                VALID FOR 1:59
                            </div>
                        </div>
                        <div className="mid-buttons">
                            <WithProviderLayout type="default"
                                handleClick2={this.handleClose}
                                handleClick={this.handleClick}
                                buttonTitle="Ok"
                                buttonData={{
                                    leftTitle: this.state.commonMapper.name + ' gold worth',
                                    leftSubtitle: '₹1,000',
                                    leftArrow: 'down',
                                    provider: 'safegold'
                                }}
                            />
                        </div>

                        <div className="hr"></div>

                        <div className="content">
                            <div className="content-points">
                                <div className="content-points-inside-text">
                                    {this.state.commonMapper.name} price for <b>0.014</b> gms
                            </div>
                                <div className="content-points-inside-text">
                                    ₹194.17
                            </div>
                            </div>

                            <div className="content-points">
                                <div className="content-points-inside-text">
                                    GST
                            </div>
                                <div className="content-points-inside-text">
                                    ₹5.83
                                </div>
                            </div>
                        </div>

                        <div className="hr"></div>

                        <div className="content2">
                            <div className="content2-points">
                                <div className="content2-points-inside-text">
                                    Total
                                </div>
                                <div className="content2-points-inside-text">
                                    ₹200.00
                                </div>
                            </div>
                        </div>

                        <div className="hr"></div>
                    </div>
                </DialogContent>
            </Dialog >
        );

    }

    handleClick2 = () => {
        this.setState({
            openConfirmDialog: true
        })
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title={this.state.commonMapper.top_title}
                handleClick={this.handleClick}
                handleClick2={this.handleClick2}
                edit={this.props.edit}
                withProvider={true}
                buttonTitle={this.state.commonMapper.cta}
                events={this.sendEvents('just_set_events')}
                buttonData={{
                    leftTitle: this.state.commonMapper.cta2,
                    leftSubtitle: '₹1,000',
                    leftArrow: 'up',
                    provider: 'safegold'
                }}
            >
                <div className="common-top-page-subtitle">
                    {this.state.commonMapper.top_subtitle}
                </div>

                <div className="live-price-gold">
                    <div className="left-img">
                        <SVG
                            // preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                            src={ic_live_green}
                        />
                    </div>
                    <div className="mid-text">
                        Live price: ₹4,173.00/gm
                    </div>
                    <div className="right-text">
                        VALID FOR 1:59
                </div>
                </div>
                <div className="register-form">
                    <div className="InputField">
                        <Input
                            error={(this.state.pan_number_error) ? true : false}
                            helperText={this.state.pan_number_error}
                            type="text"
                            width="40"
                            label="Enter PAN"
                            class="name"
                            id="name"
                            name="pan_number"
                            value={this.state.pan_number}
                            onChange={this.handleChange('pan_number')} />
                    </div>
                </div>
                {this.renderConfirmDialog()}
            </Container>
        );
    }
}

const GoldPanData = (props) => (
    <GoldPanDataClass
    {...props} />
);

export default GoldPanData;