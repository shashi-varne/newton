import React, {Component} from "react";
import Container from "fund_details/common/Container";
import Api from '../../../utils/api';

class ReplaceFund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fund: ''
        }
    }

    componentWillMount() {
      this.onload();
    }

    onload = async () => {
        const recommends = await Api.get('api/nps/invest/recommend?amount=50000');
        
        // recommends

        // this.setState({
        //     recommends: 
        // })
    }

    handleClick = () => {
      // endpoint = api/kyc/v2/mine
    }

    render() {
        return (
            <Container
                buttonTitle="APPLY"
                handleClick={() => this.handleClick()}
            >
                <div className="replace-fund">

                </div>
            </Container>
        )
    }
}

export default ReplaceFund;