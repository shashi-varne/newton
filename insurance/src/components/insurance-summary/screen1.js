import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import logo from '../../assets/icici_insurance_logo.png';
import cover_period from '../../assets/cover_period_icon.png';
import life_cover from '../../assets/life_cover_icon.png';
import income from '../../assets/income_icon.png';
import smoking from '../../assets/smoking_icon.png';
import Api from '../../service/api';

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tobacco_choice: '',
      annual_income: '',
      term: '',
      cover_amount: '',
      payment_frequency: '',
      cover_plan: '',
      premium: '',
      image: '',
      benefits: {},
      personal: {},
      contact: {},
      nominee: {},
      appointee: {},
      professional: {}
    };
  }

  handleClick = async () => {
    //
  }

  async componentDidMount() {
    const res = await Api.get('/api/insurance/all/summary');

    if (res.pfwresponse.status_code === 200) {
      const application = res.pfwresponse.result.insurance_apps.init[0];

      this.setState({
        tobacco_choice: application.quote.tobacco_choice,
        annual_income: application.quote.annual_income,
        term: application.quote.term,
        cover_amount: application.quote.cover_amount,
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
      console.log(res.pfwresponse.result.error);
    }
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

  toggleprofessionalAccordion = () => {
    this.setState(prevState => ({
      professional: {
        ...prevState.professional,
        is_open: !prevState.professional.is_open
      }
    }))
  }

  renderAccordionBody = (name) => {
    if (this.state.benefits.is_open && name === 'benefits') {
      return (
        <div className="Accordion">
          <ul>
            <li>Accidental death benifits: <span>{this.state.benefits.accident_benefit}</span></li>
            <li>Payout option: <span>{this.state.benefits.payout_option}</span></li>
          </ul>
        </div>
      );
    } else if (this.state.personal.is_open && name === 'personal') {
      return (
        <div className="Accordion">
          <ul>
            <li></li>
          </ul>
        </div>
      );
    } else if (this.state.contact.is_open && name === 'contact') {
      return (
        <div className="Accordion">
          <ul>
            <li></li>
          </ul>
        </div>
      );
    } else if (this.state.nominee.is_open && name === 'nominee') {
      return (
        <div className="Accordion">
          <ul>
            <li></li>
          </ul>
        </div>
      );
    } else if (this.state.professional.is_open && name === 'professional') {
      return (
        <div className="Accordion">
          <ul>
            <li></li>
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <Container
        title={'Term Insurance Plan Summary'}
        handleClick={this.handleClick} >
        <div>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={5}>
              <img src={logo} alt="" style={{width: '100%'}} />
            </Grid>
            <Grid item xs={7}>
              <div className="Title" style={{color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 20}}>
                ICICI Pru iProtect Smart
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{marginTop: 30}}>
          <div className="Title" style={{color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 20, marginBottom: 20}}>
            Insurance details
          </div>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={6}>
              <div className="Item" style={{display: 'flex', alignItems: 'center'}}>
                <div className="Icon" style={{marginRight: 15}}>
                  <img src={cover_period} alt="" width="40"/>
                </div>
                <div className="Text">
                  <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 15}}>Cover period</div>
                  <div style={{color: '#4a4a4a'}}>40 years</div>
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
                    <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 15}}>Life cover</div>
                    <div style={{color: '#4a4a4a'}}>2 crores</div>
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
                  <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 15}}>Annual income</div>
                  <div style={{color: '#4a4a4a'}}>10 lakhs</div>
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
                    <div style={{color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 15}}>Use tobacco</div>
                    <div style={{color: '#4a4a4a'}}>Yes</div>
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
                Benefits
              </div>
              {this.renderAccordionBody('benefits')}
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglepersonalAccordion('personal')}>
                Personal details
              </div>
              {this.renderAccordionBody('personal')}
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglecontactAccordion('contact')}>
                Contact details
              </div>
              {this.renderAccordionBody('contact')}
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.togglenomineeAccordion('nominee')}>
                Nominee details
              </div>
              {this.renderAccordionBody('nominee')}
            </div>
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => this.toggleprofessionalAccordion('professional')}>
                Professional details
              </div>
              {this.renderAccordionBody('professional')}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}


export default Summary;
