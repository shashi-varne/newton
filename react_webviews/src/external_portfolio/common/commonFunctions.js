import { getConfig } from 'utils/functions';
import { fetchEmails } from './ApiCalls';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';

export function navigate(pathname, params, replace) {
  if (!replace) {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params,
    });
  } else {
    /* Required for screens that don't require to be considered in
      the history sequence when moving back through history using
      history.goBack() */
    this.props.history.replace({
      pathname: pathname,
      search: getConfig().searchParams,
      params,
    });
  }
}

export function setLoader(val) {
  this.setState({ show_loader: val });
}

export async function emailForwardedHandler(email_id) {
  if (!email_id) return;
  try {
    this.setState({
      show_loader: true,
      loadingText: 'Checking if we have received any CAS email from you',
    });
    const [email_detail] = await fetchEmails({ email_id });
    const status = email_detail.latest_statement.statement_status;
    storageService().setObject('email_detail_hni', email_detail);
    this.setState({
      show_loader: false,
      loadingText: '',
    });
    if (status === 'success') {
      this.navigate('external_portfolio');
    } else {
      this.navigate('statement_not_received', { exitToApp: true });
    }
  } catch (err) {
    console.log(err);
    toast(err);
  }
}