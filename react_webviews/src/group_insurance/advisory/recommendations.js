import React, { Component, Fragment } from 'react'
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {formatAmount, containsNumbersAndComma} from 'utils/validators';
import RecommendationResult from './components/recommendation_result';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import download from 'assets/download.svg';
import launch from 'assets/launch.svg';

class AdivsoryRecommendations extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            openDialogReset: false
        }
    }

    navigate = (pathname, search) => {
        this.props.history.push({
          pathname: pathname,
          search: search ? search : getConfig().searchParams,
        });
    }

    resetQuote = () =>{
        console.log('reset')
    }
    handleClose = () => {
            // this.sendEvents('next');
        this.setState({
            openDialogReset: false,
        })
    }

    renderDialog = () => {
        return (
            <Dialog
                fullScreen={false}
                open={this.state.openDialogReset}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                    Restarting will delete all existing data. Do you want to restart? 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.resetQuote} color="default">
                        YES
                    </Button>
                    <Button onClick={this.handleClose} color="default" autoFocus>
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
    showDialog = () => {
        this.setState({
            openDialogReset: true,
        }, () => {
            // this.sendEvents('next');
        });
    }
    render(){
        return(
            <Container
                // events={this.sendEvents('just_set_events')}
                fullWidthButton={true}
                onlyButton={true}
                title="Our recommendations"
                resetpage={true}
                handleReset={this.showDialog}
                disableBack={true}
                noFooter={true}
                handleClick={()=>this.handleClick()}
            >
                <div className="advisory-recommendations-container">
                    <p className="advisory-sub-text">So you can plan better</p>

                    <div className="rec-profile-container">
                            <p className="rec-profile-heading">Your profile</p>
                            <div className="rec-profile">
                                <div className="rec-profile-left">
                                    <img src={require(`assets/${this.state.type}/advisory_male.svg`)}/>
                                </div>
                                <div className="rec-profile-right">
                                    <p>Shashidhar Varne</p>
                                    <p>Male</p>
                                    <p>24 years</p>
                                    <p>2 dependents</p>
                                </div>
                            </div>
                    </div>

                    <p className="advisory-sub-text" style={{marginTop: '18px'}}>It's great that you've already planned for you life with X policy but you're short on adequate coverage</p>
                    <p style={{fontSize: '17px', fontWeight: 'bold', margin:'30px 0 20px 0', color: '#160D2E' }}>Here's what we recommend</p>
                    
                    <RecommendationResult/>
                    <RecommendationResult/>
                    <RecommendationResult/>
                    <RecommendationResult/>
                    <div className="recommendation-extras">
                        <div className="download-report">
                            <img src={download} style={{marginRight: '5px'}} /> Download report
                        </div>
                        <div className="recommendation-extras-divider" style={{color: '#D6D6D6'}}>
                            |
                        </div>
                        <div className="email-report"  onClick={() => this.navigate('/group-insurance/advisory/email-report')}>
                            <img src={launch} style={{marginRight: '5px'}}/> Email report 
                        </div>
                    </div>
                </div>
                {this.renderDialog()}
            </Container>
        )
    }
}

export default AdivsoryRecommendations
