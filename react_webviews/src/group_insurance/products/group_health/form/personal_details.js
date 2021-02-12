import React, { Component } from 'react';
import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers, genderOptions, childeNameMapper } from '../../../constants';
import {
  calculateAge, toFeet, capitalizeFirstLetter,
  formatDate, validatePan, validateAlphabets, dobFormatTest, isValidDate, containsSpecialCharactersAndNumbers, containsSpecialCharacters
} from 'utils/validators';
import Input from '../../../../common/ui/Input';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import DropdownInModal from '../../../../common/ui/DropdownInModal';
import { initialize, updateLead, resetQuote } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import Dialog, {
  DialogContent,
  DialogContentText, DialogActions
} from 'material-ui/Dialog';
import ReactTooltip from "react-tooltip";
import Button from 'material-ui/Button';
import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import GenericTooltip from '../../../../common/ui/GenericTooltip';
import { storageService } from 'utils/validators';

class GroupHealthPlanPersonalDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: getConfig().productName,
      header_title: 'Personal details',
      form_data: {},
      ctaWithProvider: true,
      quotation : { member_details : {}  },
      get_lead: true,
      openBmiDialog: false,
      pan_needed: false,
      screen_name: 'personal_details_screen',
      occupationOptions: [],
    }
    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
    this.resetQuote = resetQuote.bind(this);
  }
  

  onload = () => {
  
    let lead = this.state.lead || {}
    let quotation = this.state.quotation || {};     
    let insured_people_details  = lead.insured_people_details;
    let occupationOptions = this.state.screenData.occupation_opts;

    this.setState({
      occupationOptions: occupationOptions
    })

    let spouse_relation = quotation.member_details.spouse_account_key ? quotation.member_details.spouse_account_key.relation.toUpperCase() : '';
 
    let member_base = this.state.member_base || [];
  
    // let member_key = this.props.match.params.member_key;
    let member_key = this.props.member_key;

    let pan_amount = this.state.pan_amount;

    let pan_needed = false;
    if (quotation.total_premium > pan_amount && (member_key === 'self' || member_key === 'applicant')) {
      pan_needed = true;
    }
 

    let header_title = `${capitalizeFirstLetter(childeNameMapper(member_key))}'s details`;
    let header_subtitle = '';

    if (member_key === 'self') {
      header_title = 'Personal details';
      header_subtitle = 'Policy will be issued basis these details';
    }

    let next_state = `/group-insurance/group-health/${this.state.provider}/contact`;
    let backend_key, form_data = {};

    for (var i = 0; i < member_base.length; i++) {
      if(member_base[i].key === member_key){
          if(i !== member_base.length - 1){
            next_state = member_base[i + 1].key;
          }
      }
    }
    if (this.props.edit) {
      next_state = `/group-insurance/group-health/${this.state.provider}/final-summary`;
    }

    member_base.forEach(element => {   
      if(element["key"] === member_key){
         // eslint-disable-next-line
        backend_key = element.backend_key          
      }
    });

    if (this.state.provider !== 'STAR'){
      insured_people_details.forEach((member) => {
       if (member.insured_person.relation_key === backend_key) {
        form_data = member.insured_person
       }
     })
 }

    form_data.pan_no =   lead.buyer_details.pan_no || "";
    let dobNeeded = member_key === 'applicant';
    form_data['dob'] = form_data['dob'] ? form_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';
    let age = calculateAge(form_data.dob);

    let height_options = [];

    for (var j = 30; j < 1000; j++) {
      let data = {
        name: `${j}cm (${toFeet(j)})`,
        value: j
      };
      height_options.push(data);
    }


    if (this.state.provider === 'STAR') {
      var occupation;
      insured_people_details.forEach((member) => {
        if (member.insured_person.relation_key === backend_key) {
          form_data = member.insured_person   
          occupation = member.insured_person.occupation
        }
      })
      
      let occupationIndex = '';
      occupationIndex = occupation !== null && occupationOptions.findIndex(item => item.name === occupation || item.value === occupation);
      form_data.occupation = (occupationIndex && occupationIndex !== -1) && occupationOptions[occupationIndex].value;
    };

    var selectedIndex = 123;
    let height = form_data.height || height_options[selectedIndex].value;
    if (form_data.height) {
      height_options.forEach(function (x, index) {
        if (x.value === parseInt(form_data.height, 10)) {
          return selectedIndex = index;
        }
      });
    } else {
      form_data.height = `${height}`;
    }

    form_data.selectedIndex = selectedIndex;


    if(member_key === 'applicant'){
      form_data = lead.buyer_details;
      form_data.relation = 'self';
      form_data.relation_key = 'applicant';
      backend_key = 'self_account_key';
    }

    this.setState({
      providerData: health_providers[this.state.provider],
      next_state: next_state,
      member_key: member_key,
      form_data: form_data,
      age: age,
      lead: lead,
      backend_key: backend_key,
      height_options: height_options,
      show_loader: false,
      header_title: header_title,
      header_subtitle: header_subtitle,
      selectedIndex: selectedIndex,
      height: height,
      pan_needed: pan_needed,
      spouse_relation: spouse_relation,
      dobNeeded: dobNeeded
    }, () => {
      ReactTooltip.rebuild()
    })
  }

  async componentDidUpdate(prevState) {
    if (this.state.member_key && this.state.member_key !== this.props.member_key) {
      this.onload();
    }
    storageService().setObject('applicationPhaseReached', true);
  }

  componentWillMount() {
    this.initialize()
  }


  handleChange = name => event => {

    var input = document.getElementById('dob');
    input.onkeyup = formatDate;

    let form_data = this.state.form_data;

    if (!name) {
      name = event.target.name;
    }

    var value = event.target ? event.target.value : event;

    if(name === 'weight'){
      value = event.target ? event.target.value.substr(0,3) : event;
    }

    if(containsSpecialCharactersAndNumbers(value) && name === 'name'){
      return;
    }

    if(name === 'pan_no' && containsSpecialCharacters(value)){
      return;
    }
    
    if (name === 'dob' && !dobFormatTest(value)) {
      return;
    }
    if (name === 'height') {
      let index = event;
      const height = `${this.state.height_options[index].value}`;
      this.setState({
        selectedIndex: index
      }, () => {
        form_data[name] = height;
        form_data[name + '_error'] = '';

        this.setState({ height });
      });
    } else {
      form_data[name] = value;
      form_data[name + '_error'] = '';
    }

    this.setState({
      form_data: form_data
    });

  };

  handleClick = async () => {

    this.sendEvents('next');
    let keys_to_check = ['name', 'dob', 'height', 'weight'];

    if (this.state.member_key === 'self') {
      keys_to_check.push('gender');
    }

    if (this.state.member_key === 'applicant') {
      keys_to_check = ['name', 'dob', 'gender']
    }

    if (this.state.pan_needed) {
      keys_to_check.push('pan_no');
    }

    let form_data = this.state.form_data;

    let validation_props = this.state.validation_props;

    let isChild = form_data.relation.includes('SON') || form_data.relation.includes('DAUGHTER');
    if (this.state.provider === 'RELIGARE') {
      if (isChild) {
        const age = calculateAge(form_data.dob, true);
        if (this.state.groupHealthPlanData.type_of_plan === 'WF') {
          if (age.days <= validation_props.dob_child.minDays || age.age >= validation_props.dob_child.max) {
            form_data.dob_error = `Only children between ${validation_props.dob_child.minDays} days & ${validation_props.dob_child.max} yrs can be included`;
          }
        } else {
          if (age.age < validation_props.dob_child.minAge || age.age >= validation_props.dob_child.max) {
            form_data.dob_error = `Only children between ${validation_props.dob_child.minAge}  yrs & ${validation_props.dob_child.max} yrs can be included`;
          }
        }
      }
    }

    if (!isValidDate(form_data.dob)) {
      form_data.dob_error = 'Please enter valid date';
    }

    for (var i = 0; i < keys_to_check.length; i++) {
      let key_check = keys_to_check[i];
      let first_error = key_check === 'gender' || key_check === 'height' ? 'Please select ' :
        'Please enter ';
      if (!form_data[key_check] || form_data[key_check] === "0") {
        form_data[key_check + '_error'] = first_error + (key_check === 'pan_no' ? 'pan number' : key_check);
      }
    }

    if (form_data && (form_data.name || '').split(" ").filter(e => e).length < 2) {
      form_data.name_error = 'Enter valid full name';
    }

    if (this.state.pan_needed && form_data.pan_no &&
      !validatePan(form_data.pan_no)) {
      form_data.pan_no_error = 'Invalid PAN number';
    }

    if ((this.state.member_key === 'self' || this.state.member_key === 'applicant') && form_data.gender) {
      if (this.state.spouse_relation === 'HUSBAND' && form_data.gender === 'MALE') {
        form_data.gender_error = 'Invalid gender';
      }

      if (this.state.spouse_relation === 'WIFE' && form_data.gender === 'FEMALE') {
        form_data.gender_error = 'Invalid gender';
      }
    }

    let { provider } = this.state;

    if (provider === 'STAR' && (form_data.occupation === null || form_data.occupation === false) && this.state.member_key !== 'applicant') {
      form_data.occupation_error = 'please select one occupation';
    }

    let age = calculateAge((form_data.dob || ''));

    if (this.state.dobNeeded) {
      if (provider === 'RELIGARE') {
        if ((age < validation_props.dob_adult.min || age > validation_props.dob_adult.max) && !isChild) {
          form_data.dob_error = `Valid age is between ${validation_props.dob_adult.min } - ${validation_props.dob_adult.max - 1} years`;
        }
      }

      if (provider === 'STAR') {
        if ((age < validation_props.dob_adult.min || age > validation_props.dob_adult.max) && !isChild) {
          form_data.dob_error = `Valid age is between ${validation_props.dob_adult.min} to ${validation_props.dob_adult.max - 1} year`;
        }
      }
    }


    if (this.state.member_key === 'applicant') {

      if (provider === 'HDFCERGO') {
        if (form_data.gender === 'MALE' && (age < validation_props.dob_married_male.min || age > validation_props.dob_married_male.max)) {
          form_data.dob_error = `Valid age is between ${validation_props.dob_married_male.min } - ${validation_props.dob_married_male.max - 1} years`;
        }

        if (form_data.gender === 'FEMALE' && (age < validation_props.dob_married_female.min || age > validation_props.dob_married_female.max )) {
          form_data.dob_error = `Valid age is between ${validation_props.dob_married_female.min } - ${validation_props.dob_married_female.max - 1} years`;
        }

      }

      if (this.state.quotation.insurance_type === 'parents') {
        let ageParent1 = calculateAge(((this.state.quotation.member_details.parent_account1_key || {}).dob || ''));
        let ageParent2 = calculateAge(((this.state.quotation.member_details.parent_account2_key || {}).dob || ''));

        if ((ageParent1 && age >= ageParent1) || (ageParent2 && age >= ageParent2)) {
          form_data.dob_error = "Applicant's age should be less than parents'age";
        }
      }
    }

    if (form_data.name &&
      !validateAlphabets(form_data.name)) {
      form_data.name_error = 'Invalid name';
    }

    let weight_limit = form_data.weight ? form_data.weight.toString() : ''
    // .weight.toString()

    if(weight_limit.length > 3){
      form_data.weight_error = "Invalid weight";
    }

    let canSubmitForm = true;
    for (var key in form_data) {
      if (key.indexOf('error') >= 0) {
        if (form_data[key]) {
          canSubmitForm = false;
          break;
        }
      }
    }

    this.setState({
      form_data: form_data
    })


    if (canSubmitForm) {

      let gender = '';
      if (this.state.member_key !== 'self') {
        gender = 'FEMALE';
        if (['son', 'son1', 'son2','son3','son4', 'father', 'father_in_law', 'husband'].indexOf(this.state.member_key) !== -1) {
          gender = 'MALE';
        }
      }
                                                   
      let occupationValue = '';     
      if (provider === 'STAR') {
        let { occupationOptions } = this.state;
        let occupation = form_data.occupation || '';
        occupationValue = occupation && occupationOptions.find(item => item.name === occupation || item.value === occupation).name;
      }
      let body = {
    
        "insured_people_details": [{
          "name": form_data.name,
          "height": form_data.height || '',
          "relation_key": this.state.backend_key,
          "weight": form_data.weight || '',
          "relation": this.state.form_data.relation,
          "dob": form_data.dob || '',
          "gender": form_data.gender || gender,
        }]
      }

         if (provider === 'STAR') {
          body = {
          "insured_people_details": [{
            "name": form_data.name,
            "height": form_data.height || '',
            "relation_key": this.state.backend_key,
            "weight": form_data.weight || '',
            "relation": this.state.form_data.relation,
            "dob": form_data.dob || '',
            "gender": form_data.gender || gender,
            "occupation" : occupationValue
          }]
        }
      }
      

      if (this.state.backend_key === 'self_account_key') {
        body.buyer_details = {
          "name": form_data.name || '',
          "pan_no": form_data.pan_no || "",
          "dob": form_data.dob || '',
          "gender": form_data.gender || gender,
        }
      } 

      if (this.state.backend_key === 'self_account_key' && provider === 'STAR') {
        body = {
          "insured_people_details": [{
            "name": form_data.name,
            "height": form_data.height || '',
            "relation_key": this.state.backend_key,
            "weight": form_data.weight || '',
            "relation": this.state.form_data.relation,
            "dob": form_data.dob || '',
            "gender": form_data.gender || gender,
            "occupation": occupationValue
          }],
          "buyer_details": {
            "name": form_data.name || '',
            "pan_no": form_data.pan_no || "",
            "dob": form_data.dob || '',
            "gender": form_data.gender || gender,
          }
        }
      }
      if(this.props.member_key === "applicant"){
        body = {
          "buyer_details": {
            "name": form_data.name || '',
            "pan_no": form_data.pan_no || "",
            "dob": form_data.dob || '',
            "gender": form_data.gender || gender,
          } 
        }
      }

      this.updateLead(body);
    }
  }

  sendEvents(user_action, data = {}) {  
    let formName = (this.state.form_data.name || '').split(" ").filter(e => e).length >= 2;
    let eventObj = {
      "event_name": 'health_insurance',
      "properties": {
        "user_action": user_action,
        "product": this.state.providerConfig.provider_api,
        "flow": this.state.insured_account_type || '',
        "screen_name": 'personal details',
        'full_name': formName ?  'yes' : 'no',
        'dob': this.state.form_data.dob,
        'height': this.state.form_data.height ? 'yes' : 'no',
        'weight': this.state.form_data.weight ? 'yes' : 'no',
        'gender': this.state.form_data.gender ? 'yes' : 'no',
        'member': this.props.member_key,
        "occupation": this.state.form_data.occupation ? 'yes' : 'no',
        'from_edit': this.props.edit ? 'yes' : 'no',
        'pan_entered': this.state.form_data.pan_no ? 'yes' : 'no',
        'policy_cannot_be_issued': data.bmi_check ? 'yes' : 'no'
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
      openConfirmDialog: false,
      openBmiDialog: false,
      openDialogReset: false
    });

  }
  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true,
    })
  }


  handleChangeRadio = name => event => {


    var form_data = this.state.form_data || {};

    let optionsMapper = {
      'gender': genderOptions
    }
    form_data[name] = optionsMapper[name][event].value;
    form_data[name + '_error'] = '';

    this.setState({
      form_data: form_data
    })

  };

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
                Sorry, policy can't be issued!
              </div>
              <img className=""
                src={require(`assets/${this.state.productName}/ic_medical_checkup.svg`)} alt="" />
            </div>
            <div className="content-mid">
          {this.state.provider === 'HDFCERGO' ? 'We are not able to proceed with this application as the insured BMI* is greater than 40.' : 'We are not able to proceed with this application as the insured BMI does not fall under permissible limits for this product.'}
            </div>

            <div className="content-bottom">
              *Body mass index (BMI) is a measure of body fat based on height and weight
            </div>

            <div className="actions flex-between">
              <div className="generic-page-button-small" onClick={this.handleClose}>
                CHANGE DETAILS
              </div>
              <div className="generic-page-button-small-with-back" onClick={() => {
                this.handleClose();
                this.setState({
                  openDialogReset: true
                })
              }}>
                CHANGE INSURED
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  renderResetDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialogReset || false}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            By continuing, you will reset your application.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.resetQuote} color="default">
            CONTINUE
          </Button>
          <Button onClick={this.handleClose} color="default" autoFocus>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {

    let currentDate = new Date().toISOString().slice(0, 10);    
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        skelton={this.state.skelton}
        title={this.setEditTitle(this.state.header_title)}
        withProvider={true}
        handleClick2={this.handleClick2}
        buttonData={this.state.bottomButtonData}
        buttonTitle="CONTINUE"
        handleClick={() => this.handleClick()}
      >
        {this.state.header_subtitle && (
          <div className="common-top-page-subtitle">
            {this.state.header_subtitle}
          </div>
        )}
        
        <div className="InputField">
          <Input
            type="text"
            width="40"
            label="Full name"
            class="Name"
            maxLength={this.state.provider === 'STAR' ? "100": "50"}
            id="name"
            name="name"
            error={this.state.form_data.name_error ? true : false}
            helperText={this.state.form_data.name_error}
            value={this.state.form_data.name || ""}
            onChange={this.handleChange()}
          />
        </div>
        <div className="InputField">
          <Input
            disabled={!this.state.dobNeeded}
            type="text"
            width="40"
            label="Date of birth (DD/MM/YYYY)"
            class="dob"
            id="dob"
            name="dob"
            max={currentDate}
            error={this.state.form_data.dob_error ? true : false}
            helperText={this.state.form_data.dob_error}
            value={this.state.form_data.dob || ""}
            placeholder="DD/MM/YYYY"
            maxLength="10"
            onChange={this.handleChange()}
          />
        </div>

        {(this.state.member_key === "self" ||
          this.state.member_key === "applicant") && (
          <div className="InputField">
            <RadioWithoutIcon
              width="40"
              label="Gender"
              class="Gender:"
              options={genderOptions}
              id="gender"
              name="gender"
              error={this.state.form_data.gender_error ? true : false}
              helperText={this.state.form_data.gender_error}
              value={this.state.form_data.gender || ""}
              onChange={this.handleChangeRadio("gender")}
            />
          </div>
        )}

        {(this.state.member_key === "self" ||
          this.state.member_key === "applicant") &&
          this.state.pan_needed && (
            <div
              className="InputField flex-between"
              style={{ alignItems: "baseline" }}
            >
              <Input
                error={this.state.form_data.pan_no_error ? true : false}
                helperText={this.state.form_data.pan_no_error}
                type="text"
                width="40"
                label="Enter PAN"
                class="name"
                id="name"
                name="pan_no"
                maxLength="10"
                value={this.state.form_data.pan_no || ""}
                onChange={this.handleChange("pan_no")}
              />
              <GenericTooltip
                content={
                  <div>
                    As per the IRDA guidelines, PAN is required if premium
                    amount is greater than Rs {this.state.pan_amount}
                  </div>
                }
                productName={getConfig().productName}
              />
            </div>
          )}
        {this.state.member_key !== "applicant" && (
          <div>
            <DropdownInModal
              parent={this}
              options={this.state.height_options}
              header_title="Select Height (cm)"
              cta_title="SAVE"
              selectedIndex={this.state.selectedIndex}
              value={this.state.form_data.height}
              error={this.state.form_data.height_error ? true : false}
              helperText={this.state.form_data.height_error}
              width="40"
              label="Height (cm)"
              class="Education"
              id="height"
              name="height"
              onChange={this.handleChange("height")}
            />
          </div>
        )}
        {this.state.member_key !== "applicant" && (
          <div className="InputField">
            <Input
              type="number"
              width="40"
              label="Weight (Kg)"
              class="Name"
              id="name"
              name="weight"
              error={this.state.form_data.weight_error ? true : false}
              helperText={this.state.form_data.weight_error}
              value={this.state.form_data.weight || ""}
              onChange={this.handleChange("weight")}
            />
          </div>
        )}
        {this.state.providerConfig.key === "STAR" &&
          this.state.member_key !== "applicant" && (
            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                dataType="AOB"
                options={this.state.occupationOptions}
                id="occupation"
                label="Occupation"
                name="occupation"
                error={this.state.form_data.occupation_error ? true : false}
                helperText={this.state.form_data.occupation_error}
                value={this.state.form_data.occupation || ""}
                onChange={this.handleChange("occupation")}
              />
            </div>
          )}
        <ConfirmDialog parent={this} />
        {this.renderBmiDialog()}
        {this.renderResetDialog()}
      </Container>
    );
  }
}

export default GroupHealthPlanPersonalDetails;