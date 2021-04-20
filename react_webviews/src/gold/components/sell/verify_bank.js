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
import { storageService, getUrlParams} from "utils/validators";
import RefreshSellPrice from '../ui_components/sell_price';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import {bankAccountTypeMapper} from 'utils/constants';
import {Imgc} from '../../../common/ui/Imgc';

const verificationDataMapper = {
    'success': {
        'title': "Bank added",
        'subtitle': 'Great! bank account has been added successfully. You are good to sell your gold now.',
        'icon': 'ic_bank_added'
    },
    'delayed_response': {
        'title': "Bank verification pending",
        'subtitle': "We have added your bank account details. Bank account verification is in progress, we will email you once it's done. ",
        'icon': 'ic_bank_partial_added'
    },
    'request_triggered': {
        'title': "Bank verification pending",
        'subtitle': "We have added your bank account details. Bank account verification is in progress, we will email you once it's done. ",
        'icon': 'ic_bank_partial_added'
    },
    'failed': {
        'title': "Unable to add bank",
        'subtitle': 'Bank account verification failed. Are you sure you have entered correct account details?',
        'icon': 'ic_bank_not_added',
        'cta_title': 'Check Bank Details'
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
            openStatusDialog: false,
            verification_status: '',
            verifyBankData: storageService().getObject('goldVerifyBankData') || {},
            orderType: 'sell',
            statusMapper: {},
            pan_bank_flow: getUrlParams().pan_bank_flow || false
        }
    }

    onload = () => {
        this.setState({
            openOnloadModal: false
        })
        this.setState({
            openOnloadModal: true
        })
    }

    updateParent(key, value) {
        this.setState({
            [key]: value
        })
    }

    handleClose = () => {
        this.setState({
            openConfirmDialog: false,
            // openVerifyDialog: false,
            openStatusDialog: false
        });

        if (this.state.openPriceChangedDialog && this.state.timeAvailable > 0) {
            this.setState({
                openPriceChangedDialog: false
            })
        }
    }

    async componentDidMount() {
        this.onload();
    }

    navigate = (pathname) => {

        if(pathname === 'sell-edit-bank') {
            this.sendEvents('next', {bank_edit_clicked: true});
        }
        let searchParams = getConfig().searchParams;

        if(this.state.pan_bank_flow) {
            searchParams += '&pan_bank_flow=' + this.state.pan_bank_flow
        }
        this.props.history.push({
          pathname: pathname,
          search: searchParams
        });
    }


    sendEvents(user_action, data={}) {
        let eventObj = {
            "event_name": 'gold_investment_flow',
            "properties": {
                "user_action": user_action,
                "screen_name": 'verify_bank',
                'bank_edit_clicked': data.bank_edit_clicked ? 'yes' : 'no',
                "timeout_alert": this.state.timeout_alert_event ? 'yes' : 'no',
        "refresh_price": this.state.refresh_price_event ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.countdownInterval);
    }

    countdown = () => {
        let timeAvailableVerify = this.state.timeAvailableVerify;

        timeAvailableVerify--;

        if(timeAvailableVerify === 20) {
            this.getPennyStatus();
        }
        if (timeAvailableVerify <= 0) {
            timeAvailableVerify = 0;
            clearInterval(this.state.countdownInterval);
        }

        this.setState({
            timeAvailableVerify: timeAvailableVerify
        })
    };

    getPennyStatus = async () => {
        if(this.state.bank_id) {
            try {

                let body = {
                    bank_id: this.state.bank_id
                }
                const res = await Api.post('/api/account/penny-verification-status-check', body);
    
                if (res.pfwresponse.status_code === 200) {
                    let result = res.pfwresponse.result || {};
                    let plutus_bank_info_record = result.records.PBI_record || {};
                    let penny_verification_reference = plutus_bank_info_record.penny_verification_reference || {};
                    let verification_status = penny_verification_reference.penny_verification_state || 'failed';
                    this.getStatusMapper(verification_status);
                    this.setState({
                        verification_status: verification_status,
                        openStatusDialog: true,
                        openVerifyDialog: false
                    })
                } else {
                    this.setState({
                        verification_status: 'delayed_response',
                        openStatusDialog: true,
                        openVerifyDialog: false
                    })
                    // toast(res.pfwresponse.result.error || res.pfwresponse.result.message);
                }
            } catch (err) {
                this.setState({
                    openVerifyDialog: false
                });
                toast('Something went wrong');
            }
        }
    }


    handleClick = async () => {

        this.handleClose();
        var options = {
            'account_number': this.state.verifyBankData.account_no,
            'ifsc_code': this.state.verifyBankData.ifsc_code,
            'account_type': this.state.verifyBankData.account_type
        };

        this.sendEvents('next');

        this.setState({
            openVerifyDialog: true
        });
        let intervalId = setInterval(this.countdown, 1000);
        this.setState({
            countdownInterval: intervalId,
            timeAvailableVerify: 30
        });

        try {
            const res = await Api.post('/api/gold/user/bank/details', options);

            this.setState({
                show_loader: false
            });

            if (res.pfwresponse.status_code === 200) {
                let result = res.pfwresponse.result || {};
                let plutus_bank_info_record = result.plutus_bank_info_record || {};
                let penny_verification_reference = plutus_bank_info_record.penny_verification_reference || {};
                let verification_status = penny_verification_reference.penny_verification_state || 'failed';
                this.getStatusMapper(verification_status);
                this.setState({
                    verification_status: verification_status,
                    // openStatusDialog: true,
                    bank_id: plutus_bank_info_record.bank_id
                })
            } else {
                let verification_status = 'failed';
                this.getStatusMapper(verification_status);
                this.setState({
                    verification_status: verification_status,
                    openVerifyDialog: false,
                    openStatusDialog: true
                })

                // toast(res.pfwresponse.result.error || res.pfwresponse.result.message);
            }
        } catch (err) {
            this.setState({
                openVerifyDialog: false
            });
            toast('Something went wrong');
        }

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
                            <Imgc style={{ margin: '0 0 15px 0', width: '100%',height:100, borderRadius: 6 }}
                                src={require(`assets/ic_verfication_in_progress.gif`)} alt="info" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: '#0A1C32', fontSize: 16, fontWeight: 600 }}>Verifying your account details</div>
                            <div style={{ color: getConfig().styles.primaryColor, fontSize: 13 }}>00:{this.state.timeAvailableVerify < 10 ? '0' : ''}{this.state.timeAvailableVerify}</div>
                        </div>
                        <div style={{ color: '#767E86', fontSize: 14, margin: '15px 0 0 0' }}>
                            Please wait, while we verify your bank account. Do not close the app.
                </div>
                    </div>
                </DialogContent>
            </Dialog >
        );

    }

    getStatusMapper =(verification_status) => {
        let data = verificationDataMapper[verification_status] || verificationDataMapper['failed'];

        this.setState({
            statusMapper: data
        });
    }

    handleCloseStatus = () => {
        if(this.state.pan_bank_flow) {
            this.navigate('/gold/gold-locker');
        } else {

            let eventObj = {
                "event_name": 'gold_investment_flow',
                "properties": {
                    "user_action": 'next',
                    "screen_name": 'penny_verification_respose',
                    'result': this.state.verification_status || ''
                }
            };
    
            nativeCallback({ events: eventObj });
            
            if(this.state.verification_status === 'failed') {
                this.navigate('sell-edit-bank');
            } else {
                this.navigate('sell-select-bank');
            }
            
        }
    }

    renderStatusDialog = () => {
        return (
            <Dialog
                id="bottom-popup"
                open={this.state.openStatusDialog}
                onClose={this.handleCloseStatus}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <div className="gold-dialog" id="alert-dialog-description">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '-20px 0 0 0' }}>
                            <div style={{ color: '#0A1C32', fontSize: 16, fontWeight: 600 }}>
                                {this.state.statusMapper.title}
                            </div>
                            <Imgc style={{ margin: '0 0 15px 0', borderRadius: 6,width:115,height:84 }}
                                src={require(`assets/${this.state.productName}/${this.state.statusMapper.icon}.svg`)} alt="info"
                            />
                        </div>
                        <div style={{ color: '#767E86', fontSize: 14, margin: '15px 0 0 0' }}>
                            {this.state.statusMapper.subtitle}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className="DialogButtonFullWidth" onClick={this.handleCloseStatus} color="default" autoFocus>
                        {this.state.statusMapper.cta_title || 'OK'}
                    </Button>
                </DialogActions>
            </Dialog >
        );

    }


    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                title="Verify bank details"
                edit={this.props.edit}
                handleClick={this.handleClick}
                buttonTitle="VERIFY BANK ACCOUNT"
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
                        We will credit ₹1 to your bank account to verify the account number and name.
                    </div>
                </div>

                <GoldLivePrice parent={this} />

                <div style={{ display: 'flex', margin: '20px 0 20px 0px' , position: 'relative'}}>
                    <img src={this.state.verifyBankData.bank_image}
                        style={{ width: '50px', margin: '0 8px 0 0' }} alt="Gold" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: '#0A1C32', fontSize: 16, fontWeight: 500 }}>{this.state.verifyBankData.bank_name}</div>
                            <div style={{ color: '#767E86', fontSize: 14 }}>{this.state.verifyBankData.branch_name}</div>
                        </div>
                        <div 
                        onClick={() => this.navigate('sell-edit-bank')}
                        style={{
                            position: 'absolute', right: 16,
                            color: getConfig().styles.secondaryColor, fontWeight: 'bold',
                            cursor: 'pointer'
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
                                {this.state.verifyBankData.account_no}
                            </div>
                        </div>

                        <div className="hr"></div>

                        <div className="content-points">
                            <div className="content-points-inside-text">
                                IFSC code
                            </div>
                            <div className="content-points-inside-text" style={{textTransform: 'uppercase'}}>
                                {this.state.verifyBankData.ifsc_code}
                            </div>
                        </div>

                        <div className="hr"></div>

                        <div className="content-points">
                            <div className="content-points-inside-text">
                                Account type
                            </div>
                            <div className="content-points-inside-text">
                                {bankAccountTypeMapper[this.state.verifyBankData.account_type]}
                            </div>
                        </div>
                    </div>

                    <div className="hr"></div>

                </div>

                {this.renderVerifyDialog()}
                {this.state.openStatusDialog && this.renderStatusDialog()}

                <PriceChangeDialog parent={this} />

                {this.state.openRefreshModule &&
                    <RefreshSellPrice parent={this} />}

                {this.state.openOnloadModal &&
                    <GoldOnloadAndTimer parent={this} />}
            </Container>
        );
    }
}

export default SellVerifyBank;
