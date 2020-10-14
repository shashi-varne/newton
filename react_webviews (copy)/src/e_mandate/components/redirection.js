import React, { Component } from 'react';
import Container from '../common/Container';
import '../common/Style.css';
import qs from 'qs';
import { getConfig } from 'utils/functions';
class RedirectionClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            params: qs.parse(props.history.location.search.slice(1))
        };
    }

    componentWillMount() {
        const { status } = this.state.params

        let path = '/e-mandate/'
        if (status === 'success') {
            path += 'success';
        } else {
            path += 'failure';
        }
        this.navigate(path)
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