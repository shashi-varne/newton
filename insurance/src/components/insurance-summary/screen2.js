import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import cover_period from '../../assets/cover_period_icon.png';
import life_cover from '../../assets/life_cover_icon.png';
import income from '../../assets/income_icon.png';
import smoking from '../../assets/smoking_icon.png';
import loader from '../../assets/loader_gif.gif';
import Api from '../../utils/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import qs from 'qs';
import { income_pairs } from '../../utils/constants';
import { numDifferentiation } from '../../utils/validators';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openDialog: false,
      openModalMessage: '',
      quote_provider: '',
      status: '',
      application_id: '',
      show_loader: true,
      show_appointee: false,
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
      required: {
        personal: {
          not_submitted: true,
          fields: ["name", "dob", "father_name", "mother_name", "gender", "marital_status", "birth_place"]
        },
        contact: {
          not_submitted: true,
          fields: ["email", "mobile_no", "permanent_addr", "corr_addr", "corr_address_same"]
        },
        nominee: {
          not_submitted: true,
          fields: ["nominee", "nominee_address", "nominee_address_same"]
        },
        appointee: {
          not_submitted: true,
          fields: ["appointee_address", "appointee", "appointee_address_same"]
        },
        professional: {
          not_submitted: true,
          fields: ["employer_name", "employer_address", "occupation_detail", "occupation_category", "annual_income", "designation", "education_qualification", "pan_number"]
        }
      },
      required_fields: [],
      provider: '',
      plutus_status: '',
      params: qs.parse(props.history.location.search.slice(1))
    };
  }

  componentDidMount() {
    Api.get('/api/insurance/all/summary')
      .then(res => {
      let application, required_fields;
      if (res.pfwresponse.status_code === 200) {

        if (res.pfwresponse.result.insurance_apps.init.length > 0) {
          application = res.pfwresponse.result.insurance_apps.init[0];
        } else {
          application = res.pfwresponse.result.insurance_apps.submitted[0];
        }

        required_fields = res.pfwresponse.result.required;

        let income_value = income_pairs.filter(item => item.name === application.quote.annual_income);

        let age = application.profile.nominee.dob && this.calculateAge(application.profile.nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));

        let personal_submitted = this.state.required.personal.fields.some(r => required_fields.includes(r));
        let contact_submitted = this.state.required.contact.fields.some(r => required_fields.includes(r));
        let nominee_submitted = this.state.required.nominee.fields.some(r => required_fields.includes(r));
        let appointee_submitted = this.state.required.appointee.fields.some(r => required_fields.includes(r));
        let professional_submitted = this.state.required.professional.fields.some(r => required_fields.includes(r));

        this.setState({
          required: {
            personal: {
              not_submitted: personal_submitted
            },
            contact: {
              not_submitted: contact_submitted
            },
            nominee: {
              not_submitted: nominee_submitted
            },
            appointee: {
              not_submitted: appointee_submitted
            },
            professional: {
              not_submitted: professional_submitted
            }
          },
          application_id: application.application_number,
          plutus_status: application.plutus_status,
          required_fields: required_fields,
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
            permanent_addr: application.profile.permanent_addr || {},
            corr_addr: application.profile.corr_addr || {},
            corr_address_same: application.profile.corr_address_same
          },
          nominee: {
            is_open: false,
            name: application.profile.nominee.name  || '',
            dob: (application.profile.nominee.dob) ? application.profile.nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
            marital_status: application.profile.nominee.marital_status  || '',
            relationship: application.profile.nominee.relationship  || '',
            nominee_address: application.profile.nominee_address  || {},
            nominee_address_same: application.profile.nominee_address_same
          },
          appointee: {
            is_open: false,
            name: application.profile.appointee.name || '',
            dob: (application.profile.appointee.dob) ? application.profile.appointee.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
            marital_status: application.profile.appointee.marital_status || '',
            relationship: application.profile.appointee.relationship || '',
            appointee_address: application.profile.appointee_address || {},
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
        this.setState({show_loader: false});
        alert(res.pfwresponse.result.error);
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume=true'
    });
  }

  modelMessage = () => {
    return (
      <span>
        Wait a moment, you will be redirected to <b>{this.state.quote_provider}</b> for the payment.
      </span>
    );
  }

  handleClose = () => {
    this.setState({ openDialog: false });
  }

  handleClick = async () => {
    if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.personal.not_submitted) {
      this.navigate("/");
    } else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.contact.not_submitted) {
      this.navigate("/contact");
    } else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.nominee.not_submitted) {
      this.navigate("/nominee");
    } else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.appointee.not_submitted) {
      this.navigate("/appointee");
    } else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.professional.not_submitted) {
      this.navigate("/professional");
    } else {
      this.setState({openModal: true, openModalMessage: this.modelMessage()});
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
          window.location.replace(window.location.href+'&native_payment=true&payment_link='+res.pfwresponse.result.insurance_app.payment_link+'&provider='+provider, function() {});
        } else {
          alert(res.pfwresponse.result.error);
          this.setState({openModal: false, openModalMessage: ''});
        }
      } else {
        window.location.replace(window.location.href+'&native_payment=true&resume_link='+this.state.resume_link+'&provider='+provider, function() {});
      }
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
            {this.state.openModalMessage}
          </Typography>
        </div>
      </Modal>
    );
  }

  renderDialog = () => {
    return (
      <Dialog
          fullScreen={false}
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit the application process?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            No
          </Button>
          <Button onClick={this.handleReset} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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

  capitalize = (string) => {
    return string.toLowerCase().replace(/(^|\s)[a-z]/g,function(f){return f.toUpperCase();})
  }

  handleReset = async () => {
    this.setState({openDialog: false, openModal: true, openModalMessage: 'Wait a moment while we reset your application'});
    const res = await Api.post('/api/insurance/profile/reset', {
      insurance_app_id: this.state.params.insurance_id
    });
    if (res.pfwresponse.status_code === 200) {
      window.location.replace(window.location.href+'&native_reset=true', function() {});
    } else {
      this.setState({openModal: false, openModalMessage: ''});
      alert(res.pfwresponse.result.error);
    }
  }

  showDialog = () => {
    this.setState({ openDialog: true });
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

  renderPercentage = (number) => {
    return (
      <div style={{display: 'flex', alignItems: 'center', width: 170}}>
        <div className="Progress">
          <span style={{width: `${number}%`}}></span>
        </div>
        <div style={{flex: 1, color: '#878787', fontSize: 14, fontWeight: 400, textAlign: 'center'}}>{`${number}%`}</div>
      </div>
    );
  }

  renderTotalPercentage = () => {
    let number = 50;
    if (!this.state.required.personal.not_submitted) {
      number+= 5;
    }
    if (!this.state.required.contact.not_submitted) {
      number+= 5;
    }
    if (!this.state.required.nominee.not_submitted) {
      number+= 5;
    }
    if (!this.state.required.professional.not_submitted) {
      number+= 5;
    }
    if (this.state.status === 'plutus_submitted') {
      number+= 20;
    }
    return (
      <div style={{display: 'flex', alignItems: 'center', width: 170}}>
        <div className="Progress">
          <span style={{width: `${number}%`}}></span>
        </div>
        <div style={{flex: 1, color: '#878787', fontSize: 14, fontWeight: 400, textAlign: 'center'}}>{`${number}%`}</div>
      </div>
    );
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume=true'
    });
  }

  render() {
    return (
      <Container
        resetpage={(this.state.status === 'init') ? true : false}
        handleReset={this.showDialog}
        showLoader={this.state.show_loader}
        title={'Resume Application'}
        handleClick={this.handleClick}
        fullWidthButton={true}
        premium={this.state.premium}
        provider={this.state.provider}
        paymentFrequency={this.state.payment_frequency}
        buttonTitle={((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') ? 'Resume' : 'Pay Now')} >
        <div style={{marginBottom: 20}}>
          <div style={{color: '#4a4a4a', fontSize: 20, fontWeight: 700, marginBottom: 7}}>
            Hey {this.state.personal.name}
          </div>
          <div style={{color: '#878787', fontSize: 16}}>
            You are just minutes away to secure your family.
          </div>
        </div>
        <div>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={4}>
              <img src={this.state.image} alt="" style={{width: '100%'}} />
            </Grid>
            <Grid item xs={8}>
              <div className="Title" style={{color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 18}}>
                <div style={{marginBottom: 7}}>{
                    this.state.application_id &&
                    `ID: ${this.state.application_id}`
                  }</div>
                {this.renderTotalPercentage()}
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
                    <div style={{color: '#4a4a4a'}}>{(this.state.tobacco_choice) ? 'Yes' : 'No'}</div>
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
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 7}}>
                  <span>Benefits</span>
                </div>
                {this.renderPercentage(100)}
              </div>
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglepersonalAccordion('personal')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 7}}>
                  <span>Personal details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/edit-personal')}>Edit</span>}
                </div>
                {this.renderPercentage(this.renderPersonalPercentage())}
              </div>
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglecontactAccordion('contact')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 7}}>
                  <span>Contact details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/edit-contact')}>Edit</span>}
                </div>
                {this.renderPercentage(this.renderContactPercentage())}
              </div>
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglenomineeAccordion('nominee')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 7}}>
                  <span>Nominee details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/edit-nominee')}>Edit</span>}
                </div>
                {this.renderPercentage(this.renderNomineePercentage())}
              </div>
            </div>
            {this.state.show_appointee &&
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleappointeeAccordion('appointee')}>
                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 7}}>
                    <span>Appointee details</span>
                    {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/edit-appointee')}>Edit</span>}
                  </div>
                  {this.renderPercentage(this.renderAppointeePercentage())}
                </div>
              </div>
            }
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.toggleprofessionalAccordion('professional')}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 7}}>
                  <span>Professional details</span>
                  {this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.navigate('/edit-professional')}>Edit</span>}
                </div>
                {this.renderPercentage(this.renderProfessionalPercentage())}
              </div>
            </div>
          </div>
        </div>
        {this.renderModal()}
        {this.renderDialog()}
      </Container>
    );
  }
}


export default Resume;
