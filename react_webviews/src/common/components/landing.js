import React, { Component } from 'react';
import { withRouter } from 'react-router';

import qs from 'qs';
import { storageService} from 'utils/validators';
import { getConfig } from 'utils/functions';

class CommonLanding extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            type: getConfig().productName,
            params: qs.parse(props.history.location.search.slice(1)),
            productName: getConfig().productName
        }

    }

    componentWillMount() {
        storageService().remove('gold_provider');
        const { main_module } = this.props.match.params;
        const { sub_module } = this.props.match.params;
        let openModuleData = {
            main_module: main_module || '',
            sub_module: sub_module || ''
        };

        let params = {
            openModuleData: openModuleData
        }

        let navigateMapper = {
            'health-insurance-comprehensive' : '/group-insurance/health/landing',
            'health-webview-other' : '/group-insurance/other-insurance/entry',
            'group-insurance': '/group-insurance',
            'health-insurance': '/group-insurance/health/landing',
            'term-insurance': '/group-insurance/life-insurance/term/landing',
            'gold': '/gold/landing',
            'gold-buy': '/gold/buy',
            'gold-locker': '/gold/gold-locker',
            'gold-sell': '/gold/sell',
            'gold-delivery': '/gold/delivery',
            'loan': '/loan/loan-home',
            'health-insurance-landing': '/group-insurance/health/landing',
            'health-insurance-hdfcergo': '/group-insurance/group-health/HDFCERGO/landing',
            'health-insurance-religare': '/group-insurance/group-health/RELIGARE/landing',
            'health-insurance-star': '/group-insurance/group-health/STAR/landing',
            'life-insurance-fyntune': '/group-insurance/life-insurance/savings-plan/landing',
            'idfc-landing': '/loan/idfc/loan-know-more',
            'idfc-journey': '/loan/idfc/journey',
            'health-critical-illness': '/group-insurance/health/critical_illness/plan',
            'health-super-top-up': '/group-insurance/health/super_topup/plan',
            'other-insurance-home': '/group-insurance/home_insurance/general/plan',
            'insurance-reports-list': '/group-insurance/common/report',
            'life-insurance-landing': '/group-insurance/life-insurance/entry',
            'disease-specific-plans': '/group-insurance/health/landing',
        };

        let pathname = navigateMapper[main_module] || '';
        this.navigate(pathname, '', params);
        
    }

    handleClick = () => {
        window.location.reload(false);
    }

    navigate = (pathname, search, params) => {
        this.props.history.push({
          pathname: pathname,
          search: search ? search : getConfig().searchParams,
          params: params
        });
      }

    render() {
        return (
            <div className="Loader">
              <div className="LoaderOverlay">
                <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
              </div>
            </div>
          );
    }
}

export default withRouter(CommonLanding);
