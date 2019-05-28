import React, { Component } from 'react';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import cover_period from 'assets/cover_period_icon.png';
import life_cover from 'assets/life_cover_icon.png';
import process_success from 'assets/completed_step.svg';
import wait_icn from 'assets/not_done_yet_step.svg';
import in_process_icn from 'assets/current_step.svg';
import premium from 'assets/premium_icon.svg';
import nominee from 'assets/personal_details_icon.svg';
import loader from 'assets/loader_gif.gif';
import Api from 'utils/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import qs from 'qs';
import { income_pairs } from '../..//constants';
import { numDifferentiation, formatAmount } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from '../../../utils/functions';

class Journey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openDialog: false,
      openDialogReset: false,
      paymentModal: false,
      openResponseDialog: false,
      disableBack: false,
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
          fieldsHdfc: ["name", "dob", "father_name", "mother_name", "gender", "marital_status", "birth_place"],
          fieldsIpru: ["name", 'pan_number']
        },
        contact: {
          not_submitted: true,
          fieldsHdfc: ["email", "mobile_no", "permanent_addr", "corr_addr", "corr_address_same"],
          fieldsOurPay: ["email", "mobile_no"],
          fieldsIpru: ["email", "mobile_no"]
        },
        nominee: {
          not_submitted: true,
          fieldsHdfc: ["nominee", "nominee_address", "nominee_address_same"],
          fieldsIpru: ["nominee"],
          fieldsOurPay: ["nominee"]
        },
        appointee: {
          not_submitted: true,
          fieldsHdfc: ["appointee_address", "appointee", "appointee_address_same"],
          fieldsIpru: ["appointee_address", "appointee", "appointee_address_same"],
          fieldsOurPay: ["appointee"]
        },
        professional: {
          not_submitted: true,
          fieldsHdfc: ["employer_name", "employer_address", "occupation_detail", "occupation_category", "annual_income", "designation", "education_qualification", "pan_number"],
          fieldsIpru: ["occupation_detail", "annual_income", "education_qualification"]
        }
      },
      required_fields: [],
      provider: '',
      plutus_status: '',
      apiError: '',
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
    this.renderJourney = this.renderJourney.bind(this);
    this.handleClosePayment = this.handleClosePayment.bind(this);
    this.setHeaderTitle = this.setHeaderTitle.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location;
    nativeCallback({ action: 'take_control_reset' });
    this.setState({
      disableBack: params ? params.disableBack : false
    })
    if (this.state.ismyway) {
      this.setState({
        type: 'myway',
        askEmail: 'ask@mywaywealth.com'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime',
        askEmail: 'ask@fisdom.com'
      });
    } else {
      this.setState({
        type: 'fisdom',
        askEmail: 'ask@fisdom.com'
      });
    }
  }

  setButtonTitle(journeyData, application) {
    let buttonTitle = 'Continue'
    if (journeyData[2].status === 'init') {
      buttonTitle = 'Pay Now';

    } else if (journeyData[3].status === 'init' && application.provider === 'HDFC' &&
      application.plutus_payment_status === 'payment_done' &&
      application.status !== 'plutus_submitted') {
      buttonTitle = 'Continue to Address Details';
    } else if (journeyData[3].status === 'init' && application.provider === 'IPRU') {
      buttonTitle = 'Continue to ICICI Pru';
    } else if (application.provider === 'HDFC' &&
      application.plutus_payment_status === 'payment_done' && application.status !== 'complete' &&
      application.status === 'plutus_submitted') {
      buttonTitle = 'Continue to HDFC Life';
    } else if (application.plutus_payment_status === 'payment_done' &&
      application.status === 'complete') {
      buttonTitle = 'Ok';
    }

    this.setState({
      buttonTitle: buttonTitle
    })
  }

  handleClosePayment() {
    // this.setState({
    //   paymentModal: false
    // })

    let eventObj = {
      "event_name": 'popup_post_payment_click',
      "properties": {
        "user_action": 'next',
        "source": 'resume'
      }
    };
    nativeCallback({ events: eventObj });
    this.redirect(this.state.payment_link, true);
  }

  redirect(payment_link, redirect) {

    if (!redirect) {
      this.setState({
        paymentModal: true
      });
      return;
    }

    this.setState({
      show_loader: true
    });

    // nativeCallback({
    //   action: 'take_control', message: {
    //     back_url: this.state.profile_link + '&insurance_v2=' + this.state.params.insurance_v2,
    //     back_text: 'Are you sure you want to exit the payment process?'
    //   }
    // });

    let insurance_v2 = this.state.params.insurance_v2 ? true : null;
    let paymentRedirectUrl = encodeURIComponent(
      window.location.protocol + '//' + window.location.host + '/insurance/payment/' + this.state.insurance_id + '/' + insurance_v2
    );
    var pgLink = payment_link;
    let app = getConfig().app;
    var back_url = encodeURIComponent(this.state.profile_link + '&insurance_v2=' + this.state.params.insurance_v2 + '&generic_callback=' +
      this.state.params.generic_callback);
    // eslint-disable-next-line
    pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
      '&app=' + app + '&back_url=' + back_url;
    if (getConfig().generic_callback) {
      pgLink += '&generic_callback=' + getConfig().generic_callback;
    }
    window.location.href = pgLink;
    return;
  }

  paymentRedirect() {
    this.setState({
      show_loader: true
    });
    let eventObj = {
      "event_name": 'make_payment_clicked',
      "properties": {
        "user_action": 'next',
        "source": 'resume'
      }
    };
    nativeCallback({ events: eventObj });
    Api.get('api/insurance/start/payment/' + this.state.insurance_id)
      .then(res => {
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
      });
  }

  handlePayment(application, redirect) {

    Api.get('api/insurance/start/payment/' + application.id)
      .then(res => {
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
      });

  }

  async  componentDidMount() {
    try {

      const res = await Api.get('/api/insurance/all/summary')
      let application, required_fields;
      if (res.pfwresponse.status_code === 200) {
        if (res.pfwresponse.result.insurance_apps.init.length > 0) {
          application = res.pfwresponse.result.insurance_apps.init[0];
        } else if (res.pfwresponse.result.insurance_apps.submitted.length > 0) {
          application = res.pfwresponse.result.insurance_apps.submitted[0];
        } else if (res.pfwresponse.result.insurance_apps.complete.length > 0) {
          application = res.pfwresponse.result.insurance_apps.complete[0];
        } else {
          application = res.pfwresponse.result.insurance_apps.failed[0];
        }

        let providerName = application.provider;
        if (application.provider === 'IPRU') {
          providerName = 'ICICI';
        }

        let journeyData = [
          {
            title: 'Step-1',
            disc: 'Share basic details and answer few questions to choose the right insurance',
            status: 'pending'
          },
          {
            title: 'Step-2',
            disc: 'Complete Insurance Application',
            status: 'pending'
          },
          {
            title: 'Step-3',
            disc: 'Pay first premium',
            status: 'pending'
          },
          {
            title: 'Step-4',
            disc: application.provider === 'HDFC' ? 'Share Address and relevant documents on ' + providerName + ' Life' :
              'Share relevant documents on ' + providerName + ' Pru',
            status: 'pending'
          }
        ];

        if (application.plutus_status === 'init' ||
          application.plutus_payment_status === 'init' ||
          application.status === 'init') {
          journeyData[0]['status'] = 'complete';
          journeyData[1]['status'] = 'init';
        }
        if (((application.plutus_status === 'complete' && application.provider === 'IPRU' && (application.plutus_payment_status === 'payment_ready' ||
          application.plutus_payment_status === 'failed'))
          ||
          (application.provider === 'HDFC' &&
            (application.plutus_payment_status === 'payment_ready' ||
              application.plutus_payment_status === 'failed'))) && application.plutus_status !== 'init') {
          journeyData[0]['status'] = 'complete';
          journeyData[1]['status'] = 'complete';
          journeyData[2]['status'] = 'init';
        }
        if (application.plutus_payment_status === 'payment_done') {
          journeyData[0]['status'] = 'complete';
          journeyData[1]['status'] = 'complete';
          journeyData[2]['status'] = 'complete';
          journeyData[3]['status'] = 'init';
        }
        if ((application.status === 'complete') &&
          application.plutus_payment_status === 'payment_done') {
          journeyData[0]['status'] = 'complete';
          journeyData[1]['status'] = 'complete';
          journeyData[2]['status'] = 'complete';
          journeyData[3]['status'] = 'complete';
          let obj = {
            title: 'Step-5',
            disc: 'Insurance issued',
            status: 'init'
          }
          journeyData.push(obj);
        }


        this.setButtonTitle(journeyData, application);

        // this.setState({
        //   journeyData: journeyData
        // });


        // if (application.plutus_payment_status === 'payment_ready') {
        //   this.handlePayment(application);
        // }

        required_fields = res.pfwresponse.result.required;

        let income_value = income_pairs.filter(item => item.name === application.quote.annual_income);

        let contact_submitted, nominee_submitted, appointee_submitted, professional_submitted, personal_submitted;

        if (application.provider === 'HDFC') {
          personal_submitted = this.state.required.personal.fieldsHdfc.some(r => required_fields.includes(r));
          if (application.plutus_payment_status === 'payment_done') {
            contact_submitted = this.state.required.contact.fieldsHdfc.some(r => required_fields.includes(r));
            nominee_submitted = this.state.required.nominee.fieldsHdfc.some(r => required_fields.includes(r));
            appointee_submitted = this.state.required.appointee.fieldsHdfc.some(r => required_fields.includes(r));
          } else if (application.plutus_payment_status !== 'payment_done') {
            contact_submitted = this.state.required.contact.fieldsOurPay.some(r => required_fields.includes(r));
            nominee_submitted = this.state.required.nominee.fieldsOurPay.some(r => required_fields.includes(r));
            appointee_submitted = this.state.required.appointee.fieldsOurPay.some(r => required_fields.includes(r));
          }
          professional_submitted = this.state.required.professional.fieldsHdfc.some(r => required_fields.includes(r));
        } else {
          personal_submitted = this.state.required.personal.fieldsIpru.some(r => required_fields.includes(r));

          contact_submitted = this.state.required.contact.fieldsIpru.some(r => required_fields.includes(r));
          nominee_submitted = this.state.required.nominee.fieldsIpru.some(r => required_fields.includes(r));
          appointee_submitted = this.state.required.appointee.fieldsIpru.some(r => required_fields.includes(r));
          professional_submitted = this.state.required.professional.fieldsIpru.some(r => required_fields.includes(r));
        }

        let isKyc = '';
        if (contact_submitted === false && personal_submitted === false && application.provider === 'IPRU') {
          isKyc = true;
        }

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
          providerName: providerName,
          isKyc: isKyc,
          insurance_id: application.id || this.state.params.insurance_id,
          name: application.profile.name,
          payment_confirmed: application.payment_confirmed,
          profile_link: application.profile_link,
          application_id: application.application_number,
          permanent_addr: application.profile.permanent_addr,
          plutus_status: application.plutus_status,
          plutus_payment_status: application.plutus_payment_status,
          required_fields: required_fields,
          status: application.status,
          show_loader: false,
          payment_link: application.payment_link,
          resume_link: application.resume_link,
          edit_allowed: (res.pfwresponse.result.insurance_apps.init.length > 0) ? true : false,
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
            name: application.profile.nominee.name || '',
            dob: (application.profile.nominee.dob) ? application.profile.nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
            marital_status: application.profile.nominee.marital_status || '',
            relationship: application.profile.nominee.relationship || '',
            nominee_address: application.profile.nominee_address || {},
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
          },
          journeyData: journeyData
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


  handleClose = () => {
    if (this.state.paymentModal) {
      let eventObj = {
        "event_name": 'popup_post_payment_click',
        "properties": {
          "user_action": 'back',
          "source": 'resume'
        }
      };
      nativeCallback({ events: eventObj });
    }
    this.setState({
      openDialog: false,
      openDialogReset: false,
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

  navigate = (pathname) => {
    let insurance_id = this.state.insurance_id || this.state.params.insurance_id;
    this.props.history.push({
      pathname: pathname,
      search: 'insurance_id=' + insurance_id + '&base_url=' + this.state.params.base_url +
        '&insurance_v2=' + this.state.insurance_v2 + '&resume=yes&isKyc=' + this.state.isKyc + '&generic_callback=' +
        this.state.params.generic_callback,
    });
  }

  modelMessage = () => {
    if (this.state.status === 'init') {
      return (
        <span>
          Wait a moment, you will be redirected to <b>{this.state.quote_provider}</b>
        </span>
      );
    } else {
      return (
        <span>
          Wait a moment, you will be redirected to <b>{this.state.quote_provider}</b>.
        </span>
      );
    }
  }

  handleResponseClose = () => {
    this.setState({
      openResponseDialog: false
    });
  }

  async confirmPyamentWithProvider() {
    try {
      this.setState({
        show_loader: true
      })
      const res = await Api.get('api/insurance/confirm/payment/' + this.state.insurance_id);

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200 &&
        res.pfwresponse.result.payment_confirmed === true) {
        if (this.state.provider === 'HDFC') {
          this.navigate('/insurance/contact1');
        } else {
          this.setState({
            payment_confirmed: res.pfwresponse.result.payment_confirmed
          });
          this.handleClick();
        }

      } else {
        //opoen modal
        this.setState({
          openResponseDialog: true,
          apiError: 'Oops! Seems like there is some technical issues. Don’t worry we have received your payment, please retry after sometime. Or you can reach us at ' +
            this.state.askEmail + '.'
        })
        // toast(res.pfwresponse.result.error || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      })
      toast('Something went wrong');
    }
  }

  handleClick = async () => {
    let provider;

    if (this.state.provider === 'HDFC') {
      provider = 'HDFC Life';
    } else {
      provider = 'ICICI Pru';
    }
    if (this.state.plutus_payment_status === 'payment_done' &&
      this.state.status === 'complete') {
      nativeCallback({ action: 'native_back' });
      return;
    }

    if (this.state.plutus_status === 'init') {
      this.navigate("/insurance/personal");
      return;
    }
    if (this.state.plutus_status !== 'complete' &&
      this.state.plutus_payment_status !== 'payment_ready' && this.state.plutus_payment_status !== 'payment_done' &&
      this.state.plutus_payment_status !== 'failed') {
      this.navigate("/insurance/personal");
      return;
    }

    if (this.state.provider === 'HDFC' &&
      (this.state.status === 'init') &&
      (this.state.plutus_payment_status !== 'payment_ready' && this.state.plutus_payment_status !== 'failed' &&
        this.state.plutus_payment_status !== 'payment_done')) {
      this.navigate("/insurance/personal");
      return;
    }

    // if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.personal.not_submitted) {
    //   this.navigate("/insurance/personal");
    // } else 
    if (this.state.provider === 'HDFC' && this.state.plutus_payment_status === 'payment_done' &&
      this.state.status !== 'plutus_submitted') {
      if (this.state.payment_confirmed) {
        this.navigate('/insurance/contact1')
      } else {
        this.confirmPyamentWithProvider();
      }

      return;
    }

    if (this.state.provider === 'IPRU' && this.state.plutus_payment_status === 'payment_done' &&
      !this.state.payment_confirmed) {
      this.confirmPyamentWithProvider();
      return;
    }

    // else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.contact.not_submitted &&
    //   this.state.plutus_payment_status !== 'payment_done') {
    //   this.navigate("/insurance/contact");
    // } else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.professional.not_submitted) {
    //   this.navigate("/insurance/professional");
    // } else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.nominee.not_submitted) {
    //   this.navigate("/insurance/nominee");
    // } else if ((this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') && this.state.required.appointee.not_submitted) {
    //   this.navigate("/insurance/appointee");
    // } 
    // else if (this.state.provider === 'IPRU' && (this.state.status === 'plutus_submitted' || this.state.plutus_status !== 'complete') &&
    //   (!this.state.permanent_addr || !this.state.permanent_addr.pincode)) {
    //   this.navigate("/insurance/pincode");
    // }

    else if (this.state.provider === 'HDFC' && (this.state.plutus_payment_status === 'payment_ready' ||
      this.state.plutus_payment_status === 'failed')) {
      this.paymentRedirect();
      return;
    } else if (this.state.provider === 'IPRU' && (this.state.plutus_payment_status === 'payment_ready' ||
      this.state.plutus_payment_status === 'failed')) {
      this.paymentRedirect();
      return;
    } else {

      if (this.state.provider === 'HDFC') {
        this.setState({ openModal: true, openModalMessage: this.modelMessage() });
      } else {
        this.setState({ openModal: true, openModalMessage: this.modelMessage() });
      }

      // if (this.state.provider === 'IPRU') {
      //   this.setState({
      //     openModal: false, openModalMessage: '', openResponseDialog: true, openDialog: true,
      //     apiError: 'Something went wrong, please try after sometime'
      //   });
      //   return;
      // }
      if (this.state.status === 'init' && this.state.provider === 'HDFC') {
        try {
          const res = await Api.post('/api/insurance/profile/submit', {
            insurance_app_id: this.state.insurance_id
          });
          this.setState({ show_loader: false });

          if (res.pfwresponse.status_code === 200) {
            // eslint-disable-next-line
            let result = res.pfwresponse.result;

            let eventObj = {
              "event_name": 'resume_clicked',
              "properties": {
                "user_action": 'next',
                "source": 'resume'
              }
            };
            nativeCallback({ events: eventObj });
            nativeCallback({
              action: 'take_control', message: {
                back_url: this.state.profile_link + '&insurance_v2=' + this.state.params.insurance_v2 + '&generic_callback=' +
                  this.state.params.generic_callback,
                show_top_bar: false,
                top_bar_title: provider,
                back_text: "We suggest you to complete the application process for fast issuance of your insurance.Do you still want to exit the application process"
              }
            });
            nativeCallback({ action: 'resume_provider', message: { resume_link: result.insurance_app.resume_link, provider: provider } });
          } else {
            this.setState({ openModal: false, openModalMessage: '', openResponseDialog: true, apiError: res.pfwresponse.result.error });
          }
        } catch (err) {
          this.setState({
            show_loader: false
          });
          toast('Something went wrong');
        }
      } else {
        if (!this.state.resume_link) {
          this.handleClick();
          return;
        }

        let eventObj = {
          "event_name": 'resume_clicked',
          "properties": {
            "user_action": 'next',
            "source": 'resume'
          }
        };
        nativeCallback({ events: eventObj });
        nativeCallback({
          action: 'take_control', message: {
            back_url: this.state.profile_link + '&insurance_v2=' + this.state.params.insurance_v2 + '&generic_callback=' +
              this.state.params.generic_callback,
            show_top_bar: false,
            top_bar_title: provider,
            back_text: "We suggest you to complete the application process for fast issuance of your insurance.Do you still want to exit the application process"
          }
        });
        nativeCallback({ action: 'resume_provider', message: { resume_link: this.state.resume_link, provider: provider } });
      }
    }
  }

  renderResponseDialog = () => {
    return (
      <Dialog
        open={this.state.openResponseDialog}
        onClose={this.handleResponseClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleResponseClose} color="default" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderModal = () => {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.openModal}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 4, minWidth: 320, padding: 25, textAlign: 'center' }}>
          <div style={{ padding: '20px 0 30px' }}>
            <img src={loader} alt="" />
          </div>
          <Typography variant="subheading" id="simple-modal-description" style={{ color: '#444' }}>
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
        open={this.state.openDialogReset}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to restart the insurance application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="default">
            No
          </Button>
          <Button onClick={this.handleReset} color="default" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleReset = async () => {
    this.setState({ openResponseDialog: false, apiError: '', openDialog: false, openModal: true, openModalMessage: 'Wait a moment while we reset your application' });
    const res = await Api.post('/api/insurance/profile/reset', {
      insurance_app_id: this.state.insurance_id
    });
    if (res.pfwresponse.status_code === 200) {
      nativeCallback({ action: 'native_reset' });
    } else {
      this.setState({ openModal: false, openModalMessage: '', openResponseDialog: true, apiError: res.pfwresponse.result.error });
    }
  }

  showDialog = () => {
    this.setState({ openDialogReset: true });
  }

  renderJourney(props, index) {
    return (
      <div key={index} className={'journey-process2 ' + (props.status === 'complete' ? 'journey-process2-green' :
        ((props.title === 'Step-4' && props.status !== 'complete') ||
          (props.title === 'Step-5' && props.status === 'init')) ? 'journey-process2-unset' : '')}>
        <div className="journey-process3">
          <img className="journey-process4" src={props.status === 'complete' ? process_success :
            props.status === 'init' ? in_process_icn : wait_icn} alt="" />
        </div>
        <div className="journey-process5">
          <div className={'journey-process6 ' + (props.status === 'pending' ? 'journey-process7-grey' : '')}>{props.title}</div>
          <div className={'journey-process7 ' + (props.status === 'complete' ? 'journey-process7-black' :
            props.status === 'init' ? 'journey-process7-blue' : 'journey-process7-grey')}>{props.disc}</div>
          {index === 1 && props.status !== 'pending' && this.state.plutus_payment_status !== 'payment_done' &&
            (this.state.plutus_status === 'init' || this.state.plutus_status === 'incomplete' ||
              this.state.plutus_status === 'complete') && !this.state.params.isJourney &&
            <div className="pincode-footer-img-tile-journey">
              <div className="FooterDefaultLayout">
                <div className="FlexItem1">
                  <img
                    alt=""
                    src={this.state.image}
                    className="FooterImage" />
                </div>
                <div className="FlexItem2 pincode-provider-title" style={{ color: 'grey' }}>
                  {this.state.cover_plan}
                </div>
              </div>
              <div style={{ margin: '30px 0px 0px 0px' }}>
                <div className="pincode-details-tile">
                  <div className="pincode-details-tile1">Cover Amount</div>
                  <div className="pincode-details-tile2" style={{ color: 'grey' }}>{this.state.cover_amount}</div>
                </div>
                <div className="pincode-details-tile">
                  <div className="pincode-details-tile1">Cover Period</div>
                  <div className="pincode-details-tile2" style={{ color: 'grey' }}>{this.state.term} yrs.</div>
                </div>
              </div>
              {((this.state.provider === 'IPRU' && this.state.plutus_status === 'complete') ||
                (this.state.provider === 'HDFC' && this.state.plutus_payment_status === 'payment_ready' &&
                  this.state.plutus_status !== 'init')) &&
                <div className="view-more-journey" onClick={() => this.navigate('/insurance/summary')}>
                  <div>VIEW MORE</div>
                </div>
              }
            </div>
          }
          {index === 2 && props.status === 'complete' && this.state.plutus_payment_status === 'payment_done' &&
            <div style={{ marginTop: 6 }}>
              <div>
                <span style={{ color: 'grey', fontWeight: 600 }}>Application No. - </span>
                <span style={{ color: 'grey' }}> {this.state.application_id}</span>
              </div>
            </div>
          }
          {index === 3 && props.status === 'complete' && this.state.plutus_payment_status === 'payment_done' &&
            <div style={{ marginTop: 6 }}>
              <div style={{ color: 'grey' }}>
                Application process completed. Insurance will
                be issued in <span style={{ color: 'grey', fontWeight: 600 }}>6-7 working days.</span>
              </div>
            </div>
          }
        </div>

      </div>
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

  setHeaderTitle() {
    if (this.state.plutus_status) {
      if (this.state.params.isJourney || this.state.disableBack === true) {
        return 'Insurance Journey';
      } else if (this.state.plutus_payment_status === 'payment_done' &&
        (this.state.status === 'plutus_submitted' || this.state.status === 'complete')) {
        return 'Term Insurance';
      } else {
        return 'Insurance Summary';
      }
    }
    return null;
  }

  renderMainUi() {
    if (!this.state.paymentModal) {
      return (
        <Container
          disableBack={this.state.disableBack ? true : false}
          isJourney={this.state.params.isJourney ? true : false}
          resetpage={((this.state.status === 'init' || this.state.status === 'plutus_submitted') &&
            (this.state.plutus_payment_status !== 'payment_done' && !this.state.params.isJourney)) ? true : false
          }
          handleReset={this.showDialog}
          summarypage={true}
          showLoader={this.state.show_loader}
          smallTitle={this.setHeaderTitle() === 'Term Insurance' ? this.state.provider : ''
          }
          title={this.setHeaderTitle()}
          handleClick={this.handleClick}
          fullWidthButton={true}
          onlyButton={this.state.journeyData && this.state.journeyData[2].status === 'init' ? false : true}
          premium={this.state.premium}
          provider={this.state.provider}
          paymentFrequency={this.state.payment_frequency}
          buttonTitle={this.state.buttonTitle}
          noFooter={(this.state.plutus_payment_status === 'payment_done' &&
            this.state.status === 'complete') ? true : false}
          type={this.state.type} >
          {
            this.state.plutus_payment_status === 'payment_done' && this.state.disableBack === false &&
            (this.state.status === 'plutus_submitted' || this.state.status === 'complete') &&
            <div className="journey-top-tile">
              <div>
                <Grid container spacing={8} alignItems="center">
                  <Grid item xs={5}>
                    <img src={this.state.image} alt="" style={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={7}>
                    <div className="Title" style={{ color: '#444', fontFamily: 'Roboto', fontWeight: 500, fontSize: 14 }}>
                      {this.state.providerName} {this.state.cover_plan}
                      <div>
                        Status: <span style={{ color: '#d26774' }}>Pending</span>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div style={{ marginTop: 6 }}>
                <Grid container spacing={8} alignItems="center">
                  <Grid item xs={6}>
                    <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="Icon" style={{ marginRight: 15 }}>
                        <img src={cover_period} alt="" width="40" />
                      </div>
                      <div className="Text">
                        <div style={{ color: '#4a4a4a' }}>Cover period</div>
                        <div className="journey-top-text2">{this.state.term} years</div>
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
                          <div style={{ color: '#4a4a4a' }}>Life cover</div>
                          <div className="journey-top-text2">{this.state.cover_amount}</div>
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
                        <img src={premium} alt="" className="journey-image-top" />
                      </div>
                      <div className="Text">
                        <div style={{ color: '#4a4a4a' }}>Premium</div>
                        <div className="journey-top-text2">
                          ₹ {formatAmount(this.state.premium)} {this.state.payment_frequency}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="Title">
                      <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="Icon" style={{ marginRight: 15 }}>
                          <img src={nominee} alt="" className="journey-image-top" />
                        </div>
                        <div className="Text">
                          <div style={{ color: '#4a4a4a' }}>Nominee</div>
                          <div className="journey-top-text2">
                            {this.state.nominee.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>

          }
          {
            this.state.plutus_payment_status === 'payment_done' &&
            (this.state.status === 'plutus_submitted' || this.state.status === 'complete') && !this.state.disableBack &&
            <div className="journey-connector">
            </div>
          }
          {(this.state.journeyData && this.state.journeyData[2].status === 'init') &&
            <div style={{ color: '#878787', fontSize: 14, marginLeft: 18, marginBottom: 8 }}>
              <div>
                Hey <span style={{ fontWeight: 500 }}>{(this.state.name || "  ").split(" ")[0]},</span>
              </div>
              <div>
                You’re just one step away to secure your family -
            </div>
            </div>}

          <div className="journey-process1">
            {this.state.journeyData && this.state.journeyData.map(this.renderJourney)}
          </div>
          {
            this.state.plutus_payment_status === 'payment_done' &&
            <div className="journey-bottom">
              Incase of any issues, feel free to write to us - <br />
              <span style={{ color: 'grey', fontWeight: 600 }}>ask@fisdom.com</span>

            </div>
          }
          {this.renderResponseDialog()}
          {this.renderDialog()}
          {this.renderModal()}
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
        {this.renderResponseDialog()}
      </div>
    );
  }
}


export default Journey;
