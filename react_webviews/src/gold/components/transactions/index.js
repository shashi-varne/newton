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
import { ToastContainer } from 'react-toastify';
import toast from '../../ui/Toast';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      value: 0,
      transactions: {
        buy: null,
        sell: null,
        delivery: null
      }
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

  componentDidMount = async () => {
    this.setState({
      show_loader: true,
    });

    const trans = await Api.get('/api/gold/user/list/transactions');

    if (trans.pfwresponse.status_code == 200) {
      this.setState({
        show_loader: false,
        transactions: {
          buy: trans.pfwresponse.result.orders.buy,
          sell: trans.pfwresponse.result.orders.sell,
          delivery: trans.pfwresponse.result.orders.delivery
        }
      });
    } else {
      this.setState({
        show_loader: false, openResponseDialog: true,
        apiError: trans.pfwresponse.result.error || trans.pfwresponse.result.message
      });
    }
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

  downloadInvoice = (link) => {
    // To-do
  }

  renderRows = (type) => {
    if (type == 'buy') {
      const buyData = this.state.transactions.buy;
      console.log(buyData)
      if (buyData !== null) {
        return <TableBody>{buyData.map((row, i) => (
          <TableRow key={i}>
            <TableCell align="justify" padding='dense'>{row.gold_weight}</TableCell>
            <TableCell align="justify" padding='dense'>{row.amount}</TableCell>
            <TableCell align="justify" padding='dense'>{row.gst_amount}</TableCell>
            <TableCell align="justify" padding='dense'>{row.total_amount}</TableCell>
            <TableCell align="justify" padding='dense'>{row.provider_buy_order_status || row.provider_buy_order_error}</TableCell>
            <TableCell align="justify" padding='dense'>{row.dt_created.split(' ')[0]}</TableCell>
            <TableCell align="justify" padding='dense'><div className="download-invoice" onClick={this.downloadInvoice(row.invoice_link)}>Download</div></TableCell>
          </TableRow>
        ))}</TableBody>
      } else {
        <div className="error" style={{ textAlign: 'center', margin: '10px 0' }}>No Transaction Found!</div>
      }
    } else if (type == 'sell') {
      const sellData = this.state.transactions.sell;
      if (sellData !== null) {
        return <TableBody>{sellData.map((row, i) => (
          <TableRow key={i}>
            <TableCell align="justify" padding='dense'>{row.gold_weight}</TableCell>
            <TableCell align="justify" padding='dense'>{row.total_amount}</TableCell>
            <TableCell align="justify" padding='dense'>{row.provider_sell_order_status || row.provider_sell_order_error}</TableCell>
            <TableCell align="justify" padding='dense'>{row.date_created.split(' ')[0]}</TableCell>
            <TableCell align="justify" padding='dense'><div className="download-invoice" onClick={this.downloadInvoice(row.invoice_link)}>Download</div></TableCell>
          </TableRow>
        ))}</TableBody>
      } else {
        return (
          <div className="error" style={{ textAlign: 'center', margin: '10px 0' }}>No Transaction Found!</div>
        );
      }
    } else {
      const deliveryData = this.state.transactions.delivery;
      if (deliveryData !== null) {
        return <TableBody>{deliveryData.map((row, i) => (
          <TableRow key={i}>
            <TableCell align="justify" padding='dense'>{row.metal_weight}</TableCell>
            <TableCell align="justify" padding='dense'>{row.order_status}</TableCell>
            <TableCell align="justify" padding='dense'>{row.delivery_status_message}</TableCell>
            <TableCell align="justify" padding='dense'>{row.dt_created.split(' ')[0]}</TableCell>
            <TableCell align="justify" padding='dense'>{row.delivery_address.addressline}, {row.delivery_address.city}</TableCell>
            <TableCell align="justify" padding='dense'><div className="download-invoice" onClick={this.downloadInvoice(row.invoice_link)}>Download</div></TableCell>
          </TableRow>
        ))}</TableBody>
      } else {
        <div className="error" style={{ textAlign: 'center', margin: '10px 0' }}>No Transaction Found!</div>
      }
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold Transactions"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
        noFooter={true}
        noPadding={true}
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
        {this.state.value === 0 && <div className="container-padding" style={{ overflowX: 'scroll' }}>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="justify" padding='dense'>Weight (gms)</TableCell>
                  <TableCell align="justify" padding='dense'>Amount (Rs)</TableCell>
                  <TableCell align="justify" padding='dense'>GST Amount (Rs)</TableCell>
                  <TableCell align="justify" padding='dense'>Total Amount (Rs)</TableCell>
                  <TableCell align="justify" padding='dense'>Status</TableCell>
                  <TableCell align="justify" padding='dense'>Date</TableCell>
                  <TableCell align="justify" padding='dense'>Invoice link</TableCell>
                </TableRow>
              </TableHead>
              {this.renderRows('buy')}
            </Table>
          </Grid>
        </div>}
        {this.state.value === 1 && <div className="container-padding" style={{ overflowX: 'scroll' }}>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="justify" padding='dense'>Weight (gms)</TableCell>
                  <TableCell align="justify" padding='dense'>Total Amount (Rs)</TableCell>
                  <TableCell align="justify" padding='dense'>Status</TableCell>
                  <TableCell align="justify" padding='dense'>Date</TableCell>
                  <TableCell align="justify" padding='dense'>Invoice link</TableCell>
                </TableRow>
              </TableHead>
              {this.renderRows('sell')}
            </Table>
          </Grid>
        </div>}
        {this.state.value === 2 && <div className="container-padding" style={{ overflowX: 'scroll' }}>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="justify" padding='dense'>Weight (gms)</TableCell>
                  <TableCell align="justify" padding='dense'>Order Status</TableCell>
                  <TableCell align="justify" padding='dense'>Delivery Status</TableCell>
                  <TableCell align="justify" padding='dense'>Date</TableCell>
                  <TableCell align="justify" padding='dense'>Delivery Address</TableCell>
                  <TableCell align="justify" padding='dense'>Invoice link</TableCell>
                </TableRow>
              </TableHead>
              {this.renderRows('delivery')}
            </Table>
          </Grid>
        </div>}
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default Transactions;
