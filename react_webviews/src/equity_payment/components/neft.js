import React from 'react';
import Container from '../common/Container';
import "./Style.scss";
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import icn_secure_payment from 'assets/icn_secure_payment.svg';
import { formatAmountInr } from '../../utils/validators';



const NEFT_INFO = [
    {
        title: 'NAME',
        value: 'Finwizard Technology Private Limited NEFT'
    },
    {
        title: 'Account number',
        value: '602860'
    },
    {
        title: 'IFSC code',
        value: 'YESB0CMSNOC'
    }
]

class NEFT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: props.location.state.store
        };
    }
    render() {
        return (
            <Container
                title="Payment via NEFT"
                smallTitle={`Please transfer ${formatAmountInr(this.state.store.amount)} to the following bank account`}
                header={true}
                noFooter
                classOverRideContainer='equity-neft'
                >
                <div style={{marginBottom: '220px'}}>   
                    <WVInfoBubble 
                    isDismissable={false}
                    type='info'
                    hasTitle={false}>
                        NEFT OR RTGS only (IMPS not supported)
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
                <div className="encription">
                    <img src={icn_secure_payment} alt="secure" />
                </div>
            </Container>
        );
    }
}

export default NEFT;