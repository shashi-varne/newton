import React, { Component, Fragment } from 'react'
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {formatAmount, containsNumbersAndComma} from 'utils/validators';
import RecommendationResult from './recommendation_result';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import download from 'assets/download.svg';
import launch from 'assets/launch.svg';
import {storageService} from "utils/validators";
import { updateLead } from './common_data';
import { capitalizeFirstLetter } from 'utils/validators'
class AdivsoryRecommendations extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            profile_image: storageService().getObject('advisory_data').user_data.gender === 'MALE' ? 'advisory_male' : 'advisory_female',
            openDialogReset: false,
        }
        this.updateLead = updateLead.bind(this);
    }

    navigate = (pathname, search) => {
        this.props.history.push({
          pathname: pathname,
          search: search ? search : getConfig().searchParams,
        });
      }

    componentDidMount(){
        var recommendation_data = storageService().getObject('advisory_data').recommendation_data.recommendation_data;
        var recommend_text = storageService().getObject('advisory_data').recommendation_data.rec_text;
        console.log('this', recommendation_data)
        var user_data = storageService().getObject('advisory_data').user_data;

        var dependents =  user_data.dependent_json;
        var dependent_count = dependents.kids + dependents.spouse + dependents.parents;

        
        this.setState({
            user_data: user_data,
            dependent_count: dependent_count,
            recommendation_data: recommendation_data,
            recommend_text: recommend_text
        })
    }
    handleReset = () =>{
        
        this.setState({
            openDialogReset: false,
        })
        this.updateLead({'status': 'cancelled'}, 'landing')
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
                    <Button onClick={this.handleReset} color="default">
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
        var recommendation_data = this.state.recommendation_data;
        var user_data = this.state.user_data;
        console.log(this.state.applicantGender)
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
                showLoader={this.state.show_loader}
            >
                <div className="advisory-recommendations-container">
                    <p className="advisory-sub-text">So you can plan better</p>

                    <div className="rec-profile-container">
                            <p className="rec-profile-heading">Your profile</p>
                            <div className="rec-profile">
                                <div className="rec-profile-left">
                                    <img style={{width: '120px', height: '120px'}} src={require(`assets/${this.state.type}/${this.state.profile_image}.svg`)}/>
                                </div>
                                {user_data && (
                                    <div className="rec-profile-right">
                                    <p>{capitalizeFirstLetter(user_data.name)}</p>
                                    <p>{capitalizeFirstLetter(user_data.gender.toLowerCase())}</p>
                                    <p>{user_data.age} years</p>
                                    <p>{this.state.dependent_count} dependents</p>
                                </div>
                                )}
                                
                            </div>
                    </div>

                    <p className="advisory-sub-text" style={{marginTop: '18px'}}>{this.state.recommend_text}</p>
                    <p style={{fontSize: '17px', fontWeight: 'bold', margin:'30px 0 20px 0', color: '#160D2E' }}>Here's what we recommend</p>
                    

                    {
                        recommendation_data && recommendation_data.map( (item, index) =>{
                          return <RecommendationResult key={index + 1} parent={this} parentsPresent={user_data.dependent_json.parents} recommendation_data={item}/>
                        })
                    }

                    <div className="recommendation-extras">
                        <div className="download-report">
                            <img src={download} style={{marginRight: '5px'}} /> Download report
                        </div>
                        <div className="recommendation-extras-divider">|</div>
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
