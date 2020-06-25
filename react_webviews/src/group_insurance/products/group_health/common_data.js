import { storageService, inrFormatDecimal } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { health_providers, ghGetMember } from '../../constants';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';

export async function initialize() {

    this.navigate = navigate.bind(this);
    let provider = this.props.parent && this.props.parent.props ? this.props.parent.props.match.params.provider : this.props.match.params.provider;
    let providerData = health_providers[provider];

    let groupHealthPlanData = storageService().getObject('groupHealthPlanData') || {};
    this.setState({
        productName: getConfig().productName,
        provider: provider,
        groupHealthPlanData: groupHealthPlanData,
        providerData: providerData,
        plan_selected: groupHealthPlanData ? groupHealthPlanData.plan_selected : {}
    })


    let lead = {};

    if (this.state.get_lead) {
        try {

            this.setState({
                show_loader: true
            });

            const res = await Api.get('/api/ins_service/api/insurance/hdfcergo/lead/quote?quote_id=5740551081033728');

            var resultData = res.pfwresponse.result;

            this.setState({
                show_loader: false
            });
            if (res.pfwresponse.status_code === 200) {

                lead = resultData.quote;
                lead.member_base = ghGetMember(lead);
                this.setState({
                    lead: resultData.quote || {},
                    common_data: resultData.common
                }, () => {
                    if (this.onload && !this.state.ctaWithProvider) {
                        this.onload();
                    }
        
                })
            } else {
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }

    if (this.state.ctaWithProvider) {


        let leftTitle, leftSubtitle = '';
        if (this.state.get_lead) {
            leftTitle = lead.plan_title || '';
            leftSubtitle = inrFormatDecimal(lead.premium);

        } else {
            let premium_data = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.premium_data.WF : [];
            let selectedIndexSumAssured = groupHealthPlanData.selectedIndexSumAssured || 0;

            this.setState({
                premium_data: premium_data
            })

            leftTitle = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.plan_title : '';
            leftSubtitle = premium_data[selectedIndexSumAssured] ? inrFormatDecimal(premium_data[selectedIndexSumAssured].net_premium) : '';

        }

        let bottomButtonData = {
            leftTitle: leftTitle,
            leftSubtitle: leftSubtitle,
            leftArrow: 'up',
            provider: providerData.key,
            logo: providerData.logo_cta
        }

        let confirmDialogData = {
            buttonData: {
                leftTitle: leftTitle,
                leftSubtitle: leftSubtitle,
                leftArrow: 'down',
                provider: providerData.key,
                logo: providerData.logo_cta
            },
            buttonTitle: "OK",
            content1: [
                {
                    'name': 'Basic premium ', 'value':
                        inrFormatDecimal(10000)
                },
                { 'name': 'GST & other taxes', 'value': inrFormatDecimal(10000) }
            ],
            content2: [
                { 'name': 'Total', 'value': inrFormatDecimal(10000) }
            ]
        }


        this.setState({
            bottomButtonData: bottomButtonData,
            confirmDialogData: confirmDialogData
        }, () => {
            if (this.onload) {
                this.onload();
            }

        })
    }
}

export function updateBottomPremium(premium) {

    this.setState({
        bottomButtonData: {
            ...this.state.bottomButtonData,
            leftSubtitle: inrFormatDecimal(premium || this.state.premium_data[this.state.selectedIndex].net_premium)
        }
    })
}

export async function updateLead(body, quote_id) {
    try {

        quote_id = '5740551081033728';

        this.setState({
          show_loader: true
        });

       
        const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/lead/update?quote_id=' + quote_id,
         body);

        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {
          this.navigate(this.state.next_state);
        } else {
          this.setState({
            show_loader: false
          });
          toast(resultData.error || resultData.message
            || 'Something went wrong');
        }
      } catch (err) {
        console.log(err)
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
}

export function navigate (pathname, data ={}) {

    if(this.props.edit || data.edit) {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    } else {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }
   
}