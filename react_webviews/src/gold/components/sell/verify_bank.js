import React, { Component } from 'react';

import Container from '../../common/Container';
import Api from 'utils/api';

import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldLivePrice from '../ui_components/live_price';
import Dialog, {
    DialogContent, DialogActions
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

const verificationDataMapper = {
    'success': {
        'title': "Bank added",
        'subtitle': 'Great! bank account has been added successfully. You are good to sell your gold now.',
        'icon': 'ic_bank_added'
    }
};

class SellVerifyBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            provider: this.props.match.params.provider,
            productName: getConfig().productName,
            openVerifyDialog: false,
            openStatusDialog: true,
            verification_status: 'success'
        }

        this.handleClose = this.handleClose.bind(this);
    }

    async componentDidMount() {

    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'GOLD',
            "properties": {
                "user_action": user_action,
                "screen_name": 'Sell Bank Details',
                'account_no': this.state.account_no_error ? 'invalid' : this.state.account_no ? 'valid' : 'empty',
                'confirm_account_no': this.state.confirm_account_no_error ? 'invalid' : this.state.confirm_account_no ? 'valid' : 'empty',
                'ifsc_code': this.state.ifsc_code_error ? 'invalid' : this.state.ifsc_code ? 'valid' : 'empty'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {


        var options = {
            'account_number': this.state.account_no,
            'ifsc_code': this.state.ifsc_code
        };
        this.setState({
            show_loader: true
        });

        try {
            const res = await Api.post('/api/gold/user/bank/details', options);
            if (res.pfwresponse.status_code === 200) {
                let sellData = this.state.sellData;
                sellData.account_number = this.state.account_no;
                sellData.ifsc_code = this.state.ifsc_code;
                window.localStorage.setItem('sellData', JSON.stringify(sellData));
            } else {
                this.setState({
                    show_loader: false, openResponseDialog: true,
                    apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
                });
            }
        } catch (err) {
            this.setState({
                show_loader: false
            });
            toast('Something went wrong', 'error');
        }

    }

    handleClose() {
        this.setState({
            openVerifyDialog: false,
            openStatusDialog: false
        })
    }

    renderVerifyDialog = () => {
        return (
            <Dialog
                id="bottom-popup"
                open={this.state.openVerifyDialog}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <div className="gold-dialog" id="alert-dialog-description">
                        <div>
                            <img style={{ margin: '0 0 15px 0', width: '100%', borderRadius: 6 }}
                                src={require(`assets/ic_verfication_in_progress.gif`)} alt="info" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: '#0A1C32', fontSize: 16, fontWeight: 600 }}>Verifying your account details</div>
                            <div style={{ color: getConfig().primary, fontSize: 13 }}>00:12</div>
                        </div>
                        <div style={{ color: '#767E86', fontSize: 14, margin: '15px 0 0 0' }}>
                            Please wait, while we verify your bank account. Do not close the app.
                </div>
                    </div>
                </DialogContent>
            </Dialog >
        );

    }

    renderStatusDialog = () => {
        return (
            <Dialog
                id="bottom-popup"
                open={this.state.openStatusDialog}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <div className="gold-dialog" id="alert-dialog-description">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '-20px 0 0 0' }}>
                            <div style={{ color: '#0A1C32', fontSize: 16, fontWeight: 600 }}>
                                {verificationDataMapper[this.state.verification_status].title}
                            </div>
                            <img style={{ margin: '0 0 15px 0', borderRadius: 6 }}
                                src={require(`assets/${this.state.productName}/${verificationDataMapper[this.state.verification_status].icon}.svg`)} alt="info"
                            />
                        </div>
                        <div style={{ color: '#767E86', fontSize: 14, margin: '15px 0 0 0' }}>
                            {verificationDataMapper[this.state.verification_status].subtitle}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="default" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog >
        );

    }


    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Verify bank details"
                edit={this.props.edit}
                handleClick={this.handleClick}
                buttonTitle="Verify Bank Account"
                events={this.sendEvents('just_set_events')}
            >
                <div className="common-top-page-subtitle">
                    Amount will be credited to your account
                </div>

                <div style={{ margin: '15px 0px 20px 0px' }} className="highlight-text highlight-color-info">
                    <div className="highlight-text1">
                        <img className="highlight-text11"
                            src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="info" />
                        <div className="highlight-text12">
                            Note
                        </div>
                    </div>
                    <div className="highlight-text2">
                        We will credit Rs 1 to your bank account to verify the account number and name.
                    </div>
                </div>

                <GoldLivePrice parent={this} />

                <div style={{ display: 'flex', margin: '20px 0 20px 0px' }}>
                    <img src={require(`assets/home_insurance_fisdom.svg`)} alt="Gold" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: '#0A1C32', fontSize: 16, fontWeight: 500 }}>HDFC BANK</div>
                            <div style={{ color: '#767E86', fontSize: 14 }}>Mahipalpur, New Delhi</div>
                        </div>
                        <div style={{
                            position: 'absolute', right: 16,
                            color: getConfig().secondary, fontWeight: 'bold'
                        }}>EDIT</div>
                    </div>
                </div>

                <div className="gold-dialog">
                    <div className="hr"></div>

                    <div className="content">
                        <div className="content-points">
                            <div className="content-points-inside-text">
                                Account number
                            </div>
                            <div className="content-points-inside-text">
                                5343150838600
                            </div>
                        </div>

                        <div className="hr"></div>

                        <div className="content-points">
                            <div className="content-points-inside-text">
                                IFSC code
                            </div>
                            <div className="content-points-inside-text">
                                HDFC0004404
                            </div>
                        </div>

                        <div className="hr"></div>

                        <div className="content-points">
                            <div className="content-points-inside-text">
                                Account type
                            </div>
                            <div className="content-points-inside-text">
                                Savings
                            </div>
                        </div>
                    </div>

                    <div className="hr"></div>

                </div>

                {this.renderVerifyDialog()}
                {this.renderStatusDialog()}
            </Container>
        );
    }
}

export default SellVerifyBank;
