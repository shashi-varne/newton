import { storageService, inrFormatDecimal } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { health_providers } from '../../constants';
export function initialize() {

    this.navigate = navigate.bind(this);
    let provider = this.props.parent && this.props.parent.props ? this.props.parent.props.match.params.provider : this.props.match.params.provider;
    let providerData = health_providers[provider];

    let groupHealthPlanData = storageService().getObject('groupHealthPlanData') || {};
    this.setState({
        productName: getConfig().productName,
        provider: provider,
        groupHealthPlanData: groupHealthPlanData,
        providerData: providerData,
        plan_selected: groupHealthPlanData.plan_selected
    })


    if (this.state.ctaWithProvider && groupHealthPlanData) {

        let premium_data = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.premium_data.WF : [];
        let selectedIndexSumAssured = groupHealthPlanData.selectedIndexSumAssured || 0;

        this.setState({
            premium_data: premium_data
        })

        let leftTitle = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.plan_title : '';

        let bottomButtonData = {
            leftTitle: leftTitle,
            leftSubtitle: premium_data[selectedIndexSumAssured] ? inrFormatDecimal(premium_data[selectedIndexSumAssured].net_premium): '',
            leftArrow: 'up',
            provider: providerData.key,
            logo: providerData.logo_cta
        }
        this.setState({
            bottomButtonData: bottomButtonData
        })

         let  confirmDialogData = {
                buttonData: {
                    leftTitle: leftTitle,
                    leftSubtitle: premium_data[selectedIndexSumAssured] ? inrFormatDecimal(premium_data[selectedIndexSumAssured].net_premium): '',
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
            confirmDialogData: confirmDialogData
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

export function  navigate (pathname) {
    this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams
    });
}