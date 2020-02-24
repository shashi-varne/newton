import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from 'material-ui/Grid';

import toast from '../../../common/ui/Toast';
// import { inrFormatDecimal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      loadingMore: false,
      params: qs.parse(props.history.location.search.slice(1)),
      value: 0,
      transactions: {
        buy: null,
        sell: null,
        delivery: null
      }
    }
  }

  setNextPage(type, next_page) {
    if (type === 'buy') {
      this.setState({
        next_page_buy: next_page
      })
    } else if (type === 'sell') {
      this.setState({
        next_page_sell: next_page
      })
    } else {
      this.setState({
        next_page_delivery: next_page
      })
    }
  }

  getTransaction = async (type) => {

    if (this.state.transactions[type]) {
      return;
    }
    this.setState({
      show_loader: true,
    });
    try {
      const trans = await Api.get('/api/gold/list/orders/mine?order_type=' + type);

      if (trans.pfwresponse.status_code === 200) {
        let transactions = this.state.transactions;
        transactions[type] = trans.pfwresponse.result.orders[type];
        this.setNextPage(type, trans.pfwresponse.result.orders.next_page);
        this.setState({
          show_loader: false,
          transactions: transactions,
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(trans.pfwresponse.result.error || trans.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  componentDidMount = async () => {


    this.getTransaction('buy');
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  loadMoreEnteries = async (type, next_page) => {
    if (!next_page) {
      return;
    }
    try {
      this.setState({
        loadingMore: true
      })
      const trans = await Api.get(next_page);

      if (trans.pfwresponse.status_code === 200) {
        let transactions = this.state.transactions;
        transactions[type] = transactions[type].concat(trans.pfwresponse.result.orders[type]);
        this.setNextPage(type, trans.pfwresponse.result.orders.next_page);
        this.setState({
          show_loader: false,
          loadingMore: false,
          transactions: transactions,
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(trans.pfwresponse.result.error || trans.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Transactions'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
    let valueToType = {
      0: 'buy',
      1: 'sell',
      2: 'delivery'
    };
    this.getTransaction(valueToType[value]);
  }

  async downloadInvoice(path) {
    this.setState({
      show_loader: true,
    });

    try {
      const res = await Api.get('/api/gold/invoice/download/mail', { url: path });
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        if (result.message === 'success') {
          toast('Invoice has been sent succesfully to your registered email');
        } else {
          toast(result.message || result.error);
        }
        this.setState({
          show_loader: false,
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  renderRows = (type) => {
    if (type === 'buy') {
      const buyData = this.state.transactions.buy;
      if (buyData && buyData !== null && buyData.length) {
        return (
          <div>
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
              <TableBody>{buyData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell align="justify" padding='dense'>{row.gold_weight}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.amount}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.gst_amount}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.total_amount}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.provider_buy_order_status || row.provider_buy_order_error}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.dt_created.split(' ')[0]}</TableCell>
                  <TableCell align="justify" padding='dense'><div className="download-invoice" onClick={() => this.downloadInvoice(row.invoice_link)}>Download</div></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
            {this.state.next_page_buy && !this.state.loadingMore &&
              <div className="load-more"
                onClick={() => this.loadMoreEnteries('buy', this.state.next_page_buy)}>Load More</div>
            }
            {this.state.loadingMore &&
              <div className="load-more"
              >Loading More Enteries...</div>
            }
          </div>

        )
      } else {
        return <div className="error" style={{ textAlign: 'center', margin: '10px 0' }}>No Transaction Found!</div>
      }
    } else if (type === 'sell') {
      const sellData = this.state.transactions.sell;
      if (sellData && sellData !== null && sellData.length) {
        return (
          <div>
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
              <TableBody>{sellData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell align="justify" padding='dense'>{row.gold_weight}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.total_amount}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.provider_sell_order_status || row.provider_sell_order_error}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.dt_created.split(' ')[0]}</TableCell>
                  <TableCell align="justify" padding='dense'><div className="download-invoice" onClick={() => this.downloadInvoice(row.invoice_link)}>Download</div></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
            {this.state.next_page_sell && !this.state.loadingMore &&
              <div className="load-more"
                onClick={() => this.loadMoreEnteries('sell', this.state.next_page_sell)}>Load More</div>
            }
            {this.state.loadingMore &&
              <div className="load-more"
              >Loading More Enteries...</div>
            }
          </div>
        )
      } else {
        return (
          <div className="error" style={{ textAlign: 'center', margin: '10px 0' }}>No Transaction Found!</div>
        );
      }
    } else {
      const deliveryData = this.state.transactions.delivery;
      if (deliveryData && deliveryData !== null && deliveryData.length) {
        return (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="justify" padding='dense'>Weight (gms)</TableCell>
                  <TableCell align="justify" padding='dense'>Status</TableCell>
                  <TableCell align="justify" padding='dense'>Delivery Status</TableCell>
                  <TableCell align="justify" padding='dense'>Date</TableCell>
                  <TableCell align="justify" padding='dense'>Address</TableCell>
                  <TableCell align="justify" padding='dense'>Invoice link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{deliveryData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell align="justify" padding='dense'>{row.metal_weight}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.order_status}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.delivery_status_message}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.dt_created.split(' ')[0]}</TableCell>
                  <TableCell align="justify" padding='dense'>{row.delivery_address.addressline}, {row.delivery_address.city}</TableCell>
                  <TableCell align="justify" padding='dense'><div className="download-invoice" onClick={() => this.downloadInvoice(row.invoice_link)}>Download</div></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
            {this.state.next_page_delivery && !this.state.loadingMore &&
              <div className="load-more"
                onClick={() => this.loadMoreEnteries('delivery', this.state.next_page_delivery)}>Load More</div>
            }
            {this.state.loadingMore &&
              <div className="load-more"
              >Loading More Enteries...</div>
            }
          </div>
        )
      } else {
        return <div className="error" style={{ textAlign: 'center', margin: '10px 0' }}>No Transaction Found!</div>
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
        noFooter={true}
        noPadding={true}
        events={this.sendEvents('just_set_events')}
      >
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Buy" />
          <Tab label="Sell" />
          <Tab label="Delivery" />
        </Tabs>
        {this.state.value === 0 && <div className="container-padding" style={{ overflowX: 'scroll' }}>
          <Grid item xs={12}>
            {this.renderRows('buy')}
          </Grid>
        </div>}
        {this.state.value === 1 && <div className="container-padding" style={{ overflowX: 'scroll' }}>
          <Grid item xs={12}>
            {this.renderRows('sell')}
          </Grid>
        </div>}
        {this.state.value === 2 && <div className="container-padding" style={{ overflowX: 'scroll' }}>
          <Grid item xs={12}>
            {this.renderRows('delivery')}
          </Grid>
        </div>}
      </Container>
    );
  }
}

export default Transactions;
