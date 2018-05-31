import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import cover_period from 'assets/cover_period_icon.png';
import life_cover from 'assets/life_cover_icon.png';
import income from 'assets/income_icon.png';
import smoking from 'assets/smoking_icon.png';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import loader from 'assets/loader_gif.gif';
import Api from 'utils/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import qs from 'qs';
import { income_pairs } from '../..//constants';
import { numDifferentiation } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from 'material-ui/Dialog';

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      quote_provider: '',
      status: '',
      show_loader: true,
      show_appointee: false,
      application_id: '',
      tobacco_choice: '',
      annual_income: '',
      term: '',
      cover_amount: '',
      payment_frequency: '',
      cover_plan: '',
      premium: '',
      image: '',
      payment_link: '',
      resume_link: '',
      benefits: {},
      personal: {},
      contact: {},
      nominee: {},
      appointee: {},
      professional: {},
      provider: '',
      apiError: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1))
    };
  }

  componentDidMount() {
    Api.get('/api/insurance/all/summary')
      .then(res => {
      let application;
      if (res.pfwresponse.status_code === 200) {
        if (res.pfwresponse.result.insurance_apps.init.length > 0) {
          application = res.pfwresponse.result.insurance_apps.init[0];
        } else {
          application = res.pfwresponse.result.insurance_apps.submitted[0];
        }

        let income_value = income_pairs.filter(item => item.name === application.quote.annual_income);

        let age = application.profile.nominee.dob && this.calculateAge(application.profile.nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));

        this.setState({
          application_id: application.application_number,
          status: application.status,
          show_loader: false,
          payment_link: application.payment_link,
          resume_link: application.resume_link,
          edit_allowed: (res.pfwresponse.result.insurance_apps.init.length > 0) ? true : false,
          show_appointee: (age < 18) ? true : false,
          tobacco_choice: application.quote.tobacco_choice,
          annual_income: income_value[0].value,
          term: application.quote.term,
          cover_amount: numDifferentiation(application.quote.cover_amount),
          payment_frequency: application.quote.payment_frequency,
          provider: application.provider,
          cover_plan: application.quote.quote_json.cover_plan,
          premium: application.quote.quote_json.premium,
          image: application.quote.quote_describer.image,
          quote_provider: application.quote.quote_provider,
          benefits: {
            is_open: true,
            accident_benefit: application.quote.accident_benefit || '',
            payout_option: application.quote.payout_option || ''
          },
          personal: {
            is_open: false,
            name: application.profile.name || '',
            dob: (application.profile.dob) ? application.profile.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
            marital_status: application.profile.marital_status || '',
            birth_place: application.profile.birth_place || '',
            mother_name: application.profile.mother_name || '',
            father_name: application.profile.father_name || '',
            gender: application.profile.gender || ''
          },
          contact: {
            is_open: false,
            email: application.profile.email || '',
            mobile_no: application.profile.mobile_no || '',
            permanent_addr: application.profile.permanent_addr || '',
            corr_addr: application.profile.corr_addr || '',
            corr_address_same: application.profile.corr_address_same
          },
          nominee: {
            is_open: false,
            name: application.profile.nominee.name  || '',
            dob: (application.profile.nominee.dob) ? application.profile.nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
            marital_status: application.profile.nominee.marital_status  || '',
            relationship: application.profile.nominee.relationship  || '',
            nominee_address: application.profile.nominee_address  || '',
            nominee_address_same: application.profile.nominee_address_same
          },
          appointee: {
            is_open: false,
            name: application.profile.appointee.name || '',
            dob: (application.profile.appointee.dob) ? application.profile.appointee.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
            marital_status: application.profile.appointee.marital_status || '',
            relationship: application.profile.appointee.relationship || '',
            appointee_address: application.profile.appointee_address || '',
            appointee_address_same: application.profile.appointee_address_same
          },
          professional: {
            is_open: false,
            pan_number: application.profile.pan_number || '',
            occupation_category: application.profile.occupation_category || '',
            occupation_detail: application.profile.occupation_detail || '',
            is_criminal: application.profile.is_criminal || '',
            is_politically_exposed: application.profile.is_politically_exposed || '',
            employer_name: application.profile.employer_name || '',
            employer_address: application.profile.employer_address || '',
            education_qualification: application.profile.education_qualification || '',
            designation: application.profile.designation || '',
            annual_income: application.profile.annual_income || ''
          }
        });
      } else {
        this.setState({ show_loader: false });
      }
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  calculateAge = (birthday) => {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();

    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  togglebenefitsAccordion = () => {
    this.setState(prevState => ({
      benefits: {
        ...prevState.benefits,
        is_open: !prevState.benefits.is_open
      }
    }))
  }

  togglepersonalAccordion = () => {
    this.setState(prevState => ({
      personal: {
        ...prevState.personal,
        is_open: !prevState.personal.is_open
      }
    }))
  }

  togglecontactAccordion = () => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        is_open: !prevState.contact.is_open
      }
    }))
  }

  togglenomineeAccordion = () => {
    this.setState(prevState => ({
      nominee: {
        ...prevState.nominee,
        is_open: !prevState.nominee.is_open
      }
    }))
  }

  toggleappointeeAccordion = () => {
    this.setState(prevState => ({
      appointee: {
        ...prevState.appointee,
        is_open: !prevState.appointee.is_open
      }
    }))
  }

  toggleprofessionalAccordion = () => {
    this.setState(prevState => ({
      professional: {
        ...prevState.professional,
        is_open: !prevState.professional.is_open
      }
    }))
  }

  handleClick = async () => {
    this.setState({openModal: true});
    let provider;

    if (this.state.provider === 'HDFC') {
      provider = 'HDFC Life';
    } else {
      provider = 'ICICI Pru';
    }

    if (this.state.status === 'init') {
      const res = await Api.post('/api/insurance/profile/submit', {
        insurance_app_id: this.state.params.insurance_id
      });

      if (res.pfwresponse.status_code === 200) {
          let eventObj;

          if (this.state.status === 'init') {
            eventObj = {
              "event_name": 'make_payment_clicked',
              "properties": {
                "provider": this.state.provider,
                "benefits": (this.state.benefits.accident_benefit !== '' && this.state.benefits.payout_option !== '') ? 1 : 0,
                "personal_d": (this.renderPersonalPercentage() === 100) ? 1 : 0,
                "contact_d": (this.renderContactPercentage() === 100) ? 1 : 0,
                "nominee": (this.renderNomineePercentage() === 100) ? 1 : 0,
                "professonal": (this.renderProfessionalPercentage() === 100) ? 1 : 0,
                "appointee": (this.renderAppointeePercentage() === 100) ? 1 : 0
              }
            };
          } else {
            eventObj = {
              "event_name": 'resume_clicked',
              "properties": {
                "overall_progress": this.renderTotalPercentage(),
                "personal_d": this.renderPersonalPercentage(),
                "contact_d": this.renderContactPercentage(),
                "nominee_d": this.renderNomineePercentage(),
                "professional": this.renderProfessionalPercentage(),
                "professonal_edit": 0,
                "pd_view": 0,
                "cd_view": 0,
                "nd_view": 0,
                "professional_view": 0
              }
            };
          }

          nativeCallback({ events: eventObj, action: 'payment', message: { payment_link: res.pfwresponse.result.insurance_app.payment_link, provider: provider } });
      } else {
        this.setState({ openModal: false, openDialog: true, apiError: res.pfwresponse.result.error });
      }
    } else {
        nativeCallback({ action: 'resume_payment', message: { resume_link: this.state.resume_link, provider: provider } });
    }
  }

  renderModal = () => {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.openModal}
      >
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor:'#fff', borderRadius: 4, minWidth: 320, padding: 25, textAlign: 'center'}}>
          <div style={{padding: '20px 0 30px'}}>
            <img src={loader} alt=""/>
          </div>
          <Typography variant="subheading" id="simple-modal-description" style={{color: '#444'}}>
            Wait a moment, you will be redirected to <b>{this.state.quote_provider}</b> for the payment.
          </Typography>
        </div>
      </Modal>
    );
  }

  getAddress = (addr) => {
    return (
      <div>
        {addr.addressline +', '+
          addr.landmark +', '+
          addr.pincode +', '+
          addr.city +', '+
          this.capitalize(addr.state) +', '+
          this.capitalize(addr.country)
        }
      </div>
    );
  }

  renderPersonalPercentage = () => {
    if (this.state.personal.name &&
      this.state.personal.marital_status &&
      this.state.personal.birth_place &&
      this.state.personal.mother_name &&
      this.state.personal.father_name) {
      return 100;
    } else if (this.state.personal.name ||
      this.state.personal.marital_status ||
      this.state.personal.birth_place ||
      this.state.personal.mother_name ||
      this.state.personal.father_name) {
      return 50;
    } else {
      return 0;
    }
  }

  renderContactPercentage = () => {
    let contact = this.state.contact;
    if (Object.getOwnPropertyNames(contact).length !== 0) {
      if (contact.email &&
        contact.mobile_no &&
        contact.permanent_addr.hasOwnProperty('pincode') &&
        contact.permanent_addr.hasOwnProperty('addressline') &&
        contact.permanent_addr.hasOwnProperty('landmark')) {
        return 100;
      } else if (contact.email ||
        contact.mobile_no ||
        contact.permanent_addr.hasOwnProperty('pincode') ||
        contact.permanent_addr.hasOwnProperty('addressline') ||
        contact.permanent_addr.hasOwnProperty('landmark')) {
        return 50;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  renderNomineePercentage = () => {
    let nominee = this.state.nominee;
    if (Object.getOwnPropertyNames(nominee).length !== 0) {
      if (nominee.name &&
        nominee.dob &&
        nominee.marital_status &&
        nominee.relationship &&
        (nominee.nominee_address_same ||
          (
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('pincode')) &&
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('addressline')) &&
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('landmark'))
          )
        )) {
        return 100;
      } else if (nominee.name ||
        nominee.dob ||
        nominee.marital_status ||
        nominee.relationship ||
        (nominee.nominee_address_same ||
          (
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('pincode')) &&
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('addressline')) &&
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('landmark'))
          )
        )) {
        return 50;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  renderAppointeePercentage = () => {
    let appointee = this.state.appointee;
    if (Object.getOwnPropertyNames(appointee).length !== 0) {
      if (appointee.name &&
        appointee.dob &&
        appointee.marital_status &&
        appointee.relationship &&
        (appointee.appointee_address_same ||
          (
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('pincode')) &&
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('addressline')) &&
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('landmark'))
          )
        )) {
        return 100;
      } else if (appointee.name ||
        appointee.dob ||
        appointee.marital_status ||
        appointee.relationship ||
        (appointee.appointee_address_same ||
          (
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('pincode')) &&
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('addressline')) &&
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('landmark'))
          )
        )) {
        return 50;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  renderProfessionalPercentage = () => {
    let professional = this.state.professional;
    if (Object.getOwnPropertyNames(professional).length !== 0) {
      if (professional.pan_number &&
        professional.education_qualification &&
        (
          (professional.occupation_detail === 'SELF-EMPLOYED' && professional.designation && professional.annual_income !== '') ||
          (
            (professional.occupation_detail === 'SALRIED' && professional.occupation_category && professional.designation && professional.annual_income !== '' && professional.employer_address.hasOwnProperty('pincode') &&
            professional.employer_address.hasOwnProperty('addressline') &&
            professional.employer_address.hasOwnProperty('landmark'))
          ) ||
          (professional.occupation_detail === 'STUDENT')
        )) {
        return 100;
      } else if (professional.pan_number ||
        professional.education_qualification ||
        (
          (professional.occupation_detail === 'SELF-EMPLOYED' && (professional.designation || professional.annual_income !== '')) ||
          (
            (professional.occupation_detail === 'SALRIED' && (professional.occupation_category || professional.designation || professional.annual_income !== '' || professional.employer_name ||
            professional.employer_address.hasOwnProperty('pincode') ||
            professional.employer_address.hasOwnProperty('addressline') ||
            professional.employer_address.hasOwnProperty('landmark')))
          ) ||
          (professional.occupation_detail === 'STUDENT')
        )) {
        return 50;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  renderAccordionBody = (name) => {
    if (this.state.benefits.is_open && name === 'benefits') {
      return (
        <div className="AccordionBody">
          <ul>
            {this.state.benefits.accident_benefit && <li>Accidental death benifits:<span>₹ {numDifferentiation(this.state.benefits.accident_benefit)}</span></li>}
            <li>Payout option: <span>{this.state.benefits.payout_option}</span></li>
          </ul>
        </div>
      );
    } else if (this.state.personal.is_open && name === 'personal' && this.renderPersonalPercentage() !== 0) {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.personal.name}</span></li>
            <li>DOB: <span>{this.state.personal.dob}</span></li>
            <li>Marital status: <span>{this.capitalize(this.state.personal.marital_status)}</span></li>
            <li>Birth place: <span>{this.state.personal.birth_place}</span></li>
            <li>Mother name: <span>{this.state.personal.mother_name}</span></li>
            <li>Father name: <span>{this.state.personal.father_name}</span></li>
            <li>Gender: <span>{this.capitalize(this.state.personal.gender)}</span></li>
          </ul>
        </div>
      );
    } else if (this.state.contact.is_open && name === 'contact' && this.renderContactPercentage() !== 0) {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Email: <span>{this.state.contact.email}</span></li>
            <li>Mobile number: <span>{this.state.contact.mobile_no}</span></li>
            <li>
              Permanent address:
              <div>
                <span style={{wordWrap: 'break-word'}}>
                  {this.getAddress(this.state.contact.permanent_addr)}
                </span>
              </div>
            </li>
            {
              (this.state.contact.corr_address_same)
              ? <li>
                Correspondence address:
                <div>
                  <span style={{wordWrap: 'break-word'}}>
                    {this.getAddress(this.state.contact.permanent_addr)}
                  </span>
                </div>
              </li>
              : <li>
                Correspondence address:
                <div>
                  <span style={{wordWrap: 'break-word'}}>
                    {this.getAddress(this.state.contact.corr_addr)}
                  </span>
                </div>
              </li>
            }
          </ul>
        </div>
      );
    } else if (this.state.nominee.is_open && name === 'nominee' && this.renderNomineePercentage() !== 0) {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.nominee.name}</span></li>
            <li>DOB: <span>{this.state.nominee.dob}</span></li>
            <li>Marital status: <span>{this.capitalize(this.state.nominee.marital_status)}</span></li>
            <li>Relationship: <span>{this.capitalize(this.state.nominee.relationship)}</span></li>
            {
              (this.state.nominee.nominee_address_same)
              ? <li>
                Address:
                <div>
                  <span style={{wordWrap: 'break-word'}}>
                    {this.getAddress(this.state.contact.permanent_addr)}
                  </span>
                </div>
              </li>
              : <li>
                Address:
                <div>
                  <span style={{wordWrap: 'break-word'}}>
                    {this.getAddress(this.state.nominee.nominee_address)}
                  </span>
                </div>
              </li>
            }
          </ul>
        </div>
      );
    } else if (this.state.appointee.is_open && name === 'appointee' && this.renderAppointeePercentage() !== 0) {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.appointee.name}</span></li>
            <li>DOB: <span>{this.state.appointee.dob}</span></li>
            <li>Marital status: <span>{this.capitalize(this.state.appointee.marital_status)}</span></li>
            <li>Relationship: <span>{this.capitalize(this.state.appointee.relationship)}</span></li>
              {
                (this.state.appointee.appointee_address_same)
                ? <li>
                  Address:
                  <div>
                    <span style={{wordWrap: 'break-word'}}>
                      {this.getAddress(this.state.contact.permanent_addr)}
                    </span>
                  </div>
                </li>
                : <li>
                  Address:
                  <div>
                    <span style={{wordWrap: 'break-word'}}>
                      {this.getAddress(this.state.appointee.appointee_address)}
                    </span>
                  </div>
                </li>
              }
          </ul>
        </div>
      );
    } else if (this.state.professional.is_open && name === 'professional' && this.renderProfessionalPercentage() !== 0) {
      if (this.state.professional.occupation_detail === 'SALRIED') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.professional.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation detail: <span>{this.capitalize(this.state.professional.occupation_detail)}</span></li>
              <li>Occupation category: <span>{this.capitalize(this.state.professional.occupation_category)}</span></li>
              <li>Annual income: <span>{numDifferentiation(this.state.professional.annual_income)}</span></li>
              <li>Employer name: <span>{this.state.professional.employer_name}</span></li>
              <li>
                Employer address:
                <div>
                  <span style={{wordWrap: 'break-word'}}>
                    {this.state.professional.employer_address.addressline+', '+ this.state.professional.employer_address.landmark+', '+ this.capitalize(this.state.professional.employer_address.city)+', '+ this.capitalize(this.state.professional.employer_address.state)+', '+ this.state.professional.employer_address.pincode+', '+ this.capitalize(this.state.professional.employer_address.country)}
                  </span>
                </div>
              </li>
              <li>Criminal proceedings: <span>{(this.state.professional.is_criminal) ? 'Yes' : 'No'}</span></li>
              <li>Politically exposed: <span>{(this.state.professional.is_politically_exposed) ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.professional.occupation_detail === 'STUDENT') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.professional.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation detail: <span>{this.capitalize(this.state.professional.occupation_detail)}</span></li>
              <li>Criminal proceedings: <span>{(this.state.professional.is_criminal) ? 'Yes' : 'No'}</span></li>
              <li>Politically exposed: <span>{(this.state.professional.is_politically_exposed) ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>
        );
      } else {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.professional.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation detail: <span>{this.capitalize(this.state.professional.occupation_detail)}</span></li>
              <li>Designation: <span>{this.state.professional.designation}</span></li>
              <li>Annual income: <span>{numDifferentiation(this.state.professional.annual_income)}</span></li>
              <li>Criminal proceedings: <span>{(this.state.professional.is_criminal) ? 'Yes' : 'No'}</span></li>
              <li>Politically exposed: <span>{(this.state.professional.is_politically_exposed) ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>
        );
      }
    } else {
      return null;
    }
  }

  capitalize = (string) => {
    return string.toLowerCase().replace(/(^|\s)[a-z]/g,function(f){return f.toUpperCase();})
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&base_url='+this.state.params.base_url
    });
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderResponseDialog = () => {
    return (
      <Dialog
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Oops!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    return (
      <Container
        summarypage={true}
        showLoader={this.state.show_loader}
        title={'Term Insurance Plan Summary'}
        handleClick={this.handleClick}
        fullWidthButton={true}
        premium={this.state.premium}
        provider={this.state.provider}
        paymentFrequency={this.state.payment_frequency}
        buttonTitle={(this.state.status === 'init') ? 'Pay Now' : 'Resume'} >
        <div>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={5}>
              <img src={this.state.image} alt="" style={{width: '100%'}} />
            </Grid>
            <Grid item xs={7}>
              <div className="Title" style={{color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 18}}>
                {this.state.cover_plan}
                <div style={{marginTop: 7, marginBottom: 7}}>{
                    this.state.application_id &&
                    `ID: ${this.state.application_id}`
                  }</div>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{marginTop: 30}}>
          <div className="Title" style={{color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 18, marginBottom: 20}}>
            Insurance details
          </div>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={6}>
              <div className="Item" style={{display: 'flex', alignItems: 'center'}}>
                <div className="Icon" style={{marginRight: 15}}>
                  <img src={cover_period} alt="" width="40"/>
                </div>
                <div className="Text">
                  <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14}}>Cover period</div>
                  <div style={{color: '#4a4a4a'}}>{this.state.term} years</div>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="Title">
                <div className="Item" style={{display: 'flex', alignItems: 'center'}}>
                  <div className="Icon" style={{marginRight: 15}}>
                    <img src={life_cover} alt="" width="40"/>
                  </div>
                  <div className="Text">
                    <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14}}>Life cover</div>
                    <div style={{color: '#4a4a4a'}}>{this.state.cover_amount}</div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={6}>
              <div className="Item" style={{display: 'flex', alignItems: 'center'}}>
                <div className="Icon" style={{marginRight: 15}}>
                  <img src={income} alt="" width="40"/>
                </div>
                <div className="Text">
                  <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14}}>Annual income</div>
                  <div style={{color: '#4a4a4a'}}>
                    {this.state.annual_income}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="Title">
                <div className="Item" style={{display: 'flex', alignItems: 'center'}}>
                  <div className="Icon" style={{marginRight: 15}}>
                    <img src={smoking} alt="" width="40"/>
                  </div>
                  <div className="Text">
                    <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14}}>Use tobacco</div>
                    <div style={{color: '#4a4a4a'}}>{(this.state.tobacco_choice === 'N') ? 'No' : 'Yes'}</div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{marginTop: 30, marginBottom: 30}}>
          <div className="accordion-container">
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglebenefitsAccordion('benefits')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                  <span style={{marginRight: 10}}>
                    <img style={{position: 'relative', top: 2}} src={(this.state.benefits.is_open) ? shrink : expand} alt="" width="20"/>
                  </span>
                  <span>Benefits</span>
                </div>
              </div>
              {this.renderAccordionBody('benefits')}
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglepersonalAccordion('personal')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                  <span style={{marginRight: 10}}>
                    <img style={{position: 'relative', top: 2}} src={(this.state.personal.is_open) ? shrink : expand} alt="" width="20"/>
                  </span>
                  <span>Personal details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/insurance/edit-personal')}>Edit</span>}
                </div>
              </div>
              {this.renderAccordionBody('personal')}
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglecontactAccordion('contact')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                  <span style={{marginRight: 10}}>
                    <img style={{position: 'relative', top: 2}} src={(this.state.contact.is_open) ? shrink : expand} alt="" width="20"/>
                  </span>
                  <span>Contact details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/insurance/edit-contact')}>Edit</span>}
                </div>
              </div>
              {this.renderAccordionBody('contact')}
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglenomineeAccordion('nominee')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                  <span style={{marginRight: 10}}>
                    <img style={{position: 'relative', top: 2}} src={(this.state.nominee.is_open) ? shrink : expand} alt="" width="20"/>
                  </span>
                  <span>Nominee details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/insurance/edit-nominee')}>Edit</span>}
                </div>
              </div>
              {this.renderAccordionBody('nominee')}
            </div>
            {this.state.show_appointee &&
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleappointeeAccordion('appointee')}>
                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                    <span style={{marginRight: 10}}>
                      <img style={{position: 'relative', top: 2}} src={(this.state.appointee.is_open) ? shrink : expand} alt="" width="20"/>
                    </span>
                    <span>Appointee details</span>
                    {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/insurance/edit-appointee')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('appointee')}
              </div>
            }
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.toggleprofessionalAccordion('professional')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                  <span style={{marginRight: 10}}>
                    <img style={{position: 'relative', top: 2}} src={(this.state.professional.is_open) ? shrink : expand} alt="" width="20"/>
                  </span>
                  <span>Professional details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/insurance/edit-professional')}>Edit</span>}
                </div>
              </div>
              {this.renderAccordionBody('professional')}
            </div>
          </div>
        </div>
        {this.renderModal()}
        {this.renderResponseDialog()}
      </Container>
    );
  }
}


export default Summary;
