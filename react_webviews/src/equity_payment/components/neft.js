import React from 'react';
import Container from '../common/Container';
import "./Style.scss";
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import icn_secure_payment from 'assets/icn_secure_payment.svg';
import { formatAmountInr } from '../../utils/validators';



const NEFT_INFO = [
    {
        title: 'NAME',
        value: 'Finwizard Technology Private Limited'
    },
    {
        title: 'Account number',
        value: 'FISNSE'
    },
    {
        title: 'Account type',
        value: 'Current A/C'
    },
    {
        title: 'IFSC code',
        value: 'ICIC0000106'
    },
    {
        title: 'BRANCH ADDRESS',
        value: 'ICICI BANK RPC OFFICE, VIDEOCON  TOWERS, E-1, JHANDEWALAN EXTENSION, NEAR DELHI PRESS, DELHI 110055'
    },
]

class NEFT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: props.location?.state?.store
        };
    }
    render() {
        return (
            <Container
                title="Payment via NEFT"
                smallTitle={`Please transfer ${formatAmountInr(this.state?.store?.amount)} to the following bank account`}
                header={true}
                noFooter
                classOverRideContainer='equity-neft'
                >
                <div>   
                    <WVInfoBubble 
                    isDismissable={false}
                    type='info'
                    hasTitle={false}>
                        <ul style={{margin:0,paddingLeft:'10px'}}>
                            <li style={{fontSize:'11px'}}>
                                NEFT OR RTGS only (IMPS not supported)
                            </li>
                            <li style={{fontSize:'11px'}}>
                                Use the bank account registered with your Demat account for easy transfers
                            </li>
                        </ul>
                    </WVInfoBubble>
                    <div className='neft-info-wrapper'>
                        {
                            NEFT_INFO.map((el,idx) => (
                                <div key={idx} className='neft-info'>
                                    <div className='neft-title'>{el.title}</div>
                                    <div className='neft-value'>{el.value}</div>
                                </div>
                            ))
                        }
                    </div>

                </div>
                <div className="encription eq-encryption">
                    <div className='eq-neft-note'><span className='eq-note-title'>Note:</span> NEFT/RTGS fund transfers may take upto 4 hours to reflect in your trading account.</div>
                    <img src={icn_secure_payment} alt="secure" />
                </div>
            </Container>
        );
    }
}

export default NEFT;