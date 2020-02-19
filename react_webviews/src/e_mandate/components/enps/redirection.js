import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import qs from 'qs';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
class RedirectionClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            params: qs.parse(props.history.location.search.slice(1)),
            pc_urlsafe: getConfig().pc_urlsafe
        };
    }

    async componentDidMount() {

        this.setState({
            show_loader: true
        })
        try {
            const res = await Api.get('/api/nps/esign/status/' + this.state.pc_urlsafe);
            this.setState({
                show_loader: false
            })

            if (res.pfwresponse.result && !res.pfwresponse.result.error) {
                let result = res.pfwresponse.result;
                if (result.esign === true) {
                    this.navigate('success')
                } else {
                    this.navigate('failure')
                }
            } else {
                this.navigate('about')
                toast(res.pfwresponse.result.error ||
                    res.pfwresponse.result.message || 'Something went wrong', 'error');
            }


        } catch (err) {
            this.setState({
                show_loader: false
            })
            this.navigate('about')
            toast("Something went wrong");
            this.navigate('about')
        }
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams,
            params: {
                disableBack: true
            }
        });
    }


    render() {
        return (
            <Container
                title="Redirection"
                showLoader={true}
                hide_header={true}
            >
            </Container>
        );
    }
}

const Redirection = (props) => (
    <RedirectionClass
        {...props} />
);


export default Redirection;