import React, { Component } from 'react'
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
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
import { openPdf } from './common_data';
import { openInBrowser } from "../products/group_health/common_data";

class AdivsoryRecommendations extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            profile_image: storageService().getObject('advisory_data').user_data.gender === 'MALE' ? 'advisory_male' : 'advisory_female',
            openDialogReset: false,
        }
        this.updateLead = updateLead.bind(this);
        this.openInBrowser = openInBrowser.bind(this);
        this.openPdf = openPdf.bind(this);
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
        this.setErrorData('submit');
        this.sendEvents('refresh');
        this.setState({
            openDialogReset: false,
        })
        this.updateLead({'status': 'cancelled'}, 'basic-details', '', true)
    }

    sendEvents(user_action, insurance_type, banner_clicked, download_report) {
        let eventObj = {
          "event_name": 'insurance_advisory',
          "properties": {
            "user_action": user_action,
            "screen_name": 'recommendations',
            "download_report": download_report ? 'yes' : 'no', 
          }
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
    }

    handleClose = () => {
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

    setErrorData = (type) => {

        this.setState({
          showError: false
        });
        if(type) {
          let mapper = {
            'onload':  {
              handleClick1: this.downloadReportPdf,
              button_text1: 'Retry',
              title1: ''
            },
            'submit': {
              handleClick1: this.handleReset,
              button_text1: 'Retry',
            }
          };
      
          this.setState({
            errorData: {...mapper[type], setErrorData : this.setErrorData}
          })
        }
    }

    showDialog = () => {
        this.setState({
            openDialogReset: true,
        });
    }
  
    goToEmail = () =>{
        this.sendEvents('email report');
        this.navigate('/group-insurance/advisory/email-report')
    }

    downloadReportPdf = async () =>{
        
        this.setErrorData('onload')
        
        this.setState({
            skelton: true
        })
        this.sendEvents('next', "", "", true)
        var advisory_id = storageService().getObject("advisory_id")
        let error = '';
        try{
            var res = await Api.get(`api/insurancev2/api/insurance/advisory/pdf/download?insurance_advisory_id=${advisory_id}`);

            
            var resultData = res.pfwresponse.result;
          
            if (res.pfwresponse.status_code === 200) {
                this.setState({
                    skelton: false
                })
                
                this.openPdf(resultData.download_link, "read_document")
            } else {
              error = resultData.error || resultData.message || true;
            }
        }catch(err){
            this.setState({
                show_loader: false,
                skelton: false,
                showError: true,
                errorData: {
                  ...this.state.errorData, type: 'crash'
                }
              });
        }

        // set error data
        if(error) {
          this.setState({
            errorData: {
              ...this.state.errorData,
              title2: error
            },
            showError: true,
            skelton: false,
          })
        }

    }

    render(){
        var recommendation_data = this.state.recommendation_data;
        var user_data = this.state.user_data;

        return(
            <Container
                events={this.sendEvents('just_set_events')}
                fullWidthButton={true}
                onlyButton={true}
                title="Our recommendations"
                resetpage={true}
                handleReset={this.showDialog}
                disableBack={true}
                noFooter={true}
                handleClick={()=>this.handleClick()}
                showError={this.state.showError}
                errorData={this.state.errorData}
                showLoader={this.state.show_loader}
                loaderData= {
                    {
                        'loaderClass': 'Loader-Dialog',
                        'loadingText': 'Always plan ahead. It wasn’t raining when Noah built the ark.'
                    }
                }
                skelton={this.state.skelton}
            >
                <div className="advisory-recommendations-container">
                    <p className="advisory-sub-text" style={{marginTop: '-8px'}}>So you can plan better</p>

                    <div className="rec-profile-container">
                            <p className="rec-profile-heading">Your profile</p>
                            <div className="rec-profile">
                                <div className="rec-profile-left">
                                    <img style={{width: '120px', height: '120px'}} alt="" src={require(`assets/${this.state.type}/${this.state.profile_image}.svg`)}/>
                                </div>
                                {user_data && (
                                    <div className="rec-profile-right">
                                    <p>{capitalizeFirstLetter(user_data.name)}</p>
                                    <p>{capitalizeFirstLetter(user_data.gender.toLowerCase())}</p>
                                    <p>{user_data.age} years</p>
                                    { this.state.dependent_count ? (<p>{this.state.dependent_count} dependents</p>) : null}
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
                        <div className="download-report" onClick={()=>this.downloadReportPdf()}>
                            <img src={download} alt="" style={{marginRight: '5px'}} /> Download report
                        </div>
                        <div className="recommendation-extras-divider">|</div>
                        <div className="email-report"  onClick={()=>this.goToEmail()}>
                            <img src={launch} alt="" style={{marginRight: '5px'}}/> Email report 
                        </div>
                    </div>
                </div>
                {this.renderDialog()}
            </Container>
        )
    }
}

export default AdivsoryRecommendations
