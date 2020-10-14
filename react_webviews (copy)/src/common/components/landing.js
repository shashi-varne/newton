import React, { Component } from 'react';
import { withRouter } from 'react-router';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
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
            loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
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
            'group-insurance': '/group-insurance',
            'health-insurance': '/group-insurance/health/landing',
            'term-insurance': '/group-insurance/term/intro',
            'gold': '/gold/landing',
            'gold-buy': '/gold/buy',
            'gold-locker': '/gold/gold-locker',
            'gold-sell': '/gold/sell',
            'gold-delivery': '/gold/delivery',
            'loan': '/loan/home',
            'health-insurance-landing': '/group-insurance/health/landing',
            'health-insurance-comprehensive': '/group-insurance/group-health/entry',
            'health-insurance-hdfcergo': '/group-insurance/group-health/HDFCERGO/landing',
            'health-insurance-religare': '/group-insurance/group-health/RELIGARE/landing',
            'health-insurance-star': '/group-insurance/group-health/STAR/landing'
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
                <img src={this.state.loaderMain} alt="" />
              </div>
            </div>
          );
    }
}

export default withRouter(CommonLanding);
