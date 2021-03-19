import React, { Component } from 'react';
import Container from '../common/Container';
import '../common/Style.css';
import { getConfig } from 'utils/functions';
import { capitalizeFirstLetter } from 'utils/validators'
import { nativeCallback } from 'utils/native_callback';
import Input from '../../common/ui/Input'
import Dialog, { DialogContent  } from 'material-ui/Dialog';
import Api from '../../../src/utils/api';
import toast from '../../common/ui/Toast'
import DropDownNew from '../../common/ui/DropDownNew'

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
        vendor_details : {},
        form_data : {},
        openBmiDialog : false,
        searching : true,
        lock : false,
        binding : true,
        o2o_data : '',
        color : ''
    };
    
  }
componentWillMount() {

  let vendor_details = [{
      'name': 'HDFC Ergo',
      'value': 'hdfc ergo'
    },
    {
      'name': 'Bharti Axa',
      'value': 'bharti axa general'
    },
    {
      'name': 'Care Health',
      'value': 'religare health'
    },
    {
      'name': 'Star Health',
      'value': 'star health'
    },
    {
      'name': 'Bajaj Allianz',
      'value': 'bajaj allianz'
    },
    {
      'name': 'HDFC Life',
      'value': 'hdfc life'
    }, {
      'name': 'Edelweiss Tokio Life',
      'value': 'edelweiss tokio'
    }, {
      'name': 'Kotak Life',
      'value': 'kotak life'
    }
  ]

  let form_data = this.state.form_data
  // form_data.Vendor = 'HDFC Ergo'
  let color =  this.state.type === 'fisdom' ? '#6650AB' : 'blue' 

  form_data.title = 'CONTINUE'
  this.setState({
    vendor_details: vendor_details,
    form_data : form_data,
    color : color
  })
}



handleChange = name => event => {
  document.getElementsByClassName("MuiButtonBase-root MuiButton-root")[0].style.backgroundColor = "#35CB5D";
  // setTimeout(() => {
  //   var x = document.getElementsByClassName("MuiButtonBase-root MuiButton-root")
  //   for (var i = 0; i < x.length; i++) {
  //     x.item(i).style.backgroundColor = "#35CB5D";
  //   }
  // }, 0);

  if (!name) {
    return
  }

  if(name === 'number'){
    var value = event ? event.target.value : event;
  }
  let form_data = this.state.form_data
  form_data.title = 'CONTINUE'
  form_data.notfound = false
  form_data.found = false
  if (name === 'Vendor') {
    // eslint-disable-next-line
    var value = event
    form_data.index = event
  };
  form_data[name] = value;
  form_data[name + '_error'] = '';
  this.setState({
    form_data: form_data,
    binding: true
  })
}

handleClick2 = async () => {
  this.setState({ show_loader: true });
  let form_data = this.state.form_data
  try {
    const res = await Api.get(`/api/insurancev2/api/insurance/o2o/bind/user/policy/applications?policy_or_proposal_number=${form_data.number}&provider=${form_data.Vendor}&bind=true`)
    if (res.pfwresponse.status_code === 200) {
      this.sendEvents('next','policy found')
      let state = `/group-insurance/common/report`;
      this.navigate(state);
    }
    this.setState({ show_loader: false });
  }
  catch (err) {
    toast("Something went wrong");
    this.setState({
      show_loader: false
    });
  }
}

handleClose = () => {
  this.sendEvents('back','policy found')
  let form_data = this.state.form_data
  form_data.title = 'CONTINUE'
  this.setState({
    openConfirmDialog: false,
    openBmiDialog: false,
    openDialogReset: false,
    form_data : form_data
  });
}


