import { storageService, inrFormatDecimal } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { health_providers } from '../../constants';
export function initialize() {

    this.navigate = navigate.bind(this);
    let provider = this.props.match.params.provider;
    let providerData = health_providers[provider];

    let groupHealthPlanData = storageService().getObject('groupHealthPlanData') || {};
    this.setState({
        productName: getConfig().productName,
        provider: provider,
        groupHealthPlanData: groupHealthPlanData,
        providerData: providerData,
        plan_selected: groupHealthPlanData.plan_selected
    })


    if (this.state.ctaWithProvider) {
        let bottomButtonData = {
            leftTitle: groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.plan_title : '',
            // leftSubtitle: '',
            leftArrow: 'up',
            provider: providerData.key,
            logo: providerData.logo_cta
        }
        this.setState({
            bottomButtonData: bottomButtonData
        })

    }
}

export function updateBottomPremium() {
    
    this.setState({
        bottomButtonData: {
            ...this.state.bottomButtonData,
            leftSubtitle: inrFormatDecimal(this.state.premium_data[this.state.selectedIndex].net_premium)
        }
    })
}

export function  navigate (pathname) {
    this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams
    });
}