import React from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import "./Style.css";
import "./Style.scss";

const NEFTModal = (props) => {
    window.PlutusInitState.page = 'modal';
    const bankList = props.banks.map((item, i) => {
        if (item.neft_supported) {
            return (
                <div className={`carousel-item ${(props.activeIndex === i) ? 'active' : ''}`} key={i} onClick={() => props.selectedNEFTBank(i, item)}>
                    <div className="flex">
                        <div className="item">
                            <img src={item.image} width="30" alt="bank" />
                        </div>
                        <div className="item">
                            <div className="dark-grey-text uppercase">{item.bank_short_name}</div>
                            <div className="light-grey">{item.obscured_account_number}</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    });

    return (
        <div id="neftModal" className="modal modal-center">
            <div className="modal-content page-padding-10">
                <div className="header">
                    <h1>Select your bank for NEFT/RTGS</h1>
                </div>
                <div className="carousel">
                    <div className="carousel-flex">
                        {bankList}
                    </div>
                </div>
                <div className="form-input margin-top-30">
                    <label>
                        <input type="text" name="neft" ref={props.setNFFTNumber} id="neft" />
                        <span className="placeholder">UTR number <span className="tooltip">*Info <span className="tooltiptext">This is Unique Transaction number for every NEFT and RTGS (16-digit or more i.e XXXXAYYDDD999999)</span></span></span>
                    </label>
                    {props.neft_error && <div className="validation red-color">Required, 10 characters or more</div>}
                </div>
                <div className="flex upitext">
                    <label className="checkbox"><input type="checkbox" onChange={() => props.handleCheck()} /><span className="neft_checkmark"></span></label>
                    <div className={props.highlighttnc ? 'active' : ''}>Make sure to use same <b>NEFT number</b> linked to above selected account</div>
                </div>
                <div className="upi-button margin-top">
                    <button className={`${props.checked ? 'active' : ''} ${props.store.partner}`} onClick={() => props.saveNEFT()}>Continue to Pay ₹ {props.store.amount}</button>
                </div>
            </div>
        </div>
    );
};

class NEFT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: props.location.state.store,
            bank: {},
            neftBanks: props.location.state.neftBanks,
            show_loader: false,
            showNEFTModal: false,
            activeIndex: 0,
            checked: false,
            highlighttnc: false,
            neft_error: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.setNFFTNumber = React.createRef();
        this.selectedNEFTBank = this.selectedNEFTBank.bind(this);
        this.saveNEFT = this.saveNEFT.bind(this);
    }

    saveNEFT() {
        let neft_number = this.setNFFTNumber.current.value;
        if (neft_number) {
            this.setState({ neft_error: false });
            if (this.state.checked) {
                this.setState({ show_loader: true });
                nativeCallback({
                    action: 'take_control', message: {
                        back_url: window.location.href,
                        back_text: 'Are you sure you want to exit the payment process?'
                    }
                });
                window.location.href = this.state.store.neft_callback_url + '&bank_code=' + this.state.bank.bank_code + '&account_number=' + this.state.bank.account_number + '&neft_no=' + neft_number;
            } else {
                this.setState({ highlighttnc: true });
            }
        } else {
            this.setState({ neft_error: true });
        }
    }

    selectedNEFTBank(i, item) {
        this.setState({ bank: item, activeIndex: i });
    }

    handleCheck() {
        this.setState({ checked: !this.state.checked });
    }

    handleClick() {
        console.log(this.state.neftBanks[0])
        this.setState({ showNEFTModal: true, bank: this.state.neftBanks[0] });
    }

    render() {
        return (
            <Container
                title="Payment via NEFT"
                header={true}
                handleClick={this.handleClick}
                showLoader={this.state.show_loader}
                buttonTitle="Continue" >
                <div className="page-padding">
                    <div className="neft-wrapper">
                        <div className="neft-info">
                            <p>
                                Please transfer <b>Rs.{this.state.store.amount}</b> to the following bank account:<br />
                            </p>
                            <table className="neft-table">
                                {this.state.store.partner === "obc" || this.state.store.partner === "ktb" ?
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>Indian Clearing Corporation Limited</td>
                                        </tr>
                                        <tr>
                                            <td>A/C No</td>
                                            <td>3922</td>
                                        </tr>
                                        <tr>
                                            <td>IFSC</td>
                                            <td>ICIC0000104</td>
                                        </tr>
                                    </tbody>
                                    :
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>FINWIZARD TECHNOLOGY PRIVATE LIMITED NEFT</td>
                                        </tr>
                                        <tr>
                                            <td>A/C No</td>
                                            <td>602860</td>
                                        </tr>
                                        <tr>
                                            <td>IFSC</td>
                                            <td>YESB0CMSNOC</td>
                                        </tr>
                                    </tbody>
                                }
                            </table>
                            <p className="unsupport-bank">
                                NEFT or RTGS only (IMPS not supported)</p>
                        </div>

                    </div>
                </div>
                {this.state.showNEFTModal &&
                    <NEFTModal
                        store={this.state.store}
                        banks={this.state.neftBanks}
                        accountNumber={this.state.bank.account_number}
                        selectedNEFTBank={this.selectedNEFTBank}
                        setNFFTNumber={this.setNFFTNumber}
                        neft_error={this.state.neft_error}
                        saveNEFT={this.saveNEFT}
                        handleCheck={this.handleCheck}
                        checked={this.state.checked}
                        activeIndex={this.state.activeIndex}
                        highlighttnc={this.state.highlighttnc} />
                }
            </Container>
        );
    }
}

export default NEFT;