import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from 'material-ui/Grid';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      value: 0
    }
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  componentDidMount() {
    this.setState({
      show_loader: false,
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold Transactions"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Buy" />
          <Tab label="Sell" />
          <Tab label="Delivery" />
        </Tabs>
        {this.state.value === 0 && <div>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Weight (gms)</TableCell>
                  <TableCell>Amount (Rs)</TableCell>
                  <TableCell>GST Amount (Rs)</TableCell>
                  <TableCell>Total Amount (Rs)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Invoice link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2.370</TableCell>
                  <TableCell>970.34</TableCell>
                  <TableCell>291.34</TableCell>
                  <TableCell>10000</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>17/01/2019</TableCell>
                  <TableCell><div className="download-invoice">Download</div></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="error" style={{textAlign: 'center', margin: '10px 0'}}>No Transaction Found!</div>
          </Grid>
        </div>}
        {this.state.value === 1 && <div>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Weight (gms)</TableCell>
                  <TableCell>Total Amount (Rs)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Invoice link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2.370</TableCell>
                  <TableCell>10000</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>17/01/2019</TableCell>
                  <TableCell><div className="download-invoice">Download</div></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="error" style={{textAlign: 'center', margin: '10px 0'}}>No Transaction Found!</div>
          </Grid>
        </div>}
        {this.state.value === 2 && <div>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Weight (gms)</TableCell>
                  <TableCell>Order Status</TableCell>
                  <TableCell>Delivery Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Delivery Address</TableCell>
                  <TableCell>Invoice link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2.370</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>17/01/2019</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell><div className="download-invoice">Download</div></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="error" style={{textAlign: 'center', margin: '10px 0'}}>No Transaction Found!</div>
          </Grid>
        </div>}
      </Container>
    );
  }
}

export default Transactions;
