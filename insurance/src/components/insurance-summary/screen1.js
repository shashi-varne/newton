import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import cover_period from '../../assets/cover_period_icon.png';
import life_cover from '../../assets/life_cover_icon.png';
import income from '../../assets/income_icon.png';
import smoking from '../../assets/smoking_icon.png';
import expand from '../../assets/expand_icn.png';
import shrink from '../../assets/shrink_icn.png';
import loader from '../../assets/loader_gif.gif';
import Api from '../../service/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import qs from 'query-string';

const income_pairs = [
  {
    "name" : "upto3",
    "value" : "upto 3 lakhs"
  },
  {
    "name" : "3-5",
    "value" : "3-5 lakhs"
  },
  {
    "name" : "5-7",
    "value" : "5-7 lakhs"
  },
  {
    "name" : "7-10",
    "value" : "7-10 lakhs"
  },
  {
    "name" : "10-15",
    "value" : "10-15 lakhs"
  },
  {
    "name" : "above15",
    "value" : "15 lakhs +"
  }
];

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      show_loader: false,
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
      benefits: {},
      personal: {},
      contact: {},
      nominee: {},
      appointee: {},
      professional: {},
      params: qs.parse(props.history.location.search)
    };
  }

  async componentDidMount() {
    this.setState({show_loader: true});
    const res = await Api.get('/api/insurance/all/summary');

    if (res.pfwresponse.status_code === 200) {
      const application = res.pfwresponse.result.insurance_apps.init[0];

      let income_value = income_pairs.filter(item => item.name === application.quote.annual_income);

      let age = this.calculateAge(application.profile.nominee.dob);

      this.setState({
        show_loader: false,
        payment_link: application.payment_link,
        edit_allowed: (res.pfwresponse.result.insurance_apps.init.length > 0) ? true : false,
        show_appointee: (age < 18) ? true : false,
        tobacco_choice: application.quote.tobacco_choice,
        annual_income: income_value[0].value,
        term: application.quote.term,
        cover_amount: this.numDifferentiation(application.quote.cover_amount),
        payment_frequency: application.quote.payment_frequency,
        cover_plan: application.quote.quote_json.cover_plan,
        premium: application.quote.quote_json.premium,
        image: application.quote.quote_describer.image,
        benefits: {
          is_open: false,
          accident_benefit: application.quote.accident_benefit,
          payout_option: application.quote.payout_option
        },
        personal: {
          is_open: false,
          name: application.profile.name,
          dob: application.profile.dob.replace(/\\-/g, '/').split('/').reverse().join('-'),
          marital_status: application.profile.marital_status,
          birth_place: application.profile.birth_place,
          mother_name: application.profile.mother_name,
          father_name: application.profile.father_name,
          gender: application.profile.gender
        },
        contact: {
          is_open: false,
          email: application.profile.email,
          mobile_no: application.profile.mobile_no,
          permanent_addr: application.profile.permanent_addr,
          corr_addr: application.profile.corr_addr
        },
        nominee: {
          is_open: false,
          name: application.profile.nominee.name,
          dob: application.profile.nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('-'),
          marital_status: application.profile.nominee.marital_status,
          relationship: application.profile.nominee.relationship,
          nominee_address: application.profile.nominee_address
        },
        appointee: {
          is_open: false,
          name: application.profile.appointee.name,
          dob: application.profile.appointee.dob.replace(/\\-/g, '/').split('/').reverse().join('-'),
          marital_status: application.profile.appointee.marital_status,
          relationship: application.profile.appointee.relationship,
          appointee_address: application.profile.appointee_address
        },
        professional: {
          is_open: false,
          pan_number: application.profile.pan_number,
          occupation_category: application.profile.occupation_category,
          occupation_detail: application.profile.occupation_detail,
          is_criminal: application.profile.is_criminal,
          is_politically_exposed: application.profile.is_politically_exposed,
          employer_name: application.profile.employer_name,
          employer_address: application.profile.employer_address,
          education_qualification: application.profile.education_qualification,
          designation: application.profile.designation,
          annual_income: application.profile.annual_income
        }
      });
    } else {
      this.setState({show_loader: false});
      console.log(res.pfwresponse.result.error);
    }
  }

  numDifferentiation = (val) => {
    if(val >= 10000000) val = (val/10000000).toFixed(0) + ' Crores';
    else if(val >= 100000) val = (val/100000).toFixed(0) + ' Lakhs';
    else if(val >= 1000) val = (val/1000).toFixed(0) + ' Thousand';
    return val;
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

  handleClick = () => {
    this.setState({openModal: true});
    console.log();
    window.location.href = this.state.payment_link;
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
            Wait a moment, you will be redirected to <b>HDFC</b> for the payment.
          </Typography>
        </div>
      </Modal>
    );
  }

  renderAccordionBody = (name) => {
    if (this.state.benefits.is_open && name === 'benefits') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Accidental death benifits: <span>{this.numDifferentiation(this.state.benefits.accident_benefit)}</span></li>
            <li>Payout option: <span>{this.state.benefits.payout_option}</span></li>
          </ul>
        </div>
      );
    } else if (this.state.personal.is_open && name === 'personal') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.personal.name}</span></li>
            <li>DOB: <span>{this.state.personal.dob}</span></li>
            <li>Marital status: <span>{this.state.personal.marital_status}</span></li>
            <li>Birth place: <span>{this.state.personal.birth_place}</span></li>
            <li>Mother name: <span>{this.state.personal.mother_name}</span></li>
            <li>Father name: <span>{this.state.personal.father_name}</span></li>
            <li>Gender: <span>{this.state.personal.gender}</span></li>
          </ul>
        </div>
      );
    } else if (this.state.contact.is_open && name === 'contact') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Email: <span>{this.state.contact.email}</span></li>
            <li>Mobile number: <span>{this.state.contact.mobile_no}</span></li>
            <li>
              Permanent address:
              <div>
                <span>
                  {this.state.contact.permanent_addr.addressline+','+ this.state.contact.permanent_addr.landmark+','+ this.state.contact.permanent_addr.city+','+ this.state.contact.permanent_addr.state+','+ this.state.contact.permanent_addr.pincode+','+ this.state.contact.permanent_addr.country}
                </span>
              </div>
            </li>
            <li>
              Correspondence address:
              <div>
                <span>
                  {this.state.contact.corr_addr.addressline+','+ this.state.contact.corr_addr.landmark+','+ this.state.contact.corr_addr.city+','+ this.state.contact.corr_addr.state+','+ this.state.contact.corr_addr.pincode+','+ this.state.contact.corr_addr.country}
                </span>
              </div>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.nominee.is_open && name === 'nominee') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.nominee.name}</span></li>
            <li>DOB: <span>{this.state.nominee.dob}</span></li>
            <li>Marital status: <span>{this.state.nominee.marital_status}</span></li>
            <li>Relationship: <span>{this.state.nominee.relationship}</span></li>
            <li>
              Address:
              <div>
                <span>
                  {this.state.nominee.nominee_address.addressline+','+ this.state.nominee.nominee_address.landmark+','+ this.state.nominee.nominee_address.city+','+ this.state.nominee.nominee_address.state+','+ this.state.nominee.nominee_address.pincode+','+ this.state.nominee.nominee_address.country}
                </span>
              </div>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.appointee.is_open && name === 'appointee') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.appointee.name}</span></li>
            <li>DOB: <span>{this.state.appointee.dob}</span></li>
            <li>Marital status: <span>{this.state.appointee.marital_status}</span></li>
            <li>Relationship: <span>{this.state.appointee.relationship}</span></li>
            <li>
              Address:
              <div>
                <span>
                  {this.state.appointee.appointee_address.addressline+','+ this.state.appointee.appointee_address.landmark+','+ this.state.appointee.appointee_address.city+','+ this.state.appointee.appointee_address.state+','+ this.state.appointee.appointee_address.pincode+','+ this.state.appointee.appointee_address.country}
                </span>
              </div>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.professional.is_open && name === 'professional') {
      if (this.state.professional.occupation_detail === 'SALRIED') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.professional.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation_detail: <span>{this.state.professional.occupation_detail}</span></li>
              <li>Occupation_category: <span>{this.state.professional.occupation_category}</span></li>
              <li>Annual income: <span>{this.numDifferentiation(this.state.professional.annual_income)}</span></li>
              <li>Employer name: <span>{this.state.professional.employer_name}</span></li>
              <li>
                Employer address:
                <div>
                  <span>
                    {this.state.professional.employer_address.addressline+','+ this.state.professional.employer_address.landmark+','+ this.state.professional.employer_address.city+','+ this.state.professional.employer_address.state+','+ this.state.professional.employer_address.pincode+','+ this.state.professional.employer_address.country}
                  </span>
                </div>
              </li>
              <li>Criminal proceedings: <span>{this.state.professional.is_criminal}</span></li>
              <li>Politically exposed: <span>{this.state.professional.is_politically_exposed}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.professional.occupation_detail === 'STUDENT') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.professional.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation_detail: <span>{this.state.professional.occupation_detail}</span></li>
              <li>Criminal proceedings: <span>{this.state.professional.is_criminal}</span></li>
              <li>Politically exposed: <span>{this.state.professional.is_politically_exposed}</span></li>
            </ul>
          </div>
        );
      } else {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.professional.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation_detail: <span>{this.state.professional.occupation_detail}</span></li>
              <li>Designation: <span>{this.state.professional.designation}</span></li>
              <li>Annual income: <span>{this.numDifferentiation(this.state.professional.annual_income)}</span></li>
              <li>Criminal proceedings: <span>{(this.state.professional.is_criminal)? 'Yes' : 'No'}</span></li>
              <li>Politically exposed: <span>{(this.state.professional.is_politically_exposed)? 'Yes' : 'No'}</span></li>
            </ul>
          </div>
        );
      }
    } else {
      return null;
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'Term Insurance Plan Summary'}
        handleClick={this.handleClick}
        fullWidthButton={true}
        premium={this.state.premium}
        paymentFrequency={this.state.payment_frequency} >
        <div>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={5}>
              <img src={this.state.image} alt="" style={{width: '100%'}} />
            </Grid>
            <Grid item xs={7}>
              <div className="Title" style={{color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 18}}>
                {this.state.cover_plan}
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
                  {this.state.personal.is_open && this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.props.history.push('edit-personal')}>Edit</span>}
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
                  {this.state.contact.is_open && this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.props.history.push('edit-contact')}>Edit</span>}
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
                  {this.state.nominee.is_open && this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.props.history.push('edit-nominee')}>Edit</span>}
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
                    {this.state.appointee.is_open && this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.props.history.push('edit-appointee')}>Edit</span>}
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
                  {this.state.professional.is_open && this.state.edit_allowed && <span style={{position: 'absolute', right: 0, color: '#878787', fontSize: 12, textDecoration: 'underline'}} onClick={() => this.props.history.push('edit-professional')}>Edit</span>}
                </div>
              </div>
              {this.renderAccordionBody('professional')}
            </div>
          </div>
        </div>
        {this.renderModal()}
      </Container>
    );
  }
}


export default Summary;
