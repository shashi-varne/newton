import React, { Component } from 'react';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';

class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Karan',
            productName: getConfig().productName,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.navigate('personal1');
        }, 4000);
    }

    navigate(pathname, search) {
        this.props.history.push({
            pathname: pathname,
            search: search ? search : getConfig().searchParams,
            params: {
                fromHome: true
            }
        });
    }
    render() {
        let name = this.state.name;
        return (
            <Container
                noFooter={true}
                handleClick={() => this.startFHC()}
                title="Fin Health Check (FHC)"
                >
                    <div className="landing-container">
                        <img
                            src={require(`assets/done_icon.png`)}
                            className="success-img"
                            alt="Personal Details Success" />    
                        <div className="success-text-container">
                            <span id="span1">
                                <b>Hey {name}!</b> Great work indeed.
                            </span>
                            <span id="span2">
                                Now, let's take a look at your<br />
                                liabilities, coverage, and investments.
                            </span>
                            
                        </div>    
                    </div>



            </Container>
        );
    }
}

export default Success;