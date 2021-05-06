import React, { Component } from 'react';
import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Grid from 'material-ui/Grid';
import cover_period from 'assets/cover_period_icon.png';
import life_cover from 'assets/life_cover_icon.png';
import income from 'assets/income_icon.png';
import smoking from 'assets/smoking_icon.png';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';

import Api from 'utils/api';
import LoaderModal from  '../../../common/Modal';
import qs from 'qs';
import { income_pairs } from '../../../constants';
import { numDifferentiation, formatAmount } from 'utils/validators';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig, getBasePath } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      paymentModal: false,
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
      premiumData: {},
      provider: '',
      apiError: '',
      openDialog: false,
      accordianTab: 'benefits',
      params: qs.parse(props.history.location.search.slice(1)),
      time_spent: 0,
      productName: getConfig().productName
    }
    this.handleClosePayment = this.handleClosePayment.bind(this);
  }

  componentWillMount() {
    let basepath = getBasePath();
    let current_url = basepath + '/group-insurance/term/journey' + getConfig().searchParams;
    this.setState({
      current_url: current_url
    });

    let { params } = this.props.location;

    let intervalId = setInterval(this.countdown, 1000);
    this.setState({
      countdownInterval: intervalId,
      disableBack: params && params.disableBack ? params.disableBack : false
    })
    nativeCallback({ action: 'take_control_reset' });
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {
    this.setState({
      time_spent: this.state.time_spent + 1
    })
  };

  handleClosePayment() {
    // this.setState({
    //   paymentModal: false
    // })
    this.redirect(this.state.payment_link, true);
  }

  redirect(payment_link, redirect) {

    if (!redirect && this.state.provider !== 'Maxlife') {
      this.sendEvents('next');
      this.setState({
        paymentModal: true
      });
      return;
    }

    this.sendEvents('next', 'payment');
    this.setState({
      show_loader: true
    });

    let app = getConfig().app;
    let basepath = getBasePath();
    let paymentRedirectUrl = encodeURIComponent(
      basepath + '/group-insurance/term/payment/' + this.state.params.insurance_id
    );
    var pgLink = payment_link;
    var back_url = encodeURIComponent(this.state.current_url);
    // eslint-disable-next-line
    pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
      '&app=' + app + '&back_url=' + back_url + '&generic_callback=' + getConfig().generic_callback;
    window.location.href = pgLink;
    return;
  }

  async paymentRedirect() {
    this.setState({
      show_loader: true
    });

    try {
      const res = await Api.get('api/insurance/start/payment/' + this.state.params.insurance_id)

      if (res.pfwresponse && res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result
        this.setState({
          payment_link: result.payment_link,
          payment_type: result.payment_type,
          show_loader: false
        });
        this.redirect(result.payment_link, false);

      } else {
        this.setState({
          show_loader: false,
          openModal: false, openModalMessage: '',
          openDialog: true, openResponseDialog: true, apiError: 'Something went wrong, please try after sometime.'
        });
        return;
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  async handlePayment(application, redirect) {
    try {
      const res = await Api.get('api/insurance/start/payment/' + application.id)
      if (res.pfwresponse && res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result
        this.setState({
          payment_link: result.payment_link,
          payment_type: result.payment_type
        });
        if (redirect) {
          this.redirect(result.payment_link);
        }

      } else {
        this.setState({
          openModal: false, openModalMessage: '',
          openDialog: true, apiError: 'Something went wrong, please try after sometime.'
        });
        return;
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  }

  async componentDidMount() {
    try {
      
      const res = await Api.get('/api/insurance/all/summary')
      let application;
      if (res.pfwresponse.status_code === 200) {
        if (res.pfwresponse.result.insurance_apps.init.length > 0) {
          application = res.pfwresponse.result.insurance_apps.init[0];
        } else {
          application = res.pfwresponse.result.insurance_apps.submitted[0];
        }

        let providerName = application.provider;
        if (application.provider === 'IPRU') {
          providerName = 'ICICI';
        }

        // if (application.provider === 'HDFC' && application.plutus_payment_status === 'payment_ready') {
        //   this.handlePayment(application);
        // }

        let income_value = income_pairs.filter(item => item.name === application.quote.annual_income);

        let age = application.profile.nominee.dob && this.calculateAge(application.profile.nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));

        this.setState({
          application_id: application.application_number,
          providerName: providerName,
          status: application.status,
          show_loader: false,
          plutus_payment_status: application.plutus_payment_status,
          payment_link: application.payment_link,
          profile_link: application.profile_link,
          resume_link: application.resume_link,
          edit_allowed: (res.pfwresponse.result.insurance_apps.init.length > 0) ? true : false,
          show_appointee: (age < 18) && application.provider !== 'Maxlife' ? true : false,
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
            first_name: application.profile.first_name || '',
            middle_name: application.profile.middle_name || '',
            last_name: application.profile.last_name || '',
            dob: (application.profile.dob) ? application.profile.dob.replace(/\\-/g, '/').split('/').join('/') : '',
            marital_status: application.profile.marital_status || '',
            birth_place: application.profile.birth_place || '',
            mother_name: application.profile.mother_name || '',
            father_name: application.profile.father_name || '',
            gender: application.profile.gender || '',
            spouse_name: application.profile.spouse_name || ''
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
            name: application.profile.nominee.name || '',
            dob: (application.profile.nominee.dob) ? application.profile.nominee.dob.replace(/\\-/g, '/').split('/').join('/') : '',
            marital_status: application.profile.nominee.marital_status || '',
            relationship: application.profile.nominee.relationship || '',
            nominee_address: application.profile.nominee_address || '',
            nominee_address_same: application.profile.nominee_address_same,
            gender: application.profile.nominee.gender
          },
          appointee: {
            is_open: false,
            name: application.profile.appointee.name || '',
            dob: (application.profile.appointee.dob) ? application.profile.appointee.dob.replace(/\\-/g, '/').split('/').join('/') : '',
            marital_status: application.profile.appointee.marital_status || '',
            relationship: application.profile.appointee.relationship || '',
            appointee_address: application.profile.appointee_address || '',
            appointee_address_same: application.profile.appointee_address_same,
            gender: application.profile.appointee.gender
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
          },
          premiumData: {
            is_open: false,
            base_premium: application.quote.quote_json.base_premium,
            riders_base_premium: application.quote.quote_json.riders_base_premium,
            premium: application.quote.quote_json.premium,
            total_tax: application.quote.quote_json.total_tax,
          }
        });

      } else {
        this.setState({ show_loader: false });
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
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

  toggleAccordian = (accordianTab) => {
    if (this.state.accordianTab === accordianTab) {
      this.setState({
        accordianTab: ''
      });
      return;
    }
    this.setState({
      accordianTab: accordianTab
    });
  }

  handleClick = async () => {
    if (this.state.plutus_payment_status === 'payment_ready' ||
      this.state.plutus_payment_status === 'failed') {
      this.paymentRedirect();
      return;
    }


    let provider;

    if (this.state.provider === 'HDFC') {
      provider = 'HDFC Life';
      this.setState({ show_loader: true });
    } else {
      provider = 'ICICI Pru';
      this.setState({ openModal: true });
    }

    if (this.state.status === 'init') {
      try {
        const res = await Api.post('/api/insurance/profile/submit', {
          insurance_app_id: this.state.params.insurance_id
        });
        this.setState({ show_loader: false });

        if (res.pfwresponse.status_code === 200) {
          // eslint-disable-next-line
          // let eventObj;

          // if (this.state.status === 'init') {
          //   eventObj = {
          //     "event_name": 'make_payment_clicked',
          //     "properties": {
          //       "provider": this.state.provider,
          //       "benefits": (this.state.benefits.accident_benefit !== '' && this.state.benefits.payout_option !== '') ? 1 : 0,
          //       "personal_d": (this.renderPersonalPercentage() === 100) ? 1 : 0,
          //       "contact_d": (this.renderContactPercentage() === 100) ? 1 : 0,
          //       "nominee": (this.renderNomineePercentage() === 100) ? 1 : 0,
          //       "professonal": (this.renderProfessionalPercentage() === 100) ? 1 : 0,
          //       "appointee": (this.renderAppointeePercentage() === 100) ? 1 : 0
          //     }
          //   };
          // } else {
          //   eventObj = {
          //     "event_name": 'resume_clicked',
          //     "properties": {
          //       "overall_progress": this.renderTotalPercentage(),
          //       "personal_d": this.renderPersonalPercentage(),
          //       "contact_d": this.renderContactPercentage(),
          //       "nominee_d": this.renderNomineePercentage(),
          //       "professional": this.renderProfessionalPercentage(),
          //       "professonal_edit": 0,
          //       "pd_view": 0,
          //       "cd_view": 0,
          //       "nd_view": 0,
          //       "professional_view": 0
          //     }
          //   };
          // }

          // if (res.pfwresponse.result.insurance_app.plutus_payment_status === 'payment_ready') {
          //   this.handlePayment(res.pfwresponse.result.insurance_app);
          // }
          if (res.pfwresponse.result.insurance_app.provider === 'HDFC') {
            //summary
            window.location.reload();
          } else {
            // let options = { events: eventObj, action: 'payment', message: { payment_link: '', provider: provider } };
            if (res.pfwresponse.result.insurance_app.plutus_payment_status === 'payment_ready') {
              // this.handlePayment(res.pfwresponse.result.insurance_app, options);
            }
          }

        } else {
          this.setState({ openModal: false, openDialog: true, apiError: res.pfwresponse.result.error });
        }

      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }

    } else {

      this.sendEvents('next');

      nativeCallback({
        action: 'take_control', message: {
          back_url: this.state.current_url,
          show_top_bar: false,
          top_bar_title: provider,
          back_text: "We suggest you to complete the application process for fast issuance of your insurance.Do you still want to exit the application process"
        },

      });
      nativeCallback({
        action: 'resume_provider',
        message: { resume_link: this.state.resume_link, provider: provider }
      });
    }
  }

  renderModal = () => {
    let message = `Wait a moment, you will be redirected to <b>${this.state.quote_provider}</b>`;
    return (
      <LoaderModal 
        open={this.state.openModal}
        message={message}
      />
    );
  }

  getAddress = (addr) => {
    return (
      <div>
        {addr.house_no + ', ' +
          addr.street + ', ' +
          addr.landmark + ', ' +
          addr.pincode + ', ' +
          addr.city + ', ' +
          this.capitalize(addr.state) + ', ' +
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
        contact.permanent_addr.hasOwnProperty('house_no') &&
        contact.permanent_addr.hasOwnProperty('street') &&
        contact.permanent_addr.hasOwnProperty('landmark')) {
        return 100;
      } else if (contact.email ||
        contact.mobile_no ||
        contact.permanent_addr.hasOwnProperty('pincode') ||
        contact.permanent_addr.hasOwnProperty('house_no') ||
        contact.permanent_addr.hasOwnProperty('street') ||
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
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('house_no')) &&
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('street')) &&
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
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('house_no')) &&
            (!nominee.nominee_address_same && nominee.nominee_address.hasOwnProperty('street')) &&
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
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('house_no')) &&
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('street')) &&
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
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('house_no')) &&
            (!appointee.appointee_address_same && appointee.appointee_address.hasOwnProperty('street')) &&
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
              professional.employer_address.hasOwnProperty('house_no') &&
              professional.employer_address.hasOwnProperty('street') &&
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
              professional.employer_address.hasOwnProperty('house_no') ||
              professional.employer_address.hasOwnProperty('street') ||
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

    if (this.state.provider === 'HDFC') {
      if (this.state.accordianTab === 'benefits' && name === 'benefits') {
        return (
          <div className="AccordionBody">
            <ul>
              {this.state.benefits.accident_benefit && <li>Accidental death benefits:<span>₹ {numDifferentiation(this.state.benefits.accident_benefit)}</span></li>}
              <li>Payout option: <span>{this.state.benefits.payout_option}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'personal' && name === 'personal' && this.renderPersonalPercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.personal.name}</span></li>
              <li>DOB: <span>{this.state.personal.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.personal.marital_status)}</span></li>
              <li>Birth place: <span>{this.state.personal.birth_place}</span></li>
              {this.state.personal.marital_status === 'MARRIED' &&
                <li>Spouse name: <span>{this.state.personal.spouse_name}</span></li>}
              <li>Mother name: <span>{this.state.personal.mother_name}</span></li>
              <li>Father name: <span>{this.state.personal.father_name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.personal.gender)}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'contact' && name === 'contact' && this.renderContactPercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Email: <span>{this.state.contact.email}</span></li>
              <li>Mobile number: <span>{this.state.contact.mobile_no}</span></li>
              {/* {this.state.contact.permanent_addr.house_no &&

                <li>
                  Permanent address:
                <div>
                    <span style={{ wordWrap: 'break-word' }}>
                      {this.getAddress(this.state.contact.permanent_addr)}
                    </span>
                  </div>
                </li>
              }
              {(this.state.contact.corr_address_same || this.state.contact.corr_addr.house_no) &&
                ((this.state.contact.corr_address_same)
                  ? <li>
                    Correspondence address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.permanent_addr)}
                      </span>
                    </div>
                  </li>
                  : <li>
                    Correspondence address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.corr_addr)}
                      </span>
                    </div>
                  </li>)
              } */}
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'professional' && name === 'professional' && this.renderProfessionalPercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.professional.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation detail: <span>{this.capitalize(this.state.professional.occupation_detail)}</span></li>
              {this.state.professional.occupation_detail !== 'SELF-EMPLOYED' &&
                <li>Occupation category: <span>{this.capitalize(this.state.professional.occupation_category)}</span></li>}
              <li>Annual income: <span>₹ {formatAmount(this.state.professional.annual_income)}</span></li>
              <li>Criminal proceedings: <span>{(this.state.professional.is_criminal) ? 'Yes' : 'No'}</span></li>
              <li>Politically exposed: <span>{(this.state.professional.is_politically_exposed) ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'nominee' && name === 'nominee' && this.renderNomineePercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.nominee.name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.nominee.gender)}</span></li>
              <li>DOB: <span>{this.state.nominee.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.nominee.marital_status)}</span></li>
              <li>Relationship: <span>{this.capitalize(this.state.nominee.relationship)}</span></li>
              {/* {(this.state.nominee.nominee_address_same || this.state.contact.nominee_address.house_no) &&
                ((this.state.nominee.nominee_address_same)
                  ? <li>
                    Address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.permanent_addr)}
                      </span>
                    </div>
                  </li>
                  : <li>
                    Address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.nominee.nominee_address)}
                      </span>
                    </div>
                  </li>)
              } */}
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'appointee' && name === 'appointee' && this.renderAppointeePercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.appointee.name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.appointee.gender)}</span></li>
              <li>DOB: <span>{this.state.appointee.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.appointee.marital_status)}</span></li>
              <li>Relationship: <span>{this.capitalize(this.state.appointee.relationship)}</span></li>
              {/* {(this.state.appointee.appointee_address_same || this.state.contact.appointee_address.house_no) &&
                ((this.state.appointee.appointee_address_same)
                  ? <li>
                    Address:
                    <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.permanent_addr)}
                      </span>
                    </div>
                  </li>
                  : <li>
                    Address:
                    <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.appointee.appointee_address)}
                      </span>
                    </div>
                  </li>)
              } */}
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'premium' && name === 'premium') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Base premium: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.base_premium)}</span></li>
              <li>Add on benefits: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.riders_base_premium)}</span></li>
              <li>GST & taxes: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.total_tax)}</span></li>
              <li style={{ borderTop: '1px dashed #b8b8b8' }}>Total payable: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.premium)}</span></li>
            </ul>
          </div>
        );
      } else {
        return null;
      }
    } else {
      if (this.state.accordianTab === 'benefits' && name === 'benefits') {
        return (
          <div className="AccordionBody">
            <ul>
              {this.state.benefits.accident_benefit && <li>Accidental death benefits:<span>₹ {numDifferentiation(this.state.benefits.accident_benefit)}</span></li>}
              <li>Payout option: <span>{this.state.benefits.payout_option}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'personal' && name === 'personal') {
        return (
          <div className="AccordionBody">
            <ul>
              {this.state.provider === 'IPRU' && <li>Name: <span>{this.state.personal.name}</span></li>}
              {this.state.provider === 'Maxlife' && <li>First name: <span>{this.state.personal.first_name}</span></li>}
              {this.state.provider === 'Maxlife' && <li>Middle name: <span>{this.state.personal.middle_name}</span></li>}
              {this.state.provider === 'Maxlife' && <li>Last name: <span>{this.state.personal.last_name}</span></li>}
              <li>Gender: <span>{this.capitalize(this.state.personal.gender)}</span></li>
              <li>DOB: <span>{this.state.personal.dob}</span></li>
              <li>Pincode: <span>{this.state.contact.permanent_addr.pincode}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'contact' && name === 'contact' && this.renderContactPercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Email: <span>{this.state.contact.email}</span></li>
              <li>Mobile number: <span>{this.state.contact.mobile_no}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'professional' && name === 'professional' && this.renderProfessionalPercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Education qualification: <span>{this.state.professional.education_qualification}</span></li>
              <li>Occupation detail: <span>{this.capitalize(this.state.professional.occupation_detail)}</span></li>
              {/* <li>Occupation category: <span>{this.capitalize(this.state.professional.occupation_category)}</span></li> */}
              <li>Annual income: <span>₹ {formatAmount(this.state.professional.annual_income)}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'nominee' && name === 'nominee' && this.renderNomineePercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.nominee.name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.nominee.gender)}</span></li>
              <li>DOB: <span>{this.state.nominee.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.nominee.marital_status)}</span></li>
              <li>Relationship: <span>{this.capitalize(this.state.nominee.relationship)}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'appointee' && name === 'appointee' && this.renderAppointeePercentage() !== 0) {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.appointee.name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.appointee.gender)}</span></li>
              <li>DOB: <span>{this.state.appointee.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.appointee.marital_status)}</span></li>
              <li>Relationship: <span>{this.capitalize(this.state.appointee.relationship)}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'premium' && name === 'premium') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Base premium: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.base_premium)}</span></li>
              <li>Add on benefits: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.riders_base_premium)}</span></li>
              <li>GST & taxes: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.total_tax)}</span></li>
              <li style={{ borderTop: '1px dashed #b8b8b8' }}>Total payable: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.premium)}</span></li>
            </ul>
          </div>
        );
      } else {
        return null;
      }
    }
  }

  capitalize = (string) => {
    if (!string) {
      return;
    }
    return string.toLowerCase().replace(/(^|\s)[a-z]/g, function (f) { return f.toUpperCase(); })
  }

  navigate = (pathname) => {

    if (pathname === 'edit-personal') {
      this.sendEvents('next', '', 'personal');
    } else if (pathname === 'edit-contact') {
      this.sendEvents('next', '', 'contact');
    } else if (pathname === 'edit-professional') {
      this.sendEvents('next', '', 'professional');
    } else if (pathname === 'edit-nominee') {
      this.sendEvents('next', '', 'nominee');
    } else if (pathname === 'edit-appointee') {
      this.sendEvents('next', '', 'appointee');
    }

    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClose = () => {

    if (this.state.paymentModal) {
      this.sendEvents('back', 'payment');
    }

    this.setState({
      openDialog: false,
      paymentModal: false,
      show_loader: false
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
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="default" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderPaymentDialog = () => {

    if (this.state.paymentModal) {
      return (
        <Dialog
          id="payment"
          open={this.state.paymentModal}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="payment-dialog" id="alert-dialog-description">
              {/* {this.state.apiError} */}
              <div style={{ fontWeight: 500, color: 'black' }}>Hey {this.state.name},</div>
              <div style={{ fontWeight: 400, color: 'rgb(56, 55, 55)' }}>
                As per
                {this.state.provider === 'IPRU' && <b> ICICI Pru, </b>}
                {this.state.provider === 'HDFC' && <b> HDFC Life, </b>}
                incase of <b>monthly</b> premium mode total of
                {this.state.provider === 'IPRU' && <b> 2 month </b>}
                {this.state.provider === 'HDFC' && <b> 3 month </b>}
                has to paid for the first time only.
    Otherwise first time payment will be same as the first premium amount.
              </div>
              <div style={{ display: '-webkit-box', marginTop: 10 }}>
                <div style={{ maxWidth: '30%' }}>
                  <img style={{ maxWidth: '90px' }} src={this.state.image} alt="" />
                </div>

                {(this.state.payment_frequency).toLowerCase() === 'monthly' &&
                  this.state.provider === 'IPRU' &&
                  <div style={{ margin: '0px 0px 0px 34px' }}>
                    <div>
                      Total Premium
                  </div>
                    <div>
                      {this.state.premium}*2 =  <b>₹ {formatAmount(this.state.premium * 2)}</b>
                    </div>
                  </div>
                }

                {(this.state.payment_frequency).toLowerCase() === 'monthly' &&
                  this.state.provider === 'HDFC' &&
                  <div style={{ margin: '0px 0px 0px 34px' }}>
                    <div>
                      Total Premium
                  </div>
                    <div>
                      {this.state.premium}*3 =  <b>₹ {formatAmount(this.state.premium * 3)}</b>
                    </div>
                  </div>
                }

                {(this.state.payment_frequency).toLowerCase() !== 'monthly' &&
                  <div style={{ margin: '0px 0px 0px 34px' }}>
                    <div>
                      Total Premium
                    </div>
                    <div>
                      {this.state.premium}*1 =  <b>₹ {formatAmount(this.state.premium)}</b>
                    </div>
                  </div>
                }

              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleClosePayment}
              autoFocus>Ok
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;

  }

  sendEvents(user_action, screen_name, which_one_edit) {

    which_one_edit = which_one_edit || '';
    let eventObj = {};
    if (screen_name === 'payment') {
      eventObj = {
        "event_name": 'term_insurance ',
        "properties": {
          "user_action": user_action,
          "screen_name": 'premium_amount_detail'
        }
      };
    } else {
      eventObj = {
        "event_name": 'term_insurance ',
        "properties": {
          "user_action": user_action,
          "screen_name": 'insurance_summary',
          'personal_details_edit': which_one_edit === 'personal' ? 'yes' : 'no',
          'contact_details_edit': which_one_edit === 'contact' ? 'yes' : 'no',
          'professional_details_edit': which_one_edit === 'professional' ? 'yes' : 'no',
          'nominee_details_edit': which_one_edit === 'nominee' ? 'yes' : 'no',
          'appointee_details_edit': which_one_edit === 'appointee' ? 'yes' : 'no',
          'time_spent': this.state.time_spent
        }
      };

    }

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  renderMainUi() {
    if (!this.state.paymentModal) {
      return (
        <Container
          events={this.sendEvents('just_set_events')}
          disableBack={(this.state.params.isJourney === "true" ) && this.state.disableBack === true ? true : false}
          isJourney={(this.state.params.isJourney === "true" ) ? true : false}
          summarypage={true}
          smallTitle={this.state.provider}
          showLoader={this.state.show_loader}
          title={'Insurance Summary'}
          handleClick={this.handleClick}
          fullWidthButton={true}
          premium={this.state.premium}
          provider={this.state.provider}
          paymentFrequency={this.state.payment_frequency}
          buttonTitle={(this.state.plutus_payment_status === 'payment_ready' ||
            this.state.plutus_payment_status === 'failed') ? 'Pay Now' :
            'Resume'}
          noFooter={(this.state.plutus_payment_status === 'payment_ready' ||
            this.state.plutus_payment_status === 'failed') ? false : true}
        >
          <div>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={5}>
                <img src={this.state.image} alt="" style={{ width: '100%' }} />
              </Grid>
              <Grid item xs={7}>
                <div className="Title" style={{ color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 18 }}>
                  {this.state.provider !== 'Maxlife' && <span>{this.state.providerName}</span>} {this.state.cover_plan}
                  <div style={{ marginTop: 7, marginBottom: 7 }}>{
                    this.state.application_id &&
                    `ID: ${this.state.application_id}`
                  }</div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div style={{ marginTop: 30 }}>
            <div className="Title" style={{ color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 18, marginBottom: 20 }}>
              Insurance details
          </div>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={6}>
                <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="Icon" style={{ marginRight: 15 }}>
                    <img src={cover_period} alt="" width="40" />
                  </div>
                  <div className="Text">
                    <div style={{ color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14 }}>Cover period</div>
                    <div style={{ color: '#4a4a4a' }}>{this.state.term} years</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="Title">
                  <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="Icon" style={{ marginRight: 15 }}>
                      <img src={life_cover} alt="" width="40" />
                    </div>
                    <div className="Text">
                      <div style={{ color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14 }}>Life cover</div>
                      <div style={{ color: '#4a4a4a' }}>{this.state.cover_amount}</div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={6}>
                <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="Icon" style={{ marginRight: 15 }}>
                    <img src={income} alt="" width="40" />
                  </div>
                  <div className="Text">
                    <div style={{ color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14 }}>Annual income</div>
                    <div style={{ color: '#4a4a4a' }}>
                      {this.state.annual_income}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="Title">
                  <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="Icon" style={{ marginRight: 15 }}>
                      <img src={smoking} alt="" width="40" />
                    </div>
                    <div className="Text">
                      <div style={{ color: '#4a4a4a', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14 }}>Use tobacco</div>
                      <div style={{ color: '#4a4a4a' }}>{(this.state.tobacco_choice === 'N') ? 'No' : 'Yes'}</div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div style={{ marginTop: 30, marginBottom: 30 }}>
            <div className="accordion-container">
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('benefits')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'benefits') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Benefits</span>
                  </div>
                </div>
                {this.renderAccordionBody('benefits')}
              </div>
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('personal')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'personal') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Personal details</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().styles.secondaryColor, fontSize: 13 }} onClick={() => this.navigate('edit-personal')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('personal')}
              </div>
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('contact')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'contact') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Contact details</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().styles.secondaryColor, fontSize: 13 }} onClick={() => this.navigate('edit-contact')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('contact')}
              </div>
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('professional')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'professional') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Professional details</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().styles.secondaryColor, fontSize: 13 }} onClick={() => this.navigate('edit-professional')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('professional')}
              </div>
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('nominee')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'nominee') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Nominee details</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().styles.secondaryColor, fontSize: 13 }} onClick={() => this.navigate('edit-nominee')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('nominee')}
              </div>
              {this.state.show_appointee &&
                <div className="Accordion">
                  <div className="AccordionTitle" onClick={() => this.toggleAccordian('appointee')}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                      <span style={{ marginRight: 10 }}>
                        <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'appointee') ? shrink : expand} alt="" width="20" />
                      </span>
                      <span>Appointee details</span>
                      {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().styles.secondaryColor, fontSize: 13 }} onClick={() => this.navigate('edit-appointee')}>Edit</span>}
                    </div>
                  </div>
                  {this.renderAccordionBody('appointee')}
                </div>
              }
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('premium')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'premium') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Premium details</span>
                  </div>
                </div>
                {this.renderAccordionBody('premium')}
              </div>
            </div>
          </div>
          {this.renderModal()}
          {this.renderResponseDialog()}
        </Container >
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderMainUi()}
        {this.renderPaymentDialog()}
      </div>
    );
  }
}


export default Summary;