sendEvents(user_action, policy_found) {
  let eventObj = {
    "event_name": 'import_policy',
    "properties": {
      "user_action":  user_action,
      "screen_name": policy_found ? policy_found : 'enter policy details',
    }
  };

  if (user_action === 'just_set_events') {
    return eventObj;
  } else {
    nativeCallback({
      events: eventObj
    });
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

componentDidMount() {
  this.setState({
    show_loader: false
  })
}


handleClick = async () => {

  if (!this.state.binding) {
    return;
  }

  let form_data = this.state.form_data
  form_data.name_error = ''
  form_data.name_error2 = ''

  if (!form_data.number) {
    form_data.name_error = 'Please Enter Policy number'
  }

  if (!form_data.Vendor) {
    form_data.name_error2 = 'Please Select Company Name'
  }

  if (!form_data.Vendor || !form_data.number) {
    this.setState({
      form_data: form_data
    });
    toast('Please Fill in the details');
    return
  } else {
    this.setState({
      form_data: form_data
    });
  }

  this.setState({
   show_loader : true
  });
  try {
    const res = await Api.get(`/api/insurancev2/api/insurance/o2o/bind/user/policy/applications?policy_or_proposal_number=${form_data.number}&provider=${form_data.Vendor}`);
    let resultData = res.pfwresponse.result
    form_data.title = 'SUBMIT TO FETCH THE DETAIL'
    if (res.pfwresponse.status_code === 200) {
      form_data.notfound = false
      form_data.found = false
      this.setState({
        openBmiDialog: true,
        form_data: form_data,
        o2o_data: resultData.o2o_data,
        binding: true
      })
    } else if (!resultData.found) {
      form_data.found = false
      form_data.notfound = true
      document.getElementsByClassName("MuiButtonBase-root MuiButton-root")[0].style.backgroundColor = "#CDF4D7";
      document.getElementsByClassName("Footer")[0].style.boxShadow = 'none'
      this.setState({ binding: false})
    } else if (resultData.found) {
      form_data.found = true
      form_data.notfound = false
      document.getElementsByClassName("MuiButtonBase-root MuiButton-root")[0].style.backgroundColor = "#CDF4D7";
      document.getElementsByClassName("Footer")[0].style.boxShadow = 'none'
      this.setState({ binding: false})
    } else {
      toast(resultData.error || resultData.message || "Something went wrong");
    }
    this.setState({
      form_data: form_data,
      show_loader : false
    });

  } catch (err) {
    toast("Something went wrong");
    console.log(err)
    this.setState({
      show_loader : false
    });
  }
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

            <div className="top-content flex-between" style={{marginBottom : '20px', marginTop : '-15px'}}>
              <div className="generic-page-title">
               <h2>Policy found!</h2>
              </div>
              <img className=""  src={require(`assets/${this.state.type}/icn_policy_found_f.svg`)} alt="" />
            </div>
            <div className="content-mid">
          <div className="content-large-offline-page">We have found one policy with the following details:</div> 
          <div className="content-large-offline-page">Proposer Name: <span style={{fontWeight:'500'}}>{capitalizeFirstLetter(this.state.o2o_data.customer_name)} </span></div>
          <div className="content-large-offline-page">Product Name:  <span style={{fontWeight:'500'}}>{capitalizeFirstLetter(this.state.o2o_data.product_name)} </span> </div>
            </div>
            <div className="content-bottom">
            Would you like to import the policy details?
            <br></br>
            </div>

            <div className="actions flex-between">
              <div className="generic-page-button-large" onClick={this.handleClose}>
              NO
              </div>
              <div className="generic-page-button-small-with-green" onClick={() => {
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
      fullWidthButton={true}
      buttonTitle={this.state.form_data.title}
      onlyButton={true}
      handleClick={() => this.handleClick(this.state.binding)}
      withProvider={true}
      title='Enter your policy details'
      >
        {/* <div className='health_insurance' style={{fontWeight: '700', fontSize:'20px', marginTop:'' }}> Enter your policy details   </div> */}
            <div className="InputField">
            <div>
            <DropDownNew
              parent={this}
              header_title="Insurance Company"
              cta_title="SAVE"
              selectedIndex = { this.state.form_data.index || 0}
              width="40"
              dataType="AOB"
              options={this.state.vendor_details}
              id="relation"
              label="Insurance Company"
              error={this.state.form_data.name_error2 ? true : false}
              name="Vendor"
              helperText={this.state.form_data.name_error2}
              value={this.state.form_data.Vendor || ''}
              onChange={this.handleChange("Vendor")}
            />
          </div>
          <br></br>
            <div className="InputField" style={{marginBottom : '20px'}}>
                        <Input
                            type="text"
                            width="40"
                            class="ProposalNumber"
                            label="Policy / Proposal number"
                            id="name"
                            name="name"
                            maxLength="50"
                            error={this.state.form_data.name_error ? true : false}
                            helperText={this.state.form_data.name_error}
                            value={this.state.form_data.number || ''}
                            onChange={this.handleChange('number')} />
                    </div>
                    <div>

                   {this.state.form_data.notfound &&  <span><p style={{color : 'red'}}> Sorry! Couldn’t find your policy details! </p>
                    <p style={{color : this.state.color}}>If you have bought a policy recently please wait for 2-3 days to check it here. </p></span>}
                    {this.state.form_data.found &&  <span><p style={{color : 'red'}}> This policy already exist in insurance portfolio </p></span>} 
                    </div>
                </div>
        {this.renderBmiDialog()}
      </Container>
    );
  }
}


export default AddPolicy;