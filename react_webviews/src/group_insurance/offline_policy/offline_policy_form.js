import React, { Component } from 'react';
import Container from '../common/Container';
import '../common/Style.css';
import { getConfig } from 'utils/functions';
// import { insuranceProductTitleMapper } from '/constants';
import { nativeCallback } from 'utils/native_callback';
import DropdownWithoutIcon from '../../common/ui/SelectWithoutIcon'
import DropdownInModal from '../../common/ui/DropdownInModal'
import Input from '../../common/ui/Input'
import Dialog, { DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class AddPolicy extends Component {

  constructor(props) {
    super(props);
    this.state = {
        checked: false,
        parent: this.props.parent,
        type: getConfig().productName,
        show_loader: true,
        premium_details : {},
        productTitle : {},
        company : {},
        form_data : {},
        openBmiDialog : false
    };
    
  }

  componentWillMount(){

    let company =  [
        {
            'name': 'CARE',
            'value': 'CARE'
        },
        {
            'name': 'HDFC',
            'value': 'HDFC_ERGO'
        },
        {
            'name': 'STAR',
            'value': 'STAR'
        }]

      this.setState({
        company : company
      })
  }



  handleChange = name  => event => {

    let company = this.state.company
    var value = company[event].name

    let form_data = this.state.form_data 
    form_data[name] = value;
    form_data.index = event
    form_data[name + '_error'] = '';

    this.setState({
        form_data : form_data
    })    
}


  handleClick = () => {
    this.setState({
      openBmiDialog: true
    })

    var form_data = this.state.form_data
    form_data.notfound = true
  
    this.setState({
        form_data : form_data
    })
  }

  handleClick2 = () => {
  let  state  = `/group-insurance/common/report`;
      this.navigate(state);
  }
 
  handleClose = () => {
    this.setState({
      openConfirmDialog: false,
      openBmiDialog: false,
      openDialogReset: false
    });
  }


  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'decleration',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  navigate = (pathname, search, data = {}) => {

    if (this.props.edit || data.edit) {
      this.props.history.replace({
          pathname: pathname,
          search: getConfig().searchParams
      });
  } else {
      this.props.history.push({
          pathname: pathname,
          search: getConfig().searchParams,
          params: {
              forceClose: this.state.forceClose || false
          }
      });
  }
  }

  componentDidMount(){
    this.setState({
        show_loader: false
      })
  }


  renderBmiDialog = () => {
    return (
      <Dialog
        id="bottom-popup"
        open={this.state.openBmiDialog || false}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="group-health-bmi-dialog" id="alert-dialog-description">

            <div className="top-content flex-between">
              <div className="generic-page-title">
               <h2>Policy Found!</h2>
              </div>
              <img className=""  src={require(`assets/${this.state.type}/icn_policy_found_f.svg`)} alt="" />
            </div>
            <div className="content-mid">
            We have found one policy with the following details:
              Proposer Name: Uttam Paswan
            Product Name: Care health insurance
            </div>

            <div className="content-bottom">
            Would you like to import the policy details?
            </div>

            <div className="actions flex-between">
              <div className="generic-page-button-large" onClick={this.handleClose}>
              NO
              </div>
              <div className="generic-page-button-small-with-green" onClick={() => {
                this.handleClose();
                this.handleClick2();
              }}>
                YES
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  render() {
    return (
      <Container
      events={this.sendEvents("just_set_events")}
      showLoader={this.state.show_loader}
      title={'Enter your policy details'}
      fullWidthButton={true}
      buttonTitle={'CONTINUE'}
      onlyButton={true}
      handleClick={() => this.handleClick()}
      >
            <div className="InputField" style={{marginTop : '10px'}}>
            <div>
            <DropdownInModal
              parent={this}
              header_title="Insurance Company"
              cta_title="SAVE"
              selectedIndex = { this.state.form_data.index || 0}
              width="40"
              dataType="AOB"
              options={this.state.company}
              id="relation"
              label="Insurance Company"
              error={ false}
              name="Vendor"
            //   helperText={'Insurance Company'}
              value={this.state.form_data.Vendor || 'CARE'}
              onChange={this.handleChange("Vendor")}
            />
          </div>
            <div className="InputField" style={{marginBottom : '20px'}}>
                        <Input
                            type="text"
                            width="40"
                            class="NomineeName"
                            label="Policy / Proposal number"
                            id="name"
                            name="name"
                            maxLength="50"
                            // error={this.state.form_data.name_error ? true : false}
                            // helperText={this.state.form_data.name_error}
                            value={this.state.form_data.name || ''}
                            onChange={this.handleChange('name')} />
                    </div>
                    <div>

                   {this.state.form_data.notfound &&  <span><p style={{color : 'red'}}> Sorry! Couldn’t find your policy details! </p>
                    <p style={{color : 'blue'}}>If you have bought a policy recently please wait for 2-3 days to check it here. </p></span>}
                    </div>
                </div>
                {/* <ConfirmDialog parent={this} /> */}
        {this.renderBmiDialog()}
        {/* {this.renderResetDialog()} */}
      </Container>
    );
  }
}


export default AddPolicy;